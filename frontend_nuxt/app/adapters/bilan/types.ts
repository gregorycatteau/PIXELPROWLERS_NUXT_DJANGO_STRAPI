import type { UniversalBilanViewModelV1 } from '@/adapters/bilan/universalBilanViewModel';

export interface JourneyBilanAdapter {
  journeyId: string;
  buildViewModel: () => UniversalBilanViewModelV1;
}
