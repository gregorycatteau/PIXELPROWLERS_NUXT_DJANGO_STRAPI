---
id: PARCOURS_UTILISATEURS_P1
version: 1.0.0
status: active
date: 2025-12-24
owners: ["Marty", "Claire"]
  - Marty
scope:
  - docs/20-product_specs/**
tags:
  - product_specs
  - user_stories
---

# PX V1.2 – User stories Parcours P1 « Ma structure dysfonctionne »

> Statut SSOT : document V1.2 conservé pour historique. Les user stories actives sont en V1.3 (`docs/20-product_specs/user_stories/PX_V1_3_PARCOURS_UTILISATEURS_P1.md`).

## 1. Contexte & intention

Le parcours P1 est la **porte d’entrée diagnostic** de PixelProwlers pour les collectifs, assos, SCIC et structures à visée sociale/écologique en tension.

Il est conçu comme un **atelier modulaire d’exploration**, pas comme un “audit expert” :

- Un **panorama express** permet de prendre une première photo globale des tensions.
- Quatre **blocs d’exploration détaillés** (30–35 questions chacun) permettent d’aller plus loin, à son rythme :
  1. Climat & ressenti
  2. Mouvement & prévisibilité
  3. Règles & décisions
  4. Structure & robustesse
- L’utilisateur peut **sauter des questions** et **choisir ses blocs** : les blancs sont intégrés comme **signaux** dans les bilans (zones aveugles / zones sensibles).
- À tout moment, il peut **s’arrêter**, repartir avec un **bilan exportable client-side**, sans compte ni collecte nominative.
- En fin de P1, le parcours peut s’enchaîner vers :
  - un **Bilan 2** (VUCA + Valeurs & Alignement),
  - des **ressources dynamiques open source**,
  - puis, plus tard, vers **Relinium** et **Fit** (autres user stories, hors de ce fichier).

Souveraineté & sécurité :  
P1 est conçu **security-by-design**. Les réponses brutes restent en mémoire côté front ; seuls des **scores agrégés** de bloc et de parcours sont éventuellement stockés côté navigateur (TTL 30 jours), sans jamais être envoyés au serveur sans opt-in explicite dans un autre parcours.

---

## 2. Personas & rôle principal

### Persona principal

> **“Personne qui tient (ou subit) une structure en tension”**  
> Président·e, coordinateur·rice, membre moteur, salarié·e clé, bénévole pilier, sociétaire impliqué·e…

- Se sent **fatigué·e**, parfois **coupable**, souvent **isolé·e**.
- Perçoit que “**quelque chose cloche**” mais n’arrive pas à le **nommer clairement**.
- Se méfie des **tunnels commerciaux maquillé·s en diagnostic**.
- Veut **garder la main** sur ce qu’il/elle partage et sur la suite.

---

## 3. EPIC P1

> **EPIC P1 – Atelier modulaire d’exploration**
>
> En tant que personne qui tient une structure en tension,  
> je veux pouvoir explorer de façon modulaire les tensions de ma structure (panorama + blocs),  
> afin de mettre des mots clairs sur ce qui coince, sans être jugé·e, sans perdre ma souveraineté,  
> et de repartir avec des bilans que je peux utiliser en autonomie ou partager plus tard si je le choisis.

---

## 4. User stories détaillées

### US-P1-01 – Accéder simplement au parcours P1

**Story**

En tant qu’utilisateur·rice qui arrive depuis la home ou une page de contenu,  
je veux accéder à la page “Ma structure dysfonctionne”  
afin de comprendre rapidement de quoi il s’agit et décider si je commence l’atelier ou non.

**Critères d’acceptation**

- La route `/parcours/ma-structure-dysfonctionne` charge le **layout parcours** et l’**orchestrateur P1**.
- Le contenu d’intro :
  - explique en quelques phrases qu’on parle de **tensions de structure humaine réelle** (pas de success story).
  - positionne P1 comme un **atelier d’exploration**, pas comme un audit expert.
  - ne contient **aucun appel explicite à fournir des infos personnelles** (nom, mail, structure, etc.).
- L’utilisateur comprend en **5–8 secondes** :
  - ce qu’il va trouver : panorama, blocs, bilans, ressources possibles,
  - qu’il peut **s’arrêter à tout moment** sans conséquence.
- Un CTA principal “Commencer l’atelier” (ou équivalent) envoie vers la première étape fonctionnelle (US-P1-02).
- Aucun élément de la page n’induit une **pression commerciale** (pas de “avant qu’il ne soit trop tard”).

---

### US-P1-02 – Lancer un panorama express global

**Story**

En tant qu’utilisateur·rice,  
je veux répondre à un **panorama express** qui balaye les grands thèmes,  
afin d’avoir rapidement une première idée d’où ça coince le plus, sans rentrer tout de suite dans le détail.

**Critères d’acceptation**

- Le panorama express propose une série de questions couvrant **les 4 blocs** (Climat, Mouvement, Règles, Structure).
- Chaque question est notée sur une échelle **0–5** :

  - 0 = “Pas du tout un problème”
  - 5 = “Problème majeur identifié”

- Les questions sont formulées :
  - sans jargon,
  - sans jugement (“vous êtes…”, “vous faites mal…”),
  - en mode **constat** (“Dans ta structure, il arrive que…”).
- L’utilisateur peut :
  - répondre,
  - ou **sauter** une question (bouton/option explicite).
- Un indicateur de progression clair est visible (ex. “3 / 12”, “≈ 3 minutes restantes”).
- Tant que le panorama n’est pas terminé, l’utilisateur peut **revenir en arrière** sur une question précédente sans perdre ses réponses en mémoire.
- À la validation :
  - les **scores agrégés** par bloc sont calculés (via `useJourneyDiagnostics`),
  - des scores par bloc sont persistés via `useDiagnosticStorage` dans `pp_journey_p1_scores_v1`,
  - les réponses brutes ne sont **ni stockées**, ni envoyées au serveur.

---

### US-P1-03 – Comprendre le résultat du panorama (Bilan express)

**Story**

En tant qu’utilisateur·rice ayant terminé le panorama express,  
je veux voir un **bilan simple** de mes réponses,  
afin de repérer les domaines qui “tirent” le plus avant de choisir quoi explorer en détail.

**Critères d’acceptation**

- Un écran de **Bilan express** s’affiche dès que le panorama est complété.
- Le bilan affiche pour les **4 blocs** :
  - un niveau visuel (par exemple : faible / moyen / fort, ou représentation graphique simple),
  - sans colorimétrie agressive (pas de rouge “alarme” partout).
- Un texte synthétique :
  - 3–4 phrases max,
  - parle du **système** (“votre structure semble…”) et non de la valeur de la personne.
- Les **questions non répondues** sont :
  - prises en compte comme “blancs” dans le calcul (neutralité ou indicateur de zone aveugle),
  - mentionnées dans le bilan (“certains thèmes n’ont pas été explorés ou ont été laissés en suspens, ce qui est en soi une information”).
- Le bilan propose clairement les **options suivantes** :
  - Explorer un bloc en détail (US-P1-04),
  - S’arrêter là et éventuellement exporter ce que j’ai vu (US-P1-08).
- Le bouton “Effacer mes réponses de cet appareil” est **visible** et opérationnel (US-P1-09).
- Aucun appel réseau n’est déclenché lors de l’affichage du bilan, en dehors d’éventuels **events analytics coarse** autorisés (cf. doc sécurité).

---

### US-P1-04 – Choisir un bloc d’exploration détaillé

**Story**

En tant qu’utilisateur·rice qui voit son Bilan express,  
je veux pouvoir **choisir quel bloc explorer en premier** (1 à 4),  
afin de commencer par ce qui me parle le plus, sans être enfermé·e dans un ordre imposé.

**Critères d’acceptation**

- L’écran de bilan propose les 4 blocs sous forme de **cartes ou sections claires** :

  1. Climat & ressenti
  2. Mouvement & prévisibilité
  3. Règles & décisions
  4. Structure & robustesse

- Pour chaque bloc, une brève description explique “ce qu’on y regarde”.
- Les blocs peuvent être :
  - marqués comme “déjà explorés” si l’utilisateur y est déjà passé,
  - explorés dans **n’importe quel ordre**.
- L’utilisateur peut :
  - choisir un premier bloc et démarrer le questionnaire détaillé correspondant (US-P1-05),
  - ou **ne pas explorer de bloc** et s’arrêter là avec le seul panorama express.
- Le moteur de parcours garde en mémoire les blocs **déjà explorés** pour construire le **bilan progressif** (US-P1-07).

---

### US-P1-05 – Répondre aux questions d’un bloc (avec possibilité de sauter)

**Story**

En tant qu’utilisateur·rice,  
je veux pouvoir répondre aux questions d’un bloc (30–35 items),  
en ayant la possibilité de **sauter certaines questions**,  
afin d’explorer en profondeur sans être forcé·e là où je ne souhaite pas aller.

**Critères d’acceptation**

- Chaque bloc présente ses questions :
  - sur une échelle **0–5** (“Pas du tout un problème” → “Problème majeur identifié”),
  - avec la double focale **Moi / Organisation** clairement identifiable (icône, sous-titre, balise).
- L’utilisateur peut, pour chaque question :
  - choisir une note,
  - **sauter** la question (option explicite type “Je ne souhaite pas répondre / pas applicable”).
- UX :
  - progression claire (ex : “12 / 32 questions – tu peux t’arrêter à tout moment”),
  - possibilité de revenir à la question précédente dans le même bloc.
- Les **questions sautées** sont :
  - stockées comme “non répondues” dans le state mémoire (pas de valeur 0 par défaut),
  - intégrées dans le bilan comme **zones non explorées / sensibles**.
- Les réponses brutes restent **en mémoire** uniquement (`useJourneyDiagnostics`), jamais persistées ni envoyées au serveur.
- La durée moyenne du bloc reste compatible (~8 minutes max si l’utilisateur répond à la majorité des items).

---

### US-P1-06 – Terminer un bloc et voir un Bilan de bloc

**Story**

En tant qu’utilisateur·rice ayant terminé un bloc,  
je veux recevoir un **bilan spécifique à ce bloc**,  
afin de comprendre ce que mes réponses racontent sur ce pan de ma structure.

**Critères d’acceptation**

- À la fin du bloc, un écran dédié “Bilan Bloc X” s’affiche.
- Le bilan de bloc comporte :
  - 2–3 **axes internes** au bloc (ex. pour Bloc 1 : climat de confiance, lisibilité des règles, charge/fatigue…),
  - une visualisation simple (barres, badges…),
  - une courte synthèse textuelle (3–5 phrases) qui :
    - décrit les dynamiques observées,
    - **ne culpabilise pas** l’utilisateur,
    - rappelle que ce n’est **pas un verdict**.
- Les **questions non répondues** sont :
  - prises en compte dans une phrase dédiée (ex. “Certains sujets n’ont pas été explorés, ce qui peut indiquer des zones sensibles ou simplement non prioritaires pour toi aujourd’hui.”).
- Les scores agrégés de bloc sont mis à jour dans `pp_journey_p1_scores_v1` (sans réponses brutes).
- Le bilan propose clairement :
  - de revenir à la **sélection de blocs** pour en explorer un autre (US-P1-04),
  - de consulter un **bilan global P1** si plusieurs blocs sont complétés (US-P1-07),
  - de **s’arrêter là** avec possibilité d’export (US-P1-08).

---

### US-P1-07 – Consulter un bilan global P1 (progressif)

**Story**

En tant qu’utilisateur·rice ayant exploré un ou plusieurs blocs,  
je veux disposer d’un **bilan global P1** qui s’enrichit au fil de mes explorations,  
afin de voir l’ensemble de mes tensions (et de mes blancs) de manière cohérente.

**Critères d’acceptation**

- Le bilan global P1 consolide :
  - les résultats du **panorama express**,
  - les blocs déjà explorés (1 à 4),
  - les blocs non explorés sont visibles comme tels (pas masqués).
- Le bilan global présente :
  - une vue d’ensemble sur les 4 grandes dimensions (Climat, Mouvement, Règles, Structure),
  - un court texte de synthèse,
  - une mise en avant des **3–5 signaux principaux** (tensions fortes et zones aveugles).
- Les **questions sautées** sont intégrées dans la narration comme :
  - “zones non explorées”,
  - ou “sujets peut-être sensibles / non prioritaires aujourd’hui”.
- Il est possible de revenir à ce bilan **à tout moment** après avoir complété au moins un bloc.
- Le bilan global ne déclenche **aucune sauvegarde serveur**.
- L’utilisateur peut :
  - exporter le bilan (US-P1-08),
  - décider d’enchaîner vers le **Bilan 2 VUCA/Alignement** (US-P1-10),
  - sortir du parcours P1.

---

### US-P1-08 – Exporter son bilan P1 en autonomie (client-side)

**Story**

En tant qu’utilisateur·rice,  
je veux pouvoir **exporter mon bilan P1** (express + blocs explorés),  
afin de le garder, le relire, ou le partager plus tard si je le souhaite, sans dépendre de PixelProwlers.

**Critères d’acceptation**

- Sur les écrans de bilan (bloc & global), un bouton “Exporter” ou “Garder une trace” est visible.
- L’export est **100 % client-side** :
  - soit texte structuré affiché dans la page, copiable par l’utilisateur,
  - soit impression via `window.print()` ou équivalent.
- L’export contient :
  - les principaux constats,
  - les axes et scores agrégés,
  - un rappel des blocs explorés / non explorés,
  - **aucune donnée nominative** (ni nom, ni structure, ni personne).
- Aucun fichier n’est généré par un serveur, aucune donnée n’est uploadée.
- Scope : données du diagnostic P1 uniquement ; le contact est un flux séparé.
- Aucune inscription n’est demandée pour exporter.
- L’export ne déclenche **pas d’envoi analytics détaillé** ; au plus, un event coarse `p1_export_clicked` (si validé côté sécu).

---

### US-P1-09 – Effacer facilement toutes les traces du diagnostic P1 sur l’appareil

**Story**

En tant qu’utilisateur·rice soucieux·se de ma confidentialité,  
je veux pouvoir **effacer toutes les données P1 stockées sur cet appareil**,  
afin de repartir à zéro ou de laisser cet appareil sans traces de ce diagnostic.

**Critères d’acceptation**

- Un bouton “Effacer mes réponses de cet appareil” est visible :
  - au minimum sur les écrans de bilan,
  - idéalement dans un composant réutilisable P1.
- Au clic :
  - toutes les clés `pp_journey_p1_*` sont supprimées (scores, méta),
  - l’état du parcours en mémoire est réinitialisé,
  - l’UI revient à un état neutre (comme si aucun diagnostic n’avait été fait).
- Un court message explique **clairement** :
  - ce que cela efface,
  - que rien n’était stocké côté serveur.
- Scope : données du diagnostic P1 uniquement ; le contact est un flux séparé.
- Aucune donnée P1 ne subsiste dans le storage local après exécution de la purge.
- Le bouton ne touche **pas** aux autres parties du site (contact, blog, etc.).

---

### US-P1-10 – Enchaîner P1 vers le Bilan 2 (VUCA + Valeurs & Alignement)

**Story**

En tant qu’utilisateur·rice ayant terminé au moins le panorama et éventuellement des blocs,  
je veux pouvoir **enchaîner vers un second temps de réflexion** (VUCA + Valeurs & Alignement),  
afin de relier ce que je vis à un modèle plus global et à mes propres valeurs.

**Critères d’acceptation**

- Depuis le bilan global P1, un CTA décrit clairement la suite :

  - “Je veux comprendre d’où ça vient (environnement + valeurs)”

- En cliquant, l’utilisateur arrive sur le **Questionnaire 2** (VUCA + Axe Valeurs & Alignement) déjà spécifié dans la spec fonctionnelle.
- Le contrat reste le même :
  - réponses en mémoire seulement,
  - profil de valeurs A/B/C/D agrégé uniquement,
  - aucun stockage serveur de réponses brutes.
- Le lien entre P1 et Bilan 2 est **narratif**, pas technique :  
  aucune donnée P1 n’est envoyée au serveur à cette étape.
- L’utilisateur peut choisir de :
  - faire le Bilan 2,
  - ou s’arrêter à la fin de P1 sans y entrer.

---

### US-P1-11 – Quitter le parcours P1 à tout moment, sans pénalité

**Story**

En tant qu’utilisateur·rice,  
je veux pouvoir **quitter le parcours P1 à tout moment** (fermer l’onglet, revenir en arrière, etc.),  
sans être puni, sans perdre mon autonomie,  
et sans me voir reprocher de ne pas l’avoir “terminé comme il faut”.

**Critères d’acceptation**

- À chaque étape (panorama, blocs, bilans), il existe une **issue honorable** textuelle, du type :
  - “Tu peux t’arrêter là, ce que tu as déjà posé est précieux.”
- Si l’utilisateur ferme la page ou navigue ailleurs :
  - aucune modale agressive ne le retient (“es-tu sûr ? tu vas tout perdre…”),
  - à son retour, s’il revient sur P1, les scores agrégés éventuellement persistés peuvent être réutilisés, mais jamais les réponses brutes.
- Aucune logique de gamification culpabilisante (barres type “tu es à 80 %, encore un peu !”) n’est utilisée.
- Aucun mail, notification ou relance n’est envoyée, puisque P1 ne collecte aucune donnée de contact.
- Scope : données du diagnostic P1 uniquement ; le contact est un flux séparé.

---

## 5. Synthèse – Conditions de “Done” produit pour P1

Le parcours P1 “Ma structure dysfonctionne” est considéré **Done côté produit** quand :

- [ ] Un utilisateur peut :
  - accéder au parcours,
  - faire le panorama express,
  - explorer un ou plusieurs blocs détaillés,
  - consulter des bilans de bloc et un bilan global progressif,
  - exporter ses bilans en local,
  - effacer ses données P1 sur son appareil,
  - éventuellement enchaîner vers le Bilan 2 (VUCA + Valeurs & Alignement),
  - s’arrêter à tout moment sans pression ni perte de dignité.
- [ ] Les **questions sautées** sont prises en compte comme signaux dans les bilans (zones aveugles / sensibles), pas simplement ignorées.
- [ ] Aucune réponse brute P1 n’est :
  - stockée côté navigateur de manière persistante,
  - envoyée au serveur,
  - utilisée dans les analytics.
- [ ] Seuls des **scores agrégés et métadonnées minimales** sont stockés côté navigateur (TTL 30 jours) conformément à `ARCHITECTURE_SECURITE.md`.
- [ ] Les analytics, si activées, restent :
  - **coarse**, anonymes, désactivables,
  - conformes à `MODELES_DE_MENACES.md` et `POLITIQUES_OPSEC_PRIVACY.md`.
- [ ] Le texte et le ton des écrans respectent les invariants émotionnels P1 :
  - pas de honte, pas de culpabilisation, pas de fatalisme,
  - reconnaissance du travail fait,
  - mise en avant de la **souveraineté** et de l’**agentivité** de l’utilisateur.

Une fois ces critères validés, P1 peut être utilisé comme **atelier autonome de diagnostic** et comme **socle d’orientation** vers les autres parcours PixelProwlers, sans trahir le contrat moral posé dans le SSOT.
