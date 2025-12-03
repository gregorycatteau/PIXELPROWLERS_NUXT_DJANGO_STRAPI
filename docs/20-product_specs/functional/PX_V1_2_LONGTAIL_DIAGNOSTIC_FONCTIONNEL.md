# PX V1.2 — Parcours longue traîne « Ma structure dysfonctionne » (spécification fonctionnelle)

## 1. Contexte & objectifs
- Objectif : filtrer entre curieux et personnes prêtes à agir via un double diagnostic anonyme, fournir des ressources open source adaptées, puis proposer Relinium (SSOT perso) et un tunnel Fit PixelProwlers.
- Périmètre V1.2 : front Nuxt uniquement pour les questionnaires/bilans/ressources, backend limité au contact existant ; pas de stockage serveur des réponses sans opt-in Relinium.
- Promesse clé : souveraineté — pas de compte ni d’identité requise pour le diagnostic, aucune persistance serveur par défaut, possibilité d’effacer localement.

## 2. Parcours global V1.2 – « Ma structure dysfonctionne »
- Page longue traîne dédiée (ex. `/parcours/ma-structure-dysfonctionne`) : cadrage du problème, langage aligné sur les structures sociales/humaines, promesse de souveraineté explicitée.
- Séquence : Questionnaire 1 (dysfonctionnements) → Bilan 1 → Questionnaire 2 (VUCA/systémique) → Bilan 2 → Ressources open source adaptées → Option Relinium (SSOT perso) → Tunnel Fit PixelProwlers.
- Sorties possibles : rester en mode autonome (ressources), créer un compte Relinium pour conserver/exporter, ou entrer dans le tunnel Fit pour vérifier l’adéquation avec PixelProwlers.

## 3. Questionnaire 1 – Dysfonctionnements (diagnostic « symptômes »)
- Durée cible 5–7 min, échelle Likert 1–5 (« pas du tout un problème » → « problème majeur et récurrent »).
- Structure : 8–12 blocs thématiques (humain, gouvernance, organisation, finances, numérique, etc.), 1–3 items par bloc → ~20–25 items max.
- Axes d’analyse (synthèse) : (1) Humain/coopération, (2) Gouvernance/décision, (3) Organisation/process/documentation, (4) Ressources/soutenabilité (finances, temps, outils).
- Sortie attendue : score/indice de friction par axe (faible/moyen/fort) + top 3 zones de blocage.

## 4. Questionnaire 2 – Environnement VUCA / modèle systémique
- Durée cible 5 min, 10–15 items en Likert 1–5.
- Axes d’analyse : (1) Adaptabilité/agilité, (2) Transparence/feedback, (3) Autonomie/responsabilisation, (4) Vision/cap partagé.
- Logique : éclairer les écarts (ex. forte friction opérationnelle + modèle rigide) plutôt que produire un score global unique.

### Axe I – Valeurs & alignement (perso ↔ structure)
- Objectif : voir dans quelle mesure la personne reste fidèle à ses valeurs, comment elle perçoit la cohérence (ou les contradictions) entre les valeurs affichées par la structure et ses pratiques réelles, et en quoi ce décalage alimente les tensions.  
- Format : intégré à Q2, 4 à 6 items Likert 1–5 (“Pas du tout vrai pour moi” → “Totalement vrai pour moi”), durée globale Q2 inchangée (~5 min).  
- Types d’items (exemples en prose) : cohérence entre valeurs affichées et vécu réel ; application réelle du “droit à l’erreur” ; sentiment de pouvoir rester fidèle à ses propres valeurs ; existence de conversations explicites sur les valeurs/lignes rouges ; reconnaissance (ou non) de la personne dans les comportements de la structure.  
- Scores internes (non exposés tels quels) : indice “fidélité à soi” et indice “alignement structurel perçu”.  
- Profils d’alignement (pour le Bilan 2 et l’orientation des ressources) :  
  - Profil A — alignement global partagé,  
  - Profil B — toi aligné, structure en contradiction,  
  - Profil C — flou partagé,  
  - Profil D — structure cohérente mais toi en décalage.  
  Ces profils sont utilisés uniquement dans le texte du Bilan 2, pour orienter les ressources, et comme tag ultra-coarse éventuel dans les scores persistés (ex. `alignement_profil: "B"`), jamais les réponses brutes.

