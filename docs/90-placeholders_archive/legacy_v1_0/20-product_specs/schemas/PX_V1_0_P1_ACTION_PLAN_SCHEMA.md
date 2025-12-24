# PX_V1_0_P1_ACTION_PLAN_SCHEMA.md

## 1. Objectif du schéma

Ce schéma définit la forme d’un **plan d’action** généré à l’issue du parcours P1.

Il doit :

- être **lisible par un humain** (affichage, export),
- être **auto-suffisant** (comprendre le contexte minimal),
- être **sûr** (ne pas embarquer plus d’informations que nécessaire),
- être **compatible** avec :
  - un usage solo (copier-coller, impression),
  - une éventuelle intégration dans Relinium (stockage chiffré).


## 2. Principes de design

1. **Pas de données nominatives obligatoires**
   - Le plan d’action n’a pas besoin du nom de l’utilisateur ou de la structure pour être utile.
   - L’ID utilisateur / structure doit rester optionnel et, si présent, géré côté Relinium.

2. **Lisible en Markdown**
   - L’export cible un format **Markdown** simple :
     - titres,
     - listes à puces,
     - sections.
   - Cela facilite la réutilisation :
     - dans un outil de notes,
     - dans Relinium,
     - sur papier.

3. **Structuré en blocs**
   - Le plan n’est pas une “soupe de recommandations”.
   - Il est segmenté en **blocs thématiques**, chacun avec :
     - un titre,
     - une explication,
     - des tâches,
     - éventuellement des liens vers des ressources.

4. **Hiérarchisation des actions**
   - Chaque action est typée :
     - court terme / moyen terme,
     - niveau d’effort,
     - impact attendu.
   - L’utilisateur doit pouvoir repérer rapidement :
     - “les 2–3 premiers pas”,
     - ce qui est optionnel.

5. **Traçabilité des patterns (mais locale)**
   - Le plan d’action sait de quels **patterns** il découle.
   - Ces patterns sont des clés techniques (“tags”), pas une reproduction des réponses brutes.


## 3. Modèle de données – `P1ActionPlan`

### 3.1. Vue d’ensemble

```ts
type P1ActionPlan = {
  id: string;
  version: string;
  journeyId: 'P1';

  generatedAt: string; // ISO8601
  locale: 'fr-FR';

  summary: ActionPlanSummary;
  context: ActionPlanContext;

  blocks: ActionPlanBlock[];

  meta: ActionPlanMeta;
};
```
3.2. Champs détaillés
3.2.1. Identité & version
id: string
Identifiant unique du plan d’action.

Généré côté client, scope local.

Format recommandé : UUID v4 ou équivalent.

version: string
Version du schéma du plan (ex. "1.0.0").

journeyId: 'P1'
Pour permettre à Relinium de distinguer différents types de plans.

3.2.2. Métadonnées temporelles & langue
generatedAt: string
Date/heure de génération au format ISO8601 (ex. "2025-12-10T08:45:00Z").

locale: 'fr-FR'
Langue principale du contenu texte du plan.

3.3. ActionPlanSummary – Résumé
```ts
type ActionPlanSummary = {
  title: string;
  subtitle?: string;
  overview: string;

  mainThemes: string[];
  tone: 'calm' | 'urgent' | 'mixed';
};
```
title
Titre global du plan.

Ex : "Plan d’action pour clarifier la gouvernance et alléger la charge mentale"

subtitle?
Sous-titre (optionnel).

Ex : "Un point d’appui pour les 3 prochains mois"

overview
Paragraphe de résumé (1–3 courts paragraphes max) expliquant :

ce que le diagnostic met en avant,

ce que le plan propose.

mainThemes
Liste de thèmes structurants.

Ex : ["gouvernance_clarte", "climat_confiance", "charge_travail"]

tone
Indication de tonalité :

calm : tension présente mais gérable,

urgent : signaux forts (questions critiques, ruptures),

mixed : mélange.

3.4. ActionPlanContext – Contexte minimal
```ts
type ActionPlanContext = {
  // Aucun PII obligatoire
  selfDescription?: string;
  perceivedRole?: string;
  notes?: string;

  patternTags: string[];
};
```
selfDescription?
Si l’utilisateur le souhaite, il peut se décrire en une phrase dans l’export (optionnel côté produit).

Ex : "Salarié·e à temps plein depuis 3 ans dans une association culturelle."

perceivedRole?
Type de rôle (si capté quelque part, ex. dans E0 ou E6).

Ex : "membre_salarie", "administrateur", "benevole".

Non obligatoire.

notes?
Zone libre éventuelle pour l’utilisateur (si on l’intègre plus tard).

P1 V1.3 peut rester sans saisie libre ici.

patternTags
Liste des patterns qui ont contribué à la construction du plan.

Ex : ["governance_opacity", "decision_communication_low", "burnout_risk"]

Permet à Relinium (plus tard) de retrouver les thèmes, sans nécessiter les réponses brutes.

