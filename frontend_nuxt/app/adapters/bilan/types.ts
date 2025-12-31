import type { UniversalBilanViewModel } from '@/types/bilan';

export interface JourneyBilanAdapter {
  journeyId: string;
  buildViewModel: () => UniversalBilanViewModel;
}
