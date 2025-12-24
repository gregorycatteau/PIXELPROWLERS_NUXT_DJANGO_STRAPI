---
id: PX_V1_2_LONGTAIL_DIAGNOSTIC_FONCTIONNEL
version: 1.0.0
status: archived
date: 2025-12-24
owners: ["Marty"]
scope: ["docs/20-product_specs/**"]
tags: ["product_specs", "functional"]
---

# PX V1.2 — Parcours longue traîne « Ma structure dysfonctionne » (spécification fonctionnelle)

> Statut SSOT : document V1.2 conservé pour historique. La version active est V1.3, voir `docs/20-product_specs/functional/PX_V1_3_P1_DIAGNOSTIC_ATELIER.md`.

## 1. Contexte & objectifs
- Objectif : filtrer entre curieux et personnes prêtes à agir via un parcours modulaire P1 (panorama + blocs d’exploration) puis un diagnostic VUCA/Alignement, fournir des ressources open source adaptées, puis proposer Relinium (SSOT perso) et un tunnel Fit PixelProwlers.
- Périmètre V1.2 : front Nuxt uniquement pour les questionnaires/bilans/ressources, backend limité au contact existant ; pas de stockage serveur des réponses sans opt-in Relinium.
- Promesse clé : souveraineté — pas de compte ni d’identité requise pour le diagnostic, aucune persistance serveur par défaut, possibilité d’effacer localement.

## 2. Parcours global V1.2 – « Ma structure dysfonctionne »
- Page longue traîne dédiée (ex. `/parcours/ma-structure-dysfonctionne`) : cadrage du problème, langage aligné sur les structures sociales/humaines, promesse de souveraineté explicitée.
- Séquence : Panorama P1 + blocs d’exploration (dysfonctionnements) → bilans de blocs → Bilan global P1 → Questionnaire 2 (VUCA/systémique + Valeurs/Alignement) → Bilan 2 → Ressources open source adaptées → Option Relinium (SSOT perso) → Tunnel Fit PixelProwlers.
- Sorties possibles : rester en mode autonome (ressources), créer un compte Relinium pour conserver/exporter, ou entrer dans le tunnel Fit pour vérifier l’adéquation avec PixelProwlers.

## 3. Questionnaire P1 – Dysfonctionnements (panorama + blocs d’exploration)

### 3.1. Architecture générale

Le questionnaire P1 n’est pas un bloc unique mais un **parcours d’exploration** structuré :

1. **E1 – Panorama express**  
   - 10 à 12 questions transversales couvrant les 4 axes :  
     (1) Humain/coopération  
     (2) Gouvernance/décision  
     (3) Organisation/process/documentation  
     (4) Ressources/soutenabilité  
   - Objectif : offrir une vue d’ensemble rapide des tensions, en ~3–4 minutes, et identifier les chantiers les plus “chargés”.
   - Sortie : un premier “niveau de friction” par axe (faible / moyen / fort) + une suggestion de blocs à explorer en priorité.

2. **E2 – Choix de blocs d’exploration**  
   L’utilisateur voit une carte des **4 blocs thématiques** et peut choisir lesquels explorer en profondeur, dans l’ordre qu’il veut :

   - Bloc 1 – Climat & ressenti  
   - Bloc 2 – Mouvement & prévisibilité  
   - Bloc 3 – Règles & décisions  
   - Bloc 4 – Structure & robustesse  

   Chaque bloc se comporte comme un “questionnaire autonome”, avec son propre bilan, et alimente un **bilan global** qui se construit au fil de l’exploration.

   L’utilisateur peut :
   - explorer **un seul bloc** puis s’arrêter,
   - explorer **plusieurs blocs** (dans l’ordre de son choix),
   - ou explorer **les 4 blocs** avant de passer à la suite (Q2 VUCA + Valeurs / Alignement).

   Le parcours est conçu pour rester utile même si un seul bloc est exploré.

3. **E3.x – Questionnaires de blocs (1 à 4)**  
   Pour chaque bloc choisi, l’utilisateur accède à un ensemble de questions détaillées (voir ci-dessous).

