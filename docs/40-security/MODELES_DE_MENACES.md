# Modèles de menaces — Vitrine, diagnostics, Relinium, Fit

Intention : cadrer les menaces par brique et par mode (solo/offline vs accompagné).

## 1. Front solo V1.2
- Scénarios : device partagé, navigateur compromis, extension malveillante, back-forward cache.  
- Risques : exposition des scores/tags locaux, espionnage des bilans, fuite via captures/logs navigateur.  
- Contre-mesures : volume limité de données persistées (scores/tags uniquement), option “Tout effacer”, pas de réponses brutes stockées, TTL ~30 jours, aucune clé commune avec Fit.

## 2. Analytics
- Risques : ré-identification via event stream + IP + user-agent, surtout en faible volumétrie.  
- Contre-mesures : propriétés bucketisées/anonymisées, pas d’identifiant stable, possibilité de désactiver complètement l’analytics, rétention courte des logs bruts IP+UA (7–30 jours max à confirmer), pas de conservation long terme corrélable.

## 3. Relinium & Fit (préliminaire)
- Menaces à traiter : compte compromis, admin interne malveillant, corrélation abusive diagnostics/Fit, fuite de logs (PII ou bilans), compromission de sauvegardes, escalade via backups/restaurations, abus de partage.  
- Blocage : ces points doivent être traités et documentés avant toute mise en prod backend Relinium/Fit (auth, chiffrement, journalisation append-only, rétention, consentements).

## 4. Ressources dynamiques et API publiques
- Risques : injection de contenu (Strapi/JSON), log de PII côté catalogue si mal configuré, abuse/crawling.  
- Contre-mesures : pas de PII dans le catalogue, logs minimisés, CORS strict, rate limiting éventuel sur endpoints publics.

## 5. Moteur de parcours et analytics (journey engine)

### Surface d’attaque
- Le moteur de parcours (`useJourneyEngine`) expose des hooks `onStepViewed` / `onStepCompleted`.  
- Risques : usage abusif pour envoyer des analytics trop fines, ajout de propriétés contenant des éléments de diagnostic, contournement de la politique “coarse analytics” via empilement d’événements.

### Contre-mesures
1) Encadrement par `useAnalytics`  
   - Tous les envois d’analytics liés au parcours passent par `useAnalytics`.  
   - `useJourneyEngine` ne peut pas appeler un client analytics brut ; il utilise des fonctions de haut niveau qui implémentent le schéma autorisé.

2) Schéma d’événements borné  
   - Événements autorisés P1 : `q1_start`, `q1_complete`, `q2_start`, `q2_complete`, `resource_click`, `relinium_optin_click`, `fit_start`, `fit_outcome`.  
   - Propriétés autorisées : `journey_id`, `nb_axes_haute_friction` (low/medium/high), `resource_level` (debutant/intermediaire/avance).  
   - Tout nouvel event ou propriété doit être documenté ici et validé par Eva/Marty.

3) Interdictions explicites  
   - Pas de réponses brutes, listes d’items cochés, scores détaillés par item.  
   - Pas d’identifiant stable de navigateur/utilisateur.  
   - Interdit de ré-encoder le diagnostic via une combinaison d’événements reconstructible.

4) Contrôle de modification  
   - Avant tout ajout/modification analytics : mettre à jour ce document et refléter l’impact éventuel dans `SECURITY_GATES.md`.

## 6. Carrefour E6 – menaces spécifiques et mitigations

### Menaces
- Utiliser E6 comme point de corrélation cachée entre diagnostic P1, futurs espaces Relinium et tunnel Fit.  
- Ajouter progressivement des paramètres d’URL ou payloads contenant scores/profils/identifiant unique.

### Mesures de prévention
- CTAs de E6 : ne transmettent aucune donnée de diagnostic, n’utilisent aucun paramètre d’URL porteur de diagnostic.  
- Parcours Relinium/Fit modélisés comme parcours indépendants avec menaces, modèles de données et gates propres.

Toute tentative de synchroniser des données de diagnostic via E6 est un changement de modèle de menace et doit :  
- déclencher une mise à jour de ce document,  
- être discutée avec Eva/Marty,  
- respecter le principe de “changement de contrat moral” (cf. `POLITIQUES_OPSEC_PRIVACY.md`).
