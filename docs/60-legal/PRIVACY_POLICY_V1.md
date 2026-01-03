---
id: PRIVACY_POLICY_V1
version: "1.3"
status: active
date: 2025-12-24
owners: ["Eva", "Shafi"]
  - Marty
scope: legal
tags:
  - legal
  - privacy
  - rgpd
  - data-minimization
  - retention
  - no-tracking
---

# Politique de Confidentialité PixelProwlers

> **Dernière mise à jour** : 24 décembre 2025  
> **Version** : 1.3

---

## 1. Introduction

### 1.1 Responsable du traitement

**PixelProwlers** est responsable du traitement des données personnelles collectées via la plateforme.

- **Entité** : Monsieur Gregory Catteau — Entrepreneur individuel
- **SIREN** : 520 890 336
- **Activité** : Activités spécialisées de design (NAF 74.10Z)
- **Adresse** : 13 rue des déportés et internés,33340 Queyrac 
- **Contact** : contact@pixelprowlers.io
- **Site web** : https://pixelprowlers.io

### 1.2 Périmètre d'application

Cette politique s'applique à l'ensemble des services proposés sur la plateforme PixelProwlers :

- **Parcours de diagnostic** (P1-P4) — parcours sans création de compte
- **Bibliothèque de ressources** — consultation libre
- **Formulaire de contact** — communication directe
- **Gate Opération 125** — inscription aux formations/bootcamps

### 1.3 Engagement fondamental

PixelProwlers adopte une approche **privacy-first** et **data-minimization** :

| Principe | Engagement |
|----------|------------|
| 🚫 Pas de tracking tiers | Aucun Google Analytics, Facebook Pixel, etc. |
| 🚫 Pas d'UTM/profilage | Aucun paramètre de tracking dans les URLs |
| 🚫 Pas d'identifiant stable | Aucun identifiant cross-pages ou cross-sessions |
| ✅ Parcours sans compte | Aucune inscription requise pour les diagnostics |
| ✅ Données locales | Réponses stockées localement dans le navigateur |

---

## 2. Données collectées par fonctionnalité

### 2.1 Parcours de diagnostic (P1, P2, P3, P4)

Les parcours de diagnostic sont conçus pour fonctionner **sans création de compte** et avec une **minimisation maximale**.

| Donnée | Type | Stockage | Durée |
|--------|------|----------|-------|
| Réponses aux questions | Agrégats numériques | localStorage (navigateur) | Jusqu'à effacement manuel |
| Scores par bloc | Agrégats calculés | localStorage | Jusqu'à effacement manuel |
| Recommandations générées | Texte généré localement | localStorage | Jusqu'à effacement manuel |

**Ce que nous NE collectons PAS** :
- ❌ Réponses brutes individuelles sur nos serveurs
- ❌ Historique de navigation dans le parcours
- ❌ Temps passé par question
- ❌ Identifiant utilisateur stable

### 2.2 Bibliothèque de ressources

La consultation de la bibliothèque de ressources ne génère **aucune collecte de données personnelles**.

| Donnée | Collecte |
|--------|----------|
| Pages consultées | ❌ Non collecté |
| Ressources téléchargées | ❌ Non collecté |
| Recherches effectuées | ❌ Non collecté |
| Filtres utilisés | ❌ Non collecté |

### 2.3 Formulaire de contact (full-stack)

Le formulaire de contact est traite cote serveur pour repondre aux demandes. Les donnees sont conservees au maximum 6 mois, puis purgees automatiquement. Des emails transactionnels sont emis (notification interne et accuse utilisateur). Les logs techniques sont anonymises et ne contiennent pas le contenu des messages. Le diagnostic P1 reste front-only, sans retention serveur des reponses.

| Donnée | Obligatoire | Finalité | Rétention |
|--------|-------------|----------|-----------|
| Nom | Oui | Identification | 6 mois |
| Email | Oui | Réponse | 6 mois |
| Message | Oui | Traitement demande | 6 mois |
| Entreprise | Non | Contexte | 6 mois |
| Téléphone | Non | Contact alternatif | 6 mois |

