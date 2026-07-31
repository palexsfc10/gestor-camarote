#!/usr/bin/env bash
# Rollback restricted to Pérola demo only.
# Usage: sudo ./deploy/demo/rollback-vps.sh [--yes] [--dry-run]
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

usage() {
  cat <<'EOF'
Usage: sudo ./deploy/demo/rollback-vps.sh [--yes] [--dry-run]

Restores PREVIOUS_SHA for perola-demo-web only.
Never touches Kyvora, Arena, Croniu, PostgreSQL, Cloudflared, or other stacks.
EOF
}

main() {
  if ! parse_common_flags "$@"; then
    usage
    exit 0
  fi
  if [[ ${#ARGS[@]} -gt 0 ]]; then
    usage
    die "Unexpected arguments: ${ARGS[*]}"
  fi

  install_error_trap
  init_deploy_timestamp
  check_privileges
  ensure_demo_dirs
  start_log "rollback"
  acquire_lock
  trap 'release_lock' EXIT

  check_hostname
  check_docker
  assert_demo_root_safe

  local current previous
  current="$(read_sha_file "$CURRENT_SHA_FILE" || true)"
  previous="$(read_sha_file "$PREVIOUS_SHA_FILE" || true)"

  log_both "CURRENT_SHA=${current:-none}"
  log_both "PREVIOUS_SHA=${previous:-none}"

  confirm "Rollback Pérola demo only (stop current, restore previous SHA if any)?"

  local before="${LOG_DIR}/containers-before-rollback-${DEPLOY_TS}.txt"
  snapshot_containers "$before"
  collect_failure_diagnostics "${LOG_DIR}/failure-pre-rollback-${DEPLOY_TS}.log"

  if [[ -z "$previous" ]]; then
    warn "No PREVIOUS_SHA — stopping demo container only; demo will be unavailable."
    stop_demo_only
    write_deploy_report "DEPLOY_FAILED_NO_PREVIOUS_RELEASE" "$(cat <<EOF
sha=${current:-none}
action=stop_only
note=No previous release to restore. Repository and logs preserved.
container=${CONTAINER_NAME}
EOF
)"
    die "Rollback incomplete: no previous release (demo stopped)."
  fi

  ensure_repo
  local full
  full="$(verify_remote_sha "$previous")"
  checkout_sha "$full"

  local compose
  compose="$(compose_file_path)"
  validate_compose_file "$compose"

  local build_start=$SECONDS
  build_demo
  local build_secs=$((SECONDS - build_start))
  up_demo

  if ! wait_healthy; then
    collect_failure_diagnostics
    write_deploy_report "DEPLOY_FAILED_NO_PREVIOUS_RELEASE" "$(cat <<EOF
sha=${full}
action=rollback_failed_health
build_seconds=${build_secs}
note=Previous SHA failed health after rollback attempt. Demo may be down.
EOF
)"
    die "Rollback healthcheck failed"
  fi

  if ! "${SCRIPT_DIR}/smoke-vps.sh"; then
    collect_failure_diagnostics
    die "Rollback smokes failed"
  fi

  # Swap SHA pointers: rolled-back becomes current; old current becomes previous
  if [[ "$DRY_RUN" -eq 0 ]]; then
    if [[ -n "$current" ]]; then
      printf '%s\n' "$current" >"$PREVIOUS_SHA_FILE"
    fi
    printf '%s\n' "$full" >"$CURRENT_SHA_FILE"
  fi

  local after="${LOG_DIR}/containers-after-rollback-${DEPLOY_TS}.txt"
  snapshot_containers "$after"
  assert_protected_not_restarted "$before" "$after"

  write_deploy_report "DEPLOY_SUCCESS" "$(cat <<EOF
action=rollback
sha=${full}
previous_was=${current:-none}
build_seconds=${build_secs}
health=healthy
smokes=passed
container=${CONTAINER_NAME}
port=${BIND_HOST}:${BIND_PORT}
note=Rollback restored previous release. Other stacks untouched.
EOF
)"
  log_both "ROLLBACK_OK → ${full}"
  exit 0
}

main "$@"
