import type { JourneyManifestV1 } from './types';
import { p1Manifest } from './p1.manifest';
import { p2Manifest } from './p2.manifest';
import { p3Manifest } from './p3.manifest';
import { p4Manifest } from './p4.manifest';

const registry: JourneyManifestV1[] = [p1Manifest, p2Manifest, p3Manifest, p4Manifest];

export const listManifests = (): JourneyManifestV1[] => registry.slice();

export const getManifestById = (id: string): JourneyManifestV1 | null =>
  registry.find((manifest) => manifest.id === id) ?? null;

export const getManifestBySlug = (slug: string): JourneyManifestV1 | null =>
  registry.find((manifest) => manifest.slug === slug) ?? null;
