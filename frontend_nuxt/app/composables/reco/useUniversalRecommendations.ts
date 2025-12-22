import { computed } from 'vue';
import type { GlobalBilanViewModel } from '~/types/bilan';
import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import { listActions, listResources } from '~/config/resources/registry';
import type { RecommendationItem, RecommendationResult, RecommendationSignals } from '~/utils/reco/types';
import { attachReasons } from '~/utils/reco/scoring';

const MAX_RECOMMENDED = 6;

const buildSignals = (vm: GlobalBilanViewModel, manifest: JourneyManifestV1): RecommendationSignals => {
  const axes = (vm.panorama?.axes ?? []).map((axis) => ({
    axisId: axis.id,
    label: axis.label,
    score: axis.score ?? 0,
    answeredCount: 0,
    skippedCount: 0,
    missingCount: 0,
    totalCount: 0
  }));

  const skipSignal = vm.modules?.skipSignal
    ? {
        globalSkippedCount: vm.modules.skipSignal.globalSkippedCount,
        byAxis: (vm.modules.skipSignal.byAxis ?? []).map((axis) => ({
          axisId: axis.axisId,
          skippedCount: axis.skippedCount,
          totalCount: axis.totalCount
        }))
      }
    : undefined;

  const blocks = (vm.panorama?.blocks ?? []).map((block) => ({
    id: block.id,
    title: block.title,
    answeredCount: block.answeredCount,
    skippedCount: block.skippedCount,
    unseenCount: block.unseenCount,
    completion: block.completion
  }));

  return {
    journeyId: manifest.id,
    axes,
    blocks,
    skipSignal
  };
};

const buildLibrary = (manifest: JourneyManifestV1): RecommendationItem[] => {
  const resources = listResources();
  const actions = listActions();

  const resourceIds = manifest.resourceIds;
  const actionIds = manifest.actionIds;
  const journeyTag = `journey:${manifest.id}`;

  const resourceItems = (resourceIds && resourceIds.length ? resources.filter((res) => resourceIds.includes(res.id)) : resources.filter((res) => res.tags.includes(journeyTag)))
    .map<RecommendationItem>((res) => ({
      id: res.id,
      kind: 'resource',
      title: res.title,
      summary: res.summary,
      tags: res.tags,
      format: res.format,
      filePath: res.filePath
    }));

  const actionItems = (actionIds && actionIds.length ? actions.filter((action) => actionIds.includes(action.id)) : actions.filter((action) => action.tags.includes(journeyTag)))
    .map<RecommendationItem>((action) => ({
      id: action.id,
      kind: 'action',
      title: action.label,
      summary: action.description,
      tags: action.tags,
      horizon: action.horizon,
      filePath: action.filePath
    }));

  return [...resourceItems, ...actionItems];
};

export const useUniversalRecommendations = (vm: GlobalBilanViewModel, manifest: JourneyManifestV1): RecommendationResult => {
  const signals = buildSignals(vm, manifest);
  const library = buildLibrary(manifest);
  const recommended = attachReasons(signals, library.slice(0, MAX_RECOMMENDED));

  return {
    recommended,
    library
  };
};

export const useUniversalRecommendationsState = (vm: () => GlobalBilanViewModel, manifest: () => JourneyManifestV1 | null) => {
  return computed<RecommendationResult>(() => {
    const currentManifest = manifest();
    if (!currentManifest) {
      return { recommended: [], library: [] };
    }
    return useUniversalRecommendations(vm(), currentManifest);
  });
};
