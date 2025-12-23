import { bilanAdapterIds, getBilanAdapter } from '../app/adapters/bilan/registry';
import { getManifestById } from '../app/config/journeys/manifests/registry';
import { useUniversalRecommendations } from '../app/composables/reco/useUniversalRecommendations';
import { assertNoRawAnswers } from '../app/utils/bilan/assertNoRawAnswers';

const MAX_REASON_LENGTH = 300;

const assertReasonLength = (reason: string) => {
  if (reason.length > MAX_REASON_LENGTH) {
    throw new Error('Recommendation reason exceeds max length.');
  }
};

async function main() {
  try {
    for (const journeyId of bilanAdapterIds) {
      const adapter = getBilanAdapter(journeyId);
      const manifest = getManifestById(journeyId);
      if (!adapter || !manifest) continue;
      const vm = adapter.buildViewModel();
      const recommendations = useUniversalRecommendations(vm, manifest);
      recommendations.recommended.forEach((item) => {
        if (item.reason) assertReasonLength(item.reason);
      });
      assertNoRawAnswers(vm, { recommendations });
    }
    console.log('Recommendations guard OK');
  } catch (error) {
    console.error('Recommendations guard failed.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

main();
