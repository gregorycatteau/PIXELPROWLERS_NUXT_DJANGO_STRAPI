---
id: P1_GLOBAL_BILAN_SMOKE_TESTS
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Dan", "Eva"]
  - Marty
scope:
  - docs/55-qa/**
tags:
  - qa
  - testing
---

# P1 Global Bilan — Smoke tests (adapter/engine)

Ce jeu de scénarios vérifie rapidement le nouveau moteur `GlobalBilanEngine` (branch `bilan_refactor`) sans couvrir les cas métier exhaustifs. Suivre l’ordre pour limiter les dépendances de state.

## Pré-requis
- Journey P1 complété avec données suffisantes pour afficher Panorama, Blocs, Tensions, Hypothèses.
- Naviguer jusqu’à `P1GlobalBilan` (nouveau moteur).

## Scénarios

1. **Chargement initial + sommaire**
   - Action: ouvrir la page P1 Global Bilan.
   - Attendu: le sommaire affiche les ancres `Repères`, `Panorama & blocs`, `Ce qui pèse le plus`, `Hypothèses`, `Atterrissage`, `Ressources`, `Export`, `Choisir la suite`. Les chips “Panorama/Blocs” reflètent les counts connus.

2. **Panorama & blocs**
   - Action: vérifier les 4 axes, l’ordre trié, le badge priorité sur les ex aequo max; cliquer sur un bloc pour ouvrir/fermer les détails.
   - Attendu: 0 erreur console, les blocs togglent individuellement, la complétude “Panorama complet/partiel” reste cohérente.

3. **Tensions — lecture rapide vs tout lire**
   - Action: cliquer “Lecture rapide” puis “Tout lire”.
   - Attendu: les cartes “Ce qui pèse le plus” replient/déplient le texte long; le watchlist reste inchangé; aucun dépassement de badge.

4. **Raccourci vers Ressources**
   - Action: sur une carte tension, cliquer “Voir ressources liées”.
   - Attendu: scroll vers la section Ressources, pas de navigation externe ni reload.

5. **Sélection d’hypothèses (max 2)**
   - Action: sélectionner une hypothèse, puis une deuxième; tenter d’en sélectionner une 3e.
   - Attendu: la 3e est désactivée (ou message “Max 2”); les deux sélectionnées affichent l’état “Gardée”; les autres restent dé-sélectionnables après déselection.

6. **Détails d’hypothèse**
   - Action: cliquer “Détails” sur une hypothèse puis réduire.
   - Attendu: aria-expanded et le contenu “Pourquoi ça ressort / Première vérif” apparaissent/disparaissent; pas d’effet sur la sélection.

7. **Plan de vérification**
   - Action: avec ≥1 hypothèse gardée, vérifier la section “Plan de vérification (15–30 min)” puis cliquer “Aller à Atterrissage”.
   - Attendu: la liste des plans contient exactement les hypothèses gardées, chaque plan a 3 steps; le bouton scrolle vers Atterrissage avec highlight 2s max.

8. **Atterrissage sans sélection**
   - Action: enlever toutes les hypothèses gardées.
   - Attendu: Atterrissage affiche le message d’aide + bouton “Revenir aux hypothèses”; aucun protocole rendu.

9. **Atterrissage avec sélection**
   - Action: garder 1–2 hypothèses, aller dans Atterrissage, marquer “Marquer fait”.
   - Attendu: la carte prend la ring/bordure “fait”, le bouton passe à “Marqué fait”, persiste tant que la page reste ouverte.

10. **Export markdown**
    - Action: choisir un mode (minimal/full), cliquer Export; tester Copie.
    - Attendu: pas d’erreur, le clipboard contient du markdown incluant plan d’actions et sections P1, sans réponses brutes.

11. **Reload (state non persisté)**
    - Action: recharger la page.
    - Attendu: sélections hypothèses et “Marqué fait” sont perdues (state mémoire); les données de scoring restent identiques; aucun crash adapter.

12. **Navigation sommaire**
    - Action: utiliser le sommaire (desktop ou mobile) pour sauter entre les sections.
    - Attendu: scroll smooth sur les ancres existantes, aucune navigation externe; les IDs sont stables (`gb_*`).
