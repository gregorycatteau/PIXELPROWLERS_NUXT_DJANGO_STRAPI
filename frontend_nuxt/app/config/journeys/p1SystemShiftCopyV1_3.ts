// P1 V1.3 — Bascule système (front-only). Ne pas logger, ne pas envoyer au backend.
export const P1_SYSTEM_SHIFT_COPY = {
  title: 'Bascule système',
  prompt: 'Si tu enlèves l’humain du tableau 10 secondes : qu’est-ce qui bloque vraiment ?',
  options: [
    { id: 'A', label: 'Arbitrage mission ↔ cash pas tranché' },
    { id: 'B', label: 'Capacité réelle dépassée (charge/énergie)' },
    { id: 'C', label: 'Dépendance mortelle (financeur/personne/presta/outils)' },
    { id: 'D', label: 'Gouvernance floue (qui tranche/qui peut dire non)' },
    { id: 'E', label: 'Contrôles internes/sécurité faibles (validation contournable)' },
    { id: 'F', label: 'Zone protégée (je ne veux pas préciser)' }
  ],
  helperText: 'Choisis l’option la plus plausible. Ce choix sert à orienter l’analyse, pas à te juger.'
} as const;
