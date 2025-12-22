export type Horizon = 'now' | 'soon' | 'later';

export type ResourceFormat = 'markdown' | 'pdf' | 'link' | 'other';

export type Resource = {
  id: string;
  title: string;
  summary: string;
  filePath: string;
  tags: string[];
  format: ResourceFormat;
  timeToUse?: string;
};

export type Action = {
  id: string;
  label: string;
  description: string;
  horizon: Horizon;
  tags: string[];
  effort?: number;
  safetyNote?: string;
  filePath?: string;
};
