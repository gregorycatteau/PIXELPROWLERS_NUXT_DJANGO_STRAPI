# PX_V1_3_P1_DIAGNOSTIC_ATELIER.md

## 1. Contexte

P1 « Ma structure dysfonctionne » est un parcours longtail au sein du site PixelProwlers.
Il s’adresse aux personnes impliquées dans une structure (asso, SCIC, collectif, coop…)
qui ressentent des tensions fortes (humaines, organisationnelles, politiques) et qui
ont besoin :

- d’y voir clair,
- de mettre des mots sur ce qu’elles vivent,
- d’identifier des pistes d’action adaptées à leur contexte,
- sans se livrer à un tiers ni “se mettre à nu” devant leur propre organisation.

V1.2 posait :

- un moteur de parcours (E0 → E6),
- des questionnaires en logique “niveau de problème”,
- des bilans globaux essentiellement descriptifs.

Les tests utilisateurs (dont Jenny) montrent que :

- le langage “problème / pas problème” n’est pas naturel,
- l’expérience est perçue comme correcte mais générique,
- la valeur ajoutée d’activation (plan d’action) n’est pas encore atteinte.

V1.3 vise à repositionner P1 comme :

> Un **atelier d’auto-diagnostic et d’activation**, structuré, local, qui produit
> un **plan d’action concret** exploitable en solo ou dans Relinium.


## 2. Objectifs produit P1 V1.3

### 2.1 Objectifs principaux

1. **Clarté interne**
   Aider l’utilisateur à formuler une image claire et nuancée de la situation de sa
   structure (climat, gouvernance, mouvement, robustesse).

2. **Sentiment de reconnaissance**
   Donner à l’utilisateur la sensation que son vécu est légitime, vu et compris,
   sans pathologiser ni le culpabiliser.

3. **Activation concrète**
   Générer un **plan d’action structuré**, composé de petites étapes activables, que
   l’utilisateur peut :
   - télécharger / conserver en solo,
   - ou intégrer dans Relinium pour un travail plus formel.

4. **Souveraineté et sécurité**
   Respecter strictement la promesse PixelProwlers :
   - diagnostic calculé en local,
   - pas de profilage caché,
   - contrôle total de l’utilisateur sur ce qui est conservé ou supprimé.

### 2.2 Objectifs secondaires

- Offrir une première expérience de la “méthode PixelProwlers” :
  langage clair, transparence, respect des limites de la personne.
- Préparer le terrain pour de futurs parcours (P2–P5) qui réutiliseront les mêmes
  invariants (assertions + patterns + plan d’action).


## 3. Périmètre fonctionnel V1.3

### 3.1 Ce que V1.3 doit absolument contenir

1. **Questionnaires reformulés en assertions**
   - Chaque item est une phrase au présent, formulée en positif ou négatif
     (*« Dans ma structure, les décisions importantes sont clairement expliquées. »*).
   - L’utilisateur répond via une échelle Likert :
     - 1 = Pas du tout vrai
     - 2 = Plutôt faux
     - 3 = Mitigé
     - 4 = Plutôt vrai
     - 5 = Tout à fait vrai

2. **Échelle visuelle ergonomique**
   - UI principale sous forme de **curseur / slider** à 5 crans clairement visibles.
   - Libellés textuels associés (“Pas du tout vrai” … “Tout à fait vrai”).
   - Accessibilité clavier (← →) et fallback compatible lecteurs d’écran.

3. **Gestion explicite de la non-réponse**
   - Chaque question propose un choix **“Je ne souhaite pas répondre à cette question”**.
   - Distinction nette dans les données entre :
     - `answered` (1–5),
     - `skipped_intentional`,
     - `missing` (jamais vue / jamais atteinte).
   - Les non-réponses intentionnelles sont exploitées comme signaux dans le bilan
     (zones de sensibilité / d’évitement).

4. **Progression visible**
   - Barre de progression par étape (ex : “Étape 1 sur 4 – Question 7 / 24”).
   - Message explicite :
     - “Tu peux t’arrêter à tout moment et obtenir un bilan à partir de ce que tu as déjà complété.”

5. **Bilan enrichi et contextualisé**
   - Bilan structuré en 3 couches :
     1. **Vue d’ensemble** : axes forts/faibles, tonalité globale (sans dramatisation).
     2. **Zooms ciblés** : 3–5 points d’attention reliés explicitement à des réponses
        données (avec reformulation concrète).
     3. **Plan d’action** : blocs de to-do, hiérarchisés (court terme / moyen terme).
   - Mention explicite de la non-réponse intentionnelle :
     - “Tu as choisi de ne pas répondre à certaines questions sur X – c’est un signal
       important à respecter.”

