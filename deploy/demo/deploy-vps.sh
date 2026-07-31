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

  # Transactional ERR trap (state-aware). Replaces generic on_error for deploy.
  install_transactional_error_trap
  init_deploy_timestamp

  DEPLOY_MUTATION_STARTED=0
  ROLLBACK_IN_PROGRESS=0
  DEPLOY_COMMITTED=0
  ROLLBACK_CALL_COUNT=0
  IN_ERROR_HANDLER=0
  LAST_TRANSACTION_VERDICT=""
  # State is read by ERR trap / run_auto_rollback in common.sh
  log_both "tx_state mutation=${DEPLOY_MUTATION_STARTED} rollback=${ROLLBACK_IN_PROGRESS} committed=${DEPLOY_COMMITTED} attempts=${ROLLBACK_CALL_COUNT} handler=${IN_ERROR_HANDLER}"

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
  log_both "mutation_window_open=1"
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
    # Protected by transactional ERR trap if unexpected failure; also explicit:
    if ! snapshot_containers "$after"; then
      collect_failure_diagnostics
      run_auto_rollback "snapshot_after_failed"
      exit 1
    fi
    if ! assert_preexisting_containers_unchanged "$before" "$after"; then
      collect_failure_diagnostics
      run_auto_rollback "container_impact_failed"
      exit 1
    fi
  fi

  # --- Persist SHA only after ALL gates; COMMITTED only after success ---
  if ! write_sha_files "$full_sha"; then
    collect_failure_diagnostics
    err "SHA persistence failed after healthy deploy — rolling back to known-good"
    run_auto_rollback "sha_persist_failed"
    exit 1
  fi
  DEPLOY_COMMITTED=1
  log_both "deploy_committed=1 sha=${full_sha}"

  local image_id=""
  local verdict="DEPLOY_SUCCESS"
  if [[ "$DRY_RUN" -eq 0 && "$DOCKER_OK" -eq 1 ]] && docker ps --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
    image_id="$(docker inspect -f '{{.Image}}' "$CONTAINER_NAME" 2>/dev/null || true)"
  fi

  local total=$((SECONDS - deploy_start))

  # Post-commit documentary step — failures must NOT auto-rollback
  if ! write_deploy_report "$verdict" "$(cat <<EOF
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
)"; then
    err "Deploy report write failed after commit — demo left running at committed SHA ${full_sha}"
    LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_POST_COMMIT"
    log_both "post_commit_failure verdict=${LAST_TRANSACTION_VERDICT}"
    exit 1
  fi

  log_both "DEPLOY_OK ${full_sha} (${total}s)"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log_both "DRY-RUN complete — no containers changed."
  fi
  exit 0
}

main "$@"
