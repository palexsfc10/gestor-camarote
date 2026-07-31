#!/usr/bin/env bash
# shellcheck shell=bash
# Shared helpers for Pérola demo VPS automation (NTWS Labs).
# No secrets, no IPs, no credentials. Safe for a public repository.

set -Eeuo pipefail

# ---------------------------------------------------------------------------
# Constants (fixed VPS layout; PEROLA_DEMO_ROOT overrides for tests only)
# ---------------------------------------------------------------------------
DEMO_ROOT="${PEROLA_DEMO_ROOT:-/srv/docker/perola-demo}"
REPO_DIR="${DEMO_ROOT}/repo"
LOG_DIR="${DEMO_ROOT}/logs"
RELEASES_DIR="${DEMO_ROOT}/releases"
BACKUPS_DIR="${DEMO_ROOT}/backups"
CURRENT_SHA_FILE="${DEMO_ROOT}/CURRENT_SHA"
PREVIOUS_SHA_FILE="${DEMO_ROOT}/PREVIOUS_SHA"
LAST_DEPLOY_REPORT="${DEMO_ROOT}/LAST_DEPLOY_REPORT.txt"
DEMO_MARKER_FILE="${DEMO_ROOT}/.perola-demo-marker"
readonly DEMO_ROOT REPO_DIR LOG_DIR RELEASES_DIR BACKUPS_DIR
readonly CURRENT_SHA_FILE PREVIOUS_SHA_FILE LAST_DEPLOY_REPORT DEMO_MARKER_FILE
readonly EXPECTED_HOSTNAME="${PEROLA_DEMO_EXPECTED_HOSTNAME:-srv1793294}"
readonly GITHUB_REPO_URL="https://github.com/palexsfc10/gestor-camarote.git"
readonly GITHUB_REPO_HTTPS="https://github.com/palexsfc10/gestor-camarote"
readonly COMPOSE_REL="deploy/demo/compose.demo.yaml"
readonly SERVICE_NAME="perola-demo-web"
readonly CONTAINER_NAME="perola-demo-web"
readonly NETWORK_NAME="perola-demo-net"
readonly BIND_HOST="127.0.0.1"
readonly BIND_PORT="3107"
readonly CONTAINER_PORT="3000"
readonly INTERNAL_BASE="http://${BIND_HOST}:${BIND_PORT}"
readonly HEALTH_TIMEOUT_SEC="${PEROLA_DEMO_HEALTH_TIMEOUT:-120}"
# Used by smoke-vps.sh after sourcing this library
# shellcheck disable=SC2034
readonly SMOKE_MAX_SECONDS="${PEROLA_DEMO_SMOKE_MAX_SECONDS:-5}"
readonly MIN_DISK_MB="${PEROLA_DEMO_MIN_DISK_MB:-2048}"
readonly MIN_MEM_MB="${PEROLA_DEMO_MIN_MEM_MB:-512}"
readonly PROTECTED_NAME_REGEX='(kyvora|arena|croniu|postgres|cloudflared|cloudflare)'

# Resolved at source time
COMMON_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="$(cd "${COMMON_DIR}/.." && pwd)"
# When scripts live inside a checkout: .../repo/deploy/demo
LOCAL_REPO_ROOT="$(cd "${SCRIPTS_DIR}/../.." && pwd)"

DRY_RUN=0
ASSUME_YES=0
# shellcheck disable=SC2034
EXTERNAL_URL=""
DEPLOY_TS=""
ACTIVE_LOG=""
LOCK_FD=9
DOCKER_OK=0
# Transactional deploy state (mutated by deploy-vps.sh / rollback-vps.sh)
# shellcheck disable=SC2034
DEPLOY_MUTATION_STARTED=0
# shellcheck disable=SC2034
ROLLBACK_IN_PROGRESS=0
# shellcheck disable=SC2034
DEPLOY_COMMITTED=0
# shellcheck disable=SC2034
ROLLBACK_TARGET_SHA=""
# shellcheck disable=SC2034
IN_ERROR_HANDLER=0
# shellcheck disable=SC2034
ROLLBACK_CALL_COUNT=0
# shellcheck disable=SC2034
LAST_TRANSACTION_VERDICT=""
# Optional hook for tests (command string / function name)
# shellcheck disable=SC2034
TRANSACTIONAL_ROLLBACK_HOOK=""

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
_ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

log()  { printf '[%s] INFO  %s\n' "$(_ts)" "$*"; }
warn() { printf '[%s] WARN  %s\n' "$(_ts)" "$*" >&2; }
err()  { printf '[%s] ERROR %s\n' "$(_ts)" "$*" >&2; }
die()  { err "$*"; exit 1; }

log_both() {
  local msg="$*"
  log "$msg"
  if [[ -n "${ACTIVE_LOG:-}" ]]; then
    printf '[%s] INFO  %s\n' "$(_ts)" "$msg" >>"$ACTIVE_LOG"
  fi
}

require_cmd() {
  local c
  for c in "$@"; do
    command -v "$c" >/dev/null 2>&1 || die "Required command not found: $c"
  done
}

is_root() { [[ "${EUID:-$(id -u)}" -eq 0 ]]; }

confirm() {
  local prompt="${1:-Continue?}"
  if [[ "$ASSUME_YES" -eq 1 ]]; then
    log "Confirmation skipped (--yes): ${prompt}"
    return 0
  fi
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would prompt: ${prompt}"
    return 0
  fi
  local answer=""
  printf '%s [y/N] ' "$prompt" >&2
  read -r answer || true
  [[ "$answer" == "y" || "$answer" == "Y" || "$answer" == "yes" ]] || die "Aborted by operator."
}

init_deploy_timestamp() {
  DEPLOY_TS="$(date -u +"%Y%m%dT%H%M%SZ")"
}

ensure_demo_dirs() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would ensure dirs under ${DEMO_ROOT}"
    return 0
  fi
  mkdir -p "$DEMO_ROOT" "$LOG_DIR" "$RELEASES_DIR" "$BACKUPS_DIR"
}

