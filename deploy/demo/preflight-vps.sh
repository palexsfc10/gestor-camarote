#!/usr/bin/env bash
# Preflight for Pérola demo on the NTWS VPS.
# Usage: sudo ./deploy/demo/preflight-vps.sh [--dry-run]
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

usage() {
  cat <<'EOF'
Usage: sudo ./deploy/demo/preflight-vps.sh [--dry-run] [--yes]

Validates hostname, privileges, Docker, disk, memory, port 3107,
demo directory ownership, GitHub reachability, and records inventory.
Does not build or start containers.
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
  start_log "preflight"
  acquire_lock
  trap 'release_lock' EXIT

  log_both "=== Pérola demo preflight ==="
  check_hostname
  check_arch
  check_git
  check_docker
  check_disk
  check_memory
  check_github_access
  assert_demo_root_safe
  check_port_3107

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

  local snap="${LOG_DIR}/containers-before-${DEPLOY_TS}.txt"
  if [[ "$DRY_RUN" -eq 1 ]]; then
    log_both "DRY-RUN: would write ${snap}"
  else
    snapshot_containers "$snap"
    log_both "Inventory saved: ${ACTIVE_LOG}"
    log_both "Containers before: ${snap}"
  fi

  # Validate local compose when available (repo or script sibling)
  if [[ -f "${SCRIPTS_DIR}/compose.demo.yaml" ]]; then
    if docker info >/dev/null 2>&1; then
      validate_compose_file "${SCRIPTS_DIR}/compose.demo.yaml" || true
    fi
  fi

  log_both "PREFLIGHT_OK"
  exit 0
}

main "$@"
