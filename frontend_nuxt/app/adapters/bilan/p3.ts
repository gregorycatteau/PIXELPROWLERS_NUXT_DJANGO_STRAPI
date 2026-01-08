import type { JourneyBilanAdapter } from './types';
import type { ResourcesActionsItemVM } from '@/types/bilan';
import { createEmptyUniversalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';
import { p3Copy } from '~/config/journeys/p3CopyV1_0';

const RESOURCES_TARGETS = [
  '/ressources/reunion-30min-sans-noyade',
  '/ressources/decision-log-minimal',
  '/ressources/charte-canaux-3-couleurs'
];

const buildActionCards = () =>
  (p3Copy.bilan?.actionCards ?? []).map((card, index) => ({
    id: `p3_card_${index + 1}`,
    kind: 'action' as const,
    title: card.title,
    description: card.description,
    cta: {
      type: 'route' as const,
      label: card.cta,
      target: RESOURCES_TARGETS[index % RESOURCES_TARGETS.length]
    }
  })) as ResourcesActionsItemVM[];

export const p3BilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p3',
  buildViewModel() {
    const actionCards = buildActionCards();
    const vm = createEmptyUniversalBilanViewModel({
      copy: {
        title: 'Bilan P3',
        subtitle: 'Synthese locale, neutre et factuelle.',
        exportHeading: p3Copy.global.exportHeading ?? 'Export (client-side)',
        exportNotice: p3Copy.global.exportNotice ?? 'Le texte ci-dessus est genere cote client.',
        copyCta: p3Copy.global.copyCta ?? 'Copier le bilan',
        printCta: p3Copy.global.printCta ?? 'Imprimer',
        clearCta: p3Copy.global.clearCta ?? 'Effacer mes reponses de cet appareil',
        backToHub: p3Copy.global.backToHub ?? 'Retour au panorama',
        sovereigntyNote: p3Copy.global.sovereigntyNote ?? 'Ce bilan reste sur cet appareil.'
      },
      axisSummaryLabel: p3Copy.bilan?.scoreLabel ?? 'Niveau de pression',
      blocksSummaryHeading: p3Copy.bilan?.scoreLabel ?? 'Niveau de pression',
      completedBlocksLabel: '',
      panoramaAnsweredLabel: '',
      summaryNav: [
        { id: 'gb_priorites', label: p3Copy.bilan?.prioritiesLabel ?? 'Ce qui protege d abord' },
        { id: 'gb_panorama', label: 'Panorama' },
        { id: 'gb_export', label: 'Export' }
      ],
      modules: {
        resourcesActions: {
          recommended: actionCards,
          library: [],
          tags: []
        }
      },
      meta: { isEmpty: true, partial: true, maturity: 'core' }
    });
    assertNoRawAnswers(vm);
    return vm;
  }
};
