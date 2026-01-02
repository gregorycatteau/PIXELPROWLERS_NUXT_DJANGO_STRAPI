import ACCESSIBILITY_PAGE_V1 from '../../../docs/60-legal/ACCESSIBILITY_PAGE_V1.md?raw';

export type AccessibilityStatus = 'draft' | 'active' | 'stable' | 'deprecated' | 'archived';

export type AccessibilityListItem = {
  label: string;
  value: string;
};

export type AccessibilityTable = {
  headers: string[];
  rows: AccessibilityListItem[][];
};

export type AccessibilitySection = {
  title: string;
  paragraphs: string[];
  items: AccessibilityListItem[];
  table?: AccessibilityTable;
};

export type AccessibilityData = {
  status: AccessibilityStatus;
  engagement: AccessibilitySection;
  etatConformite: AccessibilitySection;
  resultats: AccessibilitySection;
  contenusNonAccessibles: AccessibilitySection;
  environnements: AccessibilitySection;
  schema: AccessibilitySection;
  retourContact: AccessibilitySection;
  voiesRecours: AccessibilitySection;
  misesAJour: AccessibilitySection;
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

const isTableSeparator = (line: string): boolean => /\|?\s*---/.test(line);

// Parse un tableau Markdown simple (en-têtes + séparateur + lignes).
const parseTable = (lines: string[]): AccessibilityTable | undefined => {
  if (lines.length < 2) return undefined;
  const headerLine = lines[0] ?? '';
  const separatorLine = lines[1] ?? '';
  if (!headerLine.includes('|') || !isTableSeparator(separatorLine)) return undefined;

  const normalizeRow = (row: string): string[] =>
    row
      .split('|')
      .map((cell) => cell.trim())
      .filter((cell) => cell.length);

  const headers = normalizeRow(headerLine);
  const rows = lines
    .slice(2)
    .map((line) =>
      normalizeRow(line).map((value, index) => ({
        label: headers[index] ?? '',
        value
      }))
    )
    .filter((row) => row.length);

  return { headers, rows };
};

// Transforme une ligne "Label : Valeur" en objet structuré.
const parseListItem = (line: string): AccessibilityListItem => {
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

const extractSection = (sections: AccessibilitySection[], title: string): AccessibilitySection => {
  return (
    sections.find((section) => section.title === title) ?? {
      title,
      paragraphs: [],
      items: []
    }
  );
};

const parseSections = (raw: string): AccessibilitySection[] => {
  const body = splitBody(raw);
  const chunks = body.split('\n## ').filter(Boolean);
  const sections: AccessibilitySection[] = [];

  for (const chunk of chunks) {
    const [titleLine, ...rest] = chunk.split('\n');
    const title = (titleLine ?? '').replace(/^##\s*/, '').trim();
    if (!title) continue;

    const items: AccessibilityListItem[] = [];
    const paragraphLines: string[] = [];
    let tableLines: string[] = [];
    let tableCaptured = false;

    for (let index = 0; index < rest.length; index += 1) {
      const line = rest[index] ?? '';
      const trimmed = line.trim();
      const next = rest[index + 1]?.trim() ?? '';

      if (!trimmed) {
        paragraphLines.push('');
        continue;
      }

      if (!tableCaptured && trimmed.includes('|') && isTableSeparator(next)) {
        tableCaptured = true;
        tableLines = [trimmed, next];
        index += 1;
        continue;
      }

      if (tableCaptured && trimmed.includes('|')) {
        tableLines.push(trimmed);
        continue;
      }

      if (tableCaptured) {
        tableCaptured = false;
      }

      if (trimmed.startsWith('- ')) {
        items.push(parseListItem(trimmed));
      } else {
        paragraphLines.push(trimmed);
      }
    }

    const table = tableLines.length ? parseTable(tableLines) : undefined;

    sections.push({
      title,
      paragraphs: parseParagraphs(paragraphLines),
      items,
      table
    });
  }

  return sections;
};

// Expose une structure typée pour la page Accessibilité.
export const useAccessibility = (): AccessibilityData => {
  const frontmatter = parseFrontmatter(ACCESSIBILITY_PAGE_V1);
  const status = (frontmatter.status ?? 'draft') as AccessibilityStatus;
  const sections = parseSections(ACCESSIBILITY_PAGE_V1);

  return {
    status,
    engagement: extractSection(sections, "Engagement et champ d'application"),
    etatConformite: extractSection(sections, 'État de conformité'),
    resultats: extractSection(sections, 'Résultat des tests'),
    contenusNonAccessibles: extractSection(sections, 'Contenus non accessibles'),
    environnements: extractSection(sections, 'Environnements de test et pages auditées'),
    schema: extractSection(sections, "Schéma pluriannuel et plan d'action"),
    retourContact: extractSection(sections, "Retour d'information et contact"),
    voiesRecours: extractSection(sections, 'Voies de recours'),
    misesAJour: extractSection(sections, 'Date de la déclaration et mises à jour')
  };
};
