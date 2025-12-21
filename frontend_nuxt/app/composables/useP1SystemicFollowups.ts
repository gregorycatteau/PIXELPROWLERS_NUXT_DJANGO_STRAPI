import { computed, ref } from 'vue';
import { useDiagnosticStorage, type P1MetaStorage } from '@/composables/useDiagnosticStorage';
import {
  P1_SYSTEMIC_FOLLOWUPS,
  type P1SystemicFollowupStatus,
  type P1SystemicFollowupQuestion
} from '@/config/journeys/p1SystemicFollowupsV1_3';
import type { P1FollowupsMeta, P1SystemicCardId } from '@/types/p1Meta';

type FollowupPackRuntime = {
  cardId: string;
  questions: P1SystemicFollowupQuestion[];
};

export function useP1SystemicFollowups(cardIds: () => string[]) {
  const storage = useDiagnosticStorage({ journeyId: 'p1' });
  const answers = ref<Record<string, number | null | undefined>>({});
  const skippedCards = ref<Set<string>>(new Set());

  const persistedStatuses = computed<Record<string, P1SystemicFollowupStatus>>(() => {
    const raw = (storage.meta.value?.followups?.systemic ??
      {}) as Partial<Record<P1SystemicCardId, P1SystemicFollowupStatus>>;
    const map: Record<string, P1SystemicFollowupStatus> = {};
    (Object.entries(raw) as Array<[P1SystemicCardId, P1SystemicFollowupStatus | undefined]>).forEach(
      ([key, val]) => {
        if (val) {
          map[String(key)] = val;
        }
      }
    );
    return map;
  });

  const packs = computed<FollowupPackRuntime[]>(() => {
    const ids = cardIds();
    return P1_SYSTEMIC_FOLLOWUPS.filter((p) => ids.includes(p.cardId));
  });

  const setAnswer = (cardId: string, questionId: string, value: number | null) => {
    if (value === null) {
      answers.value[questionId] = null;
    } else {
      answers.value[questionId] = value;
    }
    const nextSkipped = new Set(skippedCards.value);
    nextSkipped.delete(cardId);
    skippedCards.value = nextSkipped;
  };

  const skipCard = (cardId: string) => {
    const nextSkipped = new Set(skippedCards.value);
    nextSkipped.add(cardId);
    skippedCards.value = nextSkipped;
    // Ne pas effacer les réponses existantes, mais considérer le statut comme skipped si aucune réponse.
  };

  const getCardStatus = (cardId: string): P1SystemicFollowupStatus => {
    const pack = packs.value.find((p) => p.cardId === cardId);
    if (!pack) return 'missing';
    const hasAnswer = pack.questions.some((q) => typeof answers.value[q.id] === 'number');
    if (hasAnswer) return 'answered';
    if (skippedCards.value.has(cardId)) return 'skipped';
    return 'missing';
  };

  const statuses = computed<Record<string, P1SystemicFollowupStatus>>(() => {
    const map: Record<string, P1SystemicFollowupStatus> = {};
    packs.value.forEach((p) => {
      map[p.cardId] = getCardStatus(p.cardId);
    });
    return map;
  });

  const resetCard = (cardId: string) => {
    packs.value
      .find((p) => p.cardId === cardId)
      ?.questions.forEach((q) => {
        delete answers.value[q.id];
      });
    const nextSkipped = new Set(skippedCards.value);
    nextSkipped.delete(cardId);
    skippedCards.value = nextSkipped;
  };

  const clearPersistedStatus = (cardId: string) => {
    const meta = (storage.meta.value ?? {}) as P1MetaStorage;
    const prevFollowups = meta.followups ?? {};
    const prevSystemic = { ...(prevFollowups.systemic ?? {}) };
    delete prevSystemic[cardId as P1SystemicCardId];
    const nextFollowups: P1FollowupsMeta = {
      ...prevFollowups,
      systemic: prevSystemic
    };
    const nextMeta: P1MetaStorage = {
      ...meta,
      followups: nextFollowups
    };
    storage.saveMeta(nextMeta);
  };

  const finalizeAndPersistStatuses = () => {
    const systemicStatuses = statuses.value;
    const meta = (storage.meta.value ?? {}) as P1MetaStorage;
    const prevFollowups = meta.followups ?? {};
    const prevSystemic = prevFollowups.systemic ?? {};
    const nextFollowups: P1FollowupsMeta = {
      ...prevFollowups,
      systemic: {
        ...prevSystemic,
        ...systemicStatuses
      }
    };
    const nextMeta: P1MetaStorage = {
      ...meta,
      followups: nextFollowups
    };
    storage.saveMeta(nextMeta);
  };

  const persistStatuses = () => finalizeAndPersistStatuses();

  return {
    packs,
    answers,
    statuses,
    persistedStatuses,
    setAnswer,
    skipCard,
    resetCard,
    clearPersistedStatus,
    finalizeAndPersistStatuses,
    persistStatuses
  };
}
