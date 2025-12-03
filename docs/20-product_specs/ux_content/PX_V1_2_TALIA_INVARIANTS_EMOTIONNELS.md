# PX_V1_2_TALIA_INVARIANTS_EMOTIONNELS.md
_Version 1.0 – Référence émotionnelle transverse P1–P5_

## 1. Objet du document

Ce document définit les **invariants émotionnels** et quelques **patterns de messages de dignité** qui s’appliquent à tous les parcours d’entrée PixelProwlers (P1–P5), quels que soient :

- le persona (individu / structure / porteur·se de projet),
- le niveau de gravité perçu,
- ou l’étape du tunnel (diagnostic, bilans, ressources, carrefour final).

Il sert de **charte émotionnelle commune** pour :

- **Dan / Heider** : UX / UI / cinématique,
- **Rand / Claire** : contenus, microcopy, email,
- **Codex** : implémentation front & refactors,
- **Marty** : cadrages produit,
- **Eva** : cohérence avec la posture de sécurité & souveraineté.

---

## 2. Invariants émotionnels transverses (P1–P5)

### 2.1. Posture globale

- On parle **du système**, des **structures** et des **contextes**, jamais de la valeur des personnes.
- Les difficultés sont présentées comme **courantes**, **compréhensibles**, et souvent liées à des contraintes systémiques (moyens, gouvernance, charge…).
- On reste **lucide** (on ne minimise pas), mais on refuse :
  - le **drame gratuit**,
  - la **culpabilisation**,
  - l’**infantilisation**.

> Règle d’or : la personne doit pouvoir se dire  
> “On parle de choses difficiles, mais je ne me sens ni jugée ni diminuée.”

### 2.2. Émotions à interdire

Dans tous les parcours P1–P5, nous évitons d’induire :

- la **honte** (“on est nuls / je suis nul·le”),
- la **culpabilité personnelle** (“on n’a qu’à mieux faire / j’ai raté”),
- la **désespoir** (“c’est foutu, on n’y arrivera jamais”),
- la **peur artificielle** (FOMO, urgence fabriquée),
- la sensation d’être un **“cas désespéré”** ou un **“mauvais élève”**.

Tout wording, animation, couleur ou micro-interaction qui va dans ce sens doit être **réécrit ou supprimé**.

### 2.3. Invariants de dignité

À chaque moment du parcours (choix de parcours, diagnostic, bilans, ressources, carrefour final), l’UX doit :

- **Honorer le fait de s’être présenté ici** :  
  “Tu as déjà fait quelque chose d’important en ouvrant cette page.”
- Reconnaître que **la personne fait comme elle peut** dans un contexte souvent difficile.
- Prévoir des **sorties “honorables”** à chaque étape :
  - possibilité de s’arrêter,
  - possibilité de revenir plus tard,
  - jamais de pénalité implicite (“t’as pas fini, tant pis pour toi”).

### 2.4. Souveraineté & sécurité (angle émotionnel)

Les invariants techniques sont définis par Eva. Côté émotion / UX, nous devons :

- Être **cohérents entre ce qu’on promet et ce qui est fait** :
  - si l’on dit “rien n’est stocké sur nos serveurs”, alors **aucune donnée sensible ne doit l’être**.
- Rendre la **souveraineté visible** :
  - mentionner la possibilité d’effacer les données locales,
  - rappeler que les diagnostics peuvent rester **strictement personnels**.
- Ne jamais utiliser la **peur de la perte de données** comme levier de conversion.

### 2.5. Droit de s’arrêter à tout moment

Pour tous les parcours et toutes les étapes :

- L’utilisateur ou l’utilisatrice a le **droit explicite** de :
  - s’arrêter,
  - revenir plus tard,
  - ne jamais revenir.
- Ce droit doit être **mentionné** dans les écrans de diagnostic et de bilans, de manière sereine.
- L’abandon n’est **jamais interprété** ni présenté comme un échec.

---

## 3. Patterns de messages de dignité (tous parcours)

Les patterns ci-dessous sont des **gabarits** :  
Rand / Claire peuvent adapter le ton (tu/vous, formel / semi-formel), mais **l’intention doit rester la même**.

---

### 3.1. Début de diagnostic (Questionnaire 1 / 2, P1–P5)

**Intention :**  
Poser un cadre rassurant avant que la personne ne commence à répondre à des questions potentiellement sensibles.

**Principes :**

- Valider que venir jusqu’ici est déjà un effort.
- Expliquer **simplement** :
  - à quoi sert le diagnostic,
  - combien de temps cela prend,
  - qu’on peut s’arrêter sans “casser” quelque chose.
- Rappeler la **souveraineté** et l’absence de stockage serveur par défaut (si applicable).

**Pattern A (version “tu”) :**

> “Tu viens déjà de faire un premier pas en ouvrant ce diagnostic.  
> On va te poser quelques questions pour t’aider à y voir plus clair, sans te juger.  
> Tu peux t’arrêter à tout moment : ce que tu as déjà posé restera utile pour toi.”

