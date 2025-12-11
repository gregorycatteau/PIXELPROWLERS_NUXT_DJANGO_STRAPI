// app/config/journeys/p1ActionCopyV1_0.ts
// Textes pour la section “Pistes d’action possibles” dans le bilan P1.
// Front-only, aucun lien backend / aucun log de ces textes.

export const P1_ACTION_SECTION_COPY = {
  title: "Pistes d’action possibles",
  intro:
    "Ce plan d’action n’est ni un verdict, ni un ordre de marche. C’est une liste d’options possibles à adapter à ta réalité. Tu peux en ignorer certaines, en modifier d’autres, ou décider de ne rien engager pour l’instant.",
  emptyTitle: "Pas de zone d’alerte majeure à traiter en priorité",
  emptyBody:
    "D’après ce que tu as posé, P1 ne signale pas de tensions fortes sur le climat ou les règles. Tu peux garder cet atelier sous la main et y revenir plus tard si la situation évolue.",
  exportLabel: "📝 Exporter ces pistes en Markdown",
  exportHelper:
    "L’export contient uniquement les intitulés des actions, sans aucune donnée personnelle. Tu peux les coller dans ton propre système (document, Relinium, carnet…)."
};

export const P1_ACTION_HORIZON_COPY = {
  nowTitle: "Ce que tu peux faire dès maintenant",
  nowHelper:
    "Des gestes légers, activables sans autorisation particulière, pour y voir plus clair et te protéger un minimum.",
  soonTitle: "Ce que tu pourras envisager bientôt",
  soonHelper:
    "Des actions qui demandent un peu plus d’organisation ou d’échange avec d’autres personnes, quand tu te sentiras prêt·e.",
  laterTitle: "À garder en réserve pour plus tard",
  laterHelper:
    "Des pistes plus impliquantes, à n’activer que si le contexte et le rapport de forces te semblent suffisamment favorables."
};

export const P1_ACTION_MODE_TAGS = {
  solo_reflexion: "À faire pour toi, en solo",
  duo_confiance: "À envisager avec une personne de confiance",
  petit_groupe: "À tester dans un petit groupe",
  instance_formelle: "À porter éventuellement en instance formelle"
};

export const P1_ACTION_SAFETY_COPY = {
  genericReminder:
    "Tu restes la meilleure personne pour juger de ce qui est réaliste et sûr pour toi. Renoncer à une action est un choix pleinement légitime.",
  highRiskContext:
    "Ce que tu décris ressemble à un contexte potentiellement risqué, où certaines décisions ou règles peuvent être utilisées comme leviers de pression. Les pistes proposées ici visent d’abord à te protéger, avant d’envisager d’éventuelles actions visibles."
};
