import type { JourneyBilanAdapter } from './types';
import { createEmptyUniversalBilanViewModel } from '@/types/bilan';
import { assertNoRawAnswers } from '@/utils/bilan/assertNoRawAnswers';

export const p2_stubBilanAdapter: JourneyBilanAdapter = {
  journeyId: 'p2_stub',
  buildViewModel() {
    const vm = createEmptyUniversalBilanViewModel({
      copy: { title: 'Bilan P2_STUB', subtitle: 'Synthese locale (stub).' },
      summaryNav: [
        { id: 'gb_panorama', label: 'Panorama' },
        { id: 'gb_export', label: 'Export' }
      ],
      meta: { isEmpty: true, partial: true, maturity: 'stub' }
    });
    assertNoRawAnswers(vm);
    return vm;
  }
};
