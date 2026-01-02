import LEGAL_MENTIONS_V1 from '../../../docs/60-legal/LEGAL_MENTIONS_V1.md?raw';

export type LegalMentionsStatus = 'draft' | 'active' | 'stable' | 'deprecated' | 'archived';

type LegalMentionsParagraph = {
  text: string;
  textBefore?: string;
  textAfter?: string;
  linkText?: string;
  linkTo?: string;
};

type LegalMentionsSection = {
  title: string;
  paragraphs: LegalMentionsParagraph[];
  bullets: string[];
};

type LegalMentionsData = {
  status: LegalMentionsStatus;
  sections: LegalMentionsSection[];
};

const parseFrontmatter = (raw: string): Record<string, string> => {
  const parts = raw.split('---');
  if (parts.length < 3) return {};
  const frontmatter = parts[1] ?? '';
  const lines = frontmatter.split('\n');
  const entries: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split(':');
    if (!key || !rest.length) continue;
    entries[key.trim()] = rest.join(':').trim().replace(/"/g, '');
  }

  return entries;
};

const splitBody = (raw: string): string => {
  const parts = raw.split('---');
  if (parts.length < 3) return raw;
  return parts.slice(2).join('---').trim();
};

const parseParagraphs = (lines: string[]): LegalMentionsParagraph[] => {
  const paragraphs: LegalMentionsParagraph[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (!buffer.length) return;
    const text = buffer.join(' ').trim();
    if (!text) {
      buffer = [];
      return;
    }

    const linkMatch = text.match(/\[(.+?)\]\((.+?)\)/);
    if (linkMatch) {
      const [full, linkText] = linkMatch;
      const [before, after] = text.split(full);
      paragraphs.push({
        text: text.replace(full, '').trim(),
        textBefore: before ?? '',
        textAfter: after ?? '',
        linkText,
        linkTo: '/politique-confidentialite'
      });
    } else {
      paragraphs.push({ text });
    }

    buffer = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flush();
      continue;
    }
    buffer.push(trimmed);
  }

  flush();
  return paragraphs;
};

const parseSections = (raw: string): LegalMentionsSection[] => {
  const body = splitBody(raw);
  const chunks = body.split('\n## ').filter(Boolean);
  const sections: LegalMentionsSection[] = [];

  for (const chunk of chunks) {
    const [titleLine, ...rest] = chunk.split('\n');
    const title = (titleLine ?? '').replace(/^##\s*/, '').trim();
    if (!title) continue;

    const bullets: string[] = [];
    const paragraphLines: string[] = [];

    for (const line of rest) {
      const trimmed = line.trim();
      if (!trimmed) {
        paragraphLines.push('');
        continue;
      }
      if (trimmed.startsWith('- ')) {
        bullets.push(trimmed.replace(/^-\s*/, ''));
      } else {
        paragraphLines.push(trimmed);
      }
    }

    sections.push({
      title,
      paragraphs: parseParagraphs(paragraphLines),
      bullets
    });
  }

  return sections;
};

// Lit le document SSOT des mentions legales et expose un modele structure.
export const useLegalMentions = (): LegalMentionsData => {
  const frontmatter = parseFrontmatter(LEGAL_MENTIONS_V1);
  const status = (frontmatter.status ?? 'draft') as LegalMentionsStatus;

  return {
    status,
    sections: parseSections(LEGAL_MENTIONS_V1)
  };
};
