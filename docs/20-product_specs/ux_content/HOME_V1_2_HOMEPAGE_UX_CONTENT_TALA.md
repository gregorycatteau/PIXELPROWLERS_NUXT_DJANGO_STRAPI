<!--
  Fichier : docs/20-product_specs/ux_content/HOME_V1_2_HOMEPAGE_UX_CONTENT_TALIA.md
  Rôle   : fixer le corpus texte officiel de la homepage V1.2
           pour implémentation Nuxt (HomeHeroSection, HomeJourneysGridSection,
           HomeNowSection, HomeFitAudienceSection, HomeHowWeWorkSection).
  Références fonctionnelles :
  - docs/20-product_specs/functional/HOME_V1_2_SPEC.md
  - docs/20-product_specs/functional/user_stories/homepage_core_user_stories.md
  - docs/20-product_specs/architecture/HOME_V1_2_HOMEPAGE_UX_UI_ARCHITECTURE.md
-->

# HOME V1.2 — Corpus UX homepage (Talia)

Ce document fixe les textes **officiels** de la homepage V1.2.  
Il sert de référence à :

- Rand (affinage éditorial),
- Dan / Heider (intégration UI/UX),
- Codex (mise à jour des composants Nuxt + `ui_texts_schema.json`),
- Eva (vérification cohérence avec la doctrine de souveraineté).

La homepage :

- **n’effectue aucun diagnostic** (tout est déporté sur les parcours P1–P5),
- ne contient **aucun formulaire**,
- rassure par son **positionnement clair** et sa **force tranquille**, pas par des promesses “anonyme / sans compte” explicitées.

---

## 1. S1 — HomeHeroSection

**Composant :** `app/components/home/HomeHeroSection.vue`   
**Rôle :** en 5–8 secondes, l’utilisateur comprend :

- à qui parle PixelProwlers,
- à quoi sert le site,
- qu’il peut **choisir un parcours** ou **comprendre comment on travaille**.

### 1.1. Titre (H1)

> Tu portes un projet utile. Tes structures et tes outils suivent… plus ou moins.

### 1.2. Sous-titre (paragraphe 1–2)

> PixelProwlers est un studio d’architecture numérique souveraine pour assos, SCIC, collectifs et personnes en transition.  
> Ici, tu choisis un parcours adapté à ta situation pour commencer à explorer ce qui coince dans ta structure, tes outils ou ta trajectoire.

### 1.3. CTA principal

Label :

> Choisir un parcours

**Comportement :**

- scroll vers S2 (grille P1–P5),
- déclenchement éventuel de `home_hero_cta_clicked` via `useAnalytics`.   

### 1.4. CTA secondaire (optionnel)

Label :

> Comprendre comment on travaille

**Comportement :**

- scroll vers S5 (section “Comment on travaille, concrètement”).

### 1.5. Microcopy (optionnelle, en dessous du Hero)

> Tu peux simplement parcourir la page et revenir plus tard.  
> Il n’y a rien à préparer, rien à justifier.

---

## 2. S2 — HomeJourneysGridSection (P1–P5)

**Composant :** `app/components/home/HomeJourneysGridSection.vue` (+ éventuel `HomeJourneyCard.vue`)   
**Rôle :** proposer **5 portes d’entrée** alignées sur les story-maps P1–P5, sans entrer dans les questionnaires eux-mêmes.

### 2.1. Titre de section

> Par quoi tu as envie de commencer ?

### 2.2. Sous-titre de section

> Choisis la carte qui se rapproche le plus de ce que tu vis.  
> Tu pourras toujours changer de parcours ensuite.

---

### 2.3. Cartes de parcours — structure

Pour chaque entrée de `homeJourneysConfig.ts`  :

- `title`        → titre de la carte,
- `situation`    → phrase “Tu te reconnais si…”,
- `outcome`      → phrase “Ce que tu obtiens en entrant dans ce parcours”,
- `ctaLabel`     → libellé du bouton (commun : “Explorer ce parcours”).

---

### 2.4. Carte P1 — « Ma structure dysfonctionne »

- **Title**

  > Ma structure dysfonctionne

- **Situation**

  > Réunions lourdes, décisions floues, tensions qui s’installent… et l’impression de tenir la structure à bout de bras.

- **Outcome**

  > Tu poses un diagnostic structuré de tes dysfonctionnements, tu clarifies où ça bloque vraiment et tu repars avec des pistes d’action réalistes.

- **CTA**

  > Explorer ce parcours

---

### 2.5. Carte P2 — « Nos outils numériques nous épuisent »

- **Title**

  > Nos outils numériques nous épuisent

- **Situation**

  > Drive, messageries, tableurs, formulaires… Tu passes plus de temps à jongler entre les outils qu’à faire ton vrai travail.

- **Outcome**

  > Tu cartographies tes outils, tu repères les redondances et tu imagines un outillage plus simple, plus éthique et plus soutenable.