3.5. ActionPlanBlock – Blocs d’action
```ts
type ActionPlanBlock = {
  id: string;

  title: string;
  description: string;

  priority: 'now' | 'soon' | 'later';
  estimatedHorizon?: '1-2_weeks' | '1_month' | '3_months' | '6_months';

  rationale: string;

  actions: ActionItem[];
  reflectionPrompts?: string[];

  relatedPatterns: string[];
  tags?: string[];
};
```
id
Identifiant local du bloc.

Ex: "block_governance_clarity".

title
Titre du bloc.

Ex : "Clarifier qui décide quoi et sur quels sujets"

description
Quelques phrases pour placer le bloc :

ce qu’il vise,

pourquoi il est proposé.

priority
Niveau de priorité suggéré :

now : premières actions à envisager,

soon : important mais peut attendre un peu,

later : à garder en tête pour la suite.

estimatedHorizon?
Horizon temporel indicatif :

ex : 1-2_weeks, 1_month, 3_months, 6_months.

rationale
Explication courte :

lien avec les patterns,

impact attendu si le bloc est travaillé.

actions
Liste d’éléments de type ActionItem (voir ci-dessous).

reflectionPrompts?
Questions de réflexion associées au bloc :

ex : “Quelles décisions récentes t’ont semblé les plus floues ?”

relatedPatterns
Liste de patternTags liés à ce bloc.

tags?
Tags libres pour filtrage ou regroupement ultérieur.

3.6. ActionItem – Tâches
```ts
type ActionItem = {
  id: string;

  title: string;
  description: string;

  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';

  suggestedMode: 'solo' | 'with_trusted_person' | 'with_group' | 'with_professional';

  preconditions?: string[];
  cautions?: string[];

  relatedPatterns: string[];
};
```
id
Identifiant local de la tâche.

Format : "blockId_action_01" etc.

title
Titre court de l’action.

Ex : "Lister les décisions importantes des 3 derniers mois"

description
Description concrète, langage simple, pas d’injonction violente.

effort
Estimation de l’effort :

low : ≤ 30 minutes / énergie faible,

medium : 1–2 heures / énergie moyenne,

high : action lourde, potentiellement sur plusieurs jours.

impact
Estimation de l’impact potentiel sur la situation.

suggestedMode
Mode recommandé :

solo : travail personnel,

with_trusted_person : avec quelqu’un de confiance,

with_group : en réunion / collectif,

with_professional : avec une personne formée (coach, médiateur, psy, etc.).

preconditions?
Conditions préalables :

ex : “Disposer d’un moment au calme de 30 minutes”.

cautions?
Avertissements :

ex : “Ne fais pas cette action seul·e si la situation est potentiellement violente.”

relatedPatterns
Patterns principaux liés à cette action.

3.7. ActionPlanMeta – Métadonnées & sécurité
```ts
type ActionPlanMeta = {
  schemaVersion: string;

  // Information sur l’environnement de génération (non PII)
  generator: 'pixelprowlers_p1_frontend_v1_3';
  notes?: string;

  // Indicateurs pour Relinium (plus tard)
  reliniumHint?: {
    suggestedNotebookSlug?: string;
    suggestedTags?: string[];
  };
};
```
schemaVersion
Version du schéma (ex. "1.0.0").

generator
Identifie la “source” du plan (utilisé pour audit / compatibilité).

notes?
Eventuelles notes techniques (debug, expérimentations).

reliniumHint?
Indications optionnelles pour Relinium :

dans quel “carnet” ou “dossier” déposer ce plan,

quels tags pré-remplir.

4. Export Markdown
Le plan d’action doit pouvoir se matérialiser en Markdown avec la structure suivante :

```md
# [summary.title]

_[summary.subtitle]_

_Généré le : [generatedAt] – Langue : [locale]_

---

## 1. Vue d’ensemble

[summary.overview]

**Thèmes principaux :**
- [mainThemes...]

---

## 2. Blocs d’action

### 2.1. [block.title]

[block.description]

- Priorité : [block.priority]
- Horizon : [block.estimatedHorizon]

**Pourquoi ce bloc ?**  
[block.rationale]

**Actions proposées :**
1. [action.title]  
   - Effort : [action.effort] – Impact : [action.impact] – Mode : [action.suggestedMode]  
   - Description : [action.description]

[...]

---

## 3. Pistes de réflexion

[reflectionPrompts...]

---

## 4. Notes et suites possibles

- Tu peux garder ce plan pour toi.
- Tu peux le travailler avec une personne de confiance.
- Tu peux, si tu le souhaites, l’importer dans un espace Relinium pour le suivre dans le temps.
```
5. Vue “attaque / sécurité” liée au plan d’action
En tant qu’attaquant, si je récupère un plan d’action :

Je n’ai pas les réponses brutes,

mais je peux déduire :

que la structure est en tension,

sur quels axes,

quel est le niveau de gravité perçu.

Mitigations :

Pas de nom de structure / personne par défaut dans le plan.

Les références à des personnes ou structures (si l’utilisateur les ajoute) sont sous sa seule responsabilité.

Les patterns restent des tags abstraits, non contextualisés à une entité.

Le plan d’action ne doit pas être stocké côté PixelProwlers sans consentement explicite.
