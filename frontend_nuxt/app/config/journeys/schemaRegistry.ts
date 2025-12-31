import type { JourneySchema } from './p1JourneySchema';
import { p1JourneySchema } from './p1JourneySchema';
import { p2JourneySchema } from './p2JourneySchema';
import { p3JourneySchema } from './p3JourneySchema';
import { p4JourneySchema } from './p4JourneySchema';
import { p5JourneySchema } from './p5JourneySchema';
import { p2_stubJourneySchema } from './p2_stubJourneySchema';
import { p3_stubJourneySchema } from './p3_stubJourneySchema';
import { p4_stubJourneySchema } from './p4_stubJourneySchema';




const schemaRegistry: Record<string, JourneySchema> = {
  p1: p1JourneySchema,
  p2: p2JourneySchema,
  p3: p3JourneySchema,
  p4: p4JourneySchema,
  p5: p5JourneySchema,
  p2_stub: p2_stubJourneySchema,
  p3_stub: p3_stubJourneySchema,
  p4_stub: p4_stubJourneySchema
};

export const getJourneySchemaById = (id: string): JourneySchema | null => {
  return schemaRegistry[id] ?? null;
};

export const listJourneySchemas = (): JourneySchema[] => Object.values(schemaRegistry);
