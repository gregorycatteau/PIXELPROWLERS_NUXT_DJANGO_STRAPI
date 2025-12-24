---
id: VISION_PRODUIT
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Marty", "Jared"]
  - Marty
scope:
  - docs/10-vision_roadmap/**
tags:
  - roadmap
  - vision
---

# Vision Produit - PixelProwlers (Version définitive)

## 1. Objectif principal
PixelProwlers est un studio pluriactif conçu pour accompagner les collectifs engagés et les individus en transition. Notre mission : offrir une trajectoire numérique sobre, claire et documentée qui réduit la charge mentale, sécurise l’écosystème (sites, outils, décisions) et aide à :
- Clarifier où ça bloque (organisation, priorités, outils) ;
- Décider ce qui est juste dans chaque situation ;
- Mettre en place des solutions concrètes, éthiques, adaptées aux valeurs, aux moyens et à la mission.

## 2. Problèmes adressés
- Message flou, manque de clarté.
- Outils dispersés/épuisants et non sécurisés.
- Gouvernance/rôles flous qui ralentissent les décisions.
- Manque de documentation et de transmission.
- Besoin de sens et d’alignement individuel en transition.

## 3. Positionnement
Studio pluriactif qui :
- Facilite et coordonne : clarification des priorités, gouvernance, décisions.
- Développe des solutions numériques éthiques : sites/outils sobres et sécurisés.
- Accompagne et forme : coaching, ateliers, formation continue.

## 4. Offre structurée
4.1 Clarifier & Décider (facilitation, gouvernance, priorisation)  
• Problème : priorités/gouvernance floues.  
• Solution : clarification + processus décisionnels clairs.  
• Bénéfice : décisions collaboratives, charge mentale réduite.

4.2 Outiller sans trahir les valeurs (développement numérique éthique)  
• Problème : peur d’outils propriétaires, non sécurisés.  
• Solution : sites/outils éthiques, automatisation légère, RGPD.  
• Bénéfice : outils pratiques, sécurisés, alignés valeurs.

4.3 Accompagner & Former (coaching & formation)  
• Problème : besoin d’accompagnement pour trouver du sens/évoluer.  
• Solution : coaching/formations pour clarifier et se réaligner.  
• Bénéfice : soutien personnalisé pour surmonter les blocages.

## 5. MVP fonctionnel
- Landing multi-parcours (journeys, cartes interactives, situations).
- Pages : Accueil, Accompagnement & Formation (3 formats), À propos, Relinium (Labo), Légales.
- CTA principal : prise de contact contextualisée selon le parcours.
- Formulaire : validation inline, aria-live, anti-bot, suivi succès/erreurs.
- SEO & accessibilité : metas/OG/JSON-LD, menu mobile accessible, focus visibles, contraste vérifié (tests réels à faire, notamment menu icônes).

## 6. Roadmap V1
### Mois 1 (livré)
- Landing avec parcours utilisateurs et cartes de situation.
- Formulaire de contact fonctionnel + tracking success/error.
- SEO de base (metas/OG/JSON-LD), sitemap, menu mobile accessible.
- Section Fit et manifeste intégrées.

### Mois 2
- Mesure & KPIs : mise en place GSC + sitemap, plan de taggage (journey_selected, cta_clicked avec origin/variant, contact_submit_success/error), dashboard minimal (CTR/positions GSC, conversions form, taux d’erreur, clics CTA, scroll depth optionnel).  
- Pages longue traîne : créer 2–3 ressources (études de cas/FAQ) structurées H1/H2/FAQ/CTA + JSON-LD Article ; lier depuis landing/footer.  
- Harmonisation de l’offre : décider et exécuter la stratégie services — **trancher** entre créer des pages dédiées “Clarifier/Outiller/Accompagner” ou adapter “Accompagnement & Formation” + Relinium pour refléter les 3 piliers (inclure metas/OG/CTAs cohérents).

### Mois 3
- Personnalisation parcours : choix arrêté sur des pages dédiées `/parcours/<slug>` avec metas/OG uniques et contenus spécifiques (copy/FAQ/CTA).  
- Tests utilisateurs : valider parcours et CTAs, collecter feedbacks.  
- Ajustements UX/perf : navigation, temps de chargement.

## 7. Extensions immédiates
- Pages longue traîne : sujets cibles (ex. refonte SCIC sobre, gouvernance coopérative, outillage association nationale) avec structure type (H1/H2, FAQ, CTA, JSON-LD Article).  
- Personnalisation par parcours : adapter copy/FAQ/CTA et pages dédiées `/parcours/<slug>`.

## 8. Priorités prochains sprints
- Consolider l’existant : aligner CTAs/copies sur parcours, valider formulaire et suivi de soumission.  
- Produire 3 pages longue traîne, les lier (landing/footer).  
- Mise en place mesure : GSC, taggage events, dashboard KPIs.  
- Clarification de l’offre : harmoniser Clarifier/Outiller/Accompagner avec Relinium et Accompagnement.

## 9. Fil rouge sécurité & privacy
- L’espace dédié `docs/security/SECURITY_INDEX.md` centralise les décisions et modèles sécurité (vitrine, diagnostics, Relinium, Fit).  
- Les évolutions produits doivent systématiquement être croisées avec cet espace pour garder la souveraineté et la confidentialité comme exigences transverses.

## 10. Exigences sécurité & privacy (non négociables)
- Diagnostics : par défaut 100 % en local, pas de stockage serveur des réponses sans opt-in explicite pour Relinium.  
- Corrélation diagnostics ↔ Fit : interdite en V1.x (pas d’identifiant commun, pas de session_id ou clé partagée, pas de profilage croisé).  
- Analytics : anonymes, granularité “coarse”, désactivables ; aucune conservation long terme d’events bruts corrélables avec IP + user-agent (rétention technique courte 7–30 jours à préciser).  
- Trackers tiers : aucun script de tracking tiers (GA, Meta Pixel, Hotjar…) sans spec dédiée, revue sécurité et consentement explicite.  
- Relinium : “coffre perso” chiffré ; PixelProwlers n’y accède que sur partage explicite, loggé et horodaté.  
- Fit : outil relationnel, rétention courte (6 mois) + purge auto, pas de pipeline CRM caché ni d’entraînement marketing.  
- Gates sécurité : toute fonctionnalité manipulant des données utilisateur est bloquée tant qu’un gate dédié n’est pas validé.  
- Contrat moral : tout changement qui rend le dispositif plus intrusif doit être versionné, expliqué (“avant/après”) et re-consenti.
