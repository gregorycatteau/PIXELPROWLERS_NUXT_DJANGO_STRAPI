# PixelProwlers — Makefile
# Commandes locales pour SSOT, CI, et développement

.PHONY: help ssot-check ssot-lint ssot-openapi ssot-index-check ssot-index-apply ssot-linkcheck ssot-all agent-start agent-prompt agent-scope-check agent-close agent-list

# Default target
help:
	@echo "╔══════════════════════════════════════════════════════════════╗"
	@echo "║             🦊 PixelProwlers — Makefile                      ║"
	@echo "╠══════════════════════════════════════════════════════════════╣"
	@echo "║  SSOT DOCUMENTATION                                          ║"
	@echo "║    make ssot-check        Exécute tous les checks SSOT       ║"
	@echo "║    make ssot-lint         Lint frontmatter + IDs             ║"
	@echo "║    make ssot-openapi      Valide OpenAPI spec                ║"
	@echo "║    make ssot-index-check  Vérifie index drift (CI mode)      ║"
	@echo "║    make ssot-index-apply  Applique les index générés         ║"
	@echo "║    make ssot-linkcheck    Vérifie liens + détecte orphelins  ║"
	@echo "║    make ssot-all          Full SSOT check + apply            ║"
	@echo "║                                                              ║"
	@echo "║  DEVELOPMENT                                                 ║"
	@echo "║    make frontend-dev      Lance le frontend Nuxt             ║"
	@echo "║    make backend-dev       Lance le backend Django            ║"
	@echo "║                                                              ║"
	@echo "║  CI / GUARDS                                                 ║"
	@echo "║    make ci-ssot           Simule CI SSOT localement          ║"
	@echo "║    make ci-frontend       Simule CI frontend localement      ║"
	@echo "╚══════════════════════════════════════════════════════════════╝"

# ============================================================
# SSOT DOCUMENTATION CHECKS
# ============================================================

ssot-lint:
	@echo "🔍 Running SSOT Lint (--strict)..."
	@python3 tools/ssot_lint.py --strict

ssot-openapi:
	@echo "📋 Validating OpenAPI Spec..."
	@python3 tools/openapi_validate.py

ssot-index-check:
	@echo "📚 Checking for Index Drift..."
	@python3 tools/ssot_generate_indexes.py --check

ssot-index-apply:
	@echo "📚 Applying Index Updates..."
	@python3 tools/ssot_generate_indexes.py --apply

ssot-linkcheck:
	@echo "🔗 Checking internal links + orphans..."
	@python3 tools/ssot_linkcheck.py

ssot-linkcheck-strict:
	@echo "🔗 Checking internal links (strict mode)..."
	@python3 tools/ssot_linkcheck.py --strict

ssot-orphans:
	@echo "📦 Detecting orphan docs (warning mode)..."
	@python3 tools/ssot_linkcheck.py --orphans

ssot-orphans-strict:
	@echo "📦 Detecting orphan docs (strict mode)..."
	@python3 tools/ssot_linkcheck.py --orphans --orphans-strict

ssot-tasks:
	@echo "📋 Listing SSOT Tasks..."
	@python3 tools/ssot_tasks.py list

ssot-task:
	@if [ -z "$(TASK)" ]; then \
		echo "❌ Usage: make ssot-task TASK=<task_id>"; \
		echo "   Example: make ssot-task TASK=ssot_linkcheck_fix"; \
		echo ""; \
		python3 tools/ssot_tasks.py list; \
		exit 1; \
	fi
	@python3 tools/ssot_tasks.py render $(TASK) --format cline

ssot-backlog:
	@echo "📋 Building SSOT Backlog..."
	@python3 tools/ssot_backlog.py build

ssot-backlog-list:
	@echo "📋 Listing eligible docs for backlog..."
	@python3 tools/ssot_backlog.py list

ssot-ticket:
	@if [ -z "$(TICKET)" ]; then \
		echo "❌ Usage: make ssot-ticket TICKET=<ticket_id>"; \
		echo "   Example: make ssot-ticket TICKET=TKT_px_v1_3_xxx"; \
		echo ""; \
		python3 tools/ssot_backlog.py list; \
		exit 1; \
	fi
	@python3 tools/ssot_backlog.py render $(TICKET) --format cline

ssot-sprints:
	@echo "🗓️ Building SSOT Sprints..."
	@python3 tools/ssot_sprint_planner.py build --mode $(or $(MODE),delivery)

