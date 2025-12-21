# P2 Global Bilan — Smoke tests (engine + adapter)

Scénarios rapides pour valider l’adapter P2 minimal (panorama + blocs + export).

## 1) Empty state
- Action: forcer un parcours sans adapter (journeyId inconnu) ou VM `meta.isEmpty=true`.
- Attendu: écran “Bilan indisponible pour ce parcours” + bouton Retour, aucun crash, aucune requête réseau.

## 2) Bilan minimal (panorama + bloc)
- Action: ouvrir P2 via `GlobalBilanEngine` (journeyId=`p2`).
- Attendu: 4 axes affichés (scores 1–4) et 1 bloc “Bloc exploratoire” complété; sections issues/hypothèses/atterrissage vides; sommaire réduit (Panorama/Export).

## 3) Export
- Action: lancer Export (copie markdown) en P2.
- Attendu: texte exporté “Bilan P2 (panorama + blocs)” sans données brutes ni réponses; pas d’erreur console.
