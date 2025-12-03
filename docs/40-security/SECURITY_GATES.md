# Security Gates — contrôle avant mise en prod

## Gate 0 – Vision & politique
- Description : bloc “Exigences sécurité & privacy” ajouté à la Vision Produit ; socle `docs/security/` créé.
- Critères : section présente dans vision produit, index sécurité disponible.
- Statut : TODO
- Validé par : Marty & Eva
- Date : (à renseigner)

## Gate 1 – Front solo (longtail V1.2)
- Description : stockage local limité, clés documentées, TTL défini, purge “Tout effacer” opérationnelle, modèle de menaces front rempli.
- Critères : `ARCHITECTURE_SECURITE.md` et `MODELES_DE_MENACES.md` à jour pour V1.2.
- Statut : EN COURS (implémentation stockage local + purge côté front ; tests manuels à exécuter)
- Validé par : (à renseigner)
- Date : (à renseigner)

## Gate 2 – Ressources dynamiques
- Description : pas de PII dans le catalogue, logs Strapi/endpoint minimisés et à rétention courte.
- Critères : doc catalogue + politique de logs écrite.
- Statut : TODO
- Validé par : (à renseigner)
- Date : (à renseigner)

## Gate 3 – Relinium & Fit
- Description : auth, chiffrement, rétention, consentements, recovery, journalisation append-only, aucun accès PixelProwlers sans partage explicite.
- Critères : architecture, menaces, politiques OPSEC pour Relinium/Fit validées ; rétention/purge définies ; consentements explicites.
- Statut : TODO
- Validé par : (à renseigner)
- Date : (à renseigner)

Notes :
- Gate 0 doit être OK avant tout développement significatif de V1.2 longtail.
- Gate 3 doit être OK avant toute mise en production de Relinium/Fit.
