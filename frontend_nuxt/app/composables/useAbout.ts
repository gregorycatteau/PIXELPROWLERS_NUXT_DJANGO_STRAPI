import ABOUT_PAGE_V1 from '../../../docs/60-legal/ABOUT_PAGE_V1.md?raw';

export type AboutStatus = 'draft' | 'active' | 'stable' | 'deprecated' | 'archived';

export type AboutListItem = {
  label: string;
  value: string;
};

export type AboutSection = {
  title: string;
  paragraphs: string[];
  items: AboutListItem[];
};

export type AboutData = {
  status: AboutStatus;
  quiNousSommes: AboutSection;
  valeurs: AboutSection;
  approche: AboutSection;
  histoire: AboutSection;
  pourquoiChoisir: AboutSection;
  nextSteps: AboutSection;
  noteAuthenticite: AboutSection;
};

// Extrait le frontmatter YAML pour connaître le statut du document.
const parseFrontmatter = (raw: string): Record<string, string> => {
  const parts = raw.split('---');
  if (parts.length < 3) return {};
  const frontmatter = parts[1] ?? '';
  const entries: Record<string, string> = {};

  for (const line of frontmatter.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...rest] = trimmed.split(':');
    if (!key || !rest.length) continue;
    entries[key.trim()] = rest.join(':').trim().replace(/"/g, '');
  }

  return entries;
};

// Coupe le corps du Markdown sans le frontmatter.
const splitBody = (raw: string): string => {
  const parts = raw.split('---');
  if (parts.length < 3) return raw;
  return parts.slice(2).join('---').trim();
};

// Transforme une ligne "Label : Valeur" en objet structuré.
const parseListItem = (line: string): AboutListItem => {
  const text = line.replace(/^-\s*/, '').trim();
  const match = text.match(/^(.+?)\s*:\s*(.+)$/);
  if (match) {
    const [, rawLabel, rawValue] = match;
    return {
      label: rawLabel?.trim() ?? '',
      value: rawValue?.trim() ?? ''
    };
  }
  return { label: text, value: '' };
};

// Regroupe les lignes en paragraphes simples.
const parseParagraphs = (lines: string[]): string[] => {
  const paragraphs: string[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (!buffer.length) return;
    const text = buffer.join(' ').trim();
    if (text) paragraphs.push(text);
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

const extractSection = (sections: AboutSection[], title: string): AboutSection => {
  return (
    sections.find((section) => section.title === title) ?? {
      title,
      paragraphs: [],
      items: []
    }
  );
};

const parseSections = (raw: string): AboutSection[] => {
  const body = splitBody(raw);
  const chunks = body.split('\n## ').filter(Boolean);
  const sections: AboutSection[] = [];

  for (const chunk of chunks) {
    const [titleLine, ...rest] = chunk.split('\n');
    const title = (titleLine ?? '').replace(/^##\s*/, '').trim();
    if (!title) continue;

    const items: AboutListItem[] = [];
    const paragraphLines: string[] = [];

    for (const line of rest) {
      const trimmed = line.trim();
      if (!trimmed) {
        paragraphLines.push('');
        continue;
      }

      if (trimmed.startsWith('- ')) {
        items.push(parseListItem(trimmed));
      } else {
        paragraphLines.push(trimmed);
      }
    }

    sections.push({
      title,
      paragraphs: parseParagraphs(paragraphLines),
      items
    });
  }

  return sections;
};

// Expose une structure typée pour la page À propos.
export const useAbout = (): AboutData => {
  const frontmatter = parseFrontmatter(ABOUT_PAGE_V1);
  const status = (frontmatter.status ?? 'draft') as AboutStatus;
  const sections = parseSections(ABOUT_PAGE_V1);

  return {
    status,
    quiNousSommes: extractSection(sections, 'Qui nous sommes / Mission'),
    valeurs: extractSection(sections, 'Nos valeurs et engagements'),
    approche: extractSection(sections, 'Notre approche'),
    histoire: extractSection(sections, 'Notre histoire et notre vision'),
    pourquoiChoisir: extractSection(sections, 'Pourquoi choisir PixelProwlers'),
    nextSteps: extractSection(sections, "Rejoindre l'aventure / Prochaines étapes"),
    noteAuthenticite: extractSection(sections, 'Authenticité et preuves')
  };
};
