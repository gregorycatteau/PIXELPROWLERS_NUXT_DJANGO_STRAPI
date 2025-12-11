# PX_V1_3_PARCOURS_UTILISATEURS_P1.md

## 1. Personas centraux

- **Persona A – Membre impliqué en tension**
  - Salarié·e, bénévole, sociétaire, élu·e…
  - Éprouve de la fatigue, de la confusion, parfois l’envie de partir.
  - Cherche de la clarté sans exposer sa vulnérabilité à son collectif.

- **Persona B – Porteur·se de projet / fondateur·rice**
  - Porte la structure à bout de bras.
  - Voit que “ça dysfonctionne” mais n’arrive pas à prendre le recul nécessaire.
  - Craint que parler des tensions n’aggrave la situation.

- **Persona C – Accompagnant·e / coach**
  - Utilise P1 comme support de discussion avec un client / une équipe.
  - A besoin d’un outil qui respecte la souveraineté du client.

- **Persona D – Utilisateur prudent / profil à risque**
  - Craint une surveillance (conflit avec une direction, contexte précaire).
  - Utilise un device possiblement partagé.


## 2. User stories – diagnostic & ressenti

1. **En tant que Persona A**,  
   je veux répondre à des phrases qui décrivent le fonctionnement de ma structure  
   afin de pouvoir indiquer simplement si elles sont vraies pour moi,  
   sans avoir à “évaluer un problème” de manière abstraite.

2. **En tant que Persona A**,  
   je veux pouvoir dire “je ne souhaite pas répondre” à certaines questions  
   afin de respecter mes propres limites sans être bloqué dans le parcours.

3. **En tant que Persona B**,  
   je veux voir clairement où j’en suis dans le questionnaire (barre de progression)  
   afin de gérer mon énergie et décider si je continue maintenant ou plus tard.

4. **En tant que Persona A**,  
   je veux pouvoir interrompre le parcours à tout moment  
   afin de ne pas me sentir piégé dans un “test” trop long.

5. **En tant que Persona D**,  
   je veux savoir si mes réponses sont stockées quelque part  
   afin de décider si je peux répondre depuis ce device ou non.


## 3. User stories – souveraineté & sécurité

6. **En tant que Persona D**,  
   je veux que mes réponses au diagnostic soient calculées localement  
   afin de ne pas donner à un tiers une cartographie complète des tensions de ma structure.

7. **En tant que Persona D**,  
   je veux disposer d’un bouton “Effacer mes réponses de cet appareil”  
   afin de supprimer facilement toute trace du diagnostic après coup.

8. **En tant que Persona A**,  
   je veux que le site explique clairement ce qui est fait (ou pas) de mes données  
   afin de pouvoir décider en conscience si je continue.

9. **En tant qu’admin technique PixelProwlers**,  
   je veux que le back-end ne reçoive pas les réponses brutes de P1  
   afin d’être certain que même en cas de compromission serveur, le diagnostic des utilisateurs reste privé.


## 4. User stories – bilan & plan d’action

10. **En tant que Persona A**,  
    je veux que le bilan fasse référence à certaines de mes réponses  
    afin de sentir que ce que je vis a vraiment été pris en compte.

11. **En tant que Persona B**,  
    je veux obtenir un bilan qui parle du fonctionnement de ma structure (et pas de ma personnalité)  
    afin de ne pas me sentir jugé ou “psychanalysé”.

12. **En tant que Persona A**,  
    je veux qu’on me propose un **plan d’action organisé** (par thèmes / priorités)  
    afin de savoir par où commencer de manière réaliste.

13. **En tant que Persona C (accompagnant)**,  
    je veux pouvoir utiliser le plan d’action comme base de discussion  
    afin de gagner du temps sur la phase de “mise à plat” avec mon client.

14. **En tant que Persona A**,  
    je veux pouvoir télécharger ou copier mon plan d’action  
    afin de le retravailler dans mes propres outils (ou sur papier).


## 5. User stories – Relinium & suites possibles

15. **En tant que Persona A**,  
    je veux pouvoir, si je le souhaite, envoyer mon plan d’action dans Relinium  
    afin de l’organiser dans le temps et d’en suivre la mise en œuvre.

16. **En tant que Persona A**,  
    je veux aussi pouvoir simplement garder mon plan pour moi, sans compte ni connexion à Relinium  
    afin de rester totalement autonome si je ne veux pas d’outil supplémentaire.

17. **En tant que PixelProwlers**,  
    je veux que l’activation de Relinium soit un choix explicite à la fin du parcours P1  
    afin de respecter la logique “atelier souverain d’abord, outil ensuite”.


## 6. Misuse / abuse stories (menaces à prendre en compte)

18. **En tant qu’attaquant interne (membre de la structure)**,  
    je veux ouvrir le navigateur d’un collègue pour voir s’il a rempli un diagnostic P1  
    afin de comprendre ce qu’il pense réellement de la structure.

19. **En tant qu’admin système peu scrupuleux**,  
    je veux accéder aux bases de données de PixelProwlers pour savoir quelles structures sont “en crise”  
    afin d’utiliser ces informations à mon avantage (ou de les divulguer).

20. **En tant que direction en conflit avec ses équipes**,  
    je veux obliger les salarié·es à faire P1 en séance collective sur un device projeté  
    afin de contrôler leurs réponses et les utiliser contre eux.

Ces misuse stories devront être neutralisées par :

- un design qui limite la valeur exploitable si quelqu’un accède au device,
- une architecture qui ne stocke pas le diagnostic P1 côté serveur,
- un discours clair qui encourage une utilisation **personnelle et protégée** de P1.
