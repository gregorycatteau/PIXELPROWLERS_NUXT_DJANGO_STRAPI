import type { GlobalBilanViewModel } from '@/types/bilan';

export interface JourneyBilanAdapter {
  journeyId: string;
  buildViewModel: () => GlobalBilanViewModel;
}
