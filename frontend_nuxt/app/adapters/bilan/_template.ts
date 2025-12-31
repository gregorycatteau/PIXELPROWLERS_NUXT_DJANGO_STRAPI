import type { JourneyBilanAdapter } from './types';
import type { GlobalBilanViewModel } from '@/types/bilan';
import { createEmptySections } from '@/adapters/bilan/universalBilanViewModel';

// Template pour créer un nouvel adapter de bilan.
// Règles:
// - Pas de réponses brutes / PII
// - Pas de network / storage supplémentaire
// - VM uniquement (pas de state UI ici)
export const bilanAdapterTemplate: JourneyBilanAdapter = {
  journeyId: 'journey-id-placeholder',
  buildViewModel(): GlobalBilanViewModel {
    // TODO: brancher les composables métier du parcours (scores, resources, etc.)
    return {
      copy: {
        title: 'Titre bilan',
        subtitle: 'Sous-titre'
      },
      axisSummaryLabel: '',
      completedBlocksLabel: '',
      panoramaAnsweredLabel: '',
      summaryNav: [],
      blocksSummaryHeading: '',
      completedBlocks: '',
      panorama: {
        answeredCount: 0,
        skippedCount: 0,
        completenessLabel: '',
        axes: [],
        blocks: [],
        completedLabel: ''
      },
      sections: createEmptySections({
        reperes: { title: 'Repères', summary: 'Vue d’ensemble des axes.' },
        risques: { title: 'Risques', summary: 'Signaux à surveiller.' },
        recommandations: { title: 'Recommandations', summary: 'Pistes à explorer.' },
        actions: { title: 'Actions', summary: 'Actions à court terme.' }
      }),
      modules: {},
      exportPanel: {
        exportText: '',
        clearMessage: '',
        copied: false,
        missingInfo: {},
        eraseCopyLabel: '',
        focusDetails: false,
        hasGlobalMissing: false,
        globalSkipText: '',
        globalMissing: 0
      },
      meta: {
        isEmpty: true,
        partial: true,
        maturity: 'stub'
      }
    };
  }
};
