#!/usr/bin/env bash
# Injected-failure tests for transactional deploy error handling.
# Run: bash deploy/demo/tests/run-transactional-tests.sh
# shellcheck disable=SC2034,SC2317
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEMO_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
TMPROOT="$(mktemp -d)"
trap 'rm -rf "$TMPROOT"' EXIT

export PEROLA_DEMO_ROOT="$TMPROOT/demo"
mkdir -p "${PEROLA_DEMO_ROOT}/logs" "${PEROLA_DEMO_ROOT}/releases" "${PEROLA_DEMO_ROOT}/backups"

# shellcheck source=../lib/common.sh disable=SC1091
source "${DEMO_DIR}/lib/common.sh"

PASS=0
FAIL=0
TRANSACTIONAL_TEST_MODE=1

ACTIVE_LOG="/dev/null"
DRY_RUN=0
DOCKER_OK=0

STOP_CALLS=0
ROLLBACK_HOOK_CALLS=0
OTHER_TOUCHED=0

pass() { PASS=$((PASS + 1)); printf 'PASS  %s\n' "$*"; }
fail() { FAIL=$((FAIL + 1)); printf 'FAIL  %s\n' "$*" >&2; }

reset_state() {
  DEPLOY_MUTATION_STARTED=0
  ROLLBACK_IN_PROGRESS=0
  DEPLOY_COMMITTED=0
  ROLLBACK_CALL_COUNT=0
  IN_ERROR_HANDLER=0
  LAST_TRANSACTION_VERDICT=""
  ROLLBACK_TARGET_SHA="known-good-sha"
  STOP_CALLS=0
  ROLLBACK_HOOK_CALLS=0
  OTHER_TOUCHED=0
  TRANSACTIONAL_ROLLBACK_HOOK=""
  TRANSACTIONAL_TEST_MODE=1
  printf '%s\n' "known-good-sha" >"$CURRENT_SHA_FILE"
  : >"$LAST_DEPLOY_REPORT"
  trap - ERR
  set +e
  set -e
}

stop_demo_only() {
  STOP_CALLS=$((STOP_CALLS + 1))
  log "stub stop_demo_only"
  return 0
}

collect_failure_diagnostics() {
  log "stub collect_failure_diagnostics"
  return 0
}

test_rollback_hook() {
  ROLLBACK_HOOK_CALLS=$((ROLLBACK_HOOK_CALLS + 1))
  if [[ "$ROLLBACK_IN_PROGRESS" -eq 0 ]]; then
    ROLLBACK_IN_PROGRESS=1
    ROLLBACK_CALL_COUNT=$((ROLLBACK_CALL_COUNT + 1))
  fi
  LAST_TRANSACTION_VERDICT="DEPLOY_FAILED_ROLLED_BACK"
  return 1
}

assert_eq() {
  local label="$1" got="$2" want="$3"
  if [[ "$got" == "$want" ]]; then
    pass "$label ($got)"
  else
    fail "$label (got=$got want=$want)"
  fi
}

assert_current_sha() {
  local want="$1"
  local got
  got="$(tr -d '[:space:]' <"$CURRENT_SHA_FILE")"
  assert_eq "CURRENT_SHA" "$got" "$want"
}

assert_other_untouched() {
  assert_eq "other containers untouched" "$OTHER_TOUCHED" "0"
}

# Invoke handler as a function (ERR trap uses the same body).
trigger_handler() {
  local line="${1:-99}"
  set +e
  (exit 1)
  handle_transactional_error "$line"
}

# 1) Failure after mutation (e.g. snapshot) → one rollback
reset_state
DEPLOY_MUTATION_STARTED=1
TRANSACTIONAL_ROLLBACK_HOOK=test_rollback_hook
set +e
trigger_handler 101
ec=$?
set -e
assert_eq "1 snapshot-after-up style: exit nonzero" "$ec" "1"
assert_eq "1 rollback attempts" "$ROLLBACK_CALL_COUNT" "1"
assert_eq "1 hook calls" "$ROLLBACK_HOOK_CALLS" "1"
assert_current_sha "known-good-sha"
assert_other_untouched

ensure_repo() { return 0; }
verify_remote_sha() { printf '%s' "known-good-sha"; }
checkout_sha() { return 0; }
compose_file_path() { printf '%s' "${DEMO_DIR}/compose.demo.yaml"; }
validate_compose_file() { return 0; }
build_demo() { return 0; }
up_demo() { return 0; }
wait_healthy() { return 0; }

# 2) Build failure during auto-rollback
reset_state
DEPLOY_MUTATION_STARTED=1
build_demo() { err "injected build failure"; return 1; }
up_demo() { OTHER_TOUCHED=1; return 0; }
set +e
run_auto_rollback "injected_build"
ec=$?
set -e
assert_eq "2 rollback build fail exit" "$ec" "1"
assert_eq "2 verdict" "$LAST_TRANSACTION_VERDICT" "DEPLOY_FAILED_ROLLBACK_FAILED"
assert_eq "2 demo stopped" "$STOP_CALLS" "1"
assert_eq "2 single rollback call" "$ROLLBACK_CALL_COUNT" "1"
assert_eq "2 up not reached (other untouched)" "$OTHER_TOUCHED" "0"
assert_current_sha "known-good-sha"

