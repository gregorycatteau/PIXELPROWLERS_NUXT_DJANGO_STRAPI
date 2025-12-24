---
id: INCIDENT_RESPONSE_V1
version: "1.3"
status: active
date: 2025-12-24
owners: ["Eva", "Dan"]
  - Eva
  - Dan
scope: security
tags:
  - security
  - incident
  - response
  - runbook
---

# Incident Response Plan — PixelProwlers V1.3

> **Temps cible** : Actionnable en 10 minutes. Aucun secret, aucune IP, aucune PII.

---

## 1. Déclencheurs — Quand activer ce plan ?

| Signal | Action |
|--------|--------|
| Alerte monitoring (erreur rate > 5%, latence > 3s) | Vérifier, escalader si persistant > 5 min |
| Rapport utilisateur de comportement anormal | Trier selon §2 Classification |
| Détection fuite données/logs suspects | **Activation immédiate** — S0 ou S1 |
| CI/CD bloquée par guard sécurité | Analyser le guard, évaluer severity |
| Anomalie dans logs backend (accès non autorisé) | Containment immédiat si confirmé |
| Dépendance avec CVE critique (CVSS ≥ 9) | Patch 24h — S1 |

**Règle d'or** : En cas de doute, traiter comme S2 minimum et escalader.

---

## 2. Classification S0–S3

| Niveau | Description | SLA Response | SLA Résolution | Exemple |
|--------|-------------|--------------|----------------|---------|
| **S0** | Critique — Fuite données, compromission système | 15 min | 4h | Base de données exposée, credentials leakés |
| **S1** | Majeur — Service down, vulnérabilité exploitée | 30 min | 8h | XSS actif, injection SQL, API down |
| **S2** | Modéré — Dégradation service, vulnérabilité potentielle | 2h | 24h | Rate limit contourné, erreur auth répétée |
| **S3** | Mineur — Comportement inattendu, alerte faux positif | 24h | 72h | Guard CI trop strict, log warning anormal |

### Critères de classification

```
S0 si :
  - Données utilisateur potentiellement exposées
  - Accès admin compromis
  - Service production complètement indisponible

S1 si :
  - Vulnérabilité exploitable activement
  - Impact sur > 10% des utilisateurs
  - Dépendance critique vulnérable

S2 si :
  - Vulnérabilité découverte mais non exploitée
  - Dégradation partielle du service
  - Alerte sécurité nécessitant investigation

S3 si :
  - Faux positif confirmé
  - Amélioration préventive à planifier
```

---

## 3. Triage Initial — 15 minutes

### 3.1 Containment immédiat

| Action | Commande/Procédure | Responsable |
|--------|-------------------|-------------|
| **Kill switch frontend** | Activer maintenance mode via feature flag | Dan |
| **Kill switch API** | Désactiver routes sensibles via env var | Tom |
| **Isolation DB** | Révoquer accès externes, garder read-only interne | Tom |
| **CDN purge** | Invalider cache si contenu compromis | Dan |
| **Session invalidation** | Forcer re-auth tous utilisateurs si credentials leakés | Eva |

### 3.2 Feature flags kill switches

```bash
# Frontend — Activer maintenance
NUXT_PUBLIC_MAINTENANCE_MODE=true

# Backend — Désactiver endpoints sensibles
DJANGO_DISABLE_CONTACT_ENDPOINT=true
DJANGO_DISABLE_EXPORT_ENDPOINT=true

# Global — Mode lecture seule
READONLY_MODE=true
```

### 3.3 Checklist triage rapide

- [ ] Incident confirmé ? (pas faux positif)
- [ ] Classification S0/S1/S2/S3 assignée
- [ ] Containment appliqué si S0/S1
- [ ] Owners notifiés (Eva, Dan)
- [ ] Timestamp de détection noté
- [ ] Canal communication établi

---

## 4. Evidence Handling — Collecte de preuves

### 4.1 Principes

