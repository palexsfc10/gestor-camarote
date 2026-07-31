#!/usr/bin/env bash
# Controlled deploy of Pérola demo on the NTWS VPS.
# Usage:
#   sudo ./deploy/demo/deploy-vps.sh [--dry-run] [--yes] <sha>
#
# Does NOT require the operator's current working directory.
# Does NOT deploy HEAD implicitly. Does NOT connect Cursor to the VPS.
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh disable=SC1091
source "${SCRIPT_DIR}/lib/common.sh"

usage() {
  cat <<'EOF'
Usage: sudo ./deploy/demo/deploy-vps.sh [--dry-run] [--yes] <git-sha>

Deploys exactly the given SHA of gestor-camarote as perola-demo-web.
Layout: /srv/docker/perola-demo/{repo,logs,releases,backups}

Options:
  --dry-run   Validate and print plan; no build/up/mutations under DEMO_ROOT
  --yes       Skip interactive confirmation

Example:
  sudo ./deploy/demo/deploy-vps.sh 0528b4a5fca641c15468a6c506f8f153f3466da8
EOF
}

# Restores last known-good SHA (captured at deploy start).
# Covers the mutation window starting at `docker compose up -d`.
# Never recurses. Never marks a smoke-failed restore as CURRENT_SHA.
run_auto_rollback() {
  local reason="$1"

  if [[ "$ROLLBACK_IN_PROGRESS" -eq 1 ]]; then
    err "Rollback already in progress — refusing recursion (${reason})"
    stop_demo_only
    write_deploy_report "DEPLOY_FAILED_ROLLBACK_FAILED" "$(cat <<EOF
reason=${reason}
note=Recursive rollback blocked; demo container stopped.
EOF
)"
    return 1
  fi

  if [[ "$DEPLOY_MUTATION_STARTED" -eq 0 ]]; then
    err "Deploy failed before container mutation (${reason}) — preserving current version; no rollback."
    write_deploy_report "DEPLOY_FAILED_NO_PREVIOUS_RELEASE" "$(cat <<EOF
reason=${reason}
note=Failure occurred before up -d; running container (if any) left untouched.
EOF
)"
    return 1
  fi

  if [[ "$DEPLOY_COMMITTED" -eq 1 ]]; then
    err "Deploy already committed — refusing auto-rollback (${reason})"
    return 1
  fi

  ROLLBACK_IN_PROGRESS=1
  local target="${ROLLBACK_TARGET_SHA:-}"
  err "Deploy failed (${reason}); attempting automatic rollback of demo only..."

  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would restore last known-good SHA: ${target:-none}"
    return 0
  fi

  if [[ -z "$target" ]]; then
    stop_demo_only
    write_deploy_report "DEPLOY_FAILED_NO_PREVIOUS_RELEASE" "$(cat <<EOF
reason=${reason}
note=No previous successful SHA; demo container stopped. Repo/logs preserved.
EOF
)"
    return 1
  fi

  log_both "Auto-rollback target (last known good): ${target}"
  collect_failure_diagnostics

  ensure_repo
  local full
  full="$(verify_remote_sha "$target")"
  checkout_sha "$full"
  validate_compose_file "$(compose_file_path)"
  build_demo
  up_demo

  if ! wait_healthy; then
    collect_failure_diagnostics
    stop_demo_only
    write_deploy_report "DEPLOY_FAILED_ROLLBACK_FAILED" "$(cat <<EOF
reason=${reason}
note=Auto-rollback health failed; demo stopped. CURRENT_SHA unchanged.
target=${full}
EOF
)"
    return 1
  fi

  if ! "${SCRIPT_DIR}/smoke-vps.sh"; then
    collect_failure_diagnostics
    stop_demo_only
    write_deploy_report "DEPLOY_FAILED_ROLLBACK_SMOKE" "$(cat <<EOF
reason=${reason}
note=Restored release was healthy but smoke failed; container stopped. CURRENT_SHA not updated.
target=${full}
EOF
)"
    return 1
  fi

  # Restored release passed gates — keep CURRENT_SHA as the known-good target
  # (failed candidate was never written). Atomic refresh for clarity.
  atomic_write_file "$CURRENT_SHA_FILE" "$full"
  write_deploy_report "DEPLOY_FAILED_ROLLED_BACK" "$(cat <<EOF
reason=${reason}
restored_sha=${full}
note=Automatic rollback restored last known-good release. Failed SHA was not recorded as CURRENT.
EOF
)"
  return 1
}

