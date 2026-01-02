import PRIVACY_POLICY_PAGE_V1 from '../../../docs/60-legal/PRIVACY_POLICY_PAGE_V1.md?raw';

export type PrivacyPolicyStatus = 'draft' | 'active' | 'stable' | 'deprecated' | 'archived';

export type PrivacyPolicyListItem = {
  text: string;
  label?: string;
  value?: string;
  linkText?: string;
  linkTo?: string;
};

export type PrivacyPolicyTable = {
  headers: string[];
  rows: string[][];
};

export type PrivacyPolicySection = {
  title: string;
  paragraphs: string[];
  listItems: PrivacyPolicyListItem[];
  table?: PrivacyPolicyTable;
};

export type PrivacyPolicyData = {
  status: PrivacyPolicyStatus;
  identite: PrivacyPolicySection;
  finalites: PrivacyPolicySection;
  donnees: PrivacyPolicySection;
  destinataires: PrivacyPolicySection;
  durees: PrivacyPolicySection;
  droits: PrivacyPolicySection;
  cookies: PrivacyPolicySection;
  securite: PrivacyPolicySection;
  misesAJour: PrivacyPolicySection;
  dpo: PrivacyPolicySection;
  contact: PrivacyPolicySection;
};

// Extrait le frontmatter YAML pour récupérer le statut du document.
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
const parseTable = (lines: string[]): PrivacyPolicyTable | undefined => {
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
  const rows = lines.slice(2).map(normalizeRow).filter((row) => row.length);

  return { headers, rows };
};

// Transforme une liste "Label : Valeur" en objet structuré.
const parseListItem = (line: string): PrivacyPolicyListItem => {
  const text = line.replace(/^-\s*/, '').trim();
  const match = text.match(/^(.+?)\s*:\s*(.+)$/);
  if (match) {
    const [, rawLabel, rawValue] = match;
    const value = rawValue?.trim() ?? '';
    if (value === 'https://www.cnil.fr') {
      return {
        text,
        label: rawLabel?.trim(),
        value,
        linkText: 'https://www.cnil.fr',
        linkTo: 'https://www.cnil.fr'
      };
    }
    return {
      text,
      label: rawLabel?.trim(),
      value
    };
  }
  return { text };
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

const extractSection = (sections: PrivacyPolicySection[], title: string): PrivacyPolicySection => {
  return (
    sections.find((section) => section.title === title) ?? {
      title,
      paragraphs: [],
      listItems: []
    }
  );
};

const parseSections = (raw: string): PrivacyPolicySection[] => {
  const body = splitBody(raw);
  const chunks = body.split('\n## ').filter(Boolean);
  const sections: PrivacyPolicySection[] = [];

  for (const chunk of chunks) {
    const [titleLine, ...rest] = chunk.split('\n');
    const title = (titleLine ?? '').replace(/^##\s*/, '').trim();
    if (!title) continue;

    const listItems: PrivacyPolicyListItem[] = [];
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
        listItems.push(parseListItem(trimmed));
      } else {
        paragraphLines.push(trimmed);
      }
    }

    const table = tableLines.length ? parseTable(tableLines) : undefined;

    sections.push({
      title,
      paragraphs: parseParagraphs(paragraphLines),
      listItems,
      table
    });
  }

  return sections;
};

// Expose une structure typée par section pour la page Politique de confidentialité.
export const usePrivacyPolicy = (): PrivacyPolicyData => {
  const frontmatter = parseFrontmatter(PRIVACY_POLICY_PAGE_V1);
  const status = (frontmatter.status ?? 'draft') as PrivacyPolicyStatus;
  const sections = parseSections(PRIVACY_POLICY_PAGE_V1);

  return {
    status,
    identite: extractSection(sections, 'Identité du responsable'),
    finalites: extractSection(sections, 'Finalités et bases légales'),
    donnees: extractSection(sections, 'Données collectées'),
    destinataires: extractSection(sections, 'Destinataires et sous-traitants'),
    durees: extractSection(sections, 'Durées de conservation'),
    droits: extractSection(sections, 'Droits des personnes'),
    cookies: extractSection(sections, 'Cookies et traceurs'),
    securite: extractSection(sections, 'Sécurité et anonymisation'),
    misesAJour: extractSection(sections, 'Mises à jour'),
    dpo: extractSection(sections, 'Délégué à la protection des données (DPO)'),
    contact: extractSection(sections, 'Contact')
  };
};
