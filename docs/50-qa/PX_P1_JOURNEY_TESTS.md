# PX P1 — Script de tests manuels

Scénarios à exécuter à chaque incrément du parcours P1. Objectif : vérifier la reprise, le storage et l’absence de fuite de données.

## Parcours complet “neuf”
- Ouvrir `/parcours/ma-structure-dysfonctionne` sans storage existant.
- Enchaîner E0 → E1 → E2 → E3 → E4 → E5 → E6.
- Vérifier que le carrefour est atteignable et que le paramètre `step` suit la navigation.

## Smoke test skip universel
- E1 Panorama: verifier que "Ignorer cette question" est visible sur une question, puis choisir 1-5 pour annuler le skip.
- B1 Questionnaire: ignorer une question puis repondre, la selection doit remplacer le skip.
- B3 ou B4: ignorer puis repondre, navigation et progression intactes.

## Abandon E1 puis reprise
- Démarrer un questionnaire en E1, quitter la page (reload).
- Au retour, vérifier l’affichage du bandeau de reprise (reprendre ou recommencer).
- Choisir “Reprendre” → reprise au step recommandé ; choisir “Recommencer” → retour E0 et storage vidé.

## Abandon E3 puis reprise
- Compléter E1/E2, entrer en E3, répondre partiellement, recharger.
- Le bandeau propose reprise ; si on reprend, on reste côté E2/E3 selon l’état ; si on recommence, E0 et storage purgé.

## Clear storage en E2/E4
- Depuis E2, cliquer “Effacer mes réponses de cet appareil” → storage purgé, retour E0.
- Répéter en E4 (après avoir complété E3) → storage purgé, retour E0.

## Deep-link `?step=EX`
- Sans storage : appeler `/parcours/ma-structure-dysfonctionne?step=E3` → l’app doit ignorer ou revenir à E0 (step non autorisé sans progression).
- Avec storage q1 complété uniquement : `?step=E3` accepté ; `?step=E5` ignoré → reprise recommandée.
- Avec storage q2 complété : `?step=E5` ou `E6` autorisé, navigation possible sans données diag dans l’URL.

## Carrefour
- Cliquer sur chacune des options (Autonomie, Relinium, Fit).
- Vérifier qu’aucun paramètre d’URL lié au diagnostic n’est ajouté et que seule la route cible est appelée.

## DevTools / console
- Onglet Application → localStorage : seules les clés `pp_journey_p1_scores_v1` / `pp_journey_p1_meta_v1` sont présentes, données agrégées uniquement.
- Bouton “Effacer mes réponses” supprime les clés et réinitialise le parcours.
- Pendant les questionnaires, aucune requête réseau supplémentaire ; les ressources E5 ouvrent des liens externes en nouvel onglet.
- Console : événements analytics coarse (`q1_start`, `q1_complete`, `q2_start`, `q2_complete`, `resource_click`, `relinium_optin_click`, `fit_start`) sans propriétés fines.
