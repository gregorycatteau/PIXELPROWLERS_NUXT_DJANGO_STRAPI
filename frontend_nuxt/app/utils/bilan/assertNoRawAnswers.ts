import type { GlobalBilanViewModel } from '@/types/bilan';

const suspiciousKeys = ['answers', 'responses', 'questionId', 'p1_q', 'raw', 'journeyAnswers'];

export function assertNoRawAnswers(vm: GlobalBilanViewModel) {
  if (!import.meta.dev) return;
  const json = JSON.stringify(vm);
  if (suspiciousKeys.some((key) => json.includes(key))) {
    throw new Error('Invalid bilan VM shape.');
  }
}
