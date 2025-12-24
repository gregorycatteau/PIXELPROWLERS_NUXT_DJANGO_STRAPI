---
id: HOME_V1_2_HOMEPAGE_UX_UI_ARCHITECTURE
version: 1.0.0
status: archived
date: 2025-12-24
owners: ["Dan"]
scope: ["docs/30-tech_specs/**"]
tags: ["tech_specs", "architecture"]
---

## 1. Contexte & périmètre

### 1.1. Rappel des sources fonctionnelles

Cette architecture frontend de la homepage V1.2 s’appuie sur :

- `docs/20-product_specs/functional/HOME_V1_2_SPEC.md`  
  → définit le **rôle produit** de la homepage, la structure cible en sections S1–S6 et la place de la home dans l’écosystème PixelProwlers (page d’atterrissage principale, pas page de diagnostic).

- `docs/20-product_specs/functional/user_stories/homepage_core_user_stories.md`  
  → liste les **user stories cœur** de la homepage (compréhension en 5–8 s, identification dans un parcours P1–P5, premiers gestes possibles, filtrage “pour qui / pas pour qui”, compréhension du mode de collaboration).

L’architecture décrite ici est **strictement dérivée** de ces deux documents.  
Elle ne fige **aucun texte** (copy) : la rédaction finale est du ressort de Talia (UX émotionnelle / CRO).

### 1.2. Objectif de la homepage V1.2 (vu UX/UI)

La homepage V1.2 n’est plus une vitrine “générale floue”.  
Elle devient une **piste d’atterrissage claire** qui permet à un utilisateur de :

1. Comprendre en 5–8 secondes :
   - à qui s’adresse PixelProwlers,
   - à quoi sert le site.

2. S’identifier rapidement dans **un des 5 parcours P1–P5** :
   - P1 : Ma structure dysfonctionne  
   - P2 : Nos outils numériques nous épuisent  
   - P3 : Je suis en transition, je ne sais plus comment avancer  
   - P4 : J’ai une idée forte, mais je ne sais pas comment la structurer  
   - P5 : Je sais juste que quelque chose doit changer  

3. Voir **ce qu’il peut faire ici, maintenant** (explorer un parcours, comprendre la logique, éventuellement se projeter plus tard vers Relinium / Fit).

Toute la pédagogie détaillée (souveraineté, sécurité, Relinium, Fit, etc.) est déplacée vers :

- les pages de parcours (P1–P5),
- la page **À propos**,
- la documentation / sections dédiées.

---

## 2. Technologies et conventions frontend

### 2.1. Cadre technique

- **Framework** : Nuxt 3.17 (mode SPA/SSR conforme au reste du projet).
- **Langage** : TypeScript, Composition API (`<script setup lang="ts">`).
- **CSS** : TailwindCSS v4, avec :
  - un design system maison centralisé dans `frontend_nuxt/app/assets/css/main.css`,
  - usage systématique de `@apply` dans les `<style scoped>` des composants.

### 2.2. Layout & routing

- **Layout utilisé** : `frontend_nuxt/app/layouts/default.vue` :
  - header global + navigation (desktop + menu mobile accessible),
  - fond sombre + background étoilé,
  - footer global (liens légaux / navigation secondaire).

- **Route de la homepage** :
  - fichier : `frontend_nuxt/app/pages/index.vue`
  - rôle :
    - orchestrer les sections S1–S6,
    - ne pas porter de logique métier lourde (ni diagnostic, ni stockage),
    - déléguer l’UX/UI aux composants situés dans `app/components/home/`.

### 2.3. Composants & design system

- Les composants dédiés à la homepage résident dans :
  - `frontend_nuxt/app/components/home/`

- La homepage exploite :
  - les tokens et utilitaires globaux déjà définis dans `main.css` (typographie, cards, CTA, focus ring),
  - une **sous-couche de styles “home”** décrite en section 4 (classes CSS spécifiques à la page d’accueil).

---

## 3. Architecture de la homepage (S1–S6 → fichiers Nuxt)

### 3.1. Mapping sections → composants

La structure cible décrite dans `HOME_V1_2_SPEC.md` (S1–S6) est traduite côté frontend comme suit :

- **S1 – Hero (“Tu portes un projet utile…”)**  
  → `frontend_nuxt/app/components/home/HomeHeroSection.vue`

- **S2 – Grille des parcours P1–P5 (“Par quoi tu veux commencer ?”)**  
  → `frontend_nuxt/app/components/home/HomeJourneysGridSection.vue`  
  (avec, si besoin, un sous-composant `HomeJourneyCard.vue`).

- **S3 – “Ce que tu peux faire ici, tout de suite”**  
  → `frontend_nuxt/app/components/home/HomeNowSection.vue`  
  (3 blocs : “mettre des mots”, “y voir plus clair”, “passer à l’action”).