# Call ONLY after privileges + hostname + assert_demo_root_safe.
begin_mutable_phase() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    ACTIVE_LOG="/dev/null"
    log "DRY-RUN: mutable phase skipped — no writes under ${DEMO_ROOT}"
    return 0
  fi
  ensure_demo_dirs
  write_demo_marker
}

start_log() {
  local prefix="$1"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    ACTIVE_LOG="/dev/null"
    log "DRY-RUN: log sink disabled (prefix=${prefix})"
    return 0
  fi
  if [[ ! -d "$LOG_DIR" ]]; then
    die "Refusing start_log: ${LOG_DIR} missing (call begin_mutable_phase after validations)."
  fi
  ACTIVE_LOG="${LOG_DIR}/${prefix}-${DEPLOY_TS}.log"
  : >"$ACTIVE_LOG"
  log "Log file: ${ACTIVE_LOG}"
}

# Read-only gate sequence shared by all operator scripts.
# Does not create DEMO_ROOT, logs, markers, or locks under /srv/docker/perola-demo.
run_pre_write_validations() {
  check_privileges
  check_hostname
  assert_demo_root_safe
}

on_error() {
  local ec=$?
  local line="${1:-?}"
  err "Aborted (exit=${ec}) at line ${line}"
  if [[ -n "${ACTIVE_LOG:-}" && "$ACTIVE_LOG" != "/dev/null" ]]; then
    printf '[%s] ERROR Aborted (exit=%s) at line %s\n' "$(_ts)" "$ec" "$line" >>"$ACTIVE_LOG" || true
  fi
  exit "$ec"
}

install_error_trap() {
  trap 'on_error $LINENO' ERR
}

# ---------------------------------------------------------------------------
# Transactional ERR handling (deploy mutation window)
# ---------------------------------------------------------------------------
# Avoids silent exits after up -d. Disables ERR while handling to prevent recursion.
transactional_finish() {
  local code="${1:-1}"
  if [[ "${TRANSACTIONAL_TEST_MODE:-0}" -eq 1 ]]; then
    return "$code"
  fi
  exit "$code"
}

handle_transactional_error() {
  local ec=$?
  local line="${1:-?}"

  if [[ "${IN_ERROR_HANDLER:-0}" -eq 1 ]]; then
    err "Nested error during transactional handling at line ${line} (exit=${ec})"
    trap - ERR
    set +e
    stop_demo_only >/dev/null 2>&1 || true
    transactional_finish "${ec:-1}"
    return $?
  fi

  IN_ERROR_HANDLER=1
  trap - ERR
  set +e

  err "Transactional abort (exit=${ec}) at line ${line}"
  if [[ -n "${ACTIVE_LOG:-}" && "$ACTIVE_LOG" != "/dev/null" ]]; then
    printf '[%s] ERROR Transactional abort (exit=%s) at line %s\n' "$(_ts)" "$ec" "$line" >>"$ACTIVE_LOG" || true
  fi

  # C) Already restoring — never recurse
  if [[ "${ROLLBACK_IN_PROGRESS:-0}" -eq 1 ]]; then
    collect_failure_diagnostics || true
    stop_demo_only || true
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_ROLLBACK_FAILED"
    write_deploy_report "DEPLOY_FAILED_ROLLBACK_FAILED" "$(cat <<EOF
reason=error_during_rollback
line=${line}
exit_code=${ec}
note=Nested failure while ROLLBACK_IN_PROGRESS=1; perola-demo-web stopped; CURRENT_SHA unchanged.
EOF
)" || true
    transactional_finish 1
    return $?
  fi

  # D) After successful commit — documentary / post-commit only
  if [[ "${DEPLOY_COMMITTED:-0}" -eq 1 ]]; then
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_POST_COMMIT"
    write_deploy_report "DEPLOY_FAILED_POST_COMMIT" "$(cat <<EOF
reason=post_commit_error
line=${line}
exit_code=${ec}
note=Failure after DEPLOY_COMMITTED=1; automatic rollback skipped; running demo left as committed.
EOF
)" || true
    transactional_finish 1
    return $?
  fi

  # B) Mutation window — diagnose + single auto-rollback
  if [[ "${DEPLOY_MUTATION_STARTED:-0}" -eq 1 ]]; then
    collect_failure_diagnostics || true
    if [[ -n "${TRANSACTIONAL_ROLLBACK_HOOK:-}" ]]; then
      "$TRANSACTIONAL_ROLLBACK_HOOK" "unexpected_error_line_${line}" || true
    else
      run_auto_rollback "unexpected_error_line_${line}" || true
    fi
    transactional_finish 1
    return $?
  fi

  # A) Before mutation — preserve current container
  LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_BEFORE_MUTATION"
  write_deploy_report "DEPLOY_FAILED_BEFORE_MUTATION" "$(cat <<EOF
reason=pre_mutation_error
line=${line}
exit_code=${ec}
note=Failure before up -d; current container preserved; no rollback.
EOF
)" || true
  transactional_finish 1
  return $?
}

install_transactional_error_trap() {
  IN_ERROR_HANDLER=0
  trap 'handle_transactional_error $LINENO' ERR
}

# Used by restore steps that fail inside run_auto_rollback
fail_restore_step() {
  local step="$1"
  local reason="$2"
  err "Rollback restore step failed: ${step}"
  collect_failure_diagnostics || true
  stop_demo_only || true
  LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_ROLLBACK_FAILED"
  write_deploy_report "DEPLOY_FAILED_ROLLBACK_FAILED" "$(cat <<EOF
reason=${reason}
failed_step=${step}
note=Restore aborted; perola-demo-web stopped; CURRENT_SHA not updated with failed candidate.
EOF
)"
  return 1
}

