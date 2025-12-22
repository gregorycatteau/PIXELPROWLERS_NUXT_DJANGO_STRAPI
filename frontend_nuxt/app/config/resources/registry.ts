import { P1_RESOURCES_V1_3 } from './p1ResourcesV1_3';
import { validateFilePath } from './allowlist';
import type { Action, Resource, ResourceFormat } from './types';
import * as p1ActionPlans from '../journeys/p1ActionPlansV1_0';

const normalizeFormat = (value?: string): ResourceFormat => {
  const lowered = (value ?? '').toLowerCase();
  if (lowered.includes('markdown')) return 'markdown';
  if (lowered.includes('pdf')) return 'pdf';
  if (lowered.includes('link') || lowered.includes('url')) return 'link';
  return 'other';
};

const addJourneyTag = (tags: string[] | undefined, journeyId: string): string[] => {
  const base = Array.isArray(tags) ? tags.slice() : [];
  base.push(`journey:${journeyId}`);
  return base;
};

export const RESOURCE_LIBRARY: Resource[] = P1_RESOURCES_V1_3.map((resource) => {
  validateFilePath(resource.filePath);
  return {
    id: resource.id,
    title: resource.title,
    summary: resource.summary,
    filePath: resource.filePath,
    tags: addJourneyTag(resource.tags, 'p1'),
    format: normalizeFormat(resource.format),
    timeToUse: resource.timeToUse
  };
});

const collectP1Actions = (): Action[] => {
  const packs = Object.values(p1ActionPlans);
  const actions: Action[] = [];

  packs.forEach((pack) => {
    if (!Array.isArray(pack)) return;
    pack.forEach((item) => {
      if (!item || typeof item !== 'object') return;
      const candidate = item as {
        id?: string;
        label?: string;
        description?: string;
        horizon?: Action['horizon'];
        blockId?: string;
        mode?: string;
        effort?: number;
        safetyNote?: string;
        filePath?: string;
      };
      if (!candidate.id || !candidate.label || !candidate.description || !candidate.horizon) return;
      const tags = addJourneyTag([], 'p1');
      if (candidate.blockId) tags.push(`block:${candidate.blockId}`);
      if (candidate.mode) tags.push(`mode:${candidate.mode}`);
      if (candidate.filePath) validateFilePath(candidate.filePath);
      actions.push({
        id: candidate.id,
        label: candidate.label,
        description: candidate.description,
        horizon: candidate.horizon,
        tags,
        effort: candidate.effort,
        safetyNote: candidate.safetyNote,
        filePath: candidate.filePath
      });
    });
  });

  return actions;
};

export const ACTION_LIBRARY: Action[] = collectP1Actions();

export const listResources = (): Resource[] => RESOURCE_LIBRARY.slice();
export const listActions = (): Action[] => ACTION_LIBRARY.slice();

export const getResourceById = (id: string): Resource | null =>
  RESOURCE_LIBRARY.find((resource) => resource.id === id) ?? null;

export const getActionById = (id: string): Action | null =>
  ACTION_LIBRARY.find((action) => action.id === id) ?? null;
