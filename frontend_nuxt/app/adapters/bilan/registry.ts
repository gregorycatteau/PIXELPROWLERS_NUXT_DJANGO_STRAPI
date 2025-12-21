import type { JourneyBilanAdapter } from './types';
import { p1BilanAdapter } from './p1';
import { p2BilanAdapter } from './p2';
import { p3BilanAdapter } from './p3';

const registry: Record<string, JourneyBilanAdapter> = {
  p1: p1BilanAdapter,
  p2: p2BilanAdapter,
  p3: p3BilanAdapter
};

export const bilanAdapters: JourneyBilanAdapter[] = Object.values(registry);
export const bilanAdapterIds = Object.keys(registry);

export function getBilanAdapter(journeyId: string): JourneyBilanAdapter | null {
  return registry[journeyId] ?? null;
}
