export type EngagementLevelId = 'n1' | 'n2' | 'n3' | 'n4';

export type CtaTarget = 'none' | 'contact' | 'resources' | 'export' | 'route';

export type EngagementLevel = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaTarget: CtaTarget;
  routePath?: string;
  tags?: string[];
};

export type EngagementPack = {
  intro?: string;
  levels: Record<EngagementLevelId, EngagementLevel>;
};