- **S4 – “Pour qui c’est fait / pas fait”**  
  → `frontend_nuxt/app/components/home/HomeFitAudienceSection.vue`

- **S5 – “Comment on travaille, si tu le décides plus tard”**  
  → `frontend_nuxt/app/components/home/HomeHowWeWorkSection.vue`

- **S6 – Footer/navigation**  
  → pas de composant spécifique : utilisation du footer global dans `layouts/default.vue`.  
  La homepage se contente de s’assurer que :
  - le footer expose les liens clés (“À propos”, “Parcours”, “Relinium”, “Ressources/Blog”),
  - aucune duplication de promesses fortes (souveraineté, privacy) n’est introduite ici.

### 3.2. Page orchestratrice

- **`frontend_nuxt/app/pages/index.vue`** :

  - **Responsabilités** :
    - instancier et ordonner les sections S1–S5,
    - transmettre la configuration des parcours P1–P5 à `HomeJourneysGridSection`,
    - connecter les événements de haut niveau (clics CTA, clics cartes) aux analytics via `useAnalytics`.

  - **Non-responsabilités** :
    - ne pas calculer de diagnostic,
    - ne pas gérer de stockage client (localStorage, etc.),
    - ne pas intégrer de logique Relinium / Fit (simple redirection vers les pages dédiées).

---

## 4. Design system “home” (CSS & tokens)

### 4.1. Emplacement

Les classes globales spécifiques à la homepage sont définies dans :

- `frontend_nuxt/app/assets/css/main.css`

Dans un bloc clairement identifié, par exemple :