### 3.2. Format des questions (tous blocs P1)

- **Échelle unique 0–5** pour tous les items :

  - 0 = « Pas du tout un problème »  
  - 5 = « Problème majeur identifié »

- Chaque question est pensée avec une **double focale** :

  - « 🧍‍♂️ Moi » = vécu personnel de l’utilisateur,  
  - « 🏛 Organisation » = perception du fonctionnement global.

- Temps cible par bloc : **~8 minutes** pour 30–35 questions, avec possibilité de **sauter** des questions.

- Il est explicitement possible de **ne pas répondre à un item** (bouton « Je préfère ne pas répondre à cette question » ou équivalent UX).  
  → L’absence de réponse est intégrée comme **information** dans les bilans (cf. 3.4 et 5).

### 3.3. Contenu des blocs (version P1.2)

#### Bloc 1 – Climat & ressenti

**But** : capter le vécu humain dans la structure, sans pathologiser la personne.

Types d’items (30–35 questions au total) :

- Position & place dans le système  
  - ancienneté, rôle, centralité vs périphérie, sentiment d’être “au centre” ou “à la marge”.
- Compréhension des règles & du « mode d’emploi »  
  - devoir deviner, règles implicites, réponses différentes selon les personnes, changements non expliqués.
- Climat relationnel & confiance  
  - droit au désaccord, censure, sujets tabous, clans, usage de la parole en réunion.
- Sens, alignement & légitimité  
  - compréhension du projet, sentiment d’être à sa place, dilemmes de valeurs, écart discours / réalité.
- Charge, fatigue & saturation  
  - épuisement, surcharge des mêmes personnes, report de sujets importants.
- Lisibilité du quotidien & prévisibilité  
  - surprises, urgences, capacité à anticiper, impression d’impro permanente.
- Justice / équité (mini-bloc)  
  - sentiment d’injustice, passes-droits, règles non appliquées de la même manière.

**Usage interne** : ce bloc nourrit surtout les dimensions Incompréhensible, Anxieux et le “climat” BANI/VUCA. Les scores et patterns d’items non répondus alimentent le **bilan de bloc** et le **bilan global P1**.

> Les blocs 2, 3 et 4 suivent la même logique :  
> 30–35 questions, double focale Moi/Organisation, avec une structuration thématique propre.  
> Leur contenu détaillé est décrit dans un document interne complémentaire (banque de questions P1) et ne modifie pas la présente spécification fonctionnelle.

### 3.4. Gestion des questions non répondues

L’absence de réponse à une question n’est **pas considérée comme un “trou” à ignorer**, mais comme une **information à part entière**.

#### Règles produit

- Chaque item peut être dans l’un des états suivants :

  - répondu (0–5),
  - non répondu (explicitement ignoré / « Je préfère ne pas répondre »),
  - non vu (si l’utilisateur quitte le bloc avant de l’atteindre).

- Pour chaque bloc, le système calcule :

  - `answeredCount` = nombre d’items effectivement répondus,  
  - `skippedCount` = nombre d’items vus mais laissés sans réponse,  
  - `unseenCount` = nombre d’items non affichés (si sortie anticipée du bloc),  
  - des **scores moyens par sous-thème** sur les items répondus.

#### Impact sur les bilans

- Les **scores quantitatifs** sont toujours calculés sur les **réponses présentes uniquement** (pas d’imputation automatique).
- Les **questions non répondues** sont utilisées pour produire des signaux qualitatifs, par exemple :

  - « Plusieurs questions liées à la confiance ou aux conflits n’ont pas été renseignées. Cela peut pointer une zone sensible ou difficile à regarder pour l’instant. »  
  - « Certaines questions sur la justice et l’équité n’ont pas reçu de réponse. C’est en soi une information, à prendre en douceur. »

- L’interface de bilan indique clairement :

  - combien de questions ont été répondues,
  - combien ont été laissées de côté,
  - sur quels sous-thèmes se concentrent ces “blancs”.

Aucun jugement n’est porté sur ces absences de réponse.  
Elles servent à suggérer des **« zones à explorer plus tard »**, pas à dégrader un score.

