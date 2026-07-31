# Pérola demo — VPS deploy automation (operator-facing)
#
# Makefile only wraps scripts under deploy/demo/. No duplicated logic.
# Scripts are self-contained and do not depend on the caller's cwd.
#
# Typical VPS usage (after clone or from /srv/docker/perola-demo/repo):
#   make demo-preflight
#   make demo-deploy SHA=0528b4a5fca641c15468a6c506f8f153f3466da8
#   make demo-smoke
#   make demo-status
#   make demo-rollback

SHELL := /bin/bash
.ONESHELL:
.PHONY: demo-preflight demo-deploy demo-smoke demo-status demo-rollback demo-dry-run demo-security-tests help

DEMO_DIR := deploy/demo
SCRIPTS := $(abspath $(dir $(lastword $(MAKEFILE_LIST)))/$(DEMO_DIR))

help:
	@echo "Pérola demo targets:"
	@echo "  make demo-preflight"
	@echo "  make demo-deploy SHA=<full-or-short-sha>"
	@echo "  make demo-dry-run SHA=<sha>"
	@echo "  make demo-smoke [EXTERNAL=https://perola-demo.ntws.cloud]"
	@echo "  make demo-status [EXTERNAL=https://perola-demo.ntws.cloud]"
	@echo "  make demo-rollback"
	@echo "Scripts live in $(SCRIPTS)"

demo-preflight:
	sudo "$(SCRIPTS)/preflight-vps.sh"

demo-deploy:
ifndef SHA
	$(error SHA is required. Example: make demo-deploy SHA=0528b4a5fca641c15468a6c506f8f153f3466da8)
endif
	sudo "$(SCRIPTS)/deploy-vps.sh" --yes "$(SHA)"

demo-dry-run:
ifndef SHA
	$(error SHA is required. Example: make demo-dry-run SHA=0528b4a5fca641c15468a6c506f8f153f3466da8)
endif
	sudo "$(SCRIPTS)/deploy-vps.sh" --dry-run "$(SHA)"

demo-smoke:
ifdef EXTERNAL
	sudo "$(SCRIPTS)/smoke-vps.sh" --external "$(EXTERNAL)"
else
	sudo "$(SCRIPTS)/smoke-vps.sh"
endif

demo-status:
ifdef EXTERNAL
	sudo "$(SCRIPTS)/status-vps.sh" --external "$(EXTERNAL)"
else
	sudo "$(SCRIPTS)/status-vps.sh"
endif

demo-rollback:
	sudo "$(SCRIPTS)/rollback-vps.sh"

demo-security-tests:
	bash "$(SCRIPTS)/tests/run-security-tests.sh"
	bash "$(SCRIPTS)/tests/run-transactional-tests.sh"
