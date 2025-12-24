---
id: PIXELPROWLERS_V1_2_GAPS_ET_PHASES
version: 1.0.0
status: archived
date: 2025-12-24
owners: ["Marty"]
scope: ["docs/10-vision_roadmap/**"]
tags: ["roadmap", "vision"]
---

# PixelProwlers V1.2 — Parcours longue traîne : gaps et phasage

## 1) État des lieux rapide (V1 en place)
- Front Nuxt statique : landing `/` avec parcours pré-définis, sections Fit/Manifeste, pages `/accompagnement-formation`, `/a-propos`, `/relinium`, `/mentions-legales`, `/confidentialite`. Aucune page longue traîne ou route dynamique de parcours.
- Formulaire de contact opérationnel (POST `/api/contact/` côté Django), validation inline, promesse de sobriété déjà visible, honeypot antibot. Pas d’autre interaction complexe.
- Composables réutilisables : `useCurrentJourney` (sélection de parcours), `useAnalytics` (console + store debug), styles/tokens Tailwind 4 déjà en place.
- Tracking minimal : événements `journey_selected`, `journey_cta_clicked`, `contact_submit_success/error` uniquement. Pas de plan d’events pour questionnaires, ressources ou Fit.
- Backend : seul endpoint contact exposé, pas de modèle pour diagnostics, ressources ou comptes. Strapi est vierge (aucun content-type), prévu mais non branché au front.

## 2) Écart V1.2 vs code actuel
- Double questionnaire (dysfonctionnements + VUCA) : inexistant (ni UI, ni logique, ni stockage local). Pas de moteur de scoring ou de génération de bilans.
- Bilans visuels/téléchargeables : aucune infrastructure de rendu (graphique, PDF/PNG) ni export local.
- Sélection dynamique de ressources open source : pas de source de données (Strapi/JSON), pas de service d’appariement réponses → ressources.
- Pont Relinium / compte / SSOT perso : page Relinium est purement descriptive, aucune mécanique d’auth, de création de compte ou d’espace personnel.
- Tunnel Fit post-Relinium : section Fit statique sur la home, aucun tunnel guidé ni critères structurés.
- Souveraineté & privacy : le front ne stocke rien aujourd’hui ; les nouveaux flux nécessitent des garanties explicites (diagnostic sans compte, pas de persistance serveur par défaut).
- Instrumentation : pas de mesure des étapes de questionnaires, de consultations de ressources, ni de déclenchement Relinium/Fit.

## 3) Axes prioritaires (logique métier)
- Parcours longue traîne / pages parcours : structurer une route dédiée (ex. `/parcours/ma-structure-dysfonctionne`) avec intro, promesse de souveraineté, entrée vers double questionnaire et CTA alternatifs.
- Questionnaires & bilans (diagnostic + VUCA) : composants de questions (choix multiples/likert), logique de scoring/pondération, génération de bilans lisibles, export local (PDF/PNG/texte), stockage local uniquement (session/localStorage) tant qu’il n’y a pas de compte.
- Moteur de ressources dynamiques open source : catalogue de ressources (Strapi ou JSON statique) taggé par catégories de problèmes + profils VUCA ; service front ou backend pour filtrer/suggérer ; affichage triable et partageable par URL (sans identité).
- Pont Relinium / création de compte : interface d’opt-in après diagnostic, explication des limites de stockage, déclenchement d’une création de compte (backend/API à définir) et récupération sécurisée des diagnostics si l’utilisateur choisit de les y envoyer.
- Tunnel Fit PixelProwlers : flow guidé (questions ciblées) depuis Relinium ou direct, critères d’éligibilité, réutilisation partielle des réponses diagnostic, sortie claire (Fit OK / redirection ou recommandations).
- Instrumentation & analytics : plan d’événements pour chaque étape (start/complete questionnaire 1/2, export, clic ressource, création compte Relinium, démarrage/issue du tunnel Fit) avec propriétés (parcours, segments de réponses, anonymisé). Respect du mode « no-cookie » / désactivation possible.
- UX/accessibilité : continuité visuelle avec la home (sobriété), guidelines d’état (progression, erreurs, reprises), accessibilité clavier/screen reader des questionnaires, feedbacks non intrusifs.
- Sécurité & privacy : les gaps et arbitrages seront suivis dans `docs/security/SECURITY_INDEX.md` (OPSEC, menaces, politiques de données).

## 4) Phasage proposé