## 5. Bilans – format, restitution & export
- Bilan 1 (dysfonctionnements) : résumé 3–4 phrases, visualisation simple des 4 axes (barres ou badges faible/moyen/fort), liste des 3 blocages majeurs.
- Bilan 2 (VUCA + Valeurs/Alignement) :  
  - Lecture VUCA / modèle systémique : rappel des dimensions (adaptabilité, feedback, autonomie, vision partagée), phrase de cadrage (“Votre structure fonctionne plutôt comme…”), visualisation simple (radar ou barres).  
  - Bloc “Valeurs & Alignement” (Axe I) : phrase de reconnaissance (“vous tenez manifestement à…” / “vous avez essayé de rester fidèle à…”), description du profil (A/B/C/D) en langage clair, 1–2 questions de sens (ce que tu refuses de sacrifier, ce qui fait que tu es encore là).  
  - Piste d’orientation : aider à distinguer ses valeurs profondes, celles de la structure (ou pseudo-valeurs) et ce que cela implique (rester, adapter son rôle, partir…) sans chercher qui a raison.  
- Export V1.2 : 100 % client-side (texte copiable + impression navigateur stylée), pas de génération PDF serveur. Le profil (A/B/C/D) peut apparaître dans le texte exporté ; les réponses brutes et indices détaillés ne sont jamais envoyés au serveur ni utilisés tels quels dans les analytics.

## 6. Ressources dynamiques open source – logique de recommandation
- Catalogue (Strapi ou JSON) : chaque ressource est taguée par familles de problèmes (gouvernance, conflits humains, process, finances, numérique…), tags VUCA (rigidité, faible feedback, centralisation…), niveau de maturité (débutant/intermédiaire/avancé).
- Règles métiers simples et explicites (pas d’IA opaque) : prendre les 2 axes de dysfonctionnement les plus en souffrance + 1–2 déficits VUCA importants → proposer 3–5 ressources prioritaires + une liste complémentaire « à explorer ensuite ».
- L’algorithme de recommandation doit être documenté et traçable (règles et tags visibles/compris).

## 7. Sécurité & souveraineté des données (V1.2)
- Q1/Q2 : réponses brutes en mémoire uniquement (state front), non persistées, non envoyées au serveur.  
- Stockage persistant limité côté navigateur : scores par axe + métadonnées minimales (date dernier diagnostic, flags q1/q2 complétés), sous des clés documentées (`pp_diag_v1_scores`, `pp_diag_v1_meta`), avec TTL de 30 jours.  
- Bouton “Effacer mes réponses de cet appareil” : purge ces clés de diagnostic et réinitialise l’état du parcours ; ne touche pas aux autres parties du site.  
- Gate 1 : la V1.2 n’est livrable que si Gate 1 (Front solo) est en statut OK dans `docs/security/SECURITY_GATES.md`.  
- Références : `docs/security/ARCHITECTURE_SECURITE.md`, `docs/security/MODELES_DE_MENACES.md`, `docs/security/POLITIQUES_OPSEC_PRIVACY.md`.

### Cas particulier de l’Axe I – Valeurs & alignement
- Réponses détaillées : strictement en mémoire (pas de LocalStorage/IndexedDB), pas d’envoi serveur.  
- Persistant autorisé : un tag de profil coarse (A/B/C/D) éventuellement dans `pp_diag_v1_scores` (ex. `alignement_profil: "B"`), sans valeurs nominales (“justice”, “loyauté”, etc.).  
- Analytics V1.2 : ce tag n’est pas envoyé ; aucune clé commune pour corréler diag ↔ Fit en V1.x.  
- Pas de champ texte libre sur cet axe ; éviter toute saisie identifiante. La séparation diag/Fit reste valable.

