---
id: PX_V1_3_CONTACT_FULLSTACK_USER_STORIES
title: "Contact full-stack V1.3 - User stories"
version: 1.3.0
status: draft
date: 2026-01-02
owners: ["Marty"]
scope: ["contact", "user_stories", "docs/20-product_specs/**"]
tags: ["user_stories", "contact", "full-stack", "privacy", "v1.3"]
---

# Contact full-stack V1.3 - User stories

## 1) Scope separation (P1 vs Contact)
- Le diagnostic P1 reste front-only: aucune reponse P1 n'est envoyee ni stockee cote serveur.
- Le contact est le seul flux V1.3 avec retention serveur de PII, dans une fenetre courte et purgee.

## 2) User stories - Visiteur

### US-CONT-01 - Envoyer une demande de contact
**Story**
En tant que visiteur, je veux envoyer un message afin d'obtenir une reponse claire.

**AC**
- Le formulaire impose un email et un message.
- Le consentement explicite est requis pour soumettre.
- Les champs optionnels (prenom, nom) ne bloquent pas l'envoi.
- Une confirmation est affichee apres soumission valide.

### US-CONT-02 - Comprendre comment mes donnees sont traitees
**Story**
En tant que visiteur, je veux savoir pourquoi mes donnees sont collectees et combien de temps elles sont conservees.

**AC**
- Une notice de confidentialite est visible sur la page contact.
- La notice mentionne finalite (repondre), retention courte et droit a l'effacement.
- Un lien vers la politique de confidentialite est present.

### US-CONT-03 - Recevoir un accuse de reception
**Story**
En tant que visiteur, je veux recevoir un email d'accuse pour confirmer la prise en compte.

**AC**
- L'email d'accuse est envoye en texte brut.
- L'email contient un ticketId, sans copier le contenu du message.
- L'email ne contient pas de details techniques.

### US-CONT-04 - Protection anti-abus sans divulgation
**Story**
En tant que visiteur, je veux un systeme anti-abus qui ne revele pas si ma demande a ete stockee.

**AC**
- Les blocages anti-abus renvoient un message neutre.
- Le message de blocage ne differencie pas les causes.
- Aucune info d'anti-abus n'est exposee dans l'UI.

## 3) User stories - Mainteneur / Dev

### US-CONT-05 - Hygiene des logs
**Story**
En tant que mainteneur, je veux des logs sans PII pour limiter les fuites de donnees.

**AC**
- Aucun payload de message n'apparait dans les logs.
- Aucun email en clair n'est logge.
- Les IPs sont stockees en prefix + hash sale uniquement.

### US-CONT-06 - Retention et purge automatisees
**Story**
En tant que mainteneur, je veux une purge automatique des messages pour respecter la retention.

**AC**
- Les messages sont supprimes apres 6 mois maximum.
- Les logs techniques sont purges apres 30 jours maximum.
- La purge est documentee et executable automatiquement.

### US-CONT-07 - Observabilite sans PII
**Story**
En tant que mainteneur, je veux des metriques de volume et d'erreur sans exposition de PII.

**AC**
- Les metriques n'incluent ni email, ni message, ni nom.
- Les alertes se basent sur des compteurs anonymes.

### US-CONT-08 - Separation stricte des flux
**Story**
En tant que dev, je veux garantir que P1 reste front-only, sans confusion avec le contact.

**AC**
- Aucun code P1 n'envoie de donnees au serveur par defaut.
- La documentation de P1 mentionne explicitement la separation de scope.
- Les verifications de guards restent valides (no v-html, no remote assets).
