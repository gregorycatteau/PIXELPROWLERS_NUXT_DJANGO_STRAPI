import type {
  UniversalBilanSectionId,
  UniversalBilanSectionState,
  UniversalBilanSectionVM,
  UniversalBilanSectionsVM,
  UniversalBilanViewModel
} from '@/types/bilan';

export type UniversalBilanViewModelV1 = UniversalBilanViewModel;

export const UNIVERSAL_BILAN_SECTION_IDS: UniversalBilanSectionId[] = [
  'reperes',
  'risques',
  'recommandations',
  'actions'
];

export const createEmptySection = (
  id: UniversalBilanSectionId,
  overrides?: Partial<UniversalBilanSectionVM>
): UniversalBilanSectionVM => ({
  id,
  title: '',
  summary: '',
  state: 'empty',
  itemsCount: 0,
  ...overrides
});

export type UniversalBilanSectionsOverrides = Partial<
  Record<UniversalBilanSectionId, Partial<UniversalBilanSectionVM>>
>;

export const createEmptySections = (overrides?: UniversalBilanSectionsOverrides): UniversalBilanSectionsVM => ({
  reperes: createEmptySection('reperes', overrides?.reperes),
  risques: createEmptySection('risques', overrides?.risques),
  recommandations: createEmptySection('recommandations', overrides?.recommandations),
  actions: createEmptySection('actions', overrides?.actions)
});

export type { UniversalBilanSectionId, UniversalBilanSectionState, UniversalBilanSectionVM, UniversalBilanSectionsVM };
