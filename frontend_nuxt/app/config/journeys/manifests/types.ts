export type JourneyManifestMaturity = 'stub' | 'core' | 'full' | 'prod';

export type JourneyManifestModules = {
  panorama?: boolean;
  blocks?: boolean;
  issues?: boolean;
  hypotheses?: boolean;
  landing?: boolean;
  actions?: boolean;
  resources?: boolean;
  engagement?: boolean;
  export?: boolean;
  recommendations?: boolean;
};

export type JourneyManifestPointers = {
  questions?: string;
  copy?: string;
  resources?: string;
  actions?: string;
};

export type JourneyManifestAdapters = {
  globalBilanAdapterId?: string;
};

export type JourneyManifestAxis = {
  axisId: string;
  label: string;
  description?: string;
  renderHint?: string;
};

export type JourneyManifestStorage = {
  schemaVersion: string;
  scoresKey: string;
  metaKey: string;
  ttlPolicy: 'unchanged';
};

export type JourneyManifestV1 = {
  id: string;
  slug: string;
  engine?: 'legacy' | 'universal';
  maturity: JourneyManifestMaturity;
  axes?: JourneyManifestAxis[];
  modules: JourneyManifestModules;
  pointers: JourneyManifestPointers;
  adapters: JourneyManifestAdapters;
  resourceIds?: string[];
  actionIds?: string[];
  storage: JourneyManifestStorage;
};
