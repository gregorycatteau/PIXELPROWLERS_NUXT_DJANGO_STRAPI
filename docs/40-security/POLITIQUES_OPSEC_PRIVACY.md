---
id: POLITIQUES_OPSEC_PRIVACY
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Eva", "Dan"]
scope: ["docs/40-security/**"]
tags: ["security"]
---

# Politiques OPSEC, privacy & RGPD — squelette

Objectif : formaliser les politiques de souveraineté, confidentialité, gestion des identités et consentements.

## 1. Mantra
- Souveraineté > métriques. Pas de profilage caché, pas de dark patterns. Diagnostics locaux par défaut, opt-in explicite pour tout export Relinium.

## 2. Diagnostics
- Ce qu’on fait : calcul local des scores/tags/bilans ; stockage persistant limité aux éléments nécessaires à l’affichage.  
- Ce qu’on ne fait pas : pas de stockage serveur des réponses brutes sans opt-in Relinium ; pas de corrélation avec Fit en V1.x.  
- Bouton “Effacer mes réponses” : purge des clés locales (réponses, scores, tags, bilans, préférences analytics locales).

> **Exception contrôlée — Contact full-stack (V1.3)**  
> PII isolées, finalité unique (répondre), rétention courte avec purge automatique.  
> Logs sans payload PII, IP anonymisée (prefix + hash).  
> Anti-abus: honeypot, time-gate, rate limiting, erreurs neutres (anti-oracle).  
> Scope strict: le diagnostic P1 reste front-only.

## 3. Analytics
- Schéma minimal : events anonymisés (start/complete, clic ressource, opt-in Relinium, issues Fit) avec propriétés bucketisées, sans PII ni identifiant stable.  
- Interdit : réponses brutes, PII, device IDs persistants.  
- Rétention : logs techniques IP+UA à durée courte (7–30 jours) pour diagnostic technique uniquement ; possibilité de désactivation totale.

## 4. Relinium
- Règle : aucun usage des données sans consentement éclairé par cas d’usage (accompagnement, support).  
- Partage : explicite, loggé, horodaté ; PixelProwlers n’accède pas par défaut.  
- Chiffrement/backend : à détailler (clé par utilisateur, rotation, backups chiffrés).

## 5. Fit
- Fit n’est pas un pipeline CRM. Rétention courte (6 mois) avec purge auto ; aucune réutilisation marketing/CRM cachée.  
- Pas de corrélation avec diagnostics en V1.x ; issue Fit limitée à l’usage relationnel (OK / pas timing / pas notre terrain).

## 6. Changement de contrat moral
- Toute évolution vers plus d’analytics ou plus de rétention doit être documentée (avant/après), annoncée, et re-consentie.

## 7. Parcours P1 – usage des hooks et analytics

### Hooks du moteur de parcours
- `onStepViewed` et `onStepCompleted` existent pour piloter l’UX et quelques events analytics contrôlés.  
- Toute intégration analytics à partir de ces hooks doit : passer par `useAnalytics`, respecter le schéma d’événements/propriétés documenté dans `MODELES_DE_MENACES.md`, rester désactivable via configuration globale (`analyticsEnabled`).

### Engagement produit
- PixelProwlers s’engage à ne pas dériver ces hooks vers du tracking fin caché, ni ajouter d’identifiants stables ou de propriétés permettant de reconstruire un diagnostic complet.  
- Toute évolution vers plus de granularité est un changement de contrat moral : documenté (avant/après), communiqué clairement, soumis à nouveau consentement.

## 8. Carrefour E6 – contrat privacy
- E6 (Autonomie / Relinium / Fit) est un choix de parcours, pas un point de collecte cachée.  
- Engagement : aucun bouton E6 ne transmet des réponses de diagnostic, aucun identifiant de diagnostic n’est envoyé automatiquement à Relinium ou Fit ; le choix d’entrer dans Relinium ou Fit se fait sur la base d’un contrat séparé.  
- Relinium/Fit ne peuvent accéder aux éléments d’un diagnostic P1 que si : l’utilisateur le choisit explicitement, le partage est journalisé (qui, quoi, quand), et les conditions d’usage sont précisées dans les docs associées.  
- En pratique : un utilisateur peut faire un diagnostic P1, passer par E6 et rester en autonomie sans qu’aucune donnée de P1 ne soit captée par PixelProwlers.
