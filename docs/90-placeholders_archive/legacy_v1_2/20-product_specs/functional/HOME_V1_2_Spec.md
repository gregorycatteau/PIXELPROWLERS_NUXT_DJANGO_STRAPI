<!-- 20-product_specs/functional/HOME_V1_2_SPEC.md -->

# HOME V1.2 — Spécification fonctionnelle de la page d’accueil

## 1. Contexte & rôle de la homepage

La page d’accueil de PixelProwlers est la **piste d’atterrissage principale**.  
Son rôle n’est pas de tout expliquer, mais de :

- Situer immédiatement **à qui** on parle (porteurs de projets à valeur sociale / écologique / humaine).
- Faire sentir que l’on traite de **vrais problèmes de structure et d’outillage**, pas de “growth hacking”.
- Orienter l’utilisateur vers **un parcours adapté** (P1–P5) en quelques secondes.
- Ouvrir la porte à une relation plus profonde (Relinium, Fit, accompagnement) **uniquement plus tard**, via les parcours et les pages dédiées.

La homepage **n’est pas** le lieu pour :
- détailler la politique de souveraineté des données,
- “se justifier” sur l’éthique,
- ou décrire tous les services en profondeur.

Ces éléments vivent dans :
- les **parcours** (`/parcours/<slug>`),
- la page **À propos**,
- les specs Relinium / Fit.

---

## 2. Objectifs produit

### 2.1 Objectifs principaux

1. **Compréhension en 5–8 secondes**
   - L’utilisateur doit pouvoir répondre à :
     - “De quoi parle ce site ?”
     - “Qu’est-ce que je peux faire maintenant dessus ?”

2. **Projection personnelle**
   - L’utilisateur doit se reconnaître dans **au moins un des 5 parcours** proposés.
   - Il doit percevoir que **son cas est légitime** (pas trop petit, pas trop “cassé”).

3. **Action claire**
   - L’utilisateur doit être incité à :
     - cliquer sur **un parcours** (P1–P5)  
       **ou**
     - scroller pour comprendre “comment on travaille”.

4. **Signal de positionnement**
   - Faire comprendre que PixelProwlers :
     - travaille avec des projets à **valeur sociale / écologique / humaine**,  
     - refuse la logique “spéculative / extractive”.

### 2.2 Objectifs secondaires

- Introduire en douceur les concepts :
  - **Parcours d’entrée** (P1–P5),
  - **Diagnostiques structurés**,
  - **Outillage éthique**,
  - **Accompagnement humain**.
- Donner envie de revenir, même si ce n’est pas “le bon moment”.

---

## 3. Publics & problèmes adressés

### 3.1 Public cible

- Personnes qui :
  - portent un projet utile (asso, SCIC, collectifs informels, petites structures engagées, individus en transition),
  - se sentent **débordées** par leurs structures, leurs outils, ou leur trajectoire personnelle,
  - ont déjà été déçues par des approches “one shot” ou “success story” creuses.

### 3.2 Problèmes de départ

- “Ma structure dysfonctionne, je ne sais plus quoi faire.”
- “Nos outils numériques nous fatiguent plus qu’ils ne nous aident.”
- “Je suis en transition, je ne sais pas comment articuler mes envies et ma réalité.”
- “J’ai une idée forte, mais je ne sais pas par où la prendre.”
- “Je sais juste que quelque chose doit changer, sans savoir quoi.”

La homepage doit **refléter ces situations** sans entrer dans les détails : les détails sont traités dans les parcours.

---

## 4. Structure fonctionnelle de la page

La page est découpée en **sections fonctionnelles** (S1–S6).

### S1. Hero — “Tu portes un projet, le reste suit… plus ou moins”

**Rôle :** installer le cadre en 5–8 secondes.