# Restores last known-good SHA. Safe against internal step failures and ERR recursion.
# shellcheck disable=SC2120
run_auto_rollback() {
  local reason="${1:-unspecified}"

  if [[ "${ROLLBACK_IN_PROGRESS:-0}" -eq 1 ]]; then
    err "Rollback already in progress — refusing recursion (${reason})"
    collect_failure_diagnostics || true
    stop_demo_only || true
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_ROLLBACK_FAILED"
    write_deploy_report "DEPLOY_FAILED_ROLLBACK_FAILED" "$(cat <<EOF
reason=${reason}
note=Recursive rollback blocked; demo container stopped; CURRENT_SHA unchanged.
EOF
)"
    return 1
  fi

  if [[ "${DEPLOY_MUTATION_STARTED:-0}" -eq 0 ]]; then
    err "Deploy failed before container mutation (${reason}) — preserving current version; no rollback."
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_BEFORE_MUTATION"
    write_deploy_report "DEPLOY_FAILED_BEFORE_MUTATION" "$(cat <<EOF
reason=${reason}
note=Failure occurred before up -d; running container (if any) left untouched.
EOF
)"
    return 1
  fi

  if [[ "${DEPLOY_COMMITTED:-0}" -eq 1 ]]; then
    err "Deploy already committed — refusing auto-rollback (${reason})"
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_POST_COMMIT"
    write_deploy_report "DEPLOY_FAILED_POST_COMMIT" "$(cat <<EOF
reason=${reason}
note=Automatic rollback refused after commit.
EOF
)"
    return 1
  fi

  ROLLBACK_IN_PROGRESS=1
  ROLLBACK_CALL_COUNT=$((ROLLBACK_CALL_COUNT + 1))
  local target="${ROLLBACK_TARGET_SHA:-}"
  err "Deploy failed (${reason}); attempting automatic rollback of demo only (attempt=${ROLLBACK_CALL_COUNT})..."

  # Prevent ERR trap recursion while restoring
  trap - ERR
  set +e

  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would restore last known-good SHA: ${target:-none}"
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_ROLLED_BACK"
    return 0
  fi

  if [[ -z "$target" ]]; then
    stop_demo_only || true
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_NO_PREVIOUS_RELEASE"
    write_deploy_report "DEPLOY_FAILED_NO_PREVIOUS_RELEASE" "$(cat <<EOF
reason=${reason}
note=No previous successful SHA; demo container stopped. Repo/logs preserved.
EOF
)"
    return 1
  fi

  if [[ -n "${TRANSACTIONAL_ROLLBACK_HOOK:-}" ]]; then
    "$TRANSACTIONAL_ROLLBACK_HOOK" "$reason" || true
    return 1
  fi

  log_both "Auto-rollback target (last known good): ${target}"
  collect_failure_diagnostics || true

  # Each restore step isolated — die/exit inside becomes a failed subshell/command
  if ! ( ensure_repo ); then
    fail_restore_step "ensure_repo" "$reason"
    return 1
  fi

  local full=""
  if ! full="$(verify_remote_sha "$target")"; then
    fail_restore_step "verify_remote_sha" "$reason"
    return 1
  fi

  if ! ( checkout_sha "$full" ); then
    fail_restore_step "checkout_sha" "$reason"
    return 1
  fi

  local compose_path=""
  if ! compose_path="$(compose_file_path)"; then
    fail_restore_step "compose_file_path" "$reason"
    return 1
  fi
  if ! ( validate_compose_file "$compose_path" ); then
    fail_restore_step "validate_compose_file" "$reason"
    return 1
  fi

  if ! build_demo; then
    fail_restore_step "build_demo" "$reason"
    return 1
  fi

  if ! up_demo; then
    fail_restore_step "up_demo" "$reason"
    return 1
  fi

  if ! wait_healthy; then
    fail_restore_step "wait_healthy" "$reason"
    return 1
  fi

  local smoke_script="${SCRIPTS_DIR}/smoke-vps.sh"
  if [[ ! -x "$smoke_script" && -f "$smoke_script" ]]; then
    chmod +x "$smoke_script" 2>/dev/null || true
  fi
  if ! "${smoke_script}"; then
    collect_failure_diagnostics || true
    stop_demo_only || true
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_ROLLBACK_SMOKE"
    write_deploy_report "DEPLOY_FAILED_ROLLBACK_SMOKE" "$(cat <<EOF
reason=${reason}
note=Restored release was healthy but smoke failed; container stopped. CURRENT_SHA not updated.
target=${full}
EOF
)"
    return 1
  fi

  # Restored release passed gates — refresh CURRENT_SHA to known-good (candidate never committed)
  if ! atomic_write_file "$CURRENT_SHA_FILE" "$full"; then
    fail_restore_step "persist_restored_sha" "$reason"
    return 1
  fi

  LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_ROLLED_BACK"
  write_deploy_report "DEPLOY_FAILED_ROLLED_BACK" "$(cat <<EOF
reason=${reason}
restored_sha=${full}
rollback_attempts=${ROLLBACK_CALL_COUNT}
note=Automatic rollback restored last known-good release. Failed SHA was not recorded as CURRENT.
EOF
)"
  return 1
}

# ---------------------------------------------------------------------------
# Lock (flock) — system path, independent of DEMO_ROOT
# ---------------------------------------------------------------------------
resolve_lock_file() {
  local candidate="${PEROLA_DEMO_LOCK_FILE:-}"
  if [[ -n "$candidate" ]]; then
    printf '%s' "$candidate"
    return 0
  fi
  if [[ -d /run/lock && -w /run/lock ]]; then
    printf '%s' "/run/lock/perola-demo-deploy.lock"
    return 0
  fi
  if [[ -d /var/lock && -w /var/lock ]]; then
    printf '%s' "/var/lock/perola-demo-deploy.lock"
    return 0
  fi
  # Last resort (lab/dry-run hosts) — still outside DEMO_ROOT
  printf '%s' "/tmp/perola-demo-deploy.lock"
}

acquire_lock() {
  local lock
  lock="$(resolve_lock_file)"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would acquire lock ${lock}"
    return 0
  fi
  # Ensure parent of lock exists when using /run/lock (root) — never DEMO_ROOT
  mkdir -p "$(dirname "$lock")" 2>/dev/null || true
  eval "exec ${LOCK_FD}>\"${lock}\""
  if ! flock -n "$LOCK_FD"; then
    die "Another Pérola demo operation holds ${lock}. Wait or inspect the lock."
  fi
  log "Lock acquired: ${lock}"
}

