import type { InjectionKey } from 'vue';

export type JourneyNavigate = (stepId: string) => void;

export const journeyNavigationKey: InjectionKey<JourneyNavigate> = Symbol('journeyNavigation');
