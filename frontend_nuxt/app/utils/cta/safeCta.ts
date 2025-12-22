import { validateRoutePath } from '@/config/engagement/allowlist';
import { validateFilePath } from '@/config/resources/allowlist';

// Modele de menace:
// - dev presse qui concatene une route ou un filePath sans validation
// - contenu data-only hostile qui tente d injecter un schema ou une exfiltration
// - navigation ou ouverture hors allowlist
// Ce helper force un passage par validateRoutePath / validateFilePath.

export const safeRoutePath = (routePath: string): string => {
  validateRoutePath(routePath);
  return routePath;
};

export const safeFilePath = (filePath: string): string => {
  validateFilePath(filePath);
  return filePath;
};
