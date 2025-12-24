---
id: ARCHITECTURE_SECURITE
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Eva", "Dan"]
scope: ["docs/40-security/**"]
tags: ["security"]
---

# Architecture sécurité — Vue d'ensemble

## 1. Périmètre V1.2
- Site vitrine Nuxt (landing + pages longue traîne), diagnostics/bilans client-side, ressources dynamiques.
- API Django (contact) et futur endpoint public pour catalogue de ressources.
- Strapi (contenus) non exposé au public pour l’instant.
- Relinium (SSOT perso) à venir : stockage privé des bilans/export.
- Tunnel Fit : flow relationnel post-diagnostic, pas de CRM caché.

## 2. Séparation des données
- Diagnostics et Fit : deux silos logiques distincts. Interdiction de FK directe ou d’identifiant partagé (session_id, hash dérivé, clé technique). Pas de corrélation V1.x.  
- Analytics : propriétés anonymisées sans identifiant stable.  
- Contact : PII isolées côté backend Django, non mixées avec diagnostics/Fit.

## 3. Stockage local
- Réponses brutes : mémoire seulement (pas de persistance durable).  
- Stockage persistant limité aux scores/tags/bilans nécessaires à l’affichage local.  
- TTL par défaut pour les données persistées (ordre de grandeur 30 jours, valeur exacte à confirmer dans la doc produit).  
- Bouton “Tout effacer” : purge toutes les clés de diagnostic documentées (réponses, scores, tags, bilans, préférences d’analytics locales).

## 4. Relinium — coffre perso
- Principes : chiffrement côté backend, données privées non accessibles à PixelProwlers sans partage explicite.  
- Partage : doit être explicite, loggé et horodaté (qui, quoi, quand).  
- TODO cryptographie : choix de clé par utilisateur, rotation, backup/restauration chiffrés, multi-device, récupération de compte, stockage des journaux append-only.

## 5. Points d’entrée / hébergement (préliminaire)
- HTTP/HTTPS : termination TLS devant Nuxt/Django/Strapi (proxy à définir).  
- CORS/CSRF : réduire aux origines nécessaires (landing, éventuels sous-domaines).  
- Auth : aucune auth sur diagnostics ; auth Relinium/Fit à spécifier avant mise en prod.  
- Hébergement/proxy/TLS : à préciser selon l’infra cible (VPS/PaaS), à documenter ici.

## 6. Clés de stockage locales P1 (journey `ma-structure-dysfonctionne`)

### Namespace et versionnage
- Chaque parcours dispose de son propre namespace.  
- Pour P1 (`ma-structure-dysfonctionne`), les clés locales autorisées sont :  
  - `pp_journey_p1_scores_v1`  
  - `pp_journey_p1_meta_v1`  
- Toute nouvelle clé liée au diagnostic P1 doit :  
  - être nommée avec le préfixe `pp_journey_p1_`,  
  - être documentée dans ce fichier,  
  - être associée à une version (`_v1`, `_v2`, …).

### Contenu stocké dans `pp_journey_p1_scores_v1`
- Objet JSON contenant uniquement des scores agrégés, par exemple :  
  - scores par axe de symptômes (humain, gouvernance, organisation, ressources),  
  - scores/indices VUCA,  
  - profil de valeurs A/B/C/D agrégé.  
- Interdictions : aucune réponse brute, aucun texte libre, aucune donnée directement ré-identifiante.

### Contenu stocké dans `pp_journey_p1_meta_v1`
- Objet JSON contenant uniquement des métadonnées minimales, par exemple :  
  - `lastCompletedAt` : timestamp du dernier diagnostic complet,  
  - flags de complétion (`q1Completed`, `q2Completed`),  
  - éventuelle version interne du schéma (`schemaVersion`).  
- Interdictions : pas d’identifiant utilisateur, pas de référence croisée vers d’autres parcours, pas d’éléments permettant de reconstruire les réponses brutes.

### TTL et purge
- Durée de vie indicative : 30 jours pour le couple (`pp_journey_p1_scores_v1`, `pp_journey_p1_meta_v1`).  
- `useDiagnosticStorage` doit :  
  - stocker un timestamp de dernière mise à jour,  
  - purger automatiquement si `now - lastUpdatedAt > TTL`,  
  - exposer `clearAll()` qui supprime toutes les clés `pp_journey_p1_*` et remet l’état du diagnostic à zéro côté front.  
- Le bouton “Effacer mes réponses de cet appareil” utilise `clearAll()` et ne laisse aucune donnée P1 dans le storage local après exécution.

## 7. Séparation des moteurs P1 (diagnostics et stockage)

### `useJourneyDiagnostics` (P1)
- Stockage en mémoire des réponses brutes, paramétré par `journeyId` (ici `p1`).  
- Expose des fonctions de calcul (`computeSymptomScores()`, `computeVucaValuesProfile()`).  
- Contraintes : ne touche jamais au stockage persistant, ne sérialise pas les réponses brutes pour envoi réseau, ne décide pas des analytics.

### `useDiagnosticStorage` (P1)
- Stockage persistant limité pour un parcours donné, paramétré par `journeyId` (ici `p1`).  
- Ne manipule que scores agrégés et métadonnées (TTL/purge inclus).  
- Contraintes : ne reçoit jamais les réponses brutes, pas d’API question par question, pas d’identifiant persistant de navigateur ou d’utilisateur.

## 8. Carrefour E6 – non-corrélation diag / Relinium / Fit

### Règles structurelles
- CTAs E6 ouvrent de nouveaux parcours avec leurs contrats de données propres.  
- Les liens sortants de E6 ne transmettent aucune donnée de diagnostic (ni scores, ni profil, ni identifiant de session) et n’embarquent pas de query params porteurs de diagnostic (`diagId`, `axes`, `profile`, etc.).  
- Seule info technique éventuelle : un indicateur générique (`journey_source = "p1"`) pour analytics, si conforme à `POLITIQUES_OPSEC_PRIVACY.md`.

### Conséquences
- Relinium et Fit ne peuvent pas reconstruire le diagnostic P1 via un identifiant caché.  
- Toute liaison ultérieure entre P1 et Relinium/Fit doit être spécifiée dans des specs backend dédiées et précédée d’un consentement clair de l’utilisateur.

## 9. Export client-side (E4 – bilans)
- Export entièrement côté client : texte affiché, copie manuelle, impression navigateur.  
- Interdictions : pas de génération serveur (PDF, DOCX…), pas d’upload automatique, pas de sauvegarde silencieuse backend.  
- L’export ne doit jamais créer de données P1 sur les serveurs sans que l’utilisateur ne bascule dans un autre parcours (Relinium/Fit) avec contrat explicite.