### Phase 1 — Page longue traîne & socle questionnaires (front only)
- Objectif métier : proposer le parcours “ma structure dysfonctionne” avec promesse de souveraineté et un premier diagnostic utilisable (sans backend).
- Front : nouvelle route longue traîne + sections intro/FAQ/CTA ; composants de questions (schema-driven), stockage local des réponses, calcul simplifié pour un bilan synthétique (catégories fortes/faibles), rendu visuel léger (cartes/badges) + export texte/PNG côté client.
- Backend/API : aucun prérequis bloquant ; prévoir schemas futurs pour diagnostics/ressources.
- Analytics : events `longtail_view`, `questionnaire1_start/complete`, `diagnostic_export`; propriétés : parcours_id, volume questions répondues, opt-out tracking respecté.
- Souveraineté : aucune donnée nominative, disclaimer visible, possibilité de vider les réponses localement.
- Gate 1 – Front solo (sécurité) : réponses Q1/Q2 en mémoire, scores/tags uniquement en storage avec TTL, bouton “Effacer mes réponses de cet appareil”, analytics minimalistes (coarse, anonymes, désactivables).

### Phase 2 — Questionnaire VUCA + ressources dynamiques
- Objectif métier : enrichir la lecture systémique et délivrer des ressources adaptées en libre accès.
- Front : second questionnaire (VUCA/agilité/gouvernance), fusion des résultats dans un bilan “méta”, composants de visualisation plus structurés (radar/barres simples) générés côté client, page de résultats persistable localement ; module de recommandation local connecté à un catalogue taggé.
- Backend/API : exposer un endpoint public (ou Strapi) pour récupérer la liste des ressources (URL, tags problèmes + tags VUCA, niveau de maturité) ; option de calcul server-side pour les recommandations si la logique devient lourde ; mécanisme d’invalidation/cache.
- Analytics : events `questionnaire2_start/complete`, `resource_list_view`, `resource_click`; propriétés : tags dominants, count ressources servies.
- Souveraineté : catalogue public sans traçage nominatif ; aucune remontée des réponses individuelles côté serveur par défaut (ou en mode opt-in explicite + hash local).

### Phase 3 — Pont Relinium & tunnel Fit
- Objectif métier : permettre la continuité du diagnostic vers un espace personnel et filtrer les demandes PixelProwlers.
- Front : écran d’opt-in Relinium post-bilan, choix d’importer ou non les diagnostics ; UI de création de compte (redirection vers backend ou widget) ; tunnel Fit guidé (questions ciblées + reprise des signaux forts/faibles) avec issue claire (Fit OK / pas maintenant).
- Backend/API : endpoints d’auth Relinium + stockage sécurisé des diagnostics exportés ; contrat d’API pour créer un compte, recevoir un bundle anonymisé ou attaché au compte ; webhook/endpoint pour soumettre un Fit et déclencher un suivi interne.
- Analytics : events `relinium_optin`, `relinium_account_created`, `fit_start`, `fit_validated/refused`; propriétés : parcours source, transfert de réponses (oui/non), critères Fit.
- Souveraineté : double consentement (créer un compte + envoyer ses diagnostics), info sur limites de stockage et accès PixelProwlers (par défaut aucun accès aux données privées), option “rester offline”.

## 5) Points à clarifier côté produit/UX
- Contenus exacts des deux questionnaires : thèmes, formats de questions, pondération, durée cible. Quelles échelles et seuils pour les bilans ?
- Format attendu des bilans : niveau de détail, style visuel, besoin d’export PDF ou partageable par lien signé ?
- Règles de recommandation des ressources : mapping problèmes/VUCA → tags ressources, besoin de pondération ou de règles métiers spécifiques.
- Stratégie de données : garde-t-on un hash des réponses pour analytics ? propose-t-on une sauvegarde locale chiffrée ? quelles limites explicites sur Relinium (quotas, formats) ?
- Tunnel Fit : critères de filtre, seuils d’acceptation, messages de sortie (OK / pas le bon timing / orienter ailleurs).
- Tracking : souhaite-t-on un mode “no analytics” par défaut ou un consentement explicite ? quels KPIs prioritaires à suivre sur ce parcours ?
- Références sécurité : décisions et gates à suivre dans `docs/security/SECURITY_INDEX.md` (architecture, menaces, politiques, gates).
- Sécurité/Privacy : suivre les décisions dans `docs/security/` (index, modèles de menaces, politiques OPSEC).
- Critère de réussite : la V1.2 longue traîne est livrable uniquement si Gate 1 est en statut OK dans `docs/security/SECURITY_GATES.md`.
