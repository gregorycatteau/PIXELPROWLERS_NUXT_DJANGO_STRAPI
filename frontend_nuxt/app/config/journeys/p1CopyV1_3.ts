// Textes P1 V1.3 – front-only.
// Ne jamais logger ces textes avec des données utilisateur, ne jamais les envoyer au backend.

export const P1_INTRO_COPY = {
  title: 'Faire le point sur ta structure, sans te mettre en danger',
  lead:
    'Cet atelier te propose une série de phrases sur le fonctionnement de ta structure. Tu indiques simplement à quel point chaque phrase est vraie pour toi, de “pas du tout vrai” à “tout à fait vrai”.',
  sovereignty:
    'Tes réponses sont stockées uniquement sur cet appareil, pour générer un bilan lisible par toi. Rien n’est envoyé à PixelProwlers ni à un serveur externe.',
  stopAnytime:
    'Tu peux t’arrêter à tout moment. On générera un bilan à partir de ce que tu auras déjà complété, sans jugement.',
  sharedDeviceWarning:
    'Si tu utilises un appareil partagé (ordinateur de la structure, poste public, etc.), pense à effacer tes réponses à la fin.'
};

export const P1_SCALE_COPY = {
  questionPrompt: 'À quel point cette phrase est vraie pour ta structure ?',
  valueLabels: {
    1: 'Pas du tout vrai',
    2: 'Plutôt faux',
    3: 'Mitigé / ça dépend',
    4: 'Plutôt vrai',
    5: 'Tout à fait vrai'
  },
  currentSelection: 'Sélection actuelle : {{label}} ({{value}} / 5)'
};

export const P1_PROGRESS_COPY = {
  stepLabel: 'Étape {{currentStep}} sur {{totalSteps}}',
  questionLabel: 'Question {{currentQuestion}} / {{totalQuestionsInStep}}',
  stopReminder:
    'Tu peux t’arrêter à tout moment : on générera un bilan à partir de ce que tu as déjà complété.',
  resumeInfo:
    'Tu avais déjà commencé cet atelier. Tu peux poursuivre là où tu t’étais arrêté·e ou revoir certaines réponses avant de générer un nouveau bilan.'
};

export const P1_SKIP_COPY = {
  buttonLabel: 'Je ne souhaite pas répondre',
  helperText:
    'Tu as le droit de ne pas répondre à cette question. Le bilan indiquera simplement qu’il s’agit d’une zone laissée de côté pour l’instant.'
};

export const P1_GLOBAL_SKIP_SUMMARY = {
  fewSkips:
    'Tu as choisi de laisser de côté quelques questions. C’est une manière normale d’ajuster l’atelier à ce qui est possible pour toi maintenant.',
  manySkips:
    'Tu as laissé de côté un nombre important de questions. C’est un signal que certains sujets sont peut-être sensibles, flous ou trop lourds pour l’instant. Le bilan le reconnaît comme une zone à préserver, à éventuellement explorer plus tard, à ton rythme.'
};

export const P1_MISSING_COPY = {
  info:
    'Certaines questions n’ont pas été traitées (ni répondues, ni volontairement ignorées). Elles ne seront pas prises en compte dans les calculs, ce qui est normal si tu t’es arrêté·e en cours de route.'
};

export const P1_ERASE_COPY = {
  buttonLabel: 'Effacer mes réponses de cet appareil',
  confirmTitle: 'Effacer les réponses de cet appareil ?',
  confirmBody:
    'Tu es sur le point d’effacer toutes les réponses de cet atelier stockées sur cet appareil. Aucune copie n’est conservée côté PixelProwlers, mais cette action est irréversible ici. Confirmer l’effacement des réponses ?',
  done:
    'C’est fait. Les réponses de cet atelier ont été effacées de cet appareil. Tu pourras recommencer plus tard, avec un autre contexte ou une autre équipe, si tu le souhaites.'
};