- **CTA**

  > Explorer ce parcours

---

### 2.6. Carte P3 — « Je suis en transition, je ne sais plus comment avancer »

- **Title**

  > Je suis en transition, je ne sais plus comment avancer

- **Situation**

  > Ton job, ta structure ou toi-même ont changé. Tu sens que quelque chose ne colle plus, sans savoir par où prendre le sujet.

- **Outcome**

  > Tu mets à plat ce que tu veux garder, ce que tu veux faire évoluer, et tu ouvres des pistes concrètes pour la suite.

- **CTA**

  > Explorer ce parcours

---

### 2.7. Carte P4 — « J’ai une idée forte, mais je ne sais pas comment la structurer »

- **Title**

  > J’ai une idée forte, mais je ne sais pas comment la structurer

- **Situation**

  > Tu portes une idée qui te tient à cœur, mais tu as du mal à l’expliquer, à embarquer des alliés ou à la rendre concrète.

- **Outcome**

  > Tu clarifies pour qui est ton idée, à quoi elle sert et comment la tester à petite échelle sans tout brûler.

- **CTA**

  > Explorer ce parcours

---

### 2.8. Carte P5 — « Je sais juste que quelque chose doit changer »

- **Title**

  > Je sais juste que quelque chose doit changer

- **Situation**

  > Rien n’est totalement cassé… mais rien n’est vraiment fluide non plus. Tu sens que ça ne peut pas continuer comme ça.

- **Outcome**

  > Tu prends un premier recul pour nommer ce qui coince et tu identifies par quel type de parcours commencer.

- **CTA**

  > Explorer ce parcours

---

## 3. S3 — HomeNowSection  
### « Ce que tu peux faire ici, tout de suite »

**Composant :** `app/components/home/HomeNowSection.vue`   
**Rôle :** clarifier le **bénéfice commun** à tous les parcours, sans détailler les mécaniques internes.

### 3.1. Titre de section

> Ce que tu peux faire ici, tout de suite

### 3.2. Sous-titre (optionnel)

> Quel que soit le parcours que tu choisis, la démarche reste la même : poser les choses, comprendre ce qui se joue, et décider comment avancer à ton rythme.

---

### 3.3. Bloc 1 — « Mettre des mots »

- **Title**

  > Mettre des mots

- **Body**

  > En choisissant un parcours proche de ce que tu vis, tu commences par déplier calmement les situations qui posent problème, sans jargon ni auto-culpabilisation.

---

### 3.4. Bloc 2 — « Y voir plus clair »

- **Title**

  > Y voir plus clair

- **Body**

  > Les écrans de diagnostic et de bilan du parcours t’aident à relier les symptômes entre eux et à comprendre ce qui se passe vraiment dans ta structure, tes outils ou ta trajectoire.

---

### 3.5. Bloc 3 — « Passer à l’action »

- **Title**

  > Passer à l’action

- **Body**

  > À la fin du parcours, tu repars avec des ressources open source et des pistes de travail concrètes, à activer en autonomie — avec la possibilité de nous embarquer plus tard si ça a du sens pour toi.

---

## 4. S4 — HomeFitAudienceSection  
### Quand notre façon de travailler te correspond… et quand ce n’est pas le bon cadre

Cette section présente, en miroir, dans quels contextes PixelProwlers est pertinent, et dans quels contextes ce n’est pas le bon cadre.

#### 4.1. Rapport au diagnostic

- **C’est pour toi si…**  
  Tu veux comprendre avant de “scaler”.  
  Tu préfères prendre un temps pour regarder honnêtement ce qui se passe dans ta structure, tes outils ou ton job, plutôt que rajouter une solution miracle de plus.

- **Ce n’est pas notre cadre si…**  
  Tu veux surtout un résultat visible très vite.  
  Tu cherches d’abord un site, un outil ou une refonte à livrer, sans passer par une phase de diagnostic ou de mise à plat.

---

#### 4.2. Souveraineté numérique

- **C’est pour toi si…**  
  Ta souveraineté numérique est aussi une position politique.  
  Tu utilises peut-être aujourd’hui Google Drive ou d’autres suites propriétaires, mais tu vois bien que cette dépendance a un coût, et tu as envie de t’en dégager progressivement.

- **Ce n’est pas notre cadre si…**  
  Tu n’as aucune envie de questionner tes dépendances numériques.  
  Tu souhaites rester entièrement adossé aux grands acteurs (Google, Meta, etc.), et l’idée même de limiter cette dépendance ne t’intéresse pas.

---

#### 4.3. Rapport au réel (tensions, bricolages, fatigue)

- **C’est pour toi si…**  
  Tu acceptes de regarder le réel tel qu’il est.  
  Conflits, bricolages, fatigue, non-dits : tu préfères les mettre sur la table, calmement, pour avancer à partir de ce qui est vraiment là.

