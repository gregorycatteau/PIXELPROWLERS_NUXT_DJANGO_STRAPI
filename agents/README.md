# Agents PixelProwlers

> Dossier DATA ONLY — Profils agents et registry machine-readable.

## Structure

```
agents/
├── agents_registry.json   # Registry canonique (source machine-readable)
├── profiles/              # Profils JSON détaillés par agent
│   ├── bruce_agent.json
│   ├── claire_agent.json
│   ├── dan_agent.json
│   ├── eva_agent.json
│   ├── heider_agent.json
│   ├── jared_agent.json
│   ├── jonas_agent.json
│   ├── julien_agent.json
│   ├── marty_agent.json
│   ├── nova_agent.json
│   ├── rand_agent.json
│   ├── sarah_agent.json
│   ├── shafi_agent.json
│   ├── shay_agent.json
│   ├── talia_agent.json
│   └── tom_agent.json
└── README.md
```

## Conventions

### Nommage des profils
- Format: `{slug}_agent.json`
- Slug en minuscules (ex: `eva`, `marty`, `dan`)
- Le champ `name` dans le JSON = displayName titlecase (ex: `Eva`, `Marty`, `Dan`)

### Registry (`agents_registry.json`)
Source de vérité machine-readable pour l'équipe agents. Structure:
```json
{
  "version": "1.0.0",
  "lastUpdated": "YYYY-MM-DD",
  "agents": [
    {
      "slug": "eva",
      "displayName": "Eva",
      "primaryDomains": ["security", "privacy", "opsec"],
      "profilePath": "agents/profiles/eva_agent.json"
    }
  ]
}
```

### Scripts de gestion
Les outils de gestion des agents sont dans `/tools`:
- `tools/agents_generate_registry.py` — Régénère le registry depuis les profils
- `tools/agents_register_agent.py` — Ajoute un nouvel agent
- `tools/agents/` — Scripts de migration et utilitaires

## Usage SSOT

Les `displayName` du registry sont la **source canonique** pour le champ `owners` dans les frontmatters SSOT.

```yaml
# Correct
owners: ["Eva", "Dan"]

# Incorrect
owners: ["eva", "EVA", "Eva Galperin"]
```

## Référence documentaire
- Voir `docs/00-foundations/AGENTS_REGISTRY_V1.md` pour la documentation SSOT officielle.
