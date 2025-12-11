import { useDiagnosticStorage } from '~/composables/useDiagnosticStorage';
import { P1_BLOCK_IDS, p1AxesMeta, p1BlockContent, p1Copy } from '~/config/journeys/p1QuestionsConfig';

export function useP1Export() {
  const storage = useDiagnosticStorage({ journeyId: 'p1' });

  const buildExportText = () => {
    const scores = storage.scores.value ?? {};
    const meta = storage.meta.value ?? {};
    const hasBlocks = scores.blocks && Object.keys(scores.blocks).length;
    const globalFallback = scores.global ?? (scores.panorama || hasBlocks ? { panorama: scores.panorama, blocks: scores.blocks ?? {} } : null);
    const lines: string[] = [];

    lines.push(p1Copy.export.title);
    lines.push('');

    lines.push(p1Copy.export.panoramaHeading);
    if (scores.panorama) {
      const axisLine = (Object.keys(p1AxesMeta) as (keyof typeof p1AxesMeta)[])
        .map((axisId) => `${p1AxesMeta[axisId].shortLabel}: ${scores.panorama?.[axisId] ?? 0}`)
        .join(' | ');
      lines.push(axisLine);
      lines.push(
        `Répondu: ${scores.panorama.answeredCount ?? 0} · Non répondu: ${scores.panorama.skippedCount ?? 0}`
      );
    } else {
      lines.push('Aucun panorama enregistré.');
    }
    lines.push('');

    lines.push(p1Copy.export.blocksHeading);
    if (scores.blocks && Object.keys(scores.blocks).length) {
      P1_BLOCK_IDS.forEach((blockId) => {
        const block = scores.blocks?.[blockId];
        if (!block) return;
        lines.push(`${p1BlockContent[blockId]?.title ?? `Bloc ${blockId.toUpperCase()}`}:`);
        lines.push(`  Répondu ${block.answeredCount} · Non répondu ${block.skippedCount} · Non vu ${block.unseenCount}`);
        Object.entries(block.themes ?? {}).forEach(([theme, data]) => {
          lines.push(`  ${theme}: ${data.average} (${data.count} items)`);
        });
      });
    } else {
      lines.push('Aucun bloc encore enregistré.');
    }
    lines.push('');

    lines.push(p1Copy.export.globalHeading);
    if (globalFallback) {
      lines.push(JSON.stringify(globalFallback, null, 2));
    } else {
      lines.push('Bilan global non calculé pour l’instant.');
    }
    lines.push('');

    lines.push(p1Copy.export.metaHeading);
    lines.push(`Dernière complétion: ${meta.lastCompletedAt ?? 'N/A'}`);
    lines.push(`Blocs complétés: ${(meta.completedBlocks ?? []).join(', ') || 'aucun'}`);
    lines.push(`Schéma: ${meta.schemaVersion ?? 'N/A'}`);
    lines.push('');
    lines.push(p1Copy.export.closingLine);

    return lines.join('\n');
  };

  return { buildExportText };
}
