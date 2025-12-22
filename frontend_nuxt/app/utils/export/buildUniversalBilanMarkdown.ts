import type { JourneyManifestV1 } from '~/config/journeys/manifests/types';
import type { GlobalBilanViewModel } from '~/types/bilan';
import type { RecommendationResult } from '~/utils/reco/types';
import { isAllowlistedResourcePath } from '~/config/resources/allowlist';
import { isAllowlistedEngagementRoute } from '~/config/engagement/allowlist';

export type UniversalMarkdownOptions = {
  manifest: JourneyManifestV1 | null;
  vm: GlobalBilanViewModel | null;
  recommendations?: RecommendationResult | null;
  timestamp?: Date;
};

const formatLine = (label: string, value: string | number) => `- ${label}: ${value}`;

const formatFilePath = (filePath?: string) => {
  if (!filePath) return '';
  return isAllowlistedResourcePath(filePath) ? filePath : '';
};

const formatRoutePath = (routePath?: string) => {
  if (!routePath) return '';
  return isAllowlistedEngagementRoute(routePath) ? routePath : '';
};

const formatList = (items: string[]) => (items.length ? items.join('\n') : '- Aucun');

export const buildUniversalBilanMarkdown = (options: UniversalMarkdownOptions): string => {
  const { manifest, vm, recommendations } = options;
  if (!manifest || !vm) {
    return '# Bilan PixelProwlers\n\n## Meta\n- Statut: donnees indisponibles';
  }

  const lines: string[] = [];
  const timestamp = options.timestamp ?? new Date();
  const timestampLabel = timestamp.toLocaleString('fr-FR', { hour12: false });

  lines.push('# Bilan PixelProwlers');
  lines.push('');
  lines.push('## Meta');
  lines.push(formatLine('Journey', `${manifest.id} (${manifest.slug})`));
  lines.push(formatLine('Maturity', manifest.maturity));
  lines.push(formatLine('GeneratedAt', timestampLabel));
  lines.push('');

  lines.push('## Panorama');
  lines.push(formatLine('Answered', vm.panorama?.answeredCount ?? 0));
  lines.push(formatLine('Skipped', vm.panorama?.skippedCount ?? 0));
  lines.push(formatLine('Completeness', vm.panorama?.completenessLabel ?? ''));
  const axisLines = (vm.panorama?.axes ?? []).map((axis) => `- ${axis.label}: ${axis.score}`);
  lines.push(formatList(axisLines));
  lines.push('');

  lines.push('## Blocs');
  const blockLines = (vm.panorama?.blocks ?? []).map((block) =>
    `- ${block.title} (answered: ${block.answeredCount}, skipped: ${block.skippedCount}, completion: ${block.completion}%)`
  );
  lines.push(formatList(blockLines));
  lines.push('');

  lines.push('## Skip signal');
  if (vm.modules?.skipSignal) {
    lines.push(formatLine('GlobalSkipped', vm.modules.skipSignal.globalSkippedCount));
    const skipAxisLines = (vm.modules.skipSignal.byAxis ?? []).map(
      (axis) => `- ${axis.axisId}: ${axis.skippedCount}/${axis.totalCount}`
    );
    lines.push(formatList(skipAxisLines));
  } else {
    lines.push('- Aucun');
  }
  lines.push('');

  if (vm.modules?.engagement?.levels?.length) {
    lines.push('## Options de suite (N1-N4)');
    if (vm.modules.engagement.intro) {
      lines.push(vm.modules.engagement.intro);
    }
    vm.modules.engagement.levels.forEach((level) => {
      const routePath = formatRoutePath(level.routePath);
      const target = [level.ctaTarget, routePath].filter(Boolean).join(' | ');
      lines.push(`- ${level.title}: ${level.body}`);
      lines.push(`  - CTA: ${level.ctaLabel} (${target})`);
    });
    lines.push('');
  }

  const recommended = recommendations?.recommended ?? [];
  lines.push('## Recommandations');
  if (!recommended.length) {
    lines.push('- Aucune');
  } else {
    recommended.forEach((item) => {
      const filePath = formatFilePath(item.filePath);
      const metaParts = [item.kind, item.horizon, item.format, filePath].filter(Boolean).join(' | ');
      lines.push(`- ${item.title} (${metaParts})`);
      if (item.reason) {
        lines.push(`  - Raison: ${item.reason}`);
      }
    });
  }
  lines.push('');

  const library = recommendations?.library ?? [];
  lines.push('## Bibliotheque');
  if (!library.length) {
    lines.push('- Aucune');
  } else {
    const MAX_LIBRARY = 30;
    library.slice(0, MAX_LIBRARY).forEach((item) => {
      const filePath = formatFilePath(item.filePath);
      const metaParts = [item.kind, item.horizon, item.format, filePath].filter(Boolean).join(' | ');
      lines.push(`- ${item.title} (${metaParts})`);
    });
    if (library.length > MAX_LIBRARY) {
      lines.push(`- ... (${library.length - MAX_LIBRARY} autres)`);
    }
  }

  return lines.join('\n');
};