#### Contraintes sécurité

- Les réponses brutes (y compris les états “non répondu”) restent **strictement en mémoire** (cf. §7 : Sécurité & souveraineté).
- Seules des **agrégations** sont persistées dans `pp_journey_p1_scores_v1` et `pp_journey_p1_meta_v1` :

  - scores moyens par sous-thème / bloc,  
  - `answeredCount`, `skippedCount`, `unseenCount` par bloc,  
  - pas de détail question par question.

- L’absence de réponse n’est jamais utilisée pour faire de la **corrélation diag ↔ Fit** ni pour de l’analytics utilisateur fin.

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

## 5. Bilans – format, restitution & prise en compte des “blancs”

Le parcours produit plusieurs niveaux de bilans :

1. des **bilans de bloc** (locaux) après chaque chantier exploré,
2. un **bilan global P1** qui se construit au fur et à mesure des blocs complétés,
3. un **Bilan 2** (VUCA + Valeurs/Alignement) décrit dans les sections dédiées.

### 5.1. Bilan de bloc (ex. Bloc 1 – Climat & ressenti)

Pour chaque bloc exploré, l’utilisateur reçoit un bilan dédié comprenant :

- 3–4 phrases de synthèse, en langage simple, sur ce que le bloc raconte du vécu :  
  ex. « Tu sembles porter beaucoup de choses au quotidien, avec peu de marges pour souffler. »
- Une visualisation légère des **sous-thèmes du bloc** (barres ou badges) :  
  ex. « Climat relationnel », « Sentiment de justice », « Fatigue », etc.
- Un encart dédié aux **questions non répondues** :  
  ex. « Plusieurs questions liées à la confiance et aux conflits n’ont pas été renseignées. Cela peut signaler une zone délicate ou simplement un sujet à aborder plus tard. C’est parfaitement ok. »
- 1–2 questions de sens “à garder près de soi”, adaptées au bloc :  
  ex. « Qu’est-ce que tu refuses de sacrifier dans ta manière de travailler avec les autres ? »

Les bilans de bloc restent dans un ton :

- descriptif (constats, pas verdicts),
- respectueux (« c’est un début de carte, pas un jugement »),
- compatible avec la suite du parcours (Q2, ressources, Relinium, Fit).

### 5.2. Bilan global P1 (progressif)

Le **Bilan global P1** agrège ce qui a été exploré dans :

- le panorama express (E1),
- les blocs visités (1 à 4).

Il contient :

- une carte synthétique des 4 grandes familles de tensions :  
  - Humain/coopération  
  - Gouvernance/décision  
  - Organisation/process/documentation  
  - Ressources/soutenabilité
- un statut visuel de chaque bloc :  
  - « Exploré en détail » / « Survolé » / « Pas encore exploré ».
- une section « zones nettes » vs « zones floues » :  
  - « zones nettes » = thèmes où il y a beaucoup de réponses,  
  - « zones floues ou sensibles » = thèmes où il y a beaucoup de questions non répondues.

Une phrase pivot reste obligatoire :

> « Ce n’est pas un verdict, c’est un point de départ pour mieux prendre soin de la structure et de toi. »

Le bilan global ne pousse jamais à « tout casser » :  
il invite à **poser des questions plus justes**, pas à trancher brutalement.

### 5.3. Export V1.2

- Export toujours **100 % client-side** :

  - texte copiable dans l’interface,
  - impression via le navigateur (`window.print`).

- Le bilan peut inclure :

  - les titres des blocs explorés,
  - les grandes tendances (forte friction / moyenne / faible),
  - des mentions comme « Certaines questions n’ont pas reçu de réponse, ce qui peut signaler des zones sensibles ou à explorer plus tard. »

- Il **n’inclut jamais** :

  - la liste des réponses question par question,
  - un identifiant technique de diagnostic.

Aucune donnée n’est envoyée au serveur à l’occasion de l’export.

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
- Le parcours P1 (panorama + blocs) et le questionnaire VUCA/Alignement fonctionnent de bout en bout, avec bilans lisibles et exportables via le navigateur (client-side).
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
