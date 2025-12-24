---
id: SPRINT0_FILES_FOR_SEO
version: 1.0.0
status: draft
date: 2025-12-24
owners: ["Rand", "Julien"]
scope: ["docs/70-seo/**"]
tags: ["seo"]
---

# Fichiers utiles pour le travail SEO

| Chemin relatif | Rôle pressenti | Priorité |
| --- | --- | --- |
| frontend_nuxt/nuxt.config.ts | Configuration globale, head par défaut (title/description/lang). Point d’entrée pour metas et OG. | Haute |
| frontend_nuxt/app/layouts/default.vue | Layout général (header nav, footer liens légaux, fond). Impact navigation interne et structure H1/Hn possibles. | Haute |
| frontend_nuxt/app/pages/index.vue | Landing principale orchestrant toutes les sections marketing et les parcours. | Haute |
| frontend_nuxt/app/components/home/HeroSection.vue | Hero, H1 principal, parcours d’entrée, CTA principaux. | Haute |
| frontend_nuxt/app/components/home/RecognitionSection.vue | Étape 2, cartes de situations (copy riche, badges), CTA secondaires. | Haute |
| frontend_nuxt/app/components/home/AxesSection.vue | Section « Trois axes » (proposition de valeur structurée). | Moyenne |
| frontend_nuxt/app/components/home/TimelineSection.vue | Méthode en 4 étapes (éléments de preuve/process). | Moyenne |
| frontend_nuxt/app/components/home/FitSection.vue | Arguments d’adéquation / anti-fit (filtrage leads). | Moyenne |
| frontend_nuxt/app/components/home/ManifestoSection.vue | Manifeste détaillé (copy longue utile pour tonalité et mots-clés). | Moyenne |
| frontend_nuxt/app/components/home/ContactSection.vue | Formulaire de contact + messages de confiance. Lien avec backend `api/contact/`. | Haute |
| frontend_nuxt/app/pages/accompagnement-formation.vue | Page offres/formations (3 formats, durées). | Haute |
| frontend_nuxt/app/pages/a-propos.vue | Présentation studio + piliers. | Haute |
| frontend_nuxt/app/pages/relinium.vue | Labo interne (services/innovations, Strapi, ateliers, DS). | Moyenne |
| frontend_nuxt/app/pages/mentions-legales.vue | Page légale placeholder (à compléter). | Moyenne |
| frontend_nuxt/app/pages/confidentialite.vue | Politique confidentialité (brouillon). | Moyenne |
| frontend_nuxt/app/assets/css/main.css | Thème, tokens, styles CTA/cartes/sections (impact sur cohérence visuelle et microcopie). | Moyenne |
| frontend_nuxt/public/mainhero.png | Image Hero (alt text déjà présent, utile pour OG éventuels). | Secondaire |
| frontend_nuxt/app/composables/useAnalytics.ts | Tracking interne (événements CTA/formulaire), pourra intégrer analytics SEO/ads. | Secondaire |
| frontend_nuxt/app/composables/useCtaVariant.ts | A/B wording CTA (influence sur copy tests). | Secondaire |
| frontend_nuxt/docs/ENVIRONMENTS.md, PHASES_DEV.md | Contexte d’environnement/déploiement si besoin de savoir où injecter metas. | Secondaire |
