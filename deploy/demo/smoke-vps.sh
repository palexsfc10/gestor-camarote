#!/usr/bin/env bash
# Smoke tests for Pérola demo (internal localhost; optional external URL).
# Usage:
#   sudo ./deploy/demo/smoke-vps.sh
#   sudo ./deploy/demo/smoke-vps.sh --external https://perola-demo.ntws.cloud
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=lib/common.sh disable=SC1091
source "${SCRIPT_DIR}/lib/common.sh"

STATIC_ASSET="/perola/brand/perola-mark.png"
SMOKE_FAILS=0

usage() {
  cat <<'EOF'
Usage: sudo ./deploy/demo/smoke-vps.sh [--external https://perola-demo.ntws.cloud] [--dry-run]

Validates internal http://127.0.0.1:3107 routes and headers.
Optional --external also checks HTTPS/certificate for the public hostname.
Does not depend on Cloudflare for the internal checks.
EOF
}

http_headers() {
  local url="$1"
  curl -sI --max-time 15 --max-redirs 5 "$url" 2>/dev/null || true
}

assert_http_ok() {
  local label="$1"
  local url="$2"
  local elapsed code
  # curl time_total is portable; avoid date+%s%3N
  code="$(curl -sI --max-time 15 --max-redirs 5 -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo "000")"
  elapsed="$(curl -sI --max-time 15 --max-redirs 5 -o /dev/null -w '%{time_total}' "$url" 2>/dev/null || echo "0")"

  if [[ "$code" != "200" ]]; then
    err "SMOKE FAIL [${label}] ${url} → HTTP ${code}"
    SMOKE_FAILS=$((SMOKE_FAILS + 1))
    return 1
  fi

  if awk -v e="$elapsed" -v m="$SMOKE_MAX_SECONDS" 'BEGIN{exit !(e+0>m+0)}'; then
    warn "SMOKE SLOW [${label}] ${url} took ${elapsed}s (limit ${SMOKE_MAX_SECONDS}s)"
  fi
  log "SMOKE OK  [${label}] ${url} HTTP ${code} (${elapsed}s)"
}

assert_robots_header() {
  local base="$1"
  local headers
  headers="$(http_headers "${base}/demo")"
  if echo "$headers" | grep -qi 'X-Robots-Tag:.*noindex'; then
    log "SMOKE OK  [x-robots] X-Robots-Tag present on /demo"
  else
    err "SMOKE FAIL [x-robots] missing X-Robots-Tag: noindex on ${base}/demo"
    SMOKE_FAILS=$((SMOKE_FAILS + 1))
  fi
}

assert_no_redirect_loop() {
  local url="$1"
  local code
  code="$(curl -sI --max-time 15 --max-redirs 5 -o /dev/null -w '%{http_code}' "$url" 2>/dev/null || echo "000")"
  if [[ "$code" == "000" ]]; then
    err "SMOKE FAIL [redirects] could not fetch ${url}"
    SMOKE_FAILS=$((SMOKE_FAILS + 1))
    return 1
  fi
  log "SMOKE OK  [redirects] ${url} resolved without loop (HTTP ${code})"
}

run_base_smokes() {
  local base="$1"
  local label="$2"
  log "=== Smokes (${label}): ${base} ==="
  assert_http_ok "${label}/demo" "${base}/demo"
  assert_http_ok "${label}/eventos" "${base}/demo/eventos"
  assert_http_ok "${label}/admin" "${base}/demo/admin"
  assert_http_ok "${label}/robots" "${base}/robots.txt"
  assert_http_ok "${label}/asset" "${base}${STATIC_ASSET}"
  assert_robots_header "$base"
  assert_no_redirect_loop "${base}/demo"
}

run_external_smokes() {
  local base="$1"
  require_cmd curl
  log "=== External HTTPS smokes: ${base} ==="
  # Certificate / TLS handshake
  if curl -fsSIL --max-time 20 "$base" >/dev/null 2>&1; then
    log "SMOKE OK  [tls] HTTPS handshake succeeded"
  else
    err "SMOKE FAIL [tls] HTTPS handshake failed for ${base}"
    SMOKE_FAILS=$((SMOKE_FAILS + 1))
  fi
  run_base_smokes "$base" "external"
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
  require_cmd curl

  if [[ "$DRY_RUN" -eq 1 ]]; then
    log "DRY-RUN: would smoke ${INTERNAL_BASE}/demo /eventos /admin /robots.txt ${STATIC_ASSET}"
    if [[ -n "$EXTERNAL_URL" ]]; then
      log "DRY-RUN: would also smoke ${EXTERNAL_URL}"
    fi
    exit 0
  fi

  run_base_smokes "$INTERNAL_BASE" "internal"

  if [[ -n "$EXTERNAL_URL" ]]; then
    case "$EXTERNAL_URL" in
      https://*) ;;
      *) die "--external URL must start with https://" ;;
    esac
    run_external_smokes "$EXTERNAL_URL"
  fi

  if [[ "$SMOKE_FAILS" -gt 0 ]]; then
    die "Smoke tests failed: ${SMOKE_FAILS} check(s)"
  fi
  log "SMOKE_OK"
  exit 0
}

main "$@"
