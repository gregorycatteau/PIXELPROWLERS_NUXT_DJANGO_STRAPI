---
id: PX_V1_3_X_OPERATION_125_PRODUCT_SPEC
version: 1.0.1
status: active
date: 2025-12-24
owners: ["Marty"]
scope: ["pixelprowlers.io", "offer:operation125"]
tags:
  - offer
  - bootcamp
  - sprint
  - vuca
  - bani
  - governance
  - security
  - privacy-first
---

# OPÉRATION 125% — Product Spec (V1.3.x feature)

## 0) Pitch (public)
> “Tu veux PixelProwlers à 125% ? Alors toi aussi, tu viens à 125%.
> Ici on ne pose pas un vernis. On casse les mirages, on décide, on livre, on durcit.”

## 1) Objectifs
### 1.1 Objectif principal
Installer en 14 jours un **système opérationnel** :
- décisions claires
- documentation minimale mais probante
- hygiène sécu pragmatique
- plan 30 jours réaliste
- rituels d’entretien anti-régression

### 1.2 Objectifs secondaires
- révéler les incohérences systémiques qui sabotent la mission
- sortir du “mirage de conformité” et du “mirage de bienveillance”
- construire une souveraineté numérique minimale viable (sans devenir tech)

## 2) Format
### 2.1 Bootcamp présentiel (7h)
- public : **date + ville + durée**
- **adresse exacte non publique** : communiquée après validation Gate + confirmation
- programme volontairement non figé (adaptatif)
- produit des livrables non négociables (voir §5)

### 2.2 Sprint 14 jours
- micro-actions quotidiennes (20–40 min)
- 2 checkpoints
- 1 review “bouclier” (sécu/orga)
- sortie : livrables + gates validés

## 3) Gate d’entrée (filtre “prêts / pas prêts”)
### 3.1 Principe
Réservé aux structures qui acceptent :
- remise en question radicale
- décisions explicites
- exécution réelle

Communication :
- “Not ready” = **refus protecteur**, pas un jugement.
- sortie : Dojo gratuit + ressources + “quand revenir”.

### 3.2 Conditions minimales
- sponsor identifié (autorité d’arbitrage)
- disponibilité réelle (bootcamp + sprint)
- acceptation explicite “pas de surcouche as usual”
- acceptation des livrables non négociables

## 4) UX / Pages
### 4.1 Page “Opération 125%”
- promesse “vérité + livrables”
- “pour qui / pas pour qui”
- bootcamp : **date + ville** (adresse après confirmation)
- CTA unique : “Demander une place (Gate)”

### 4.2 Gate (formulaire) — minimal + durci
#### Données minimales
- structure : nom
- taille : range
- ville
- sponsor : nom + email

#### Engagements (checkboxes obligatoires)
- nous acceptons de remettre en question nos croyances/pratiques
- un sponsor peut arbitrer et décider
- nous acceptons les livrables non négociables (preuve > storytelling)
- nous pouvons libérer du temps pendant 14 jours

#### Champ libre (optionnel, sous contrat)
Champ : “Ce que vous êtes prêts à changer / abandonner”
- disclaimer visible :
  - pas de noms
  - pas d’accusations
  - pas de données personnelles
  - pas de dumps internes
- clamp : **800 caractères max**
- hardening Unicode :
  - NFKC + strip zero-width + trim
  - rejet des caractères de contrôle
- détection anti-abus minimale :
  - si 2+ emails OU 2+ numéros détectés → rejet OU HOLD
- **HOLD (défini)**
  - mise en attente manuelle (pas de traitement automatique)
  - purge si non qualifié sous **14 jours**
- **jamais** recopié dans un email, ni cité dans un template

#### Anti-abus sans CAPTCHA tiers (obligatoire)
- rate limiting serveur + honeypot + validation stricte + erreurs neutres
- **rate limit V1 (ordre de grandeur, chiffré)**
  - 5 soumissions / 15 min / IP
  - + 1 soumission / minute / IP
- erreurs neutres :
  - réponses serveur uniformes en cas de rejet anti-abus
  - pas d’indication exploitable (anti probing/énumération)
- PoW léger : hors V1, option si spam réel

## 5) Livrables V1 (non négociables)
1) Carte système (boucles / incitations / angles morts)
2) Contrat de décision (qui décide quoi, quand, avec quelle preuve)
3) Plan 30 jours (3 chantiers max)
4) Souveraineté minimale viable (accès/partage/backup testée + restore)
5) Rituels d’entretien (15–30 min/semaine)

## 6) Sécurité & Privacy (verrous)
### 6.1 Rétention (chiffrée, canon)
- Gate (DB) : **6 mois max**
- Logs serveur : **30 jours max**
- Emails :
  - contenu neutre uniquement
  - **aucune citation du formulaire** (aucun champ texte)
  - politique d’archivage/purge alignée (pas d’archive de conflit)

### 6.2 Compartimentation (anti “CRM caché”)
- Gate : zone/table dédiée (minimale)
- facturation : espace séparé
- notes d’accompagnement : autre espace (Relinium/SSOT interne) + consentement
- interdit : scoring marketing / retargeting / lookalike / profilage

### 6.3 Email neutre (anti fuite)
- pas de détails sensibles
- pas d’analyse/diagnostic
- pas d’adresse exacte avant confirmation
- pas de citations du formulaire (anti reply quoting)

## 7) Metrics (privacy-preserving)
Compteurs agrégés uniquement :
- vues page
- soumissions Gate (success/fail)
- ratio ready/not ready
- conversion contact → confirmation
Aucun identifiant stable, aucun tracking cross-pages.

## 8) Gouvernance d’exploitation (à préciser)
- qui lit les demandes
- comment la décision ready/not ready est prise
- où et comment ça s’archive (minimal)
Objectif : éviter stockage fantôme / dérive “CRM implicite”.
