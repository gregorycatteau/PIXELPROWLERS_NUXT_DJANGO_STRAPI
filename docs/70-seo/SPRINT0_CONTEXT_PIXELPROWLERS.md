---
id: SPRINT0_CONTEXT_PIXELPROWLERS
version: 1.0.0
status: draft
date: 2025-12-24
owners: ["Rand", "Julien"]
scope: ["docs/70-seo/**"]
tags: ["seo"]
---

# Sprint 0 – Contexte PixelProwlers

## Architecture frontend (Nuxt/Tailwind)
- Nuxt 4 avec `srcDir: app`, TailwindCSS v4 importé via `@tailwindcss/vite` (`nuxt.config.ts`).
- Layout unique `app/layouts/default.vue` : header sticky (logo + nav vers Accueil, À propos, Relinium, Accompagnement & formation, Mentions, Confidentialité), footer simple. Fond dégradé/étoiles défini ici.
- Pages Nuxt actuellement déclarées : `index.vue` (landing principale), `a-propos.vue`, `relinium.vue`, `accompagnement-formation.vue`, `mentions-legales.vue`, `confidentialite.vue`.
- Composants principaux de la landing dans `app/components/home/` : `HeroSection`, `RecognitionSection`, `AxesSection`, `TimelineSection`, `FitSection`, `ManifestoSection`, `ContactSection`.
- Thème/DS minimal dans `app/assets/css/main.css` (tokens couleur, typo Space Grotesk/Manrope, cartes, CTA, badges, formulaire).
- Assets publics : image `public/mainhero.png` utilisée dans le Hero.

## Pages business clés
- Accueil (`app/pages/index.vue`) : landing complète structurée en 7 sections (Hero avec parcours, reconnaissance de situations, axes d’accompagnement, 4 étapes de méthode, adéquation « fit », manifeste, formulaire de contact).
- Accompagnement & formation (`app/pages/accompagnement-formation.vue`) : trois offres synthétiques (diagnostic rapide, sprint cadrage, accompagnement 4–6 semaines) avec durées.
- À propos (`app/pages/a-propos.vue`) : présentation du studio et trois piliers (clarté éditoriale, produit léger, transmission).
- Relinium (`app/pages/relinium.vue`) : labo interne (composants Strapi, ateliers courts, design system minimal, automations).
- Mentions légales & Confidentialité : pages placeholder indiquant que le projet est en préfiguration.

## Ton et positionnement perçus
- Tutoiement, ton empathique et déculpabilisant (« on ne te juge pas », « compatible avec ta fatigue »).
- Cible : collectifs, assos, SCIC, tiers-lieux, porteurs de projets en tension ; recherche d’un partenaire qui clarifie et documente plutôt qu’une « agence magique ».
- Promesse : clarté éditoriale, simplification des outils, documentation/transmission. Mise en avant de formats courts, regard extérieur honnête, possibilité de dire stop.
- Copie orientée symptômes concrets (réunions lourdes, outils épuisants) et rassurance (premier échange offert, pas de newsletter cachée, pas de revente de données).

## Signaux SEO on-page visibles
- Métadonnées globales dans `nuxt.config.ts` : `<title>PixelProwlers</title>`, `lang="fr"`, meta viewport, charset, description générique « PixelProwlers — studio pluriactif ». Aucune méta spécifique par page ou par section.
- Aucune utilisation actuelle de `useHead`/`definePageMeta` pour titres/descriptions uniques, pas d’OG/Twitter cards, pas de balises `link rel="canonical"`, pas de schéma JSON-LD.
- Structure sémantique côté contenu : H1 dans chaque page secondaire (`SectionTitle`), H1 dans le Hero de la landing (« Salut… aujourd’hui, tu en es où… »). Sections avec h2/h3 explicites, listes et paragraphes riches.
- Navigation claire et crawlable (NuxtLink), footer avec liens légaux. Formulaire de contact natif avec messages d’état, pas de captcha.
- Tracking léger côté client via `app/composables/useAnalytics.ts` (console + store debug, pas d’intégration externe renseignée) et A/B de CTA via `useCtaVariant` (variant stocké en sessionStorage).

## Observations de contenu / structure éditoriale
- Parcours d’entrée (journeys) définis en dur dans `app/pages/index.vue` (5 profils, titres + tagline + highlight) réutilisés dans Hero et cartes de reconnaissance : bon point pour scénariser des landing dérivées.
- Sections « Axes », « Timeline », « Fit », « Manifeste » fournissent déjà du texte long (bon matériau SEO), mais tout est dans les composants Vue et non externalisé (pas encore de source CMS).
- Pages légales marquées comme temporaires ; aucune info société/contact publiée.
- Thème sombre avec vocabulaire nuit/dégradé, design soigné déjà prêt pour une landing unique ; pas encore de blog/ressources ni de pages secteurs/offres détaillées.

## Questions ouvertes pour Rand
- Souhaite-t-on définir des meta titres/descriptions uniques par page dès maintenant (notamment pour Accueil, Accompagnement, À propos) et ajouter OG/Twitter cards ?
- Les parcours (journeys) doivent-ils conduire à des pages/sections dédiées ou à des contenus personnalisés (copy, FAQ, formulaires filtrés) ?
- Faut-il préparer des pages supplémentaires (blog/ressources, études de cas, secteurs, offres détaillées) pour soutenir le positionnement et les entrées SEO longue traîne ?
- Quelle promesse/formulation est prioritaire pour le H1 global de la landing : la question actuelle ou une promesse plus explicite pour l’intention « studio web/UX/SEO pour collectifs » ?
- Le formulaire envoie vers `config.public.apiBase/api/contact/` : faut-il ajouter transparence RGPD (durée de conservation, hébergement, destinataire) et un plan B sans JS ?