6. **Plan d’action exportable**
   - Génération d’un **plan d’action structuré** (sections + tâches) côté client.
   - Possibilités :
     - Copier-coller texte brut,
     - Télécharger (format à définir : Markdown / texte simple),
     - À terme : envoyer vers Relinium (API) si l’utilisateur le demande.

7. **Moteur de règles local**
   - Les interprétations et recommandations sont basées sur :
     - des **scores par question**,
     - des agrégats par axe / bloc,
     - des patterns (combinaisons de réponses, y compris non-réponses).
   - Aucun appel serveur n’est nécessaire pour produire le bilan ou le plan d’action.


### 3.2 Ce que V1.3 ne fera pas (non-objectifs)

- Pas de **stockage serveur** des réponses brutes au diagnostic P1.
- Pas de **corrélation automatique** entre résultats P1 et :
  - parcours Fit,
  - suivi CRM,
  - ou base de données externe.
- Pas de **profilage marketing** (segment “bon client / mauvais client”) à partir de P1.
- Pas de **diagnostic pseudo-clinique** (pas d’étiquettes psychologisantes sur l’utilisateur).


## 4. Invariants de souveraineté & de sécurité

Ces invariants prolongent ceux déjà posés en V1.2.

1. **Diagnostic local-only par défaut**
   - Les réponses brutes (1–5 + `skipped_intentional`) sont conservées uniquement
     en mémoire (frontend) pour le calcul du bilan.
   - Option éventuelle de stockage local (browser) :
     - limitée à des **scores agrégés** / tags de patterns,
     - avec TTL courte (30 jours max) et bouton “Tout effacer”.

2. **Contrôle utilisateur**
   - L’utilisateur est informé de ce qui est ou non conservé sur son appareil.
   - Un bouton “Effacer mes réponses de cet appareil” est disponible au plus tard
     sur l’écran de bilan.

3. **Transparence sur les exports**
   - Export du plan d’action :
     - expliqué clairement (ce qui est dans le fichier),
     - aucun envoi automatique vers PixelProwlers.
   - En cas de connexion à Relinium :
     - opt-in explicite,
     - contrat clair : “voici ce que nous enregistrons pour toi et dans quel but.”

4. **Séparation P1 / Fit / Relinium**
   - P1 reste un **atelier autonome** :
     - Pas de lien caché entre P1 et un éventuel rendu Fit ou une base clients.
   - Si l’utilisateur active Relinium :
     - c’est une nouvelle couche, consciente et traçable, au-dessus de P1.


## 5. Parcours utilisateur macro (rappel + ajustements V1.3)

Le squelette E0–E6 reste, avec des ajustements :

- **E0 – Introduction & cadrage**
  - Cadrage émotionnel (tu n’es pas seul, ce n’est pas un test, tu peux t’arrêter).
  - Explication de la logique assertions + échelle “vrai / pas vrai”.
  - Rappel des engagements de souveraineté.

- **E1 – Panorama / Climat global**
  - Assertions transversales pour se situer rapidement.
  - Première barre de progression visible.
  - Introduction du bouton “Je ne souhaite pas répondre”.

- **E2 – Bilan 1 (vue d’ensemble)**
  - Synthèse rapide des axes explorés.
  - Invitation à approfondir certains blocs (climat, gouvernance, structure…).

- **E3 – Explorations détaillées (blocs)**
  - Blocs thématiques (B1–B4), chacun en assertions.
  - Même échelle et même gestion des non-réponses.
  - Progression claire à l’intérieur de chaque bloc.

- **E4 – Bilan 2 (détaillé + patterns)**
  - Zoom sur quelques combinaisons significatives.
  - Mise en lumière des non-réponses intentionnelles si elles se concentrent
    sur certains thèmes.

- **E5 – Plan d’action & ressources**
  - Construction d’un **plan d’action structuré** à partir des patterns vus.
  - Propositions de ressources (lecture, outils, pratiques) liées aux patterns.

- **E6 – Carrefour des suites possibles**
  - Options explicites :
    - Rester en autonomie (télécharger le plan, le garder pour soi).
    - Explorer Relinium pour structurer ce plan dans le temps.
    - Ne pas aller plus loin pour l’instant (et revenir plus tard si besoin).


## 6. Indicateurs de réussite (KPIs qualitatifs)

1. L’utilisateur comprend rapidement :
   - ce qu’il va faire,
   - ce que le diagnostic peut lui apporter,
   - ce qui est (ou non) stocké.

2. À la fin du parcours P1, l’utilisateur peut formuler :
   - « Je comprends mieux où ça coince dans ma structure. »
   - « J’ai des idées concrètes de choses que je peux tester. »

3. Le plan d’action est :
   - lisible,
   - crédible,
   - activable en solo sans accompagnement humain direct.

4. Les retours qualitatifs ne parlent plus d’un “snapshot générique”, mais d’un
   sentiment de **lecture fine et respectueuse**.