# 3) up failure during auto-rollback
reset_state
DEPLOY_MUTATION_STARTED=1
build_demo() { return 0; }
up_demo() { err "injected up failure"; return 1; }
set +e
run_auto_rollback "injected_up"
ec=$?
set -e
assert_eq "3 rollback up fail exit" "$ec" "1"
assert_eq "3 verdict" "$LAST_TRANSACTION_VERDICT" "DEPLOY_FAILED_ROLLBACK_FAILED"
assert_eq "3 demo stopped" "$STOP_CALLS" "1"
assert_eq "3 single rollback" "$ROLLBACK_CALL_COUNT" "1"
assert_current_sha "known-good-sha"
assert_other_untouched

# 4) checkout failure during auto-rollback
reset_state
DEPLOY_MUTATION_STARTED=1
checkout_sha() { err "injected checkout failure"; return 1; }
build_demo() { OTHER_TOUCHED=1; return 0; }
set +e
run_auto_rollback "injected_checkout"
ec=$?
set -e
assert_eq "4 checkout fail exit" "$ec" "1"
assert_eq "4 verdict" "$LAST_TRANSACTION_VERDICT" "DEPLOY_FAILED_ROLLBACK_FAILED"
assert_eq "4 stopped" "$STOP_CALLS" "1"
assert_eq "4 build not reached" "$OTHER_TOUCHED" "0"
assert_current_sha "known-good-sha"

# 5) Generic failure after DEPLOY_MUTATION_STARTED=1
reset_state
DEPLOY_MUTATION_STARTED=1
TRANSACTIONAL_ROLLBACK_HOOK=test_rollback_hook
set +e
trigger_handler 205
ec=$?
set -e
assert_eq "5 generic mutation error exit" "$ec" "1"
assert_eq "5 one rollback" "$ROLLBACK_CALL_COUNT" "1"
assert_current_sha "known-good-sha"

# 6) Error during ROLLBACK_IN_PROGRESS — no recursion
reset_state
DEPLOY_MUTATION_STARTED=1
ROLLBACK_IN_PROGRESS=1
ROLLBACK_CALL_COUNT=1
TRANSACTIONAL_ROLLBACK_HOOK=test_rollback_hook
set +e
trigger_handler 306
ec=$?
set -e
assert_eq "6 nested rollback exit" "$ec" "1"
assert_eq "6 no extra rollback hook" "$ROLLBACK_HOOK_CALLS" "0"
assert_eq "6 rollback count unchanged" "$ROLLBACK_CALL_COUNT" "1"
assert_eq "6 demo stopped" "$STOP_CALLS" "1"
assert_eq "6 verdict" "$LAST_TRANSACTION_VERDICT" "DEPLOY_FAILED_ROLLBACK_FAILED"
assert_current_sha "known-good-sha"

# 7) Failure before mutation preserves version
reset_state
DEPLOY_MUTATION_STARTED=0
TRANSACTIONAL_ROLLBACK_HOOK=test_rollback_hook
set +e
trigger_handler 407
ec=$?
set -e
assert_eq "7 pre-mutation exit" "$ec" "1"
assert_eq "7 no rollback hook" "$ROLLBACK_HOOK_CALLS" "0"
assert_eq "7 not stopped" "$STOP_CALLS" "0"
assert_eq "7 verdict" "$LAST_TRANSACTION_VERDICT" "DEPLOY_FAILED_BEFORE_MUTATION"
assert_current_sha "known-good-sha"
assert_other_untouched

# 8) Failure after DEPLOY_COMMITTED — no rollback
reset_state
DEPLOY_MUTATION_STARTED=1
DEPLOY_COMMITTED=1
printf '%s\n' "new-committed-sha" >"$CURRENT_SHA_FILE"
TRANSACTIONAL_ROLLBACK_HOOK=test_rollback_hook
set +e
trigger_handler 508
ec=$?
set -e
assert_eq "8 post-commit exit" "$ec" "1"
assert_eq "8 no rollback hook" "$ROLLBACK_HOOK_CALLS" "0"
assert_eq "8 not stopped" "$STOP_CALLS" "0"
assert_eq "8 verdict" "$LAST_TRANSACTION_VERDICT" "DEPLOY_FAILED_POST_COMMIT"
assert_current_sha "new-committed-sha"
assert_other_untouched

# 9) recursive run_auto_rollback while already in progress
reset_state
DEPLOY_MUTATION_STARTED=1
ROLLBACK_IN_PROGRESS=1
ROLLBACK_CALL_COUNT=1
set +e
run_auto_rollback "nested_call"
ec=$?
set -e
assert_eq "9 recursive API exit" "$ec" "1"
assert_eq "9 call count not incremented" "$ROLLBACK_CALL_COUNT" "1"
assert_eq "9 stopped" "$STOP_CALLS" "1"
assert_eq "9 verdict" "$LAST_TRANSACTION_VERDICT" "DEPLOY_FAILED_ROLLBACK_FAILED"
assert_current_sha "known-good-sha"

printf '\nTransactional results: %s passed, %s failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
