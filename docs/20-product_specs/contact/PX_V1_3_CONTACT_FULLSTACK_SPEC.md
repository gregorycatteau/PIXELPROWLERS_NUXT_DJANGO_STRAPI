---
id: PX_V1_3_CONTACT_FULLSTACK_SPEC
title: "Contact full-stack V1.3 - Spec produit"
version: 1.3.0
status: draft
date: 2026-01-02
owners: ["Marty"]
scope: ["contact", "frontend_nuxt", "backend_django", "docs/20-product_specs/**"]
tags: ["product_specs", "contact", "full-stack", "privacy", "v1.3"]
---

# Contact full-stack V1.3 - Specification produit

## 1) Objectif
- Offrir un formulaire de contact fiable et simple, avec traitement cote serveur pour repondre aux demandes.
- Respecter une posture privacy-first: minimisation, retention courte, purge automatique, pas de tracking.

## 2) Scope
- Formulaire de contact avec validation cote client et cote serveur.
- Stockage limite des messages pour traitement, puis purge automatique.
- Notifications email internes + accusé de reception utilisateur.
- Anti-abus: honeypot, time-gate, rate limiting, erreurs neutres.
- Separation de scope: P1 reste front-only (aucune retention serveur des reponses P1).

## 3) Non-goals
- Pas de CRM, marketing automation, ni newsletter.
- Pas de compte utilisateur ni espace de suivi.
- Pas de conservation au-dela de la fenetre definie.

## 4) UX flows
1) Visiteur ouvre la page contact.
2) Remplit le formulaire (prenom/nom optionnels, email obligatoire, message obligatoire, consentement obligatoire).
3) Soumet le formulaire avec honeypot vide et time-gate valide.
4) Systeme renvoie un statut neutre si anti-abus declenche, sans oracle.
5) Si valide: message stocke, email support envoye, accusé utilisateur envoye avec ticketId.

## 5) API contract (interne)
Endpoint: `POST /api/v1/contact`

Request body (JSON):
- `firstName` (string, optionnel, max 80)
- `lastName` (string, optionnel, max 80)
- `email` (string, requis, max 120)
- `message` (string, requis, max 4000)
- `consent` (boolean, requis, true)
- `honeypot` (string, doit etre vide)
- `clientTimeOnPageSeconds` (number, optionnel) ou `timeGateToken`

Response (success):
- `status`: "ok"
- `ticketId`: string (opaque)
- `message`: "Merci, nous avons bien recu votre demande."

Response (validation error):
- `status`: "error"
- `errors`: { champ: "message" }

Response (anti-abuse / rate limit):
- `status`: "error"
- `message`: "Reessaie plus tard."

Notes:
- Ne pas echo de HTML; reponses texte uniquement.
- Protections anti injection d'entetes email.

## 6) Data model
Table `contact_messages`:
- `id` (UUID)
- `ticket_id` (string, unique)
- `first_name` (nullable)
- `last_name` (nullable)
- `email` (string)
- `message` (text)
- `consent_at` (datetime)
- `created_at` (datetime)
- `ip_prefix` (string)
- `ip_hash` (string, salted)
- `abuse_score` (nullable, numeric)

Aucun stockage de payload dans les logs applicatifs.

## 7) Retention & purge
- Messages: retention max 6 mois.
- Logs techniques: retention max 30 jours.
- Purge automatisee, non reversible.

## 8) Emails
- Notification support: resume minimal, sans HTML brut, pas d'attachements.
- Accuse utilisateur: confirmation de prise en compte + ticketId, sans details sensibles.
- Subject et headers proteges contre l'injection.

## 9) Strategie d'erreur (anti-oracle)
- Erreurs de validation: champ par champ.
- Anti-abus: message neutre "Reessaie plus tard." sans indiquer stockage.
- Pas de differenciation entre emails existants/inexistants.

## 10) Securite et anti-abus
- Honeypot invisible.
- Time-gate (delai minimal avant submission) ou token serveur.
- Rate limiting par IP prefix + hash sale.
- Logs sans PII; IP full jamais stockee.
- Erreurs neutres et non revelatrices.

## 11) Observabilite (sans PII)
- Compteurs: volume d'envois, taux d'erreur, taux d'anti-abus.
- Aucune donnée de message dans les traces.

## 12) RGPD & legal
- Base legale: consentement explicite pour le contact.
- Droit d'acces, rectification, effacement via contact@pixelprowlers.io.
- Retention courte et purge automatique communiquees.

## 13) Accessibilite
- Champs avec labels associes et aides contextuelles.
- Messages d'erreur lisibles et annonces ARIA.
- Focus visible et ordre de tabulation logique.

## 14) Acceptance criteria
- Le formulaire valide cote client et cote serveur avec erreurs par champ.
- Les messages sont stockes au maximum 6 mois puis purges.
- Les logs ne contiennent pas de contenu de message ni d'email en clair.
- Les erreurs anti-abus sont neutres et non oracles.
- L'accuse utilisateur est envoye avec ticketId.
- P1 reste front-only, sans retention serveur de reponses.