- **Ce n’est pas notre cadre si…**  
  Tu préfères que la communication enjolive le récit.  
  Tu veux surtout que tout paraisse fluide et inspirant vers l’extérieur, sans aborder les tensions, les limites ou les zones d’ombre.

---

#### 4.4. Relation de travail (allié vs exécutant)

- **C’est pour toi si…**  
  Tu cherches un allié exigeant, pas un prestataire docile.  
  Tu attends qu’on t’aide à structurer, documenter et questionner les choix, quitte à ce qu’on te dise parfois “non, ça ne va pas dans ton sens”.

- **Ce n’est pas notre cadre si…**  
  Tu attends d’un prestataire qu’il exécute sans discuter.  
  Tu veux avant tout quelqu’un qui applique tes demandes techniques le plus vite possible, sans remettre en question le sens ou les effets à long terme.

---

#### 4.5. Soutenabilité & transmission

- **C’est pour toi si…**  
  Tu veux que ton système soit transmissible, pas héroïque.  
  Tu veux sortir du modèle où deux personnes tiennent tout à bout de bras, et aller vers des outils et des process que ton équipe peut comprendre, reprendre et faire vivre sans toi.

- **Ce n’est pas notre cadre si…**  
  Tu acceptes que tout repose durablement sur quelques personnes clés.  
  Tant que “ça tourne”, le fait que rien ne soit vraiment documenté ni partageable ne te semble pas être un problème prioritaire.

---

## 5. S5 — HomeHowWeWorkSection  
### « Comment on travaille, concrètement »

**Composant :** `app/components/home/HomeHowWeWorkSection.vue`   
**Rôle :** montrer le **film global** : autonomie → documentation → Fit, sans entrer dans les détails techniques.

### 5.1. Titre de section

> Comment on travaille, concrètement

### 5.2. Sous-titre (optionnel)

> L’idée n’est pas de tout retourner, mais de t’aider à avancer de façon posée, documentée et soutenable.

---

### 5.3. Étape 1 — « Explorer en autonomie »

- **Title**

  > 1. Explorer en autonomie

- **Body**

  > Tu choisis un parcours qui te parle.  
  > Tu explores la page longue traîne, tu utilises les questionnaires et les ressources pour clarifier ta situation, sans compte ni engagement.

---

### 5.4. Étape 2 — « Structurer ce que tu découvres »

- **Title**

  > 2. Structurer ce que tu découvres

- **Body**

  > Si tu en as besoin, tu peux documenter ton diagnostic dans un espace Relinium dédié : un SSOT personnel pour garder une trace, partager avec ton collectif et suivre les évolutions dans le temps.

---

### 5.5. Étape 3 — « Vérifier si on est faits pour travailler ensemble »

- **Title**

  > 3. Vérifier si on est faits pour travailler ensemble

- **Body**

  > Quand le terrain est prêt, tu peux enclencher un échange Fit.  
  > On regarde ensemble si PixelProwlers est la bonne pièce du puzzle pour toi maintenant, ou si d’autres options sont plus justes. Dans tous les cas, l’objectif est que tu repartes avec plus de clarté que lorsque tu es arrivé·e.

---

## 6. Garde-fous émotionnels & sécurité (rappel, version homepage)

Ces règles complètent les **invariants émotionnels** déjà posés pour P1–P5  :

- On parle **du système**, pas de la valeur des personnes.
- Aucun texte de la home ne promet “anonyme / sans compte / sans inscription” :  
  ces engagements sont tenus **par le design** (aucun formulaire, aucun diagnostic sur la home) et détaillés ailleurs.
- Aucun ton dramatique : on nomme le réel (fatigue, tensions, bricolages) sans le surjouer.
- Chaque section laisse entrevoir la possibilité de :
  - **rester en autonomie**,  
  - **revenir plus tard**,  
  - ou **aller plus loin** uniquement si la personne le décide.
- Aucun appel à l’action n’est rédigé sur le mode de la peur ou de l’urgence (“si tu ne cliques pas, tout va s’effondrer”).

---

## 7. Notes pour Codex / intégration

- Tous les textes ci-dessus doivent être :
  - injectés dans les composants `Home*` (props + slots),
  - référencés dans `docs/ui_texts_schema.json` avec des clés explicites
    (`app/components/home/HomeHeroSection.vue:text_X`, etc.).
- `homeJourneysConfig.ts` doit exposer, pour chaque P1–P5 :
  - `id`, `slug`, `title`, `situation`, `outcome`, `ctaLabel`,
  - avec les valeurs de ce document comme **source de vérité**.
- Aucune logique métier, aucun tracking fin, aucun stockage client ne doit être ajouté en dehors de ce qui est prévu dans :
  - `HOME_V1_2_HOMEPAGE_UX_UI_ARCHITECTURE.md`,
  - `HOME_V1_2_SPEC.md`,
  - la stack sécurité (SECURITY_INDEX & associés).

Fin du corpus homepage V1.2 (Talia).