- Contenu attendu :
  - `H1` : formulation à travailler avec Rand, dans l’esprit :
    - “Tu portes un projet utile. Tes structures et tes outils suivent… plus ou moins.”
  - Sous-titre (2–3 lignes) :
    - à qui on parle,
    - ce que l’on propose en une phrase (diagnostic, clarté, outils, accompagnement).
  - CTA principal :
    - “Choisir un parcours” → ancre vers la section S2.
  - Option secondaire :
    - ancre discrète “Comprendre comment on travaille” → section S5.

**Contraintes :**

- ❌ Aucun micro-texte de type “diagnostic anonyme”, “sans compte”, “sans inscription”.
- ❌ Pas de double CTA “Contact” en Hero.
- ✅ Ton : calme, lucide, pas dramatique.

---

### S2. Grid des parcours P1–P5 — “Par quoi tu veux commencer ?”

**Rôle :** proposer **5 portes d’entrée claires**, alignées avec les story-maps P1–P5.

- Titre :
  - “Par quoi tu as envie de commencer ?”
- 5 cartes (ou tuiles) cliquables, chacune avec :
  - Un titre de parcours :
    - P1 : “Ma structure dysfonctionne”
    - P2 : “Nos outils numériques nous épuisent”
    - P3 : “Je suis en transition, je ne sais plus comment avancer”
    - P4 : “J’ai une idée forte, mais je ne sais pas comment la structurer”
    - P5 : “Je sais juste que quelque chose doit changer”
  - 1 phrase “situation de départ” (tu te reconnais si…).
  - 1 phrase “ce que tu obtiens” en entrant (diagnostic + bilan + ressources).
  - CTA : “Explorer ce parcours” → route `/parcours/<slug>`.

**Contraintes :**

- Chaque carte doit :
  - refléter la **story-map** du parcours concerné,
  - utiliser le **slug officiel** du parcours,
  - rester neutre (pas de promesse de transformation miracle).

---

### S3. “Ce que tu peux faire ici, tout de suite”

**Rôle :** clarifier le **bénéfice commun** à tous les parcours.

- Titre :
  - “Ce que tu peux faire ici, tout de suite.”
- 3 blocs (ou colonnes), communs P1–P5 :
  1. **Mettre des mots**
     - Diagnostic structuré, simple, sans jargon.
  2. **Y voir plus clair**
     - Bilans lisibles, adaptés à ta situation.
  3. **Passer à l’action**
     - Ressources activables en autonomie,  
       possibilité d’aller plus loin avec nous **plus tard**, si ça fait sens.

**Contraintes :**

- ❌ Pas de détail sur la techno (localStorage, VUCA, etc.).
- ✅ Focalisé sur le **résultat concret** pour l’utilisateur.

---

### S4. “Pour qui c’est fait (et pour qui ça ne l’est pas)”

**Rôle :** filtrer doucement les visiteurs.

- Titre possible :
  - “Pour qui PixelProwlers est fait (et pour qui ça l’est moins).”
- Structure :
  - Colonne gauche : “Tu es au bon endroit si…”
    - projet à fort enjeu social / écologique / humain,
    - volonté d’explorer en profondeur, pas juste “un site vite fait”,
    - ouverture à se remettre en question.
  - Colonne droite : “Ce n’est pas notre terrain si…”
    - projets purement spéculatifs / extractifs,
    - recherche de “performances à tout prix”,
    - demande de hacks opaques / manipulatifs.

**Contraintes :**

- Ton : factuel, non moralisateur.
- Objectif : **économiser du temps** des deux côtés.

---

### S5. “Comment on travaille (si tu le décides plus tard)”

**Rôle :** esquisser le **process général PixelProwlers** sans détailler toutes les étapes.

- Titre :
  - “Comment on bosse avec toi, si tu le décides plus tard.”