- **NO PII** : Ne jamais inclure données personnelles dans les logs d'incident
- **Horodatage UTC** : Tous les timestamps en UTC
- **Hash d'intégrité** : SHA256 pour chaque fichier de preuve
- **Chaîne de custody** : Qui a accédé quoi, quand

### 4.2 Collecte des logs

```bash
# Export logs applicatifs (dernières 24h)
# Remplacer <TIMESTAMP> par date incident
LOG_START="2025-12-24T00:00:00Z"
LOG_END="2025-12-24T23:59:59Z"

# Backend Django
python manage.py export_logs --start=$LOG_START --end=$LOG_END --output=incident_logs.json

# Anonymisation automatique
python tools/anonymize_logs.py incident_logs.json > incident_logs_anon.json

# Hash d'intégrité
sha256sum incident_logs_anon.json > incident_logs_anon.sha256
```

### 4.3 Structure du dossier incident

```
/incidents/INCIDENT-YYYY-MM-DD-NNN/
├── timeline.md           # Chronologie des événements
├── evidence/
│   ├── logs_anon.json    # Logs anonymisés
│   ├── logs_anon.sha256  # Hash intégrité
│   ├── screenshots/      # Captures écran (PII masqués)
│   └── configs/          # Configs au moment de l'incident
├── chain_of_custody.md   # Qui a accédé quoi
└── postmortem.md         # À remplir après résolution
```

### 4.4 Chaîne de custody template

```markdown
# Chain of Custody — INCIDENT-2025-12-24-001

| Timestamp (UTC) | Personne | Action | Hash fichier |
|-----------------|----------|--------|--------------|
| 2025-12-24T10:00:00Z | Eva | Export logs backend | abc123... |
| 2025-12-24T10:15:00Z | Dan | Capture screenshot frontend | def456... |
```

---

## 5. Communication

### 5.1 Communication interne — Template

```markdown
## 🔴 Incident [Sx] — [Titre court]

**Détecté** : [TIMESTAMP UTC]
**Severity** : S[0-3]
**Status** : [En cours / Contenu / Résolu]

### Impact
[Description factuelle, pas de spéculation]

### Actions en cours
- [ ] [Action 1]
- [ ] [Action 2]

### Prochaine mise à jour
[TIMESTAMP ou "dans X minutes"]

---
Owner : [Nom]
Canal : [Slack/Discord channel]
```

### 5.2 Communication utilisateur — Template (si nécessaire)

```markdown
## Information importante

Nous avons détecté [description générale sans détails techniques].

**Ce que nous faisons** :
Nos équipes travaillent activement à résoudre la situation.

**Ce que vous pouvez faire** :
[Actions concrètes si applicable, ex: "Par précaution, nous vous recommandons de..."]

**Prochaine mise à jour** :
Nous vous tiendrons informés dès que possible.

---
L'équipe PixelProwlers
```

### 5.3 Règles de communication

| À faire | À NE PAS faire |
|---------|----------------|
| Rester factuel | Spéculer sur la cause |
| Donner un délai de MAJ | Promettre une date de résolution |
| Reconnaître l'impact | Minimiser ou exagérer |
| Informer proactivement | Attendre qu'on nous demande |

---

## 6. Remédiation

### 6.1 Patch d'urgence

```bash
# 1. Créer branche hotfix
git checkout -b hotfix/incident-YYYY-MM-DD main

# 2. Appliquer le fix
# ... modifications ...

# 3. Tests minimaux obligatoires
npm run test:security
npm run guards:all

# 4. Review accélérée (2 approvals minimum pour S0/S1)
gh pr create --base main --title "HOTFIX: [Description]"

# 5. Merge et deploy
gh pr merge --squash
```

### 6.2 Rotation des secrets (si compromission)

```bash
# Checklist rotation
- [ ] API keys backend (Django SECRET_KEY)
- [ ] Tokens tiers (si applicable)
- [ ] Clés de chiffrement DB
- [ ] Tokens de déploiement CI/CD
- [ ] Mise à jour .env.example avec nouvelles variables
```

### 6.3 Rollback d'urgence

