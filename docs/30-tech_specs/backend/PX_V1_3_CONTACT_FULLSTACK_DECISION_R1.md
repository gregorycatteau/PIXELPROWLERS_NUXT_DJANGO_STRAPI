---
id: PX_V1_3_CONTACT_FULLSTACK_DECISION_R1
title: "Contact full-stack - Decision R1 (V1.3)"
version: 1.3.0
status: draft
date: 2026-01-02
owners: ["Marty", "Eva"]
scope: ["backend_django", "contact", "privacy", "security"]
tags: ["decision", "contact", "full-stack", "privacy", "v1.3"]
---

# Contact full-stack - Decision R1 (V1.3)

## Contexte
- La posture historique est front-only pour les diagnostics P1, sans retention serveur.
- Le besoin operationnel exige un canal de contact fiable avec reponse humaine.
- Les promesses privacy doivent rester coherentes et explicites.

## Decision
- Le formulaire de contact passe en full-stack avec stockage minimal et temporaire.
- Cette evolution est une exception controlee au principe front-only, limitee au flux Contact.

## Rationale
- Confiance: pouvoir repondre sans pertes ni doublons.
- RGPD: cadre explicite, finalite unique, retention courte, purge automatique.
- Securite: anti-abus, logs hygieniques, erreurs neutres.
- Operationnel: support et suivi via un ticketId.

## Consequences
- Mise a jour des docs publiques (confidentialite, privacy policy, OPSEC).
- Ajout d'un processus de purge automatique.
- Aucune collecte additionnelle sur P1.

## Non-goals
- Pas de CRM ni de marketing.
- Pas de suivi utilisateur ou d'identifiants persistants.
- Pas d'extension du scope P1.

## Rollback plan
- Desactiver l'endpoint contact.
- Basculer vers un canal email direct uniquement.
- Purger immediatement la base des messages restants.
