---
id: FORMULAIRE_CONTACT
version: 0.1.0
status: draft
date: 2025-12-24
owners: ["Marty", "Claire"]
scope: ["docs/**", "frontend_nuxt/app/pages/contact.vue"]
tags: ["user_stories", "contact", "form", "product_specs"]
---

# Formulaire de Contact — User Stories

> **Status** : Draft — À compléter avec les user stories du formulaire contact.

## Objectif

Définir les user stories pour le formulaire de contact PixelProwlers.

## User Stories

### US-CONTACT-001 : Envoi de message

**En tant que** visiteur,  
**Je veux** pouvoir envoyer un message via le formulaire de contact,  
**Afin de** poser une question ou demander plus d'informations.

#### Critères d'acceptation

- [ ] Le formulaire contient les champs : nom, email, message
- [ ] Validation côté client des champs obligatoires
- [ ] Validation email format valide
- [ ] Message de confirmation après envoi réussi
- [ ] Message d'erreur en cas d'échec

### US-CONTACT-002 : Protection anti-spam

**En tant que** propriétaire du site,  
**Je veux** une protection contre le spam,  
**Afin de** ne recevoir que des messages légitimes.

#### Critères d'acceptation

- [ ] Honeypot field invisible
- [ ] Rate limiting sur l'API
- [ ] Pas de CAPTCHA visible (privacy-first)

## Spécifications techniques

- **Frontend** : `frontend_nuxt/app/pages/contact.vue`
- **Backend** : `backend_django/apps/contact/`
- **API** : POST `/api/contact/`

---

*Document à enrichir selon les besoins produit.*
