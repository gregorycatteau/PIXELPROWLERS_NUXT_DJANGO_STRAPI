import type { JourneyBilanAdapter } from './types';
import { p1BilanAdapter } from './p1';
import { p2BilanAdapter } from './p2';

const registry: Record<string, JourneyBilanAdapter> = {
  p1: p1BilanAdapter,
  p2: p2BilanAdapter
};

export function getBilanAdapter(journeyId: string): JourneyBilanAdapter | null {
  return registry[journeyId] ?? null;
}
