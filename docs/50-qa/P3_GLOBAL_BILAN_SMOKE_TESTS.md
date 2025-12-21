# P3 Global Bilan — Smoke tests (core-only)

1. **Empty/missing adapter fallback**
   - Action: forcer un parcours inconnu ou VM `meta.isEmpty=true`.
   - Attendu: message “Bilan indisponible” + bouton Retour, aucun crash.

2. **Panorama + bloc P3**
   - Action: ouvrir P3 via `GlobalBilanEngine` (journeyId=`p3`).
   - Attendu: 4 axes affichés (scores 1–4), un bloc “Bloc de base P3” avec complétion 75%, sommaire limité (Panorama/Export), aucune section issues/hypothèses/atterrissage/actions.

3. **Partial state**
   - Action: vérifier la mention “Bilan partiel” en haut (modules absents).
   - Attendu: aucune CTA d’actions/ressources/hypothèses; pas d’erreur console.

4. **Export**
   - Action: lancer l’export P3.
   - Attendu: texte “Bilan P3 (panorama + blocs)” copié, pas de données brutes ni d’erreur.