release_lock() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    return 0
  fi
  flock -u "$LOCK_FD" 2>/dev/null || true
}

# ---------------------------------------------------------------------------
# Demo root ownership / marker
# ---------------------------------------------------------------------------
write_demo_marker() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would write marker ${DEMO_MARKER_FILE}"
    return 0
  fi
  cat >"$DEMO_MARKER_FILE" <<EOF
project=gestor-camarote
demo=perola-demo
owner=ntws-labs
created_utc=$(_ts)
EOF
}

assert_demo_root_safe() {
  if [[ ! -e "$DEMO_ROOT" ]]; then
    log "Demo root does not exist yet: ${DEMO_ROOT}"
    return 0
  fi
  if [[ ! -d "$DEMO_ROOT" ]]; then
    die "Path exists but is not a directory: ${DEMO_ROOT}"
  fi
  if [[ -f "$DEMO_MARKER_FILE" ]]; then
    if ! grep -q 'demo=perola-demo' "$DEMO_MARKER_FILE" 2>/dev/null; then
      die "Marker present but not for perola-demo. Refusing to touch ${DEMO_ROOT}"
    fi
    log "Demo marker OK: ${DEMO_MARKER_FILE}"
    return 0
  fi
  # Existing dir without marker: only allow known layout
  local unknown=0
  local entry
  shopt -s nullglob
  for entry in "${DEMO_ROOT}"/* "${DEMO_ROOT}"/.[!.]*; do
    [[ -e "$entry" ]] || continue
    local base
    base="$(basename "$entry")"
    case "$base" in
      repo|logs|releases|backups|CURRENT_SHA|PREVIOUS_SHA|LAST_DEPLOY_REPORT.txt|.perola-demo-marker)
        ;;
      *)
        warn "Unexpected entry in demo root: ${base}"
        unknown=1
        ;;
    esac
  done
  shopt -u nullglob
  if [[ "$unknown" -eq 1 ]]; then
    die "Refusing to use ${DEMO_ROOT}: unknown contents without .perola-demo-marker"
  fi
  log "Demo root looks like perola-demo layout (no foreign trees)."
}

# ---------------------------------------------------------------------------
# Argument helpers
# ---------------------------------------------------------------------------
normalize_sha() {
  local sha="${1:-}"
  sha="${sha,,}"
  [[ -n "$sha" ]] || die "SHA argument is required (refusing implicit HEAD)."
  [[ "$sha" =~ ^[0-9a-f]{7,40}$ ]] || die "Invalid SHA format: ${sha}"
  printf '%s' "$sha"
}

parse_common_flags() {
  # Mutates global DRY_RUN / ASSUME_YES / EXTERNAL_URL; leaves remaining in ARGS array
  ARGS=()
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dry-run) DRY_RUN=1; shift ;;
      --yes|-y) ASSUME_YES=1; shift ;;
      --external)
        [[ $# -ge 2 ]] || die "--external requires a URL"
        # Consumed by smoke-vps.sh / status-vps.sh after sourcing this library
        # shellcheck disable=SC2034
        EXTERNAL_URL="${2%/}"
        shift 2
        ;;
      --help|-h)
        return 2
        ;;
      --)
        shift
        ARGS+=("$@")
        break
        ;;
      -*)
        die "Unknown flag: $1"
        ;;
      *)
        ARGS+=("$1")
        shift
        ;;
    esac
  done
}

# ---------------------------------------------------------------------------
# Host / resource checks
# ---------------------------------------------------------------------------
check_hostname() {
  local host
  host="$(hostname -s 2>/dev/null || hostname)"
  if [[ "$host" != "$EXPECTED_HOSTNAME" ]]; then
    if [[ "$DRY_RUN" -eq 1 ]]; then
      warn "Hostname is '${host}', expected '${EXPECTED_HOSTNAME}' (allowed in --dry-run)."
      return 0
    fi
    die "Unexpected hostname '${host}' (expected '${EXPECTED_HOSTNAME}'). Set PEROLA_DEMO_EXPECTED_HOSTNAME to override."
  fi
  log "Hostname OK: ${host}"
}

check_privileges() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    if is_root; then
      log "Running as root (dry-run)."
    else
      warn "Not root — dry-run continues; real deploy requires sudo/root."
    fi
    return 0
  fi
  is_root || die "Run with sudo/root (needed for ${DEMO_ROOT} and Docker)."
  log "Privileges OK (root)."
}

check_arch() {
  local arch
  arch="$(uname -m)"
  log "Architecture: ${arch}"
  case "$arch" in
    x86_64|amd64|aarch64|arm64) ;;
    *) warn "Unusual architecture: ${arch}" ;;
  esac
}

check_disk() {
  local avail=""
  local target="/"
  if [[ -d "$DEMO_ROOT" ]]; then
    target="$DEMO_ROOT"
  elif [[ "$DRY_RUN" -eq 1 ]]; then
    target="."
  fi
  avail="$(df -Pm "$target" 2>/dev/null | awk 'NR==2{print $4}' || true)"
  if [[ -z "$avail" || ! "$avail" =~ ^[0-9]+$ ]]; then
    avail="$(df -Pm . 2>/dev/null | awk 'NR==2{print $4}' || true)"
  fi
  log "Free disk (MB) on ${target}: ${avail:-unknown}"
  if [[ "$avail" =~ ^[0-9]+$ ]]; then
    if (( avail < MIN_DISK_MB )); then
      die "Insufficient disk: ${avail}MB < ${MIN_DISK_MB}MB"
    fi
  elif [[ "$DRY_RUN" -eq 1 ]]; then
    warn "Could not determine free disk (dry-run continues)."
  else
    die "Could not determine free disk"
  fi
}

check_memory() {
  local mem_mb=0
  if [[ -r /proc/meminfo ]]; then
    mem_mb="$(awk '/MemAvailable:/{printf "%d", $2/1024}' /proc/meminfo)"
  fi
  log "Available memory (MB): ${mem_mb}"
  if [[ "${mem_mb}" -gt 0 && "${mem_mb}" -lt "$MIN_MEM_MB" ]]; then
    die "Insufficient memory: ${mem_mb}MB < ${MIN_MEM_MB}MB"
  fi
}

check_docker() {
  DOCKER_OK=0
  if [[ "$DRY_RUN" -eq 1 && "${PEROLA_DEMO_DRY_RUN_DOCKER:-0}" != "1" ]]; then
    warn "DRY-RUN: skipping Docker engine probe (set PEROLA_DEMO_DRY_RUN_DOCKER=1 to enable)."
    return 0
  fi
  if ! command -v docker >/dev/null 2>&1; then
    if [[ "$DRY_RUN" -eq 1 ]]; then
      warn "docker CLI not found — dry-run continues with static checks only."
      return 0
    fi
    die "Required command not found: docker"
  fi
  if ! docker info >/dev/null 2>&1; then
    if [[ "$DRY_RUN" -eq 1 ]]; then
      warn "Docker daemon not accessible — dry-run continues without live compose/engine checks."
      return 0
    fi
    die "Docker daemon is not running or not accessible."
  fi
  if docker compose version >/dev/null 2>&1; then
    log "Docker Compose: $(docker compose version --short 2>/dev/null || docker compose version | head -1)"
  else
    if [[ "$DRY_RUN" -eq 1 ]]; then
      warn "Docker Compose plugin missing — dry-run continues."
      return 0
    fi
    die "Docker Compose plugin not available (need: docker compose)."
  fi
  DOCKER_OK=1
}

check_git() {
  require_cmd git
  log "Git: $(git --version)"
}

check_github_access() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: skipping live GitHub HTTP probe (use git fetch on VPS)."
    return 0
  fi
  if command -v curl >/dev/null 2>&1; then
    if curl -fsSIL --connect-timeout 5 --max-time 10 "${GITHUB_REPO_HTTPS}" >/dev/null 2>&1; then
      log "GitHub HTTP reachability OK"
      return 0
    fi
    warn "GitHub HTTP check failed (network/DNS). git fetch may still work."
    return 0
  fi
  warn "curl missing; skipped GitHub HTTP check."
}

check_port_3107() {
  local listeners=""
  if command -v ss >/dev/null 2>&1; then
    listeners="$(ss -ltnp 2>/dev/null | grep -E ':3107\b' || true)"
  elif command -v lsof >/dev/null 2>&1; then
    listeners="$(lsof -nP -iTCP:3107 -sTCP:LISTEN 2>/dev/null || true)"
  fi
  if [[ -z "$listeners" ]]; then
    log "Port ${BIND_PORT} appears free (or could not be probed)."
    return 0
  fi
  if echo "$listeners" | grep -qi "$CONTAINER_NAME"; then
    log "Port ${BIND_PORT} held by ${CONTAINER_NAME} (expected for redeploy)."
    return 0
  fi
  if [[ "$DOCKER_OK" -eq 1 ]] && docker ps --format '{{.Names}}' 2>/dev/null | grep -qx "$CONTAINER_NAME"; then
    log "Port ${BIND_PORT} in use and ${CONTAINER_NAME} is running (OK)."
    return 0
  fi
  err "Port ${BIND_PORT} is occupied by a foreign process:"
  err "$listeners"
  die "Refusing to continue while ${BIND_PORT} is taken by something other than ${CONTAINER_NAME}."
}

compose_file_path() {
  if [[ -f "${REPO_DIR}/${COMPOSE_REL}" ]]; then
    printf '%s' "${REPO_DIR}/${COMPOSE_REL}"
    return 0
  fi
  if [[ -f "${SCRIPTS_DIR}/compose.demo.yaml" ]]; then
    printf '%s' "${SCRIPTS_DIR}/compose.demo.yaml"
    return 0
  fi
  die "compose.demo.yaml not found (repo checkout missing?)."
}

compose_cmd() {
  local file
  file="$(compose_file_path)"
  # shellcheck disable=SC2086
  docker compose -f "$file" --project-name perola-demo "$@"
}

# ---------------------------------------------------------------------------
# Compose security validation
# ---------------------------------------------------------------------------
validate_compose_file() {
  local file="$1"
  [[ -f "$file" ]] || die "Compose file missing: $file"
  log "Validating compose: $file"

  if [[ "$DOCKER_OK" -ne 1 ]]; then
    if [[ "$DRY_RUN" -eq 1 ]]; then
      warn "DRY-RUN: docker unavailable — static compose text checks only"
      validate_compose_static "$file"
      return 0
    fi
    die "Docker required to render compose config"
  fi

  local rendered
  if ! rendered="$(docker compose -f "$file" --project-name perola-demo config 2>&1)"; then
    err "$rendered"
    die "docker compose config failed"
  fi

  local tmp
  tmp="$(mktemp)"
  printf '%s\n' "$rendered" >"$tmp"

  # Only one app service expected
  local services
  services="$(docker compose -f "$file" --project-name perola-demo config --services 2>/dev/null || true)"
  if [[ -z "$services" ]]; then
    die "Could not list compose services"
  fi
  if ! printf '%s\n' "$services" | grep -qx "$SERVICE_NAME"; then
    die "Compose must define service ${SERVICE_NAME}"
  fi
  local other
  other="$(printf '%s\n' "$services" | grep -vx "$SERVICE_NAME" || true)"
  if [[ -n "$other" ]]; then
    die "Compose defines unexpected services: ${other}"
  fi

  grep -Eq "published: \"?${BIND_PORT}\"?|${BIND_HOST}:${BIND_PORT}:${CONTAINER_PORT}|\"${BIND_HOST}:${BIND_PORT}:${CONTAINER_PORT}\"" "$tmp" \
    || grep -Eq "${BIND_HOST}.*${BIND_PORT}|${BIND_PORT}" "$tmp" \
    || die "Bind ${BIND_HOST}:${BIND_PORT}:${CONTAINER_PORT} not found in rendered compose"

  # Prefer explicit published/host_ip checks when present
  if grep -q 'published:' "$tmp"; then
    grep -q "published: \"${BIND_PORT}\"" "$tmp" || grep -q "published: ${BIND_PORT}" "$tmp" \
      || die "Published port must be ${BIND_PORT}"
    if grep -q 'host_ip:' "$tmp"; then
      grep -q "host_ip: ${BIND_HOST}" "$tmp" || die "host_ip must be ${BIND_HOST}"
    fi
  fi

  grep -Eq "name: ${NETWORK_NAME}|${NETWORK_NAME}" "$tmp" || die "Network ${NETWORK_NAME} missing"

  validate_compose_forbidden "$tmp"
  rm -f "$tmp"
  log "Compose validation OK (isolated ${SERVICE_NAME} only)."
}

validate_compose_static() {
  local file="$1"
  grep -q "container_name: ${CONTAINER_NAME}" "$file" || die "static: missing container_name ${CONTAINER_NAME}"
  grep -q "${BIND_HOST}:${BIND_PORT}:${CONTAINER_PORT}" "$file" || die "static: missing bind ${BIND_HOST}:${BIND_PORT}:${CONTAINER_PORT}"
  grep -q "${NETWORK_NAME}" "$file" || die "static: missing network ${NETWORK_NAME}"
  grep -q "perola-demo-web:" "$file" || die "static: missing service ${SERVICE_NAME}"
  validate_compose_forbidden "$file"
  log "Static compose checks OK: $file"
}

validate_compose_forbidden() {
  local tmp="$1"
  local bad
  for bad in \
    'privileged: true' \
    'network_mode: host' \
    'network_mode: "host"' \
    '/var/run/docker.sock' \
    'docker.sock'
  do
    if grep -Fiq -- "$bad" "$tmp"; then
      die "Forbidden compose setting detected: ${bad}"
    fi
  done
  # DB / infra image or service hints
  if grep -Ei 'image:.*(postgres|mysql|mariadb|mongo|redis)' "$tmp" >/dev/null; then
    die "Forbidden database/infra image reference in compose"
  fi
  if compose_file_has_external_network "$tmp"; then
    die "External Docker networks are forbidden for this demo"
  fi
}

# Deterministic: exit 0 if an external network is declared, else exit 1.
# Uses `found` so END cannot overwrite a match with a blind exit 1.
compose_file_has_external_network() {
  awk '
    BEGIN { found = 0; in_networks = 0 }
    /^[[:space:]]*networks:[[:space:]]*$/ { in_networks = 1; next }
    in_networks && /^[^[:space:]#]/ { in_networks = 0 }
    in_networks && /external:[[:space:]]*true([[:space:]]|$)/ { found = 1 }
    END { if (found) exit 0; exit 1 }
  ' "$1"
}

# ---------------------------------------------------------------------------
# Git / SHA
# ---------------------------------------------------------------------------
ensure_repo() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    if [[ -d "${LOCAL_REPO_ROOT}/.git" ]]; then
      log "DRY-RUN: using local checkout ${LOCAL_REPO_ROOT}"
      return 0
    fi
    log "DRY-RUN: would clone ${GITHUB_REPO_URL} → ${REPO_DIR}"
    return 0
  fi

  # DEMO_ROOT must already have passed assert_demo_root_safe + begin_mutable_phase
  if [[ ! -d "$DEMO_ROOT" ]]; then
    die "Refusing ensure_repo: ${DEMO_ROOT} missing (mutable phase not started)."
  fi

  if [[ ! -d "${REPO_DIR}/.git" ]]; then
    if [[ -e "$REPO_DIR" ]]; then
      die "${REPO_DIR} exists but is not a git repository. Refusing to overwrite."
    fi
    log "Cloning repository into ${REPO_DIR}"
    git clone "$GITHUB_REPO_URL" "$REPO_DIR"
  else
    log "Repository already present: ${REPO_DIR}"
  fi

  (
    cd "$REPO_DIR"
    local origin
    origin="$(git remote get-url origin 2>/dev/null || true)"
    if [[ -z "$origin" ]]; then
      die "origin remote missing in ${REPO_DIR}"
    fi
    case "$origin" in
      *palexsfc10/gestor-camarote*) log "origin OK: ${origin}" ;;
      *) die "Unexpected origin remote: ${origin}" ;;
    esac

    if [[ -n "$(git status --porcelain)" ]]; then
      die "Working tree has local changes in ${REPO_DIR}. Clean or document before deploy."
    fi

    log "Fetching from origin (no pull)"
    git fetch --tags --prune origin
  )
}

repo_workdir() {
  if [[ "$DRY_RUN" -eq 1 && -d "${LOCAL_REPO_ROOT}/.git" ]]; then
    printf '%s' "$LOCAL_REPO_ROOT"
  else
    printf '%s' "$REPO_DIR"
  fi
}

verify_remote_sha() {
  local sha="$1"
  local wd
  wd="$(repo_workdir)"
  (
    cd "$wd"
    if [[ "$DRY_RUN" -eq 1 ]]; then
      git fetch --tags --prune origin 2>/dev/null || true
    fi
    if ! git cat-file -e "${sha}^{commit}" 2>/dev/null; then
      # try after fetch
      git fetch --tags --prune origin 2>/dev/null || true
    fi
    git cat-file -e "${sha}^{commit}" 2>/dev/null || die "SHA not found in repository: ${sha}"
    local full
    full="$(git rev-parse "${sha}^{commit}")"
    printf '%s' "$full"
  )
}

checkout_sha() {
  local full_sha="$1"
  local wd
  wd="$(repo_workdir)"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would checkout detached ${full_sha} in ${wd}"
    (
      cd "$wd"
      git rev-parse "${full_sha}^{commit}" >/dev/null
    )
    return 0
  fi
  (
    cd "$wd"
    if [[ -n "$(git status --porcelain)" ]]; then
      die "Refusing checkout: dirty working tree"
    fi
    log "Checkout detached HEAD at ${full_sha}"
    git checkout --detach "$full_sha"
    local now
    now="$(git rev-parse HEAD)"
    [[ "$now" == "$full_sha" ]] || die "HEAD mismatch after checkout: ${now} != ${full_sha}"
    log "Confirmed HEAD=${now}"
  )
}

read_sha_file() {
  local f="$1"
  if [[ -f "$f" ]]; then
    tr -d '[:space:]' <"$f"
  fi
}

atomic_write_file() {
  local dest="$1"
  local content="$2"
  local dir tmp
  dir="$(dirname "$dest")"
  if ! mkdir -p "$dir"; then
    err "atomic_write_file: cannot create directory ${dir}"
    return 1
  fi
  tmp="$(mktemp "${dir}/.tmp.XXXXXX")" || {
    err "atomic_write_file: mktemp failed for ${dir}"
    return 1
  }
  if ! printf '%s\n' "$content" >"$tmp"; then
    rm -f "$tmp"
    err "atomic_write_file: write failed for ${tmp}"
    return 1
  fi
  if ! mv -f "$tmp" "$dest"; then
    rm -f "$tmp"
    err "atomic_write_file: rename failed → ${dest}"
    return 1
  fi
  return 0
}

# Call ONLY after healthy + smokes + inventory comparison + all gates.
# DEPLOY_COMMITTED must remain 0 until this returns success.
write_sha_files() {
  local new_sha="$1"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would set CURRENT_SHA=${new_sha} (atomic, post-gates)"
    return 0
  fi
  local prev
  prev="$(read_sha_file "$CURRENT_SHA_FILE" || true)"
  if [[ -n "$prev" && "$prev" != "$new_sha" ]]; then
    if ! atomic_write_file "$PREVIOUS_SHA_FILE" "$prev"; then
      err "Failed to persist PREVIOUS_SHA"
      return 1
    fi
    log "PREVIOUS_SHA ← ${prev}"
  fi
  if ! atomic_write_file "$CURRENT_SHA_FILE" "$new_sha"; then
    err "Failed to persist CURRENT_SHA"
    return 1
  fi
  if ! mkdir -p "${RELEASES_DIR}/${new_sha}"; then
    err "Failed to create release directory for ${new_sha}"
    return 1
  fi
  local meta
  meta="$(mktemp "${RELEASES_DIR}/${new_sha}/.meta.XXXXXX")" || {
    err "Failed to allocate release metadata tempfile"
    return 1
  }
  if ! cat >"$meta" <<EOF
sha=${new_sha}
deployed_utc=$(_ts)
image=perola-demo-web:local
container=${CONTAINER_NAME}
EOF
  then
    rm -f "$meta"
    err "Failed to write release metadata"
    return 1
  fi
  if ! mv -f "$meta" "${RELEASES_DIR}/${new_sha}/meta.txt"; then
    rm -f "$meta"
    err "Failed to commit release metadata"
    return 1
  fi
  log "CURRENT_SHA ← ${new_sha} (committed after all gates)"
  return 0
}

# ---------------------------------------------------------------------------
# Container inventory / protection
# ---------------------------------------------------------------------------
snapshot_containers() {
  local out="$1"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would snapshot containers → ${out}"
    return 0
  fi
  if [[ "$DOCKER_OK" -ne 1 ]]; then
    err "Docker required for container snapshot"
    return 1
  fi
  if ! {
    echo "# containers snapshot $(_ts)"
    docker ps -a --format 'table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
    echo
    echo "# started_at"
    docker ps -a --format '{{.Names}} {{.ID}}' | while read -r name id; do
      [[ -n "$id" ]] || continue
      local started
      started="$(docker inspect -f '{{.State.StartedAt}}' "$id" 2>/dev/null || echo unknown)"
      echo "${name} ${id} ${started}"
    done
  } >"$out"; then
    err "Failed to write container snapshot: ${out}"
    return 1
  fi
  log "Container snapshot: $out"
  return 0
}

assert_preexisting_containers_unchanged() {
  local before="$1"
  local after="$2"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would compare all pre-existing containers (except ${CONTAINER_NAME})"
    return 0
  fi
  if [[ ! -f "$before" || ! -f "$after" ]]; then
    err "Missing container inventory for comparison (${before} / ${after})"
    return 1
  fi

  local name id started_before after_id after_started
  local notable=()

  while read -r name id started_before; do
    [[ -z "$name" || "$name" == \#* ]] && continue
    # Only perola-demo-web may change during this deploy
    if [[ "$name" == "$CONTAINER_NAME" ]]; then
      continue
    fi

    after_id="$(awk -v n="$name" '$1==n{print $2; exit}' "$after" || true)"
    after_started="$(awk -v n="$name" '$1==n{print $3; exit}' "$after" || true)"

    if [[ -z "$after_id" ]]; then
      err "Pre-existing container missing after deploy: ${name}"
      return 1
    fi
    if [[ "$after_id" != "$id" ]]; then
      err "Pre-existing container ID changed: ${name} (${id} → ${after_id})"
      return 1
    fi
    if [[ "$after_started" != "$started_before" ]]; then
      err "Pre-existing container restarted: ${name} (${started_before} → ${after_started})"
      return 1
    fi

    if echo "$name" | grep -Eiq "$PROTECTED_NAME_REGEX"; then
      notable+=("$name")
    fi
  done < <(awk '/^# started_at/{f=1;next} f && NF>=3{print}' "$before")

  log "All pre-existing containers unchanged (except ${CONTAINER_NAME})."
  if [[ ${#notable[@]} -gt 0 ]]; then
    log "Notable stacks verified unchanged: ${notable[*]}"
  fi
  return 0
}

# Backward-compatible alias
assert_protected_not_restarted() {
  assert_preexisting_containers_unchanged "$@"
}

diagnose_cloudflared() {
  if [[ "$DOCKER_OK" -ne 1 ]]; then
    warn "Skipping cloudflared diagnostic (Docker unavailable)."
    return 0
  fi
  if docker ps --format '{{.Names}} {{.Status}}' 2>/dev/null | grep -Ei 'cloudflared|cloudflare' || true; then
    log "Cloudflare Tunnel containers (diagnostic only — not modified):"
    docker ps --format '{{.Names}}\t{{.Status}}' | grep -Ei 'cloudflared|cloudflare' || true
  else
    warn "No cloudflared/cloudflare container name matched (diagnostic only)."
  fi
}

# ---------------------------------------------------------------------------
# Health / failure diagnostics
# ---------------------------------------------------------------------------
wait_healthy() {
  local deadline=$((SECONDS + HEALTH_TIMEOUT_SEC))
  local status=""
  log "Waiting for health (timeout ${HEALTH_TIMEOUT_SEC}s)..."
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: skip health wait"
    return 0
  fi
  while (( SECONDS < deadline )); do
    if ! docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
      status="missing"
    else
      status="$(docker inspect -f '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$CONTAINER_NAME" 2>/dev/null || echo unknown)"
    fi
    case "$status" in
      healthy)
        log "Container healthy."
        return 0
        ;;
      unhealthy|exited|dead)
        err "Container status: ${status}"
        return 1
        ;;
      restarting)
        warn "Container restarting..."
        ;;
      starting|running|created|"")
        ;;
      *)
        warn "Health status: ${status}"
        ;;
    esac
    sleep 3
  done
  err "Healthcheck timeout after ${HEALTH_TIMEOUT_SEC}s (last=${status})"
  return 1
}

# shellcheck disable=SC2120
collect_failure_diagnostics() {
  local out="${1:-}"
  if [[ -z "$out" ]]; then
    if [[ -d "$LOG_DIR" ]]; then
      out="${LOG_DIR}/failure-${DEPLOY_TS:-$(_ts)}.log"
    else
      out="/tmp/perola-demo-failure-${DEPLOY_TS:-$(_ts)}.log"
    fi
  fi
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would collect failure diagnostics → ${out}"
    return 0
  fi
  mkdir -p "$(dirname "$out")" 2>/dev/null || true
  {
    echo "=== failure diagnostics $(_ts) ==="
    echo "--- compose ps ---"
    if [[ "$DOCKER_OK" -eq 1 ]]; then
      compose_cmd ps || true
      echo "--- inspect ---"
      docker inspect "$CONTAINER_NAME" 2>&1 || true
      echo "--- logs (200) ---"
      docker logs --tail 200 "$CONTAINER_NAME" 2>&1 || true
      echo "--- memory ---"
      docker stats --no-stream "$CONTAINER_NAME" 2>&1 || true
    else
      echo "(docker unavailable)"
    fi
    echo "--- port ---"
    ss -ltnp 2>/dev/null | grep 3107 || true
    curl -sI --max-time 5 "${INTERNAL_BASE}/demo" 2>&1 || true
  } >"$out"
  err "Diagnostics saved: ${out}"
}

# ---------------------------------------------------------------------------
# Build / up (no down, no prune)
# ---------------------------------------------------------------------------
record_previous_image() {
  if [[ "$DRY_RUN" -eq 1 || "$DOCKER_OK" -ne 1 ]]; then
    return 0
  fi
  if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    docker inspect -f 'image={{.Image}} image_id={{.Image}} status={{.State.Status}}' "$CONTAINER_NAME" \
      | tee -a "${ACTIVE_LOG:-/dev/null}" >/dev/null || true
  fi
}

build_demo() {
  local file
  file="$(compose_file_path)"
  validate_compose_file "$file"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would build ${SERVICE_NAME} via ${file}"
    return 0
  fi
  log "Building ${SERVICE_NAME}..."
  local start=$SECONDS
  if ! compose_cmd build "$SERVICE_NAME"; then
    err "Build failed for ${SERVICE_NAME}"
    return 1
  fi
  log "Build duration: $((SECONDS - start))s"
  return 0
}

up_demo() {
  local file
  file="$(compose_file_path)"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would up -d ${SERVICE_NAME} via ${file}"
    return 0
  fi
  log "Starting ${SERVICE_NAME} (no compose down)..."
  if ! compose_cmd up -d "$SERVICE_NAME"; then
    err "up -d failed for ${SERVICE_NAME}"
    return 1
  fi
  return 0
}

stop_demo_only() {
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would stop/remove only ${CONTAINER_NAME}"
    return 0
  fi
  if [[ "$DOCKER_OK" -ne 1 ]]; then
    warn "Cannot stop ${CONTAINER_NAME}: Docker unavailable"
    return 0
  fi
  if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    log "Stopping ${CONTAINER_NAME} only"
    docker stop "$CONTAINER_NAME" >/dev/null || true
    docker rm "$CONTAINER_NAME" >/dev/null || true
  else
    log "Container ${CONTAINER_NAME} not present"
  fi
}

# ---------------------------------------------------------------------------
# Reporting
# ---------------------------------------------------------------------------
write_deploy_report() {
  local verdict="$1"
  shift
  local body="$*"
  local report_file
  LAST_TRANSACTION_VERDICT="$verdict"
  # shellcheck disable=SC2034
  : "${LAST_TRANSACTION_VERDICT}"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN verdict: ${verdict}"
    printf '%s\n' "$body"
    return 0
  fi
  report_file="${LOG_DIR}/deploy-${DEPLOY_TS}.log"
  if [[ ! -d "$LOG_DIR" ]]; then
    err "Cannot write deploy report: ${LOG_DIR} missing"
    return 1
  fi
  if ! {
    echo "=== Pérola Demo Deploy Report ==="
    echo "verdict=${verdict}"
    echo "hostname=$(hostname)"
    echo "date_utc=$(_ts)"
    echo "$body"
  } | tee "$report_file" | tee "$LAST_DEPLOY_REPORT" >/dev/null; then
    err "Failed to write deploy report"
    return 1
  fi
  if [[ -n "${ACTIVE_LOG:-}" && "$ACTIVE_LOG" != "$report_file" && "$ACTIVE_LOG" != "/dev/null" ]]; then
    cat "$report_file" >>"$ACTIVE_LOG" || true
  fi
  log "Report: ${report_file}"
  log "LAST_DEPLOY_REPORT.txt updated"
  log "VERDICT: ${verdict}"
  return 0
}
