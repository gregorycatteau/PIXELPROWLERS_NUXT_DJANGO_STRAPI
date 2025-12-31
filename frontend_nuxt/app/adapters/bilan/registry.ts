import type { JourneyBilanAdapter } from './types';
import { p1BilanAdapter } from './p1';
import { p2BilanAdapter } from './p2';
import { p3BilanAdapter } from './p3';
import { p4BilanAdapter } from './p4';
import { p5BilanAdapter } from './p5';
import { p2_stubBilanAdapter } from './p2_stub';
import { p3_stubBilanAdapter } from './p3_stub';
import { p4_stubBilanAdapter } from './p4_stub';




const registry: Record<string, JourneyBilanAdapter> = {
  p1: p1BilanAdapter,
  p2: p2BilanAdapter,
  p3: p3BilanAdapter,
  p4: p4BilanAdapter,
  p5: p5BilanAdapter,
  p2_stub: p2_stubBilanAdapter,
  p3_stub: p3_stubBilanAdapter,
  p4_stub: p4_stubBilanAdapter
};

export const bilanAdapters: JourneyBilanAdapter[] = Object.values(registry);
export const bilanAdapterIds = Object.keys(registry);

export function getBilanAdapter(journeyId: string): JourneyBilanAdapter | null {
  return registry[journeyId] ?? null;
}
