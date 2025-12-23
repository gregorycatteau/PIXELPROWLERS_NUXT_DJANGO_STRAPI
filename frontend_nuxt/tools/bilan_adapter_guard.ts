import { bilanAdapterIds, getBilanAdapter } from '../app/adapters/bilan/registry';
import { assertNoRawAnswers } from '../app/utils/bilan/assertNoRawAnswers';
import { getManifestById } from '../app/config/journeys/manifests/registry';
import { useUniversalRecommendations } from '../app/composables/reco/useUniversalRecommendations';
import { buildUniversalBilanMarkdown } from '../app/utils/export/buildUniversalBilanMarkdown';

async function main() {
  try {
    for (const journeyId of bilanAdapterIds) {
      const adapter = getBilanAdapter(journeyId);
      if (!adapter) continue;
      const vm = adapter.buildViewModel();
      const manifest = getManifestById(journeyId);
      const recommendations = manifest ? useUniversalRecommendations(vm, manifest) : null;
      const exportMarkdown = buildUniversalBilanMarkdown({ manifest, vm, recommendations });
      assertNoRawAnswers(vm, { recommendations, exportMarkdown });
    }
    console.log('Bilan adapter guard OK');
  } catch (error) {
    console.error('Bilan adapter guard failed.');
    if (error instanceof Error) {
      console.error(error.message);
    }
    process.exit(1);
  }
}

main();
