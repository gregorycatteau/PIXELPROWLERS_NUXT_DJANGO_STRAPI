import { assertNoRawAnswers } from '../app/utils/bilan/assertNoRawAnswers';
import {
  createEmptyUniversalBilanViewModel,
  withUniversalBilanDefaults,
  type UniversalBilanViewModel
} from '../app/types/bilan';

const requiredRootKeys = [
  'copy',
  'axisSummaryLabel',
  'completedBlocksLabel',
  'panoramaAnsweredLabel',
  'summaryNav',
  'panorama',
  'blocksSummaryHeading',
  'completedBlocks',
  'exportPanel'
];

const requiredPanoramaKeys = [
  'answeredCount',
  'skippedCount',
  'completenessLabel',
  'axes',
  'blocks',
  'completedLabel'
];

const requiredExportPanelKeys = [
  'exportText',
  'clearMessage',
  'copied',
  'missingInfo',
  'eraseCopyLabel',
  'focusDetails',
  'hasGlobalMissing',
  'globalSkipText',
  'globalMissing'
];

const assertKeys = (label: string, obj: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    if (!(key in obj)) {
      throw new Error(`Missing ${label}.${key}`);
    }
  }
};

const assertMandatory = (vm: UniversalBilanViewModel) => {
  assertKeys('vm', vm as Record<string, unknown>, requiredRootKeys);
  assertKeys('vm.panorama', vm.panorama as Record<string, unknown>, requiredPanoramaKeys);
  assertKeys('vm.exportPanel', vm.exportPanel as Record<string, unknown>, requiredExportPanelKeys);
};

const run = () => {
  const emptyVm = createEmptyUniversalBilanViewModel();
  assertMandatory(emptyVm);
  assertNoRawAnswers(emptyVm);

  const partialVm = withUniversalBilanDefaults({
    meta: { isEmpty: false, partial: true, maturity: 'core' },
    summaryNav: [{ id: 'gb_panorama', label: 'Panorama' }],
    panorama: {
      answeredCount: 1,
      skippedCount: 0,
      completenessLabel: 'Panorama complet (1/1)',
      axes: [],
      blocks: [],
      completedLabel: '1'
    },
    exportPanel: {
      exportText: 'Bilan (local)',
      clearMessage: '',
      copied: false,
      missingInfo: {},
      eraseCopyLabel: '',
      focusDetails: false,
      hasGlobalMissing: false,
      globalSkipText: '',
      globalMissing: 0
    }
  });
  assertMandatory(partialVm);
  assertNoRawAnswers(partialVm);

  console.log('Bilan VM contract guard OK');
};

try {
  run();
} catch (error) {
  console.error('Bilan VM contract guard failed.');
  if (error instanceof Error) {
    console.error(error.message);
  }
  process.exit(1);
}
