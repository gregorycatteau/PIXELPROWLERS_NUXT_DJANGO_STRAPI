---
id: PX_V1_3_P1_QUESTION_SCHEMA
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Dan", "Marty"]
scope: ["docs/20-product_specs/**"]
tags: ["product_specs", "schemas"]
---

# PX_V1_3_P1_QUESTION_SCHEMA.md

## 1. Objectif du schéma

Ce schéma définit la structure standard d’une **question P1** (parcours "Ma structure dysfonctionne") en V1.3.

Il sert de référence commune à :

- la rédaction des assertions (contenu),
- le scoring (tension / axes),
- le moteur de patterns,
- l’UX (slider, skip, affichage),
- la sécurité (ce qui est loggé ou non, comment, et sous quelle forme).

Ce schéma doit rester **stable** sur P1 et pourra être réutilisé pour les autres parcours (P2–P5) avec des variations d’axes.


## 2. Principes de design

1. **Assertif et humain**
   - Chaque question est une **assertion** formulée au présent.
   - L’utilisateur ne “note pas un problème”, il dit si la phrase est plus ou moins vraie pour lui.

2. **Échelle Likert 1–5**
   - 1 = Pas du tout vrai  
   - 2 = Plutôt faux  
   - 3 = Mitigé  
   - 4 = Plutôt vrai  
   - 5 = Tout à fait vrai

3. **Polarité explicite**
   - Certaines assertions décrivent un fonctionnement souhaitable (“les décisions sont expliquées”).
   - D’autres décrivent une difficulté (“on apprend les décisions au dernier moment”).
   - Pour le scoring, on a besoin d’une **valeur de tension homogène**, d’où le champ `polarity`.

4. **Non-réponse intentionnelle**
   - L’utilisateur peut choisir explicitement “Je ne souhaite pas répondre”.
   - Ce choix est **un signal à part entière** (zones d’évitement, sujets sensibles).

5. **Séparation contenu / logique**
   - Tout ce qui est **texte** réside dans la config P1 (copie).
   - Tout ce qui est **logique / scoring** (poids, axes, criticité) réside aussi dans la config, mais clairement séparé.
   - Le moteur peut évoluer sans changer le texte, et inversement.


## 3. Modèle de données – `P1Question`

### 3.1. Vue d’ensemble

Une question P1 est représentée par un objet de type :

```ts
type P1Question = {
  id: string;
  version: string;
  journeyId: 'P1';
  blockId: 'B1' | 'B2' | 'B3' | 'B4' | 'GLOBAL';
  axis: string;
  subAxis?: string | null;

  assertion: string;
  assertionAlt?: string | null;

  polarity: 'positive' | 'negative';
  scale: 'likert_1_5';

  weight: 1 | 2 | 3;
  critical: boolean;

  allowSkip: boolean;
  uiHint: 'slider' | 'radio' | 'other';

  order: number;
  stepId: 'E1' | 'E3' | 'OTHER';

  patternSignals?: string[];
  tags?: string[];

  notesProduct?: string;
  notesSafety?: string;
};
```
⚠ Ce type est donné ici à titre de référence produit.
Les implémentations concrètes (TS/JSON) doivent rester conformes à cette structure.

3.2. Champs détaillés
3.2.1. Identité & version
id: string
Identifiant unique et stable de la question.

Format recommandé : p1_q_<bloc>_<index>

ex. p1_q_b1_01, p1_q_b3_07

Utilisé pour :

le scoring,

les patterns,

l’analytics coarse (jamais avec la réponse brute côté serveur).

version: string
Version logique de la question (ex. "1.3.0").

Sert à tracer les changements dans le SSOT et à éviter les collisions de logique.

Permet de différencier :

P1 V1.2 (ancienne logique),

P1 V1.3 (assertions + skip + patterns).

journeyId: 'P1'
Identifie le parcours.

Permet d’unifier le schéma avec P2–P5 (qui auront d’autres IDs).

3.2.2. Structure & axes
blockId: 'B1' | 'B2' | 'B3' | 'B4' | 'GLOBAL'
Bloc auquel la question est rattachée :

B1 – Climat & ressenti

B2 – Mouvement & prévisibilité

B3 – Règles & décisions

B4 – Structure & robustesse

GLOBAL – Questions transversales / panorama

axis: string
Axe principal de lecture de la question (niveau produit).

Exemples :

"climate",

"psychological_safety",

"governance_clarity",

"structural_robustness".

subAxis?: string | null
Sous-axe optionnel.

Exemple : "meetings", "documentation", "conflict_management".

3.2.3. Texte & présentations
assertion: string
Texte principal affiché à l’utilisateur.

Formulé au présent, dans un langage simple, en “je” ou “nous”.

