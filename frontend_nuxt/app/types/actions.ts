import type { RouteLocationRaw } from '#vue-router';

export type ActionItemKind =
  | 'resource_filters'
  | 'resource'
  | 'action'
  | 'export'
  | 'info';

export type ActionItem = {
  id: string;
  title: string;
  summary: string;
  kind: ActionItemKind;
  ctaLabel: string;
  to: RouteLocationRaw;
};
