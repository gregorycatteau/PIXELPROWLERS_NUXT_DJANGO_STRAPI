---
id: PX_V1_3_CONTACT_RETENTION_PURGE_REPORT
version: 1.3.0
status: active
date: 2025-12-27
owners: ["Tom", "Eva"]
scope: ["backend_django", "contact", "retention"]
tags: ["backend", "contact", "retention", "purge", "privacy", "security"]
---

# Contact Retention & Purge — Report V1.3

## Objectif
Implémenter la rétention 6 mois + purge automatique des données Contact, avec dry‑run par défaut.

## Scope
- Commande de purge `purge_contacts` (dry‑run, `--apply` pour exécuter).
- Suppression par batch, logs sans PII (counts uniquement).

## Implémentation
- Cutoff = maintenant – 6 mois (calcul mois civil).
- Purge `ContactMessage` puis `Prospect` sans messages.
- Index `created_at` pour requêtes de purge.

## Tests
- Dry‑run conserve les données.
- Purge `--apply` supprime anciens messages + prospects orphelins.

## Risques & mitigations
- PII dans logs → logs limités aux compteurs.
- Delete massif → suppression par batch.

## Commandes validation
```bash
cd backend_django && python -m pytest -q && cd ..
python3 tools/ssot_lint.py --strict
python3 tools/ssot_linkcheck.py --strict
python3 tools/openapi_validate.py
```

## Fichiers touchés
- `backend_django/apps/contact/models.py`
- `backend_django/apps/contact/migrations/0001_initial.py`
- `backend_django/apps/contact/management/commands/purge_contacts.py`
- `backend_django/tests/test_purge_contacts.py`
