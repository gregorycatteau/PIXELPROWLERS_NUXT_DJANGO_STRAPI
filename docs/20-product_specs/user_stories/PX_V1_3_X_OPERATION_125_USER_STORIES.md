---
id: PX_V1_3_X_OPERATION_125_USER_STORIES
version: 1.0.2
status: active
date: 2025-12-24
owners: ["Marty", "Claire"]
scope: ["pixelprowlers.io", "offer:operation125"]
tags: ["backlog", "user-stories", "acceptance-criteria", "privacy-first", "anti-abuse"]
---

# Opération 125% — Epics & User Stories (V1.3.x feature)

## Epic A — Découverte & décision (page offre)
### US-A1 — Comprendre si c’est pour moi
En tant que visiteur, je veux savoir rapidement si l’Opération 125% est adaptée à mon état d’esprit,
afin de ne pas perdre de temps.

**AC**
- La page contient “Pour qui / Pas pour qui”
- Le ton est explicite
- Mention : “Le refus est protecteur, pas un jugement.”
- CTA unique vers Gate + sortie Dojo gratuit + “quand revenir”

### US-A2 — Connaître l’essentiel (date/ville)
En tant que visiteur, je veux connaître la date, la ville et la durée (7h),
afin de décider si je peux venir.

**AC**
- Date + ville visibles rapidement
- Adresse exacte non publique (communiquée après confirmation)

---

## Epic B — Gate “prêts / pas prêts”
### US-B1 — Soumettre une demande minimaliste
En tant que sponsor, je veux soumettre une demande avec peu de données,
afin de respecter la privacy tout en permettant un tri.

**AC**
- Champs minimaux (structure, taille, ville, sponsor, engagements)
- Validation serveur + clamp + hardening Unicode (NFKC + strip zero-width) sur champs texte
- Anti-abus : rate limit + honeypot + erreurs neutres
- Aucune dépendance à un service tiers (tracking/captcha)
- **Rate limit (ordre de grandeur V1)** :
  - 5 soumissions / 15 min / IP
  - + 1 soumission / minute / IP
  (valeurs ajustables, mais chiffre obligatoire en doc)
- **Erreurs neutres (anti probing)** :
  - en cas de rejet anti-abus, la réponse serveur reste uniforme (même statut/message)
  - aucune indication exploitable (pas de “vous êtes bloqué”, pas de motif précis)

### US-B1bis — Champ libre sécurisé (si activé)
En tant que sponsor, je veux pouvoir ajouter une précision courte sans exposer des infos sensibles,
afin de donner du contexte sans risque.

**AC**
- Disclaimer visible : “Pas de noms / pas d’accusations / pas de données personnelles / pas de dumps internes.”
- Clamp : 800 caractères max
- Hardening Unicode : NFKC + stripZW + trim + rejet des caractères de contrôle
- Détection minimale doxxing : si 2+ emails ou 2+ numéros de téléphone détectés → rejet ou **hold**
- Le texte libre n’est jamais renvoyé dans un email
- **Définition HOLD (anti stockage fantôme)** :
  - HOLD = mise en attente manuelle (pas de traitement automatique)
  - purge automatique si non qualifié sous **14 jours**
  - pas d’export / pas de scoring marketing

### US-B2 — Être redirigé proprement si pas prêt
En tant que structure pas prête, je veux être orienté vers le Dojo gratuit,
afin de continuer sans pression.

**AC**
- Message clair “pas prêt (encore)”
- Liens vers Dojo + ressources pertinentes + “quand revenir”
- Pas de culpabilisation / pas de relance agressive

### US-B3 — Confirmation & suivi (email neutre)
En tant que sponsor prêt, je veux recevoir une confirmation simple,
afin de savoir la suite (contact / validation / paiement).

**AC**
- Email neutre : pas de données sensibles
- Pas de replay champ libre
- Pas d’adresse exacte (avant confirmation)
- **Anti fuite par citation** :
  - l’email ne contient aucune citation du formulaire (aucun champ texte)
  - uniquement un identifiant interne + prochaines étapes
- Politique de purge alignée avec rétention (voir DoD global)

---

## Epic C — Sprint 14 jours (opérationnel)
### US-C1 — Recevoir le pack de livrables
En tant que participant, je veux un pack clair des livrables attendus,
afin d’exécuter sans ambiguïté.

**AC**
- Liste des 5 livrables non négociables
- Templates minimaux disponibles (offline si possible)
- “Gates” de fin de sprint

### US-C2 — Checkpoints
En tant que participant, je veux 2 checkpoints,
afin de corriger la trajectoire avant la fin.

**AC**
- Calendrier annoncé
- Format simple (présentiel/visio/asynchrone, à préciser)
- Pas de dépendance à une plateforme invasive

### US-C3 — Review “bouclier”
En tant que participant, je veux une review finale sécu/orga,
afin de ne pas livrer un château de cartes.

**AC**
- Checklist sécu minimale (accès/partage/backup/restore)
- Checklist orga (décision/preuve/rituels)
- Recommandations actionnables

---

## Epic D — Dojo gratuit (pont)
### US-D1 — Accéder anonymement
En tant que visiteur, je veux accéder aux missions gratuitement et anonymement,
afin de rester souverain.

**AC**
- Pas de compte requis
- Pas de tracking
- Ressources téléchargeables offline

### US-D2 — Être orienté vers l’Opé 125% sans manipulation
En tant que visiteur, je veux comprendre quand passer au payant,
afin de choisir librement.

**AC**
- CTA présent mais non intrusif
- “Prêts / pas prêts” explicite
- Liens clairs vers Gate

---

## Non-fonctionnels (DoD global)
- A11y : focus visible, clavier OK, labels, contrastes
- Security : sanitize Unicode, clamp, validation serveur, rate limiting, erreurs neutres
- Privacy : pas de trackers, pas de remote assets, logs minimaux, pas de profilage
- **Rétention (valeurs explicites V1)** :
  - Gate (DB) : **6 mois max**
  - Logs serveur : **30 jours max**
  - Emails : contenu neutre uniquement + politique d’archivage/purge alignée (pas d’archive de conflit)
- Exploitation : compartimentation Gate / facturation / accompagnement (anti “CRM caché”)