```bash
# Identifier le dernier déploiement stable
git log --oneline -10

# Rollback frontend
git revert --no-commit HEAD~N..HEAD
git commit -m "ROLLBACK: Revert to stable state pre-incident"

# Rollback backend (Django)
# Via Vercel/hosting : redeploy previous commit

# Vérification post-rollback
npm run test:smoke
```

---

## 7. Post-mortem

### 7.1 Template post-mortem

```markdown
# Post-mortem — INCIDENT-YYYY-MM-DD-NNN

## Résumé
- **Severity** : S[0-3]
- **Durée totale** : [X heures]
- **Impact** : [Description]
- **Cause racine** : [Analyse technique]

## Timeline
| Heure (UTC) | Événement |
|-------------|-----------|
| HH:MM | Détection |
| HH:MM | Containment |
| HH:MM | Résolution |

## Analyse des 5 pourquoi
1. Pourquoi [symptôme] ? → [cause immédiate]
2. Pourquoi [cause 1] ? → [cause 2]
3. Pourquoi [cause 2] ? → [cause 3]
4. Pourquoi [cause 3] ? → [cause 4]
5. Pourquoi [cause 4] ? → **[cause racine]**

## Ce qui a bien fonctionné
- [Point positif 1]
- [Point positif 2]

## Ce qui peut être amélioré
- [Amélioration 1]
- [Amélioration 2]

## Actions correctives
| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| [Action SSOT] | [Nom] | [Date] | [ ] |
| [Action CI] | [Nom] | [Date] | [ ] |
| [Guard à ajouter] | [Nom] | [Date] | [ ] |
```

### 7.2 Checklist actions correctives

- [ ] **SSOT** : Mettre à jour la documentation si procédure manquante
- [ ] **CI/CD** : Ajouter test qui aurait détecté le problème
- [ ] **Guards** : Créer/renforcer guard si pattern dangereux
- [ ] **Monitoring** : Améliorer alertes si détection trop lente
- [ ] **Formation** : Partager apprentissages avec l'équipe

### 7.3 Revue périodique

| Fréquence | Action |
|-----------|--------|
| Après chaque S0/S1 | Post-mortem obligatoire sous 48h |
| Mensuelle | Revue des incidents S2/S3 |
| Trimestrielle | Simulation incident (tabletop exercise) |

---

## 8. Références — Documents liés

| Document | Chemin | Description |
|----------|--------|-------------|
| Security Index | [SECURITY_INDEX.md](./SECURITY_INDEX.md) | Index des composants sécurité |
| Security Gates | [SECURITY_GATES.md](./SECURITY_GATES.md) | Gates CI/CD obligatoires |
| Logs & Backups | [LOGS_BACKUPS_ACCES.md](./LOGS_BACKUPS_ACCES.md) | Politique logs et sauvegardes |
| Guards Registry | [contracts/PX_V1_3_SECURITY_GUARDS_REGISTRY.md](./contracts/PX_V1_3_SECURITY_GUARDS_REGISTRY.md) | Registre des guards actifs |
| DOM Guards | [contracts/PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS.md](./contracts/PX_V1_3_SECURITY_P0_DEEPLINKS_DOM_GUARDS.md) | Guards DOM/Deeplinks |

---

## 9. Contacts d'urgence

| Rôle | Personne | Disponibilité |
|------|----------|---------------|
| Security Lead | Eva | Heures ouvrées + astreinte S0 |
| Tech Lead Frontend | Dan | Heures ouvrées + astreinte S0 |
| Tech Lead Backend | Tom | Heures ouvrées |
| Product Owner | Marty | Heures ouvrées |

---

## Changelog

| Version | Date | Auteur | Changement |
|---------|------|--------|------------|
| 1.0 | 2025-12-24 | Eva, Dan | Création initiale |

---

> **Doctrine PixelProwlers** : Privacy-first, minimisation des données, pas de tracking, no remote assets. Ce plan respecte ces principes en ne collectant aucune PII et en anonymisant systématiquement les logs.
