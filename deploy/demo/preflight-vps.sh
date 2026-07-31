#!/usr/bin/env bash
# Preflight for Pérola demo on the NTWS VPS.
# Usage: sudo ./deploy/demo/preflight-vps.sh [--dry-run]
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh disable=SC1091
source "${SCRIPT_DIR}/lib/common.sh"

usage() {
  cat <<'EOF'
Usage: sudo ./deploy/demo/preflight-vps.sh [--dry-run] [--yes]

Validates hostname, privileges, Docker, disk, memory, port 3107,
demo directory ownership, GitHub reachability, and records inventory.
Does not build or start containers.

Writes under /srv/docker/perola-demo ONLY after privileges + hostname +
demo-root safety checks succeed. Lock uses /run/lock (not DEMO_ROOT).
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

  # --- No writes under DEMO_ROOT before these gates ---
  run_pre_write_validations
  acquire_lock
  trap 'release_lock' EXIT

  # --- Mutable phase (idempotent dirs + marker + log) ---
  begin_mutable_phase
  start_log "preflight"

  log_both "=== Pérola demo preflight ==="
  check_arch
  check_git
  check_docker
  check_disk
  check_memory
  check_github_access
  check_port_3107

  if [[ "$DOCKER_OK" -eq 1 ]]; then
    if docker network ls --format '{{.Name}}' | grep -qx "$NETWORK_NAME"; then
      log_both "Docker network exists: ${NETWORK_NAME}"
    else
      log_both "Docker network ${NETWORK_NAME} not created yet (will be created on first up)."
    fi

    if docker ps -a --format '{{.Names}}' | grep -qx "$CONTAINER_NAME"; then
      log_both "Existing container: $(docker ps -a --filter "name=^${CONTAINER_NAME}$" --format '{{.Names}} {{.Status}}')"
    else
      log_both "Container ${CONTAINER_NAME} not present yet."
    fi
    diagnose_cloudflared
  else
    log_both "Skipping live Docker inventory (DOCKER_OK=0)."
  fi

  local snap="${LOG_DIR}/containers-before-${DEPLOY_TS}.txt"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log_both "DRY-RUN: would write ${snap}"
  elif [[ "$DOCKER_OK" -eq 1 ]]; then
    snapshot_containers "$snap"
    log_both "Inventory saved: ${ACTIVE_LOG}"
    log_both "Containers before: ${snap}"
  fi

  # Compose validation — must fail the preflight on any error (no || true)
  if [[ -f "${SCRIPT_DIR}/compose.demo.yaml" ]]; then
    validate_compose_file "${SCRIPT_DIR}/compose.demo.yaml"
  else
    die "compose.demo.yaml not found next to scripts: ${SCRIPT_DIR}"
  fi

  log_both "PREFLIGHT_OK"
  exit 0
}

main "$@"
