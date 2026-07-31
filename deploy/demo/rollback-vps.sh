#!/usr/bin/env bash
# Rollback restricted to Pérola demo only.
# Usage: sudo ./deploy/demo/rollback-vps.sh [--yes] [--dry-run]
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh disable=SC1091
source "${SCRIPT_DIR}/lib/common.sh"

usage() {
  cat <<'EOF'
Usage: sudo ./deploy/demo/rollback-vps.sh [--yes] [--dry-run]

Restores PREVIOUS_SHA for perola-demo-web only.
Never touches Kyvora, Arena, Croniu, PostgreSQL, Cloudflared, or other stacks.

If the restored release is healthy but smoke fails: diagnostics are collected,
perola-demo-web is stopped, CURRENT_SHA is NOT updated, and the script exits
with DEPLOY_FAILED_ROLLBACK_SMOKE.
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

  ROLLBACK_IN_PROGRESS=1

  run_pre_write_validations
  acquire_lock
  trap 'release_lock' EXIT

  begin_mutable_phase
  start_log "rollback"

  check_docker

  local current previous
  current="$(read_sha_file "$CURRENT_SHA_FILE" || true)"
  previous="$(read_sha_file "$PREVIOUS_SHA_FILE" || true)"

  log_both "CURRENT_SHA=${current:-none}"
  log_both "PREVIOUS_SHA=${previous:-none}"
  log_both "rollback_in_progress=${ROLLBACK_IN_PROGRESS} mutation=${DEPLOY_MUTATION_STARTED:-0}"

  confirm "Rollback Pérola demo only (stop current, restore previous SHA if any)?"

  local before="${LOG_DIR}/containers-before-rollback-${DEPLOY_TS}.txt"
  if [[ "$DRY_RUN" -eq 0 && "$DOCKER_OK" -eq 1 ]]; then
    snapshot_containers "$before"
  fi
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

  DEPLOY_MUTATION_STARTED=1
  up_demo

  if ! wait_healthy; then
    collect_failure_diagnostics
    stop_demo_only
    write_deploy_report "DEPLOY_FAILED_ROLLBACK_FAILED" "$(cat <<EOF
sha=${full}
action=rollback_failed_health
build_seconds=${build_secs}
mutation_started=${DEPLOY_MUTATION_STARTED}
note=Previous SHA failed health; demo stopped. CURRENT_SHA unchanged.
EOF
)"
    die "Rollback healthcheck failed"
  fi

  if [[ "$DRY_RUN" -eq 1 ]]; then
    "${SCRIPT_DIR}/smoke-vps.sh" --dry-run
  elif ! "${SCRIPT_DIR}/smoke-vps.sh"; then
    collect_failure_diagnostics
    stop_demo_only
    write_deploy_report "DEPLOY_FAILED_ROLLBACK_SMOKE" "$(cat <<EOF
sha=${full}
action=rollback_failed_smoke
build_seconds=${build_secs}
mutation_started=${DEPLOY_MUTATION_STARTED}
note=Restored release healthy but smoke failed; container stopped. CURRENT_SHA not updated.
EOF
)"
    die "Rollback smokes failed — restored version not kept active"
  fi

  local after="${LOG_DIR}/containers-after-rollback-${DEPLOY_TS}.txt"
  if [[ "$DRY_RUN" -eq 0 && "$DOCKER_OK" -eq 1 ]]; then
    snapshot_containers "$after"
    assert_preexisting_containers_unchanged "$before" "$after"
  fi

  # Commit SHA pointers only after all gates (including smoke + inventory)
  if [[ "$DRY_RUN" -eq 0 ]]; then
    if [[ -n "$current" && "$current" != "$full" ]]; then
      atomic_write_file "$PREVIOUS_SHA_FILE" "$current"
    fi
    atomic_write_file "$CURRENT_SHA_FILE" "$full"
  else
    log "DRY-RUN: would commit CURRENT_SHA=${full}"
  fi
  DEPLOY_COMMITTED=1
  log_both "rollback_committed=${DEPLOY_COMMITTED}"

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