### 2.4 Gate Opération 125 (formations/bootcamps)

L'inscription aux formations et bootcamps nécessite des données supplémentaires pour la gestion logistique.

| Donnée | Obligatoire | Finalité | Rétention |
|--------|-------------|----------|-----------|
| Nom complet | Oui | Identification, certificat | 6 mois après fin formation |
| Email | Oui | Communication logistique | 6 mois après fin formation |
| Téléphone | Oui | Urgences, rappels | 6 mois après fin formation |
| Entreprise/Poste | Oui | Adaptation pédagogique | 6 mois après fin formation |
| Besoins spécifiques | Non | Accessibilité | 6 mois après fin formation |

**Information importante sur les lieux** :
- 📍 **Ville + date** : Information publique
- 🔒 **Adresse exacte** : Communiquée uniquement après validation de l'inscription

---

## 3. Finalités strictes

Les données collectées sont utilisées **exclusivement** pour les finalités suivantes :

| Finalité | Base légale | Données concernées |
|----------|-------------|-------------------|
| Réponse aux demandes de contact | Consentement | Contact |
| Gestion des inscriptions formations | Contrat | Gate 125 |
| Envoi des convocations bootcamp | Contrat | Gate 125 |
| Émission des certificats | Contrat | Gate 125 |
| Amélioration de la plateforme | Intérêt légitime | Agrégats anonymes uniquement |
| Prévention des abus (rate limiting) | Intérêt légitime | Compteurs IP anonymisés |

**Ce que nous NE faisons PAS** :
- ❌ Profilage comportemental
- ❌ Publicité ciblée
- ❌ Revente ou partage de données à des tiers
- ❌ Croisement de données entre fonctionnalités
- ❌ Scoring ou notation des utilisateurs

---

## 4. Base légale RGPD et minimisation

### 4.1 Bases légales utilisées

| Base légale | Application |
|-------------|-------------|
| **Consentement** (art. 6.1.a) | Formulaire de contact, newsletter (si applicable) |
| **Exécution d'un contrat** (art. 6.1.b) | Inscription formations, bootcamps |
| **Intérêt légitime** (art. 6.1.f) | Sécurité, prévention des abus, agrégats anonymes |

### 4.2 Principe de minimisation (art. 5.1.c)

PixelProwlers applique rigoureusement le principe de minimisation :

```
┌─────────────────────────────────────────────────┐
│  PRINCIPE : Ne collecter QUE ce qui est         │
│  strictement nécessaire à la finalité déclarée  │
└─────────────────────────────────────────────────┘
```

**Mise en œuvre concrète** :
- Les parcours fonctionnent avec des **agrégats locaux** uniquement
- Les formulaires ne demandent **que les champs indispensables**
- Les logs serveur sont **neutres** (pas de payload brut)
- Les identifiants sont **éphémères** et non corrélables

### 4.3 Privacy by Design

La plateforme est conçue selon les principes de **Privacy by Design** :

1. **Proactif** : Protection intégrée dès la conception
2. **Par défaut** : Paramètres les plus protecteurs activés
3. **Intégré** : Sécurité native, pas ajoutée après coup
4. **Fonctionnel** : Pas de compromis fonctionnalité/vie privée
5. **Bout en bout** : Protection sur tout le cycle de vie
6. **Visible** : Transparence totale
7. **Centré utilisateur** : L'utilisateur garde le contrôle

---

## 5. Durées de conservation

### 5.1 Tableau récapitulatif

| Catégorie | Données | Durée | Justification |
|-----------|---------|-------|---------------|
| **Parcours** | Réponses, scores | Navigateur local | Contrôle utilisateur |
| **Contact** | Formulaire | **6 mois** | Délai raisonnable de traitement |
| **Gate 125** | Inscription | **6 mois après fin formation** | Obligations contractuelles |
| **Logs serveur** | Accès, erreurs | **30 jours** | Sécurité, debugging |
| **Emails archivés** | Correspondance | **12 mois** puis purge | Traçabilité légale |
| **Compteurs anti-abus** | IP hashés | **24 heures** | Rate limiting uniquement |