```css
/* === Homepage (HOME_V1_2) ============================ */
.home-shell { @apply ...; }
.home-section { @apply ...; }
.home-hero { @apply ...; }
/* etc. */
4.2. Types de classes
Structure / layout :

.home-shell : conteneur principal de la page d’accueil (max-width, padding horizontal, espacement vertical global).

.home-section : bloc générique pour chaque section S1–S5 (margin-top/bottom, spacing responsive).

.home-section-title / .home-section-subtitle : titres de niveau H2/H3, alignés avec la typographie globale.

Composants récurrents :

.home-hero : style du Hero (fond éventuel, grille responsive texte + illustration).

.home-journeys-grid : layout de la grille P1–P5 (grid responsive).

.home-journey-card : style de base des cartes parcours (repose sur .pp-card mais ajoute les micro-interactions propres à la home).

.home-now-grid : layout 3 colonnes (S3).

.home-fit-grid : layout binaire “pour qui / pas pour qui”.

.home-how-grid : layout en 3 étapes (“comment on travaille”).

CTAs :

.home-cta-primary : CTA principal (Hero + éventuellement CTA de grille).

.home-cta-secondary : CTA secondaire (ex. lien vers S5).

Ces classes réutilisent les patterns déjà définis pour les CTA du site (focus ring, hover, transitions), en les adaptant au rôle central de la homepage.

4.3. Accessibilité & focus
Les classes “home” doivent intégrer :

un état :focus-visible cohérent (anneau clair + offset) pour :

les CTA,

les cartes cliquables (cartes P1–P5),

les liens internes.

une hiérarchie typographique claire pour les titres de sections, alignée sur les recommandations fonctionnelles (H1 unique, H2 par section fonctionnelle, H3 pour les sous-blocs).

5. Données de configuration & analytics
5.1. Aucun diagnostic sur la home
Conformément aux deux documents fonctionnels :

La homepage ne réalise aucun diagnostic :

pas de Q1/Q2,

pas de stockage de réponses,

pas de bilans.

Toute logique de diagnostic reste confinée aux parcours (P1–P5), qui exploitent leurs propres composables (journey engine, diagnostics, stockage).

5.2. Configuration des cartes P1–P5
Les cartes P1–P5 sont configurées à partir d’une structure simple, idéalement définie dans un fichier de configuration dédié :

frontend_nuxt/app/config/homeJourneysConfig.ts

Contenu typique : un tableau/objet décrivant les 5 parcours :

id (p1…p5),

slug (pour les routes /parcours/...),

placeholders pour :

le titre de carte,

la phrase de situation de départ,

la phrase “ce que tu obtiens”.

Les valeurs textuelles définitives seront fournies par Talia.
L’architecture se contente de poser la structure et les types.

5.3. Analytics (coarse, home uniquement)
La homepage utilise le composable :

frontend_nuxt/app/composables/useAnalytics.ts

avec des événements coarse, par exemple :

home_hero_cta_clicked :

déclenché lorsque l’utilisateur clique sur le CTA principal du Hero.

home_journey_card_clicked :

déclenché sur clic d’une carte P1–P5,

payload minimal :

journey_id (p1…p5),

origin (ex. "home_grid").

éventuellement home_now_block_clicked :

si des liens spécifiques sont présents dans S3.

Contraintes :

aucun event ne doit contenir :

de texte brut de l’utilisateur (il n’y en a pas sur la home),

de données ré-identifiantes,

des dérivés du diagnostic (non applicable sur la home).

tous les events sont envoyés via useAnalytics (aucun appel direct à un SDK tiers dans les composants).

6. Détails par composant
6.1. app/pages/index.vue
Responsabilités :

importer et ordonner S1–S5,

injecter la configuration P1–P5 dans HomeJourneysGridSection,

connecter les callbacks de clic aux événements analytics.

API interne (pseudo-code indicatif) :

ts
Copier le code
const { track } = useAnalytics()
const journeys = useHomeJourneysConfig()

const onHeroCtaClick = () => {
  track('home_hero_cta_clicked')
  // scroll vers S2
}

const onJourneyClick = (journeyId: HomeJourneyId) => {
  track('home_journey_card_clicked', { journey_id: journeyId, origin: 'home_grid' })
  navigateTo(`/parcours/${journeys[journeyId].slug}`)
}
6.2. HomeHeroSection.vue
Responsabilités :

afficher H1 + sous-titre + CTA principal (textes fournis par Talia),

éventuellement un CTA secondaire (ancre S5).

Props (indicatif) :

title: string

subtitle: string

primaryCtaLabel: string

secondaryCtaLabel?: string

Événements :

cta-primary-click

cta-secondary-click (optionnel)

UX :

CTA principal scrolle vers S2,

heading H1 unique de la page.

6.3. HomeJourneysGridSection.vue (+ HomeJourneyCard.vue)
Responsabilités :

afficher la grille des 5 parcours P1–P5,

porter le texte chapeau de la section.

Props :

journeys: HomeJourneyConfig[]

title: string

subtitle?: string

Événements :

journey-click avec payload { journeyId: HomeJourneyId }.

Règles UX :

chaque carte est un bouton ou un NuxtLink entier, focusable,

état hover/focus visible,

navigation clavier fluide.

6.4. HomeNowSection.vue
Responsabilités :

présenter 3 blocs “Ce que tu peux faire ici, tout de suite”.

Props :

tableau de 3 items (titre + texte + éventuellement lien).

Événements :

callbacks de clic optionnels pour analytics.

6.5. HomeFitAudienceSection.vue
Responsabilités :

afficher deux colonnes “Pour qui c’est fait / pas fait”.

Props :

deux listes d’items (copy fournie par Talia).

UX :

ton neutre, non culpabilisant,

lisibilité forte sur mobile.

6.6. HomeHowWeWorkSection.vue
Responsabilités :

décrire le “comment on travaille” en 3 étapes :

exploration autonome via parcours,

documentation (Relinium),

vérification de fit (Fit).

Props :

liste d’étapes (titre + description).

Événements :

clics éventuels vers “À propos”, “Relinium”, “Fit”.

7. Accessibilité & ergonomie homepage
La homepage applique les mêmes principes d’accessibilité que le parcours P1, adaptés à son rôle :

Structure sémantique :

<main> unique pour le contenu central,

H1 dans HomeHeroSection,

H2 pour chaque grande section S1–S5,

H3 pour les sous-blocs internes.

Navigation clavier :

skip-link déjà présent dans default.vue,

focus visible sur :

CTA,

cartes P1–P5,

liens internes.

Texte & lisibilité :

tailles de police et line-height adaptées à des utilisateurs en situation de fatigue,

contrastes conformes à la palette accessible existante.

8. Sécurité & privacy (vue homepage)
Même si la homepage n’est pas une surface critique du point de vue diagnostic, elle respecte la doctrine globale :

Aucun champ de formulaire / input utilisateur sur la home.

Aucun stockage client (localStorage, sessionStorage, IndexedDB) lié à la home.

Analytics :

uniquement des événements coarse,

uniquement via useAnalytics,

aucune exploitation détournée pour reconstruire un comportement fin.

Les détails complets sur la sécurité/OPSEC restent décrits dans :

docs/40-security/ARCHITECTURE_SECURITE.md

docs/40-security/SECURITY_GATES.md

docs/40-security/MODELES_DE_MENACES.md

9. Évolutivité (P2–P5 & futures versions)
Cette architecture est conçue pour être :

Stable pour la V1.2 de la home : les composants Home* sont centrés sur l’orientation vers les parcours.

Évolutive :

ajout de nouveaux parcours (P6, etc.) possible via homeJourneysConfig.ts,

réorganisation de l’ordre des sections S1–S5 possible sans refonte profonde (grâce au découpage par composants).

Toute évolution de la home (V1.3, V2.0, etc.) devra :

partir des specs produit mises à jour dans :

HOME_V1_2_SPEC.md (ou versions ultérieures),

homepage_core_user_stories.md (ou équivalent),

adapter ce document d’architecture en conséquence, pour garder le SSOT aligné.


