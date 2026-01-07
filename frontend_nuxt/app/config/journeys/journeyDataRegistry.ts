import type { JourneyManifestV1 } from './manifests/types';
import { p2Copy } from './p2CopyV1_0';
import { p3Copy } from './p3CopyV1_0';
import { p4Copy } from './p4CopyV1_0';
import {
  p2PanoramaAxesMeta,
  p2PanoramaQuestions,
  P2_PANORAMA_AXIS_ORDER
} from './p2QuestionsV1_0';
import {
  p3PanoramaAxesMeta,
  p3PanoramaQuestions,
  P3_PANORAMA_AXIS_ORDER
} from './p3QuestionsV1_0';
import {
  p4PanoramaAxesMeta,
  p4PanoramaQuestions,
  P4_PANORAMA_AXIS_ORDER
} from './p4QuestionsV1_0';
import { p5Copy } from './p5CopyV1_0';
import { p5PanoramaAxesMeta, p5PanoramaQuestions, P5_PANORAMA_AXIS_ORDER } from './p5QuestionsV1_0';

import { p2_stubCopy } from './p2_stubCopyV1_0';

import { p2_stubPanoramaAxesMeta, p2_stubPanoramaQuestions, P2_STUB_PANORAMA_AXIS_ORDER } from './p2_stubQuestionsV1_0';

import { p3_stubCopy } from './p3_stubCopyV1_0';

import { p3_stubPanoramaAxesMeta, p3_stubPanoramaQuestions, P3_STUB_PANORAMA_AXIS_ORDER } from './p3_stubQuestionsV1_0';

import { p4_stubCopy } from './p4_stubCopyV1_0';

import { p4_stubPanoramaAxesMeta, p4_stubPanoramaQuestions, P4_STUB_PANORAMA_AXIS_ORDER } from './p4_stubQuestionsV1_0';

export type JourneyCopyIntro = {
  title: string;
  subtitle?: string;
  cta?: string;
};

export type JourneyCopyPanorama = {
  title: string;
  subtitle?: string;
  meta?: string;
  validate?: string;
  back?: string;
};

export type JourneyCopyPanoramaBilan = {
  title: string;
  subtitle?: string;
  summaryTitle?: string;
  summarySubtitle?: string;
  backToPanorama?: string;
  globalCta?: string;
  globalLocked?: string;
};

export type JourneyCopyGlobal = {
  title?: string;
  subtitle?: string;
};

export type JourneyCopyBundle = {
  intro?: JourneyCopyIntro;
  panorama?: JourneyCopyPanorama;
  panoramaBilan?: JourneyCopyPanoramaBilan;
  global?: JourneyCopyGlobal;
};

export type PanoramaQuestion = {
  id: string;
  axisId: string;
  label: string;
  order?: number;
};

export type PanoramaQuestionsBundle = {
  questions: PanoramaQuestion[];
  axisOrder?: string[];
  axesMeta?: Record<string, { label: string; shortLabel?: string }>;
};

const copyRegistry: Record<string, JourneyCopyBundle> = {
  'app/config/journeys/p2CopyV1_0': p2Copy,
  'app/config/journeys/p3CopyV1_0': p3Copy,
  'app/config/journeys/p4CopyV1_0': p4Copy,
  'app/config/journeys/p5CopyV1_0': p5Copy,
  'app/config/journeys/p2_stubCopyV1_0': p2_stubCopy,
  'app/config/journeys/p3_stubCopyV1_0': p3_stubCopy,
  'app/config/journeys/p4_stubCopyV1_0': p4_stubCopy
};

const questionsRegistry: Record<string, PanoramaQuestionsBundle> = {
  'app/config/journeys/p2QuestionsV1_0': {
    questions: p2PanoramaQuestions,
    axisOrder: P2_PANORAMA_AXIS_ORDER,
    axesMeta: p2PanoramaAxesMeta
  },
  'app/config/journeys/p3QuestionsV1_0': {
    questions: p3PanoramaQuestions,
    axisOrder: P3_PANORAMA_AXIS_ORDER,
    axesMeta: p3PanoramaAxesMeta
  },
  'app/config/journeys/p4QuestionsV1_0': {
    questions: p4PanoramaQuestions,
    axisOrder: P4_PANORAMA_AXIS_ORDER,
    axesMeta: p4PanoramaAxesMeta
  },
  'app/config/journeys/p5QuestionsV1_0': { questions: p5PanoramaQuestions, axisOrder: [...P5_PANORAMA_AXIS_ORDER], axesMeta: p5PanoramaAxesMeta },
  'app/config/journeys/p2_stubQuestionsV1_0': { questions: p2_stubPanoramaQuestions, axisOrder: P2_STUB_PANORAMA_AXIS_ORDER, axesMeta: p2_stubPanoramaAxesMeta },
  'app/config/journeys/p3_stubQuestionsV1_0': { questions: p3_stubPanoramaQuestions, axisOrder: P3_STUB_PANORAMA_AXIS_ORDER, axesMeta: p3_stubPanoramaAxesMeta },
  'app/config/journeys/p4_stubQuestionsV1_0': { questions: p4_stubPanoramaQuestions, axisOrder: P4_STUB_PANORAMA_AXIS_ORDER, axesMeta: p4_stubPanoramaAxesMeta }
};

export const getJourneyCopy = (manifest: JourneyManifestV1 | null): JourneyCopyBundle | null => {
  const pointer = manifest?.pointers?.copy;
  if (!pointer) return null;
  return copyRegistry[pointer] ?? null;
};

export const getJourneyPanoramaQuestions = (manifest: JourneyManifestV1 | null): PanoramaQuestionsBundle | null => {
  const pointer = manifest?.pointers?.questions;
  if (!pointer) return null;
  return questionsRegistry[pointer] ?? null;
};