## 8. Données, souveraineté & sécurité (rappel synthèse)
- Avant Relinium (mode anonyme) : réponses stockées uniquement en local (localStorage ou équivalent), aucune réponse brute envoyée au serveur par défaut, bouton « Effacer mes réponses » pour purger localement.
- Analytics : événements anonymisés possibles (ex. q1_complete, axes dominants) mais sans identité, sans hash des réponses complètes en V1.2 ; traçage désactivable par configuration.
- Avec Relinium (opt-in explicite) : si compte créé et export demandé, envoyer un bundle structuré (résumés, scores, tags) vers le SSOT personnel. PixelProwlers n’a pas accès par défaut au contenu détaillé ; tout accès ultérieur nécessite consentement explicite dans le cadre d’un accompagnement. Aucun profil caché n’est construit.

## 9. Tunnel Fit PixelProwlers – critères & issues
- Finalité : vérifier l’adéquation PixelProwlers / utilisateur à ce moment T.
- Inputs : signaux forts/faibles des bilans + questions complémentaires (volonté d’agir court/moyen terme, temps/relais disponibles, capacité minimale d’engagement).
- Issues attendues : (1) Fit OK → prise de contact cadrée (ex. appel 30 min / diagnostic guidé), (2) Pas le bon timing → encourager ressources/Relinium et retour ultérieur, (3) Pas notre terrain → expliquer et orienter génériquement.
- Le tunnel décrit intentions et logiques ; textes finaux à écrire plus tard.

## 10. Analytics & KPIs – ce qu’on mesure et comment
- Événements (coarse, anonymes, désactivables) : `q1_start`, `q1_complete`, `q2_complete`, `resource_list_view`, `resource_click`, `relinium_optin_click`, `fit_start`, `fit_outcome`.  
- Propriétés autorisées : `parcours_id`, `nb_axes_en_forte_friction` (buckets 0–2 / 3–5 / >5), `issue_fit` ∈ {ok, plus_tard, hors_perimetre}, éventuellement `resource_level` (debutant/intermediaire/avance).  
- Interdits : réponses brutes, identifiant utilisateur stable, corrélation diag ↔ Fit. Analytics désactivables par configuration ; rétention courte IP+UA pour logs techniques uniquement.
- KPIs prioritaires : % longtail_view, q1_start/q1_complete, q2_complete, resource_click, relinium_optin_click, fit_start, fit_outcome.

## 11. Critères de “Done” pour la V1.2 du parcours longue traîne
- Les deux questionnaires fonctionnent de bout en bout, avec bilans lisibles et exportables via le navigateur (client-side).
- Stockage : aucune réponse brute persistée ; seules scores/méta sous `pp_diag_v1_scores` / `pp_diag_v1_meta` avec TTL 30 jours ; bouton “Effacer mes réponses de cet appareil” opérationnel (purge + reset).
- Les ressources dynamiques s’affichent selon les tags, avec une logique de recommandation explicitée et traçable.
- Aucune donnée nominative n’est stockée côté serveur sans opt-in Relinium ; purge locale possible.
- Opt-in Relinium opérationnel : export des bilans vers un SSOT personnel via un contrat d’API défini (côté backend).
- Tunnel Fit minimal en place avec les trois issues possibles (Fit OK / Pas le bon timing / Pas notre terrain).
- Schéma d’events minimal conforme (coarse, anonymes, désactivables). Gate 1 en statut OK dans `docs/security/SECURITY_GATES.md`.

## 12. Questions ouvertes / points à affiner plus tard
- Contenus précis des questions (libellés, pondérations) et seuils de passage faible/moyen/fort.
- Choix définitif de visualisation (radar vs barres) et styles d’export/impression.
- Détails du mapping tags problèmes/VUCA → ressources, et mécanisme d’édition (Strapi vs JSON).
- Modalités exactes d’opt-in Relinium (UX, messages) et spécification API d’export/import.
- Design d’UX consentement analytics (opt-in/opt-out, wording) et configuration runtime.
