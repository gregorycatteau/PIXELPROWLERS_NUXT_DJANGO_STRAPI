---
id: PX_V1_3_P1_ENGAGEMENT_INTEGRATION
version: 1.0.0
status: draft
date: 2025-12-24
owners: ["Marty"]
  - Marty
scope:
  - docs/20-product_specs/**
tags:
  - product_specs
  - functional
---

# PX_V1_3_P1_ENGAGEMENT_INTEGRATION.md
## Intégration des niveaux N1–N4 dans le parcours P1

## 1. Objet

Ce document précise **comment** les niveaux d’engagement publics N1–N4
(PixelProwlers) sont intégrés concrètement dans le parcours P1
« Ma structure dysfonctionne ».

P1 doit :

- rester pleinement utile en **mode N1 solo** (sans contact avec PixelProwlers),
- proposer, **sans pression**, des portes d’entrée vers N2, N3 et N4,
- respecter les contraintes de souveraineté et de non-corrélation automatique
  entre diagnostic P1 et une éventuelle demande d’accompagnement.

---

## 2. Rappel des niveaux P1 (résumé)

- **N1 – Auto-défense solo** : diagnostic P1 + bilans + ressources solo.
- **N2 – Miroir sécurisé** : lecture externe P1 + reformulation et priorisation.
- **N3 – Atelier tactique** : travail ciblé sur un axe / bloc (1–3 ateliers).
- **N4 – Re-architecture accompagnée** : programme P1 étendu sur plusieurs mois.

Level 5 (défense active) reste **interne** et ne doit pas apparaître dans P1.

---

## 3. Surfaces P1 impactées

Les ajustements concernent 4 zones principales du parcours :

1. **E0 – Intro atelier P1**
2. **E2 – Bilan Panorama**
3. **Bilan global P1** (écran de synthèse après les blocs)
4. **E6 – Carrefour & sorties**

Les questionnaires eux-mêmes (E1, blocs d’exploration) ne sont pas modifiés
par les niveaux d’engagement.

---

## 4. E0 – Intro atelier P1

### 4.1. Intention

- Rassurer sur le fait que P1 peut être vécu **en entier en mode N1**.
- Évoquer l’existence de niveaux ultérieurs **sans les détailler**.
- Ne pas saturer l’écran de détails sur la privacy (doublon avec d’autres pages).

### 4.2. Ajustements attendus

- Texte d’intro raccourci et recentré sur :
  - “atelier de diagnostic solo”,
  - “tu peux t’arrêter quand tu veux”,
  - “tu peux garder les résultats pour toi”.
- Mention légère :
  - “Si à un moment tu as besoin d’un regard extérieur, on te proposera des options.”

### 4.3. Pas de CTA niveaux ici

- E0 ne présente **aucun CTA N2/N3/N4**.
- L’utilisateur reste dans la logique : *“je teste, pour moi”*.

---

## 5. E2 – Bilan Panorama

### 5.1. Intention

- Donner une **lecture claire** des 4 axes,
- Poser une première **mise en perspective**,
- Proposer un **premier choix N1 vs N2**, sans tout de suite sortir du parcours.

### 5.2. Ajustements de contenu

- Structure narrative par axe :
  - intro courte “Ce panorama te donne 4 regards sur ta structure…”,
  - 1 carte par axe :
    - nom de l’axe,
    - phrase de synthèse,
    - 2–3 lignes d’interprétation,
  - mini conclusion : “Ce que tu peux faire maintenant de ce panorama”.

- Ajout d’une section finale :
  - “Continuer en solo pour l’instant (Niveau 1)”
  - “Envie d’un miroir sur ce panorama ? (Niveau 2)”

### 5.3. CTA

- CTA N1 (par défaut) :
  - bouton ou lien :
    - “Continuer le diagnostic”
    - ou “Explorer plus finement certains axes”
  - renvoie vers les blocs P1 (E3).

- CTA N2 (optionnel) :
  - lien discret :
    - “Demander un miroir externe sur ce panorama”
  - renvoie vers :
    - soit une page d’explication des niveaux,
    - soit un futur formulaire/contact dédié P1 (à implémenter plus tard).

---

## 6. Bilan global P1

### 6.1. Intention

- Donner une **vision intégrée** :
  - axes Panorama,
  - blocs explorés,
  - patterns remarquables.
- Proposer **clairement** les différents niveaux possibles :
  - rester en N1,
  - passer en N2,
  - envisager N3 (atelier),
  - ou N4 (programme d’accompagnement).

### 6.2. Ajustements de contenu

- Narration :
  - rappeler que l’utilisateur a déjà fait un travail important,
  - reformuler les 2–3 grandes lignes de tension / enjeu.

- Section “Ce que tu peux choisir maintenant” avec 3 à 4 options :

  1. **Rester en solo (N1)**  
     - garder ses bilans, continuer à observer, utiliser les ressources téléchargeables.

  2. **Demander un miroir (N2)**  
     - faire lire ses résultats et recevoir un retour structuré.

  3. **Travailler un sujet ciblé (N3)**  
     - atelier sur un axe spécifique (réunions, décisions, climat, etc.).

  4. **Parler re-architecture (N4)**  
     - si la structure est prête à un travail plus profond.

### 6.3. CTA

- N1 : “Télécharger mon bilan” / “Garder trace pour moi”.
- N2 : “Obtenir un miroir sur ma situation”.
- N3 : “Co-designer un atelier pour ma structure”.
- N4 : “Discuter d’un accompagnement en profondeur”.

Ces CTA peuvent rester **symboliques** au début (placeholder) en attendant
les flux Relinium/Fit.

---

## 7. E6 – Carrefour & sorties

### 7.1. Intention

- Devenir la **porte de sortie structurée** basée sur les niveaux N1–N4.
- Ne pas être un simple “menu de liens”, mais une **mise en scène de choix**.

### 7.2. Ajustements attendus

- E6 présente :
  - un rappel très synthétique du bilan,
  - une version simplifiée des 4 niveaux d’engagement,
  - 1 à 3 CTA maximum affichés selon le contexte (profil de tension).

- Stratégie produit :
  - P1 reste principalement **orienté N1–N2** en V1.3,
  - N3–N4 peuvent être présentés comme :
    - “options à explorer en en parlant ensemble”,
    - pas comme un “funnel automatique”.

---

## 8. Contraintes de sécurité / souveraineté

- Les CTAs N2/N3/N4 ne doivent **jamais** :
  - envoyer automatiquement les réponses P1,
  - pré-remplir un contact avec des données détaillées sans consentement explicite.

- Si un flux futur permet de partager des bilans :
  - il doit être basé sur :
    - un export *volontaire* (upload, copier-coller, lien Relinium),
    - des consentements clairs,
    - des logs d’accès.

- P1 doit rester **entièrement valide en mode N1** :
  - aucune fonctionnalité critique ne doit être conditionnée
    au passage à N2/N3/N4.

