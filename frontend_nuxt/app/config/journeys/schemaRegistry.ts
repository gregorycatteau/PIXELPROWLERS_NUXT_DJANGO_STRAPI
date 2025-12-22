import type { JourneySchema } from './p1JourneySchema';
import { p1JourneySchema } from './p1JourneySchema';
import { p2JourneySchema } from './p2JourneySchema';
import { p3JourneySchema } from './p3JourneySchema';

const schemaRegistry: Record<string, JourneySchema> = {
  p1: p1JourneySchema,
  p2: p2JourneySchema,
  p3: p3JourneySchema
};

export const getJourneySchemaById = (id: string): JourneySchema | null => {
  return schemaRegistry[id] ?? null;
};

export const listJourneySchemas = (): JourneySchema[] => Object.values(schemaRegistry);