**Pattern B (version “vous”) :**

> “Le fait d’être ici est déjà un premier geste important pour votre structure et pour vous.  
> Ce questionnaire sert à mettre des mots sur ce qui coince, pas à vous évaluer.  
> Vous pouvez vous arrêter quand vous le souhaitez : chaque réponse peut déjà vous servir de point d’appui.”

---

### 3.2. Abandon en cours de questionnaire (Q1/Q2, P1–P5)

**Intention :**  
Empêcher que l’abandon soit vécu comme un échec ou une faute ; conserver une **porte ouverte**.

**Principes :**

- Remercier pour l’énergie déjà investie.
- Rappeler que ce qui a été fait n’est **pas “perdu”** (même si non stocké).
- Proposer une **option simple** pour revenir ou garder une trace (si export local).

**Pattern A :**

> “Merci d’avoir pris le temps de commencer ce diagnostic.  
> Ce que tu as déjà regardé n’est pas inutile : tu sais un peu mieux où ça te tire.  
> Tu peux revenir quand tu voudras, à ton rythme, sans repartir de zéro dans ta réflexion.”

**Pattern B :**

> “Merci d’avoir pris ce temps pour vous et pour votre structure.  
> Même si vous vous arrêtez ici, le simple fait d’avoir commencé à regarder ces questions est déjà un travail en soi.  
> Vous pourrez revenir quand ce sera le bon moment pour vous.”

---

### 3.3. Clôture de bilan (Bilan 1 / Bilan 2, P1–P5)

**Intention :**  
Transformer le moment du bilan en **miroir respectueux**, et non en verdict ou sentence.

**Principes :**

- Rappeler que le bilan est un **point de départ**, pas un jugement.
- Reconnaître le caractère **émotionnel** du processus.
- Proposer une ou deux **options de suite** (continuer, s’arrêter, exporter).

**Pattern A (fin de Bilan 1 ou 2) :**

> “Ce que tu viens de lire n’est pas un verdict, c’est une photo de la situation à un instant donné.  
> Tu as déjà fait un vrai travail en acceptant de regarder tout ça en face.  
> Tu peux choisir de continuer, de faire une pause ou de garder simplement ces quelques repères pour toi.”

**Pattern B :**

> “Ces éléments ne disent rien de ta valeur, ni de celle de ta structure.  
> Ils décrivent des tensions, des frictions, des contradictions à apprivoiser.  
> À partir de là, tu restes aux commandes : poursuivre, faire une pause, ou simplement garder ces pistes en tête.”

---

### 3.4. Arrivée au carrefour final (Relinium / Fit / Autonomie)

**Intention :**  
Clore le parcours en rendant explicite que **toutes les issues sont légitimes**, y compris celle qui consiste à **continuer seul·e**.

**Principes :**

- Remercier explicitement pour le chemin parcouru.
- Nommer le fait que beaucoup de gens **n’osent jamais regarder ces sujets**.
- Présenter les issues (Autonomie / Relinium / Fit) **sans hiérarchie implicite**.
- Éviter toute pression du type “c’est maintenant ou jamais”.

**Pattern A (carrefour final) :**

> “Tu viens de faire un travail que beaucoup repoussent pendant des années.  
> Merci d’avoir pris ce temps-là pour toi et pour ta structure.  
> À partir de maintenant, tu choisis :  
> – continuer en autonomie avec tes notes et les ressources,  
> – te créer un espace privé pour documenter ta démarche,  
> – ou voir si on peut réfléchir ensemble à la suite.  
> Aucune de ces options n’est plus ‘sérieuse’ ou ‘courageuse’ qu’une autre.”

**Pattern B :**

> “Le chemin que tu as parcouru ici t’appartient.  
> Tu peux décider de le garder pour toi, de le structurer dans un espace dédié, ou de nous inviter à le regarder avec toi.  
> Quelle que soit ta décision, elle mérite le respect : c’est toi qui connais le mieux ton rythme et ton contexte.”

---

## 4. Application & gouvernance de ces invariants

- Ces invariants s’appliquent **à tous les parcours P1–P5** et à toutes les futures déclinaisons (pages longues traîne, emails associés, interfaces Relinium / Fit en lien direct avec les diagnostics).
- Toute nouvelle formulation, animation ou logique de tunnel qui entre en conflit avec ce document doit :
  - soit être ajustée,
  - soit faire l’objet d’une discussion explicite (Talia + Marty + Eva au minimum).
- En cas de doute, **la personne prime sur le produit** :  
  on privilégie la **dignité** et la **souveraineté** à court terme, quitte à réduire la conversion.

---

## 5. Changelog

- **v1.0 – Base issue de P1 (Talia)**  
  - Extraction des invariants émotionnels P1 pour les généraliser à P1–P5.  
  - Ajout de patterns de messages de dignité pour :  
    - début de diagnostic,  
    - abandon en cours,  
    - clôture de bilan,  
    - carrefour final (Relinium / Fit / Autonomie).