main() {
  if ! parse_common_flags "$@"; then
    usage
    exit 0
  fi
  if [[ ${#ARGS[@]} -ne 1 ]]; then
    usage
    die "Exactly one SHA argument is required (got ${#ARGS[@]})."
  fi

  local requested full_sha
  requested="$(normalize_sha "${ARGS[0]}")"

  install_error_trap
  init_deploy_timestamp

  DEPLOY_MUTATION_STARTED=0
  ROLLBACK_IN_PROGRESS=0
  DEPLOY_COMMITTED=0

  # --- No writes under DEMO_ROOT before these gates ---
  run_pre_write_validations
  acquire_lock
  trap 'release_lock' EXIT

  begin_mutable_phase
  start_log "deploy"

  local deploy_start=$SECONDS
  # Capture known-good BEFORE any mutation (file may not exist yet)
  ROLLBACK_TARGET_SHA="$(read_sha_file "$CURRENT_SHA_FILE" || true)"

  log_both "=== Pérola demo deploy ==="
  log_both "requested_sha=${requested}"
  log_both "dry_run=${DRY_RUN}"
  log_both "rollback_target_sha=${ROLLBACK_TARGET_SHA:-none}"

  check_arch
  check_git
  check_docker
  check_disk
  check_memory
  check_github_access
  check_port_3107
  diagnose_cloudflared

  local before="${LOG_DIR}/containers-before-${DEPLOY_TS}.txt"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log_both "DRY-RUN: would snapshot ${before}"
  else
    snapshot_containers "$before"
  fi

  confirm "Deploy Pérola demo at SHA ${requested} to ${DEMO_ROOT}?"

  ensure_repo
  full_sha="$(verify_remote_sha "$requested")"
  log_both "resolved_sha=${full_sha}"
  checkout_sha "$full_sha"

  local head_now
  head_now="$(
    cd "$(repo_workdir)"
    if [[ "$DRY_RUN" -eq 1 ]]; then
      git rev-parse "${full_sha}^{commit}"
    else
      git rev-parse HEAD
    fi
  )"
  [[ "$head_now" == "$full_sha" ]] || die "Refusing build: HEAD ${head_now} != ${full_sha}"
  log_both "Pre-build SHA confirmed: ${head_now}"

  local compose
  compose="$(compose_file_path)"
  validate_compose_file "$compose"

  record_previous_image

  # --- Build (no container mutation yet) ---
  local build_start=$SECONDS
  if ! build_demo; then
    collect_failure_diagnostics
    run_auto_rollback "build_failed"
    exit 1
  fi
  local build_secs=$((SECONDS - build_start))
  log_both "build_seconds=${build_secs}"

  # --- Mutation window opens at up -d ---
  local up_start=$SECONDS
  DEPLOY_MUTATION_STARTED=1
  if ! up_demo; then
    collect_failure_diagnostics
    run_auto_rollback "up_failed"
    exit 1
  fi
  local up_secs=$((SECONDS - up_start))
  log_both "up_seconds=${up_secs}"

  if ! wait_healthy; then
    collect_failure_diagnostics
    run_auto_rollback "healthcheck_failed"
    exit 1
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    log_both "DRY-RUN: would run smoke-vps.sh against ${INTERNAL_BASE}"
    "${SCRIPT_DIR}/smoke-vps.sh" --dry-run
  elif ! "${SCRIPT_DIR}/smoke-vps.sh"; then
    collect_failure_diagnostics
    run_auto_rollback "smoke_failed"
    exit 1
  fi

  local after="${LOG_DIR}/containers-after-${DEPLOY_TS}.txt"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log_both "DRY-RUN: would snapshot ${after} and compare inventories"
  else
    snapshot_containers "$after"
    if ! assert_preexisting_containers_unchanged "$before" "$after"; then
      collect_failure_diagnostics
      run_auto_rollback "container_impact_failed"
      exit 1
    fi
  fi

  # --- Commit SHA only after ALL gates ---
  write_sha_files "$full_sha"
  DEPLOY_COMMITTED=1

  local image_id=""
  local verdict="DEPLOY_SUCCESS"
  if [[ "$DRY_RUN" -eq 0 && "$DOCKER_OK" -eq 1 ]] && docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    image_id="$(docker inspect -f '{{.Image}}' "$CONTAINER_NAME" 2>/dev/null || true)"
  fi

  local total=$((SECONDS - deploy_start))

  write_deploy_report "$verdict" "$(cat <<EOF
sha=${full_sha}
image=${image_id:-perola-demo-web:local}
container=${CONTAINER_NAME}
port=${BIND_HOST}:${BIND_PORT}
hostname_planned=perola-demo.ntws.cloud
build_seconds=${build_secs}
deploy_up_seconds=${up_secs}
total_seconds=${total}
health=healthy
smokes=passed
containers_before=${before}
containers_after=${after}
preexisting_containers=unchanged
compose=${compose}
cloudflare=unchanged_by_this_script
EOF
)"

  log_both "DEPLOY_OK ${full_sha} (${total}s)"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log_both "DRY-RUN complete — no containers changed."
  fi
  exit 0
}

main "$@"