- 3 étapes simples :
  1. **Tu explores en solo**
     - Tu utilises les parcours et les ressources en autonomie.
  2. **Tu documentes**
     - Si tu veux aller plus loin, tu peux structurer ta démarche (Relinium).
  3. **On voit si on est un bon fit**
     - Si tu veux travailler avec nous, on passe par un tunnel Fit (on peut dire non, tu peux dire non).

**Contraintes :**

- Relinium / Fit :
  - simplement mentionnés,
  - les **contrats de données** et détails vivent ailleurs (pages dédiées / docs).

---

### S6. Footer & navigation

**Rôle :** permettre l’accès rapide aux zones clés.

- Liens attendus :
  - À propos
  - Relinium
  - Parcours (ou ancre vers S2)
  - Blog / Ressources (quand ils seront en place)
  - Mentions légales, confidentialité

**Contraintes :**

- Ton sobre.
- Pas de duplication des promesses de souveraineté ici (elles vivent dans la page À propos et les pages produits).

---

## 5. Comportements & interactions

- Le CTA “Choisir un parcours” (Hero) scrolle vers S2.
- Chaque carte de parcours ouvre :
  - `/parcours/<journeySlug>` avec :
    - `journeySlug` cohérent avec la spec des parcours (P1–P5).
- Il n’existe **aucun formulaire** sur la homepage dans cette V1.2.
- Aucun onboarding forcé, aucune modale bloquante.

---

## 6. Tracking & KPIs (coarse)

### 6.1 Événements autorisés (homepage)

- `home_view`
- `home_scroll_depth` (buckets : 25 / 50 / 75 / 100 %)
- `home_parcours_card_click` avec propriétés :
  - `journey_id` (p1…p5)

### 6.2 KPIs prioritaires

- % de visiteurs qui voient la section S2.
- % de clics sur au moins une carte de parcours.
- Répartition des clics par parcours.

### 6.3 Contraintes

- ❌ Aucun identifiant stable utilisateur.
- ❌ Aucun contenu de diagnostic (logique P1–P5) sur la homepage.
- ✅ Analytics désactivables par configuration globale.

Les détails d’analytics sont alignés avec `docs/security/MODELES_DE_MENACES.md` et `POLITIQUES_OPSEC_PRIVACY.md`.

---

## 7. Non-objectifs

La homepage V1.2 **ne fait pas** :

- de génération de leads directe (pas de formulaire de contact en Hero),
- de promesse juridique détaillée (RGPD, etc.),
- de description complète des offres (Clarifier / Outiller / Accompagner) — ces blocs vivent sur d’autres pages.

---

## 8. Contraintes UX/UI

- Respect de l’identité visuelle PixelProwlers (dark, sobre, pas criard).
- Mobile first, avec :
  - héro lisible sur petit écran,
  - cartes de parcours scrollables confortablement.
- Accessibilité :
  - titres hiérarchisés (H1 unique),
  - CTA focusables,
  - contrastes conformes à la charte existante.

---

## 9. Contraintes sécurité & privacy

- La homepage **ne collecte aucune donnée personnelle**.
- Aucun champ texte libre.
- Aucun cookie non essentiel côté frontend lié à cette page.
- Les engagements forts de souveraineté :
  - sont tenus par **le fonctionnement réel** (pas de login, pas de champ perso),
  - sont détaillés dans À propos / specs, pas dans le Hero.

---

## 10. Critères de “Done” — HOME V1.2

- Un utilisateur “froid” peut, en <10 secondes :
  - dire de quoi parle le site,
  - montrer du doigt une carte de parcours adaptée à sa situation.
- Maël (et d’autres cobayes) ne remontent plus “l’offre est floue”.
- Chaque carte de parcours :
  - correspond à une story-map existante P1–P5,
  - mène à la bonne route `/parcours/<slug>`.
- Aucun texte de réassurance superflu type “anonyme, sans compte, pas de vente forcée” sur la homepage.
- Les événements de tracking sont strictement limités à ceux listés ci-dessus.
- La spec de la home est référencée dans la roadmap V1.2.
