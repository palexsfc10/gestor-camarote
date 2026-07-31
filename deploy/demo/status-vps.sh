#!/usr/bin/env bash
# Status for Pérola demo on the VPS.
# Usage: sudo ./deploy/demo/status-vps.sh [--external https://perola-demo.ntws.cloud]
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh
source "${SCRIPT_DIR}/lib/common.sh"

usage() {
  cat <<'EOF'
Usage: sudo ./deploy/demo/status-vps.sh [--external https://perola-demo.ntws.cloud] [--dry-run]
EOF
}

main() {
  if ! parse_common_flags "$@"; then
    usage
    exit 0
  fi

  install_error_trap

  local current previous
  current="$(read_sha_file "$CURRENT_SHA_FILE" || true)"
  previous="$(read_sha_file "$PREVIOUS_SHA_FILE" || true)"

  echo "=== Pérola demo status ==="
  echo "hostname:     $(hostname 2>/dev/null || echo unknown)"
  echo "demo_root:    ${DEMO_ROOT}"
  echo "current_sha:  ${current:-"(none)"}"
  echo "previous_sha: ${previous:-"(none)"}"
  if [[ -f "$LAST_DEPLOY_REPORT" ]]; then
    echo "last_report:  ${LAST_DEPLOY_REPORT}"
    grep -E '^(verdict|date_utc|sha=)' "$LAST_DEPLOY_REPORT" 2>/dev/null || true
  else
    echo "last_report:  (none)"
  fi

  if docker ps -a --format '{{.Names}}' 2>/dev/null | grep -qx "$CONTAINER_NAME"; then
    echo "container:    present"
    docker ps -a --filter "name=^${CONTAINER_NAME}$" --format 'status:      {{.Status}}'
    docker inspect -f 'health:      {{if .State.Health}}{{.State.Health.Status}}{{else}}n/a{{end}}
started:     {{.State.StartedAt}}
image:       {{.Config.Image}}' "$CONTAINER_NAME" 2>/dev/null || true
    docker stats --no-stream --format 'memory:      {{.MemUsage}} ({{.MemPerc}})' "$CONTAINER_NAME" 2>/dev/null || true
  else
    echo "container:    absent"
  fi

  echo "port_bind:    ${BIND_HOST}:${BIND_PORT}"
  if command -v ss >/dev/null 2>&1; then
    ss -ltnp 2>/dev/null | grep -E ':3107\b' || echo "port_listen:  (none)"
  fi

  if command -v curl >/dev/null 2>&1; then
    local code
    code="$(curl -sI --max-time 5 -o /dev/null -w '%{http_code}' "${INTERNAL_BASE}/demo" 2>/dev/null || echo "000")"
    echo "internal_/demo: HTTP ${code}"
    if [[ -n "$EXTERNAL_URL" ]]; then
      code="$(curl -sI --max-time 15 -o /dev/null -w '%{http_code}' "${EXTERNAL_URL}/demo" 2>/dev/null || echo "000")"
      echo "external_/demo: HTTP ${code} (${EXTERNAL_URL})"
    fi
  fi

  echo "--- last logs (40) ---"
  docker logs --tail 40 "$CONTAINER_NAME" 2>&1 || echo "(no logs)"
  exit 0
}

main "$@"