### 5.2 Procédure de purge

```
┌──────────────────────────────────────────────────┐
│  PURGE AUTOMATIQUE                               │
│  ─────────────────                               │
│  • Logs serveur : cron quotidien, rétention 30j │
│  • Compteurs IP : reset automatique à 24h       │
│  • Sessions : expiration 24h sans activité      │
└──────────────────────────────────────────────────┘
```

### 5.3 Archivage et suppression

| Phase | Action | Déclencheur |
|-------|--------|-------------|
| **Active** | Données accessibles | Période d'utilisation |
| **Archive** | Accès restreint | Fin de la finalité |
| **Purge** | Suppression définitive | Fin de rétention |

---

## 6. Destinataires et sous-traitants

### 6.1 Accès internes

| Rôle | Accès | Justification |
|------|-------|---------------|
| Équipe pédagogique | Gate 125 | Organisation formations |
| Support | Contact | Réponse aux demandes |
| Technique | Logs (anonymisés) | Maintenance, sécurité |

### 6.2 Sous-traitants

| Prestataire | Service | Localisation | Garanties |
|-------------|---------|--------------|-----------|
| [Hébergeur] | Hébergement serveurs | UE | Clauses contractuelles types |
| [Email provider] | Envoi emails transactionnels | UE | DPA signé |

**Note** : Aucun sous-traitant n'a accès aux réponses des parcours (stockées localement).

### 6.3 Transferts hors UE

PixelProwlers **ne transfère pas** de données personnelles hors de l'Union Européenne.

Si un tel transfert devait être nécessaire, il serait encadré par :
- Décision d'adéquation de la Commission européenne, ou
- Clauses contractuelles types (CCT), ou
- Binding Corporate Rules (BCR)

---

## 7. Sécurité

### 7.1 Mesures techniques

| Mesure | Implémentation |
|--------|----------------|
| **Chiffrement transit** | TLS 1.3 sur toutes les connexions |
| **Chiffrement repos** | AES-256 pour données sensibles |
| **Hachage mots de passe** | bcrypt (coût ≥12) |
| **Headers sécurité** | CSP strict, HSTS, X-Frame-Options |
| **Rate limiting** | Protection contre brute force |

### 7.2 Logs neutres

Les logs serveur sont conçus pour être **neutres** et ne pas compromettre la vie privée :

```
┌─────────────────────────────────────────────────────┐
│  LOGS NEUTRES - Ce qui est enregistré :            │
│  ────────────────────────────────────────          │
│  ✅ Timestamp                                       │
│  ✅ Code HTTP (200, 404, 500...)                   │
│  ✅ Endpoint appelé (sans paramètres sensibles)    │
│  ✅ IP hashée (non réversible)                     │
│                                                     │
│  LOGS NEUTRES - Ce qui N'EST PAS enregistré :     │
│  ────────────────────────────────────────          │
│  ❌ Payload des requêtes                           │
│  ❌ Contenu des formulaires                        │
│  ❌ Headers d'authentification                     │
│  ❌ Cookies                                        │
│  ❌ User-Agent complet                             │
└─────────────────────────────────────────────────────┘
```

### 7.3 Contrôle d'accès

| Niveau | Accès | Authentification |
|--------|-------|------------------|
| Admin système | Logs, configuration | MFA obligatoire |
| Équipe pédago | Gate 125 uniquement | Mot de passe + 2FA |
| Support | Contact uniquement | Mot de passe + 2FA |

### 7.4 Réponse aux incidents

En cas de violation de données :
1. Notification CNIL sous 72h si risque pour les droits
2. Information des personnes concernées si risque élevé
3. Documentation de l'incident (cf. INCIDENT_RESPONSE_V1)

---

## 8. Droits des personnes