Exemple :

"Les décisions importantes sont clairement expliquées à l’ensemble des personnes concernées."

assertionAlt?: string | null
Variante alternative (optionnelle) :

pour tests A/B,

pour persona spécifique,

ou pour simplification UX.

L’implémentation décidera laquelle afficher (ou toujours assertion).

3.2.4. Polarité & échelle
polarity: 'positive' | 'negative'

Définit la relation entre la réponse et le niveau de tension.

positive :

Assertion décrit une situation saine.

Ex : “Les réunions sont préparées à l’avance.”

5/5 = peu de tension, 1/5 = tension forte.

negative :

Assertion décrit une difficulté / dysfonctionnement.

Ex : “On apprend les décisions importantes au dernier moment.”

5/5 = tension forte, 1/5 = peu de tension.

scale: 'likert_1_5'
Indique le type d’échelle utilisée.

Permettrait à terme d’introduire d’autres échelles si nécessaire

(binaire, 1–7, etc.), mais P1 reste en 1–5.

3.2.5. Poids & criticité
weight: 1 | 2 | 3
Poids de la question dans le calcul des scores d’axe / bloc.

1 = question légère, contexte général.

2 = question importante.

3 = question structurante pour l’interprétation.

critical: boolean
Marqueur de “question-sentinelle”.

true pour les questions qui touchent à :

sécurité psychologique,

violence,

harcèlement,

santé,

niveau de rupture.

Permet de :

déclencher des messages plus prudents dans les bilans,

moduler les plans d’action (ne pas pousser à certaines actions dangereuses).

3.2.6. Skip & UX
allowSkip: boolean
Indique si l’UI doit proposer “Je ne souhaite pas répondre à cette question”.

P1 V1.3 : par défaut true (sauf rare exception à documenter).

uiHint: 'slider' | 'radio' | 'other'
Recommandation pour l’implémentation UX.

P1 V1.3 : par défaut slider.

radio possible en fallback ou pour des questions particulières.

3.2.7. Ordonnancement
order: number
Position de la question dans son bloc/parcours.

Ex : 1, 2, 3…

stepId: 'E1' | 'E3' | 'OTHER'
Étape du parcours où la question apparaît :

E1 – Panorama / premières questions,

E3 – Explorations détaillées (blocs),

OTHER – éventuellement pour des évolutions.

3.2.8. Patterns & tags
patternSignals?: string[]
Liste de clés de signal que cette question alimente.

Ces clés sont utilisées par le moteur de patterns.

Exemple :

["governance_opacity", "decision_communication"]

["psychological_safety_low"]

tags?: string[]
Mots-clés produit / éditorial.

Exemple :

["meetings", "board", "conflicts"]

["frontline", "management"]

3.2.9. Notes internes
notesProduct?: string
Notes produit / intention de la question.

Pourquoi elle existe, ce qu’elle vise à révéler, comment l’utiliser.

notesSafety?: string
Notes sécurité / éthique :

Risques particuliers (triggers possibles),

Recommandations pour le wording des bilans,

Points de vigilance (ex : ne jamais renvoyer cette assertion brute vers un canal non chiffré).

4. Représentation de la réponse (hors schéma question)
Important : la réponse de l’utilisateur n’est pas stockée dans l’objet P1Question.
Elle est représentée par un objet séparé de type :

```ts
type P1AnswerStatus = 'answered' | 'skipped_intentional' | 'missing';

type P1Answer = {
  questionId: string;
  status: P1AnswerStatus;
  value?: 1 | 2 | 3 | 4 | 5; // présent seulement si status === 'answered'
};
```
Cette séparation :

évite tout mélange contenu / réponse,

facilite les décisions de persistance (localStorage partiel, pas de backend),

rend explicite la différence :

skipped_intentional ≠ missing.

5. Vue “attaque / sécurité” liée au schéma
En tant qu’attaquant, ce schéma de question devient exploitable si :

je mets la main sur un dispositif où les réponses sont stockées (device partagé, telefon, PC d’asso),

je parviens à recouper questionId ↔ texte d’assertion.

Je peux alors :

reconstruire une cartographie très fine des tensions d’une structure,

cibler des vulnérabilités (gouvernance, conflits internes, personnes-clés),

exploiter des zones sensibles (questions critiques, skips répétés).

Contre-mesures structurant le design :

Les réponses brutes (valeurs 1–5) restent en mémoire pour le calcul des bilans.

Un éventuel stockage local (navigateur) doit se limiter à :

des agrégats par axe / bloc,

des tags de patterns,

éventuellement des méta minimalistes.

Les IDs et les textes d’assertion ne doivent pas être envoyés au backend avec les réponses.

Le moteur de patterns doit être local pour P1 V1.3.
