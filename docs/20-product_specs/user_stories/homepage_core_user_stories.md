---
id: HOMEPAGE_CORE_USER_STORIES
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Marty", "Claire"]
  - Marty
scope:
  - docs/20-product_specs/**
tags:
  - product_specs
  - user_stories
---

<!-- 20-product_specs/functional/user_stories/homepage_core_user_stories.md -->

# User stories — Homepage V1.2

## Epic 1 — Comprendre rapidement “où je suis” et “à quoi ça sert”

### US 1.1 — Comprendre le propos du site

En tant que  
**porteur de projet (asso / collectif / individu en transition)**  
je veux  
**comprendre en quelques secondes de quoi parle PixelProwlers**  
afin de  
**savoir si ce site peut m’aider ou si je peux passer à autre chose**.

**Critères d’acceptation**

- En moins de 10 secondes :
  - un utilisateur peut reformuler :
    - “PixelProwlers aide des projets utiles à remettre de l’ordre dans leurs structures / outils / trajectoires.”
- Le H1 + sous-titre :
  - mentionnent clairement :
    - l’idée de projet utile,
    - les problèmes de structure / outils / trajectoire.
- Aucun jargon technique (RAG, VUCA, SSOT…) n’apparaît dans le Hero.

---

### US 1.2 — Se sentir légitime

En tant que  
**personne qui doute de la “taille” ou de la légitimité de son projet**  
je veux  
**me sentir à ma place sur la homepage**  
afin de  
**oser explorer sans me sentir jugé ou “pas assez gros”**.

**Critères d’acceptation**

- Au moins un texte (Hero ou S4) explicite que :
  - les petits collectifs, SCIC naissantes, assos, individus en transition sont légitimes.
- Les visuels et textes ne suggèrent pas :
  - uniquement des “grosses structures”.
- Les CTAs ne parlent jamais de “gros budgets” ou “grands comptes”.

---

## Epic 2 — Choisir un parcours adapté

### US 2.1 — Identifier un parcours qui me ressemble

En tant que  
**utilisateur qui arrive avec un problème flou**  
je veux  
**parcourir des cartes de parcours qui décrivent des situations concrètes**  
afin de  
**trouver celle qui se rapproche le plus de ma propre situation**.

**Critères d’acceptation**

- La section S2 comporte 5 cartes alignées sur P1–P5.
- Pour chaque carte :
  - une phrase décrit une **situation de départ réaliste**,
  - l’utilisateur “froid” peut dire “ça, c’est moi” ou “non, pas ça”.
- Les textes des cartes ne sont pas centrés sur la méthode, mais sur la **situation vécue**.

---

### US 2.2 — Comprendre ce que j’obtiens en cliquant

En tant que  
**utilisateur hésitant à cliquer**  
je veux  
**savoir ce que je vais trouver dans un parcours avant de m’engager**  
afin de  
**ne pas perdre de temps dans quelque chose qui ne me correspond pas**.

**Critères d’acceptation**

- Chaque carte de parcours mentionne :
  - le type de **diagnostic** proposé,
  - la présence de **bilans lisibles**,
  - l’accès à des **ressources activables**.
- Aucun vocabulaire ne laisse penser à :
  - une formation payante cachée,
  - un tunnel commercial direct.

---

### US 2.3 — Accéder simplement au parcours choisi

En tant que  
**utilisateur qui a trouvé un parcours pertinent**  
je veux  
**ouvrir ce parcours via un CTA clair**  
afin de  
**commencer le diagnostic sans détours**.

**Critères d’acceptation**

- Le CTA principal de chaque carte est clairement visible.
- Le clic sur une carte ouvre `/parcours/<slug>` correspondant à P1–P5.
- Aucun autre clic “compétitif” n’est placé plus en avant (pas de CTA “Contact” en surbrillance sur cette section).

---

## Epic 3 — Comprendre “ce que je peux faire ici, tout de suite”

### US 3.1 — Clarifier les bénéfices immédiats

En tant que  
**utilisateur qui scrolle un peu avant de cliquer**  
je veux  
**voir clairement ce que je peux faire sur ce site dès maintenant**  
afin de  
**savoir si ça vaut le coup d’investir 10–20 minutes dans un parcours**.

**Critères d’acceptation**

- La section S3 liste clairement 3 bénéfices :
  - Mettre des mots / Diagnostic
  - Y voir plus clair / Bilan
  - Passer à l’action / Ressources
- Pas de jargon fonctionnel (Q1, Q2, VUCA, etc.).
- Le texte reste centré sur **l’utilisateur**, pas sur la fierté technique.

---

## Epic 4 — Savoir si je suis au bon endroit (fit de valeurs)

### US 4.1 — Vérifier que ma façon de voir le monde colle

En tant que  
**porteur de projet avec une éthique forte**  
je veux  
**comprendre rapidement si PixelProwlers partage une vision compatible**  
afin de  
**ne pas engager du temps dans une relation qui serait toxique ou mal alignée**.

**Critères d’acceptation**

- La section S4 liste des “Tu es au bon endroit si…” qui évoquent :
  - valeur sociale / écologique / humaine,
  - refus de logiques purement extractives,
  - envie de gouvernance plus saine.
- La section “Ce n’est pas notre terrain” :
  - reste non insultante,
  - indique clairement ce que PixelProwlers ne fait pas.

---

### US 4.2 — Ne pas me sentir jugé

En tant que  
**personne qui sait que sa structure est abîmée**  
je veux  
**ne pas me sentir jugé ou humilié par le wording de la homepage**  
afin de  
**oser explorer les parcours sans honte**.

**Critères d’acceptation**

- Aucun terme de type “toxique”, “raté”, “mauvais” sur la homepage.
- Le problème est toujours formulé au niveau :
  - de la **structure / système**,  
  - pas de la valeur des personnes.

---

## Epic 5 — Comprendre comment on peut travailler ensemble (plus tard)

### US 5.1 — Avoir une vision simple du process global

En tant que  
**utilisateur qui pense déjà à un accompagnement**  
je veux  
**voir en 3–4 phrases comment PixelProwlers travaille avec ses clients**  
afin de  
**savoir si ce type de relation me convient**.

**Critères d’acceptation**

- Section S5 affiche un process en 3 étapes :
  1. Explorer en solo,
  2. Documenter (Relinium),
  3. Vérifier le fit.
- Relinium et Fit sont mentionnés :
  - sans détails techniques,
  - sans promesse magique.

---

### US 5.2 — Ne pas me sentir poussé vers une vente

En tant que  
**utilisateur méfiant vis-à-vis des “tunnels cachés”**  
je veux  
**ne voir aucun signal d’urgence commerciale ou de pression**  
afin de  
**rester en confiance et revenir si j’en ai envie plus tard**.

**Critères d’acceptation**

- Aucun élément de type :
  - “offre limitée”, “c’est maintenant ou jamais”, “prix bientôt en hausse”.
- Aucun compteur, pop-up, exit-intent sur la homepage V1.2.
- Le CTA “Contact” ou “Travailler ensemble” n’apparaît pas comme “l’unique issue valable”.

---

## Epic 6 — Navigation & ergonomie

### US 6.1 — Retrouver facilement les infos importantes

En tant que  
**utilisateur qui veut creuser**  
je veux  
**pouvoir accéder rapidement à la page À propos, aux parcours et aux futures ressources**  
afin de  
**naviguer à mon rythme sans me perdre**.

**Critères d’acceptation**

- Le header ou footer de la homepage contient :
  - un lien “À propos”,
  - un lien “Parcours” (ou ancre vers S2),
  - un lien vers le blog / ressources (quand existants).
- Ces liens restent visibles ou facilement accessibles sur mobile.

---

### US 6.2 — Ne pas avoir à deviner où cliquer

En tant que  
**utilisateur peu à l’aise avec le web**  
je veux  
**que les zones cliquables soient évidentes**  
afin de  
**ne pas me sentir bête ou perdu**.

**Critères d’acceptation**

- Les cartes de parcours ont :
  - un CTA visible (“Explorer ce parcours”),
  - une affordance claire (hover, focus).
- Les liens textuels importants sont distincts du texte normal.

---