### 8.1 Vos droits RGPD

| Droit | Description | Comment l'exercer |
|-------|-------------|-------------------|
| **Accès** (art. 15) | Obtenir une copie de vos données | Email à contact@pixelprowlers.io |
| **Rectification** (art. 16) | Corriger des données inexactes | Email à contact@pixelprowlers.io |
| **Effacement** (art. 17) | Demander la suppression | Email à contact@pixelprowlers.io |
| **Limitation** (art. 18) | Restreindre le traitement | Email à contact@pixelprowlers.io |
| **Portabilité** (art. 20) | Recevoir vos données en format lisible | Email à contact@pixelprowlers.io |
| **Opposition** (art. 21) | S'opposer au traitement | Email à contact@pixelprowlers.io |

### 8.2 Procédure d'exercice

1. **Envoyez votre demande** à contact@pixelprowlers.io
2. **Précisez** :
   - Votre identité (nom, email utilisé)
   - Le droit que vous souhaitez exercer
   - Les données concernées
3. **Réponse** sous 30 jours (extensible à 60 jours si complexité)

### 8.3 Données des parcours

Pour les données des parcours stockées localement :
- **Vous avez le contrôle total** via votre navigateur
- Accédez à vos données : `localStorage` dans les DevTools
- Supprimez vos données : Effacer les données du site dans les paramètres

### 8.4 Réclamation CNIL

Vous pouvez introduire une réclamation auprès de la CNIL :
- **Site** : https://www.cnil.fr
- **Adresse** : 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07

---

## 9. Cookies et traceurs

### 9.1 Politique "No Tracking"

PixelProwlers applique une politique stricte de **zéro tracking tiers** :

| Catégorie | Présence | Détails |
|-----------|----------|---------|
| Cookies analytiques (GA, Matomo...) | ❌ Aucun | Pas de tracking comportemental |
| Cookies publicitaires | ❌ Aucun | Pas de publicité |
| Pixels de suivi | ❌ Aucun | Pas de Facebook Pixel, etc. |
| UTM parameters | ❌ Non utilisés | Pas de tracking marketing |
| Fingerprinting | ❌ Non pratiqué | Pas d'identification passive |

### 9.2 Cookies techniques utilisés

| Cookie | Finalité | Durée | Base légale |
|--------|----------|-------|-------------|
| `session_id` | Session utilisateur | Session | Fonctionnement |
| `csrf_token` | Protection CSRF | Session | Sécurité |
| `consent` | Mémoriser choix cookies | 12 mois | Consentement |

### 9.3 localStorage (non-cookie)

Le `localStorage` est utilisé pour stocker les données des parcours **localement dans votre navigateur** :

- ✅ Données sous votre contrôle exclusif
- ✅ Jamais transmises à nos serveurs
- ✅ Supprimables à tout moment via les paramètres navigateur

---

## 10. Mises à jour de cette politique

### 10.1 Processus de mise à jour

| Étape | Action |
|-------|--------|
| 1 | Rédaction des modifications |
| 2 | Validation juridique |
| 3 | Mise à jour du numéro de version |
| 4 | Publication sur le site |
| 5 | Notification si changement majeur |

### 10.2 Notification des changements

- **Changements mineurs** (clarifications, corrections) : Mise à jour silencieuse
- **Changements majeurs** (nouvelles finalités, nouveaux sous-traitants) : Notification par email aux utilisateurs inscrits

### 10.3 Historique des versions

| Version | Date | Changements |
|---------|------|-------------|
| 1.3 | 2025-12-24 | Version initiale complète |

---

## Contact

Pour toute question relative à cette politique de confidentialité :

📧 **Email** : contact@pixelprowlers.io  
📍 **Adresse** : [À compléter]  
🌐 **Site** : https://pixelprowlers.io

---

*Cette politique de confidentialité est conforme au Règlement Général sur la Protection des Données (RGPD - Règlement UE 2016/679) et à la loi Informatique et Libertés modifiée.*
