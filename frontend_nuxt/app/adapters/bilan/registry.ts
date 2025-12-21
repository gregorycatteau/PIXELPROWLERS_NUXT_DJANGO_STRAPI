import type { JourneyBilanAdapter } from './types';
import { p1BilanAdapter } from './p1';

export function getBilanAdapter(journeyId: string): JourneyBilanAdapter {
  if (journeyId === 'p1') {
    return p1BilanAdapter;
  }
  throw new Error(`No bilan adapter registered for journeyId=${journeyId}`);
}
