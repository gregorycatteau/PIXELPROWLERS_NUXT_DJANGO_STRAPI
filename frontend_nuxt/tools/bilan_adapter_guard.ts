import { bilanAdapters } from '../app/adapters/bilan/registry';
import { assertNoRawAnswers } from '../app/utils/bilan/assertNoRawAnswers';

async function main() {
  try {
    for (const adapter of bilanAdapters) {
      const vm = adapter.buildViewModel();
      assertNoRawAnswers(vm);
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
