#!/usr/bin/env bash
# Security unit tests for Pérola demo deploy helpers.
# Run: bash deploy/demo/tests/run-security-tests.sh
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
# shellcheck source=../lib/common.sh disable=SC1091
source "${DEMO_DIR}/lib/common.sh"

PASS=0
FAIL=0
TMPROOT="$(mktemp -d)"
trap 'rm -rf "$TMPROOT"' EXIT

pass() { PASS=$((PASS + 1)); printf 'PASS  %s\n' "$*"; }
fail() { FAIL=$((FAIL + 1)); printf 'FAIL  %s\n' "$*" >&2; }

# Run command in subshell; expect non-zero exit
expect_fail() {
  local name="$1"
  shift
  if (
    set +e
    "$@"
    exit $?
  ) >/dev/null 2>&1; then
    fail "$name (expected failure, got success)"
  else
    pass "$name"
  fi
}

expect_ok() {
  local name="$1"
  shift
  if (
    set -e
    "$@"
  ) >/dev/null 2>&1; then
    pass "$name"
  else
    fail "$name (expected success)"
  fi
}

# ---------------------------------------------------------------------------
# Compose forbidden checks
# ---------------------------------------------------------------------------
GOOD_COMPOSE="${DEMO_DIR}/compose.demo.yaml"

expect_ok "real compose.demo.yaml passes static forbidden checks" \
  validate_compose_forbidden "$GOOD_COMPOSE"

if compose_file_has_external_network "$GOOD_COMPOSE"; then
  fail "real compose must not declare external network"
else
  pass "real compose has no external network"
fi

EXT_NET="${TMPROOT}/external-net.yaml"
cat >"$EXT_NET" <<'EOF'
services:
  perola-demo-web:
    image: test
networks:
  perola-demo-net:
    external: true
EOF
expect_ok "external: true is detected" \
  compose_file_has_external_network "$EXT_NET"
expect_fail "external: true is blocked by validate_compose_forbidden" \
  validate_compose_forbidden "$EXT_NET"

HOST_NET="${TMPROOT}/host-net.yaml"
cat >"$HOST_NET" <<'EOF'
services:
  perola-demo-web:
    network_mode: host
EOF
expect_fail "network_mode host is blocked" \
  validate_compose_forbidden "$HOST_NET"

PRIV="${TMPROOT}/privileged.yaml"
cat >"$PRIV" <<'EOF'
services:
  perola-demo-web:
    privileged: true
EOF
expect_fail "privileged is blocked" \
  validate_compose_forbidden "$PRIV"

SOCK="${TMPROOT}/sock.yaml"
cat >"$SOCK" <<'EOF'
services:
  perola-demo-web:
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
EOF
expect_fail "docker.sock is blocked" \
  validate_compose_forbidden "$SOCK"

DBIMG="${TMPROOT}/db.yaml"
cat >"$DBIMG" <<'EOF'
services:
  perola-demo-web:
    image: postgres:16
EOF
expect_fail "database image is blocked" \
  validate_compose_forbidden "$DBIMG"

# False positive guard: external: true outside networks block should not match
# (compose_file_has_external_network only scans networks: section)
FALSE_EXT="${TMPROOT}/false-ext.yaml"
cat >"$FALSE_EXT" <<'EOF'
services:
  perola-demo-web:
    environment:
      FLAG: "external: true"
networks:
  perola-demo-net:
    driver: bridge
EOF
if compose_file_has_external_network "$FALSE_EXT"; then
  fail "external:true string outside networks section must be ignored"
else
  pass "external:true string outside networks section is ignored"
fi

# ---------------------------------------------------------------------------
# Container inventory comparison
# ---------------------------------------------------------------------------
BEFORE="${TMPROOT}/before.txt"
AFTER_OK="${TMPROOT}/after-ok.txt"
AFTER_RESTART="${TMPROOT}/after-restart.txt"
AFTER_MISSING="${TMPROOT}/after-missing.txt"
AFTER_ID="${TMPROOT}/after-id.txt"
AFTER_DEMO_ONLY="${TMPROOT}/after-demo.txt"

cat >"$BEFORE" <<'EOF'
# containers snapshot
# started_at
kyvora-api abc111 2026-01-01T00:00:00Z
arena-web def222 2026-01-01T00:00:01Z
postgres-main ghi333 2026-01-01T00:00:02Z
perola-demo-web old999 2026-01-01T00:00:03Z
EOF

cat >"$AFTER_OK" <<'EOF'
# containers snapshot
# started_at
kyvora-api abc111 2026-01-01T00:00:00Z
arena-web def222 2026-01-01T00:00:01Z
postgres-main ghi333 2026-01-01T00:00:02Z
perola-demo-web new888 2026-07-31T12:00:00Z
EOF

expect_ok "preserved containers pass; perola-demo-web may change" \
  assert_preexisting_containers_unchanged "$BEFORE" "$AFTER_OK"

cat >"$AFTER_RESTART" <<'EOF'
# started_at
kyvora-api abc111 2026-07-31T99:00:00Z
arena-web def222 2026-01-01T00:00:01Z
postgres-main ghi333 2026-01-01T00:00:02Z
perola-demo-web new888 2026-07-31T12:00:00Z
EOF
expect_fail "restarted pre-existing container fails" \
  assert_preexisting_containers_unchanged "$BEFORE" "$AFTER_RESTART"

cat >"$AFTER_MISSING" <<'EOF'
# started_at
kyvora-api abc111 2026-01-01T00:00:00Z
postgres-main ghi333 2026-01-01T00:00:02Z
perola-demo-web new888 2026-07-31T12:00:00Z
EOF
expect_fail "removed pre-existing container fails" \
  assert_preexisting_containers_unchanged "$BEFORE" "$AFTER_MISSING"

cat >"$AFTER_ID" <<'EOF'
# started_at
kyvora-api ZZZ999 2026-01-01T00:00:00Z
arena-web def222 2026-01-01T00:00:01Z
postgres-main ghi333 2026-01-01T00:00:02Z
perola-demo-web new888 2026-07-31T12:00:00Z
EOF
expect_fail "changed container ID fails" \
  assert_preexisting_containers_unchanged "$BEFORE" "$AFTER_ID"

cat >"$AFTER_DEMO_ONLY" <<'EOF'
# started_at
kyvora-api abc111 2026-01-01T00:00:00Z
arena-web def222 2026-01-01T00:00:01Z
postgres-main ghi333 2026-01-01T00:00:02Z
perola-demo-web brandnew 2026-07-31T15:00:00Z
EOF
expect_ok "only perola-demo-web changed is allowed" \
  assert_preexisting_containers_unchanged "$BEFORE" "$AFTER_DEMO_ONLY"

# ---------------------------------------------------------------------------
# Static validation of good compose
# ---------------------------------------------------------------------------
expect_ok "validate_compose_static on real compose" \
  validate_compose_static "$GOOD_COMPOSE"

printf '\nResults: %s passed, %s failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