ssot-next-sprint:
	@echo "🚀 Getting next sprint..."
	@python3 tools/ssot_sprint_planner.py next --mode $(or $(MODE),delivery) --wip $(or $(WIP),7)

ssot-render-sprint:
	@if [ -z "$(SPRINT)" ]; then \
		echo "❌ Usage: make ssot-render-sprint SPRINT=<sprint_id>"; \
		echo "   Example: make ssot-render-sprint SPRINT=SPRINT_DELIVERY_20241224_01"; \
		exit 1; \
	fi
	@python3 tools/ssot_sprint_planner.py render-sprint SPRINT=$(SPRINT) --format cline

ssot-check: ssot-lint ssot-openapi ssot-index-check ssot-linkcheck
	@echo ""
	@echo "✅ All SSOT checks passed!"

ssot-all: ssot-lint ssot-openapi ssot-index-apply
	@echo ""
	@echo "✅ SSOT check + apply completed!"

# ============================================================
# CI SIMULATION
# ============================================================

ci-ssot: ssot-check
	@echo ""
	@echo "🎯 CI SSOT gates would PASS"

ci-frontend:
	@echo "🧪 Running frontend CI locally..."
	@cd frontend_nuxt && npm run typecheck && npm run guards:ci

# ============================================================
# DEVELOPMENT
# ============================================================

frontend-dev:
	@echo "🚀 Starting Nuxt dev server..."
	@cd frontend_nuxt && npm run dev

backend-dev:
	@echo "🚀 Starting Django dev server..."
	@cd backend_django && python manage.py runserver

# ============================================================
# DOC SCAFFOLDING
# ============================================================

doc-new:
	@echo "📄 Usage: make doc-new TYPE=product_spec PATH=docs/20-product_specs/functional/NEW.md TITLE='My Doc'"
	@echo ""
	@if [ -z "$(TYPE)" ] || [ -z "$(PATH)" ]; then \
		echo "❌ Missing TYPE or PATH"; \
		echo "   Example: make doc-new TYPE=product_spec PATH=docs/20-product_specs/functional/NEW.md TITLE='My Doc'"; \
		exit 1; \
	fi
	@python3 tools/ssot_create_doc.py $(TYPE) $(PATH) --title "$(TITLE)" --register

doc-preview:
	@echo "📄 Preview doc (dry-run)..."
	@if [ -z "$(TYPE)" ] || [ -z "$(PATH)" ]; then \
		echo "❌ Missing TYPE or PATH"; \
		exit 1; \
	fi
	@python3 tools/ssot_create_doc.py $(TYPE) $(PATH) --title "$(TITLE)" --dry-run

# ============================================================
# AGENT RUNTIME (Option B)
# ============================================================

agent-start:
	@if [ -z "$(AGENT)" ] || [ -z "$(TICKET)" ]; then \
		echo "❌ Usage: make agent-start AGENT=<agent> TICKET=<ticket>"; \
		echo "   Example: make agent-start AGENT=tom TICKET=TKT_backend_mvp"; \
		exit 1; \
	fi
	@python3 tools/agent_runtime.py start --agent $(AGENT) --ticket $(TICKET)

agent-prompt:
	@if [ -z "$(AGENT)" ] || [ -z "$(TICKET)" ]; then \
		echo "❌ Usage: make agent-prompt AGENT=<agent> TICKET=<ticket>"; \
		echo "   Example: make agent-prompt AGENT=tom TICKET=TKT_backend_mvp"; \
		exit 1; \
	fi
	@python3 tools/agent_runtime.py prompt --agent $(AGENT) --ticket $(TICKET)

agent-scope-check:
	@if [ -z "$(AGENT)" ] || [ -z "$(TICKET)" ]; then \
		echo "❌ Usage: make agent-scope-check AGENT=<agent> TICKET=<ticket>"; \
		echo "   Example: make agent-scope-check AGENT=tom TICKET=TKT_backend_mvp"; \
		exit 1; \
	fi
	@python3 tools/agent_runtime.py scope-check --agent $(AGENT) --ticket $(TICKET)

agent-close:
	@if [ -z "$(AGENT)" ] || [ -z "$(TICKET)" ]; then \
		echo "❌ Usage: make agent-close AGENT=<agent> TICKET=<ticket>"; \
		echo "   Example: make agent-close AGENT=tom TICKET=TKT_backend_mvp"; \
		exit 1; \
	fi
	@python3 tools/agent_runtime.py close --agent $(AGENT) --ticket $(TICKET) $(if $(SUMMARY),--summary "$(SUMMARY)",)

agent-list:
	@python3 tools/agent_runtime.py list
