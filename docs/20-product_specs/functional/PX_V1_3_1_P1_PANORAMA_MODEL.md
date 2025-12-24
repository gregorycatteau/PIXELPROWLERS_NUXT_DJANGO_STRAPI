---
id: PX_V1_3_1_P1_PANORAMA_MODEL
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Marty"]
  - Marty
scope:
  - docs/20-product_specs/**
tags:
  - product_specs
  - functional
---

# PX_V1_3_1_P1_PANORAMA_MODEL.md

## 1. Objet

Ce document précise le modèle du **Panorama E1** pour le parcours P1
(« Ma structure dysfonctionne »), version 1.3.1.

Objectif :
- 16 questions,
- 4 axes,
- 4 blocs de progression,
- avec un modèle de poids et de criticité stable pour alimenter un bilan par axe.

## 2. Axes du panorama

- `humain` – climat, coopération, sécurité psychologique.
- `mouvement` – dynamique, sentiment d’avancer ou de piétiner.
- `decisions` – clarté, légitimité, communication, compréhension.
- `structure` – robustesse, répartition des rôles, continuité de fonctionnement.

Ces axes doivent être :
- annoncés dans l’intro du panorama (E1),
- repris tels quels dans le bilan (E2).

## 3. Grille 4 × 4 (blocs × axes)

Le panorama est structuré en 4 blocs successifs :

- B1 – Entrée (prise de température),
- B2 – Affiner,
- B3 – Creuser,
- B4 – Questions sentinelles.

Dans chaque bloc, l’utilisateur répond à une assertion par axe :

| Bloc | human_axis | movement_axis | decisions_axis | structure_axis |
|------|------------|---------------|----------------|----------------|
| B1   | Q_h_1      | Q_m_1         | Q_d_1          | Q_s_1          |
| B2   | Q_h_2      | Q_m_2         | Q_d_2          | Q_s_2          |
| B3   | Q_h_3      | Q_m_3         | Q_d_3          | Q_s_3          |
| B4   | Q_h_4      | Q_m_4         | Q_d_4          | Q_s_4          |

Chaque `Q_*_*` sera une assertion P1Question (cf. PX_V1_3_P1_QUESTION_SCHEMA.md).

## 4. Poids & criticité

### 4.1. Poids par bloc

- **Bloc B1 (entrée)**  
  - `weight = 1` pour les 4 questions.  
  - `critical = false`.

- **Bloc B2 (affiner)**  
  - `weight = 2` pour les 4 questions.  
  - `critical` utilisé seulement si une assertion touche un sujet sensible (à documenter par question).

- **Bloc B3 (creuser)**  
  - `weight = 2 ou 3` selon les questions.  
  - Certaines questions peuvent être marquées `critical = true` si elles touchent :
    - la sécurité psychologique,
    - des conflits ouverts,
    - des situations de surcharge chronique,
    - des décisions systématiquement opaques.

- **Bloc B4 (sentinelles)**  
  - `weight = 3` pour les 4 questions.  
  - `critical = true` pour la majorité des questions (sauf exception à documenter).

### 4.2. Rôle produit

- Les poids sont utilisés pour :
  - moduler l’influence d’une réponse sur la tension globale de l’axe,
  - éviter qu’une seule réponse légère en B1 ne domine un axe.

- La marque `critical` est utilisée pour :
  - déclencher des nuances de ton dans le bilan,
  - déclencher des plans d’action plus prudents,
  - prioriser certaines ressources (fiches, canevas).

## 5. Règles UX / expérience

- L’utilisateur ne voit pas les notions de `B1/B2/B3/B4`, de poids ou de criticité.
- Il expérimente seulement :
  - une séquence de 16 assertions,
  - avec une progression narrative logique (les questions deviennent plus précises / profondes).
- La navigation doit rester fluide (pas de rupture visuelle brutale entre blocs).

## 6. Impacts sur l’implémentation

### 6.1. Pour Talia (UX / contenu)

- Rédiger 16 assertions V1.3 :
  - 4 par axe,
  - en respectant la progression “entrée → affiner → creuser → sentinelles”.
- Pour chaque assertion :
  - proposer une polarité (`positive` ou `negative`),
  - suggérer un poids (1 / 2 / 3) si besoin d’ajuster le modèle par défaut,
  - signaler si la question doit être `critical = true`.

### 6.2. Pour Dan / Codex (implémentation)

- Adapter la config P1Question V1.3 pour intégrer :
  - les 16 questions,
  - les axes,
  - les blocs,
  - les poids,
  - la criticité.
- S’assurer que le calcul des scores par axe utilise bien :
  - `weight`,
  - `critical` (le cas échéant),
  - la `polarity` et la `tensionScore` (cf. useJourneyDiagnostics).
