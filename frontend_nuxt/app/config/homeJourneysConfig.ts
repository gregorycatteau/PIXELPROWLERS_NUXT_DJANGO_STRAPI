export type HomeJourneyId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

export interface HomeJourneyConfig {
  id: HomeJourneyId;
  slug: string;
  title: string;
  situation: string;
  outcome: string;
  ctaLabel: string;
  isAvailable: boolean;
  badgeLabel?: string;
  isEmphasized?: boolean;
}

/**
 * Textes officiels issus de HOME_V1_2_HOMEPAGE_UX_CONTENT_TALIA.md (section S2).
 */
export const HOME_JOURNEYS: HomeJourneyConfig[] = [
  {
    id: 'p1',
    slug: 'ma-structure-dysfonctionne',
    title: 'Ma structure dysfonctionne',
    situation:
      'Réunions lourdes, décisions floues, tensions qui s’installent… et l’impression de tenir la structure à bout de bras.',
    outcome:
      'Tu poses un diagnostic structuré de tes dysfonctionnements, tu clarifies où ça bloque vraiment et tu repars avec des pistes d’action réalistes.',
    ctaLabel: 'Explorer ce parcours',
    isAvailable: true
  },
  {
    id: 'p2',
    slug: 'nos-outils-numeriques-nous-epuisent',
    title: 'Nos outils numériques nous épuisent',
    situation:
      'Drive, messageries, tableurs, formulaires… Tu passes plus de temps à jongler entre les outils qu’à faire ton vrai travail.',
    outcome:
      'Tu cartographies tes outils, tu repères les redondances et tu imagines un outillage plus simple, plus éthique et plus soutenable.',
    ctaLabel: 'Explorer ce parcours',
    isAvailable: false
  },
  {
    id: 'p3',
    slug: 'je-suis-en-transition',
    title: 'Je suis en transition, je ne sais plus comment avancer',
    situation:
      'Ton job, ta structure ou toi-même ont changé. Tu sens que quelque chose ne colle plus, sans savoir par où prendre le sujet.',
    outcome:
      'Tu mets à plat ce que tu veux garder, ce que tu veux faire évoluer, et tu ouvres des pistes concrètes pour la suite.',
    ctaLabel: 'Explorer ce parcours',
    isAvailable: false
  },
  {
    id: 'p4',
    slug: 'idee-forte-a-structurer',
    title: 'J’ai une idée forte, mais je ne sais pas comment la structurer',
    situation:
      'Tu portes une idée qui te tient à cœur, mais tu as du mal à l’expliquer, à embarquer des alliés ou à la rendre concrète.',
    outcome:
      'Tu clarifies pour qui est ton idée, à quoi elle sert et comment la tester à petite échelle sans tout brûler.',
    ctaLabel: 'Explorer ce parcours',
    isAvailable: false
  },
  {
    id: 'p5',
    slug: 'quelque-chose-doit-changer',
    title: 'Je sais juste que quelque chose doit changer',
    situation:
      'Rien n’est totalement cassé… mais rien n’est vraiment fluide non plus. Tu sens que ça ne peut pas continuer comme ça.',
    outcome:
      'Tu prends un premier recul pour nommer ce qui coince et tu identifies par quel type de parcours commencer.',
    ctaLabel: 'Explorer ce parcours',
    isAvailable: false
  }
];
