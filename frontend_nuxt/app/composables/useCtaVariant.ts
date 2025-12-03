type CtaVariant = 'A' | 'B';

const CTA_VARIANT_KEY = 'pp_cta_variant';

const pickVariant = (): CtaVariant => {
  if (typeof window === 'undefined' || !window?.sessionStorage) return 'A';
  const stored = window.sessionStorage.getItem(CTA_VARIANT_KEY);
  if (stored === 'A' || stored === 'B') return stored;
  const variant: CtaVariant = Math.random() < 0.5 ? 'A' : 'B';
  window.sessionStorage.setItem(CTA_VARIANT_KEY, variant);
  return variant;
};

export const useCtaVariant = () => {
  const variant = pickVariant();

  const getJourneyCtaLabel = (journeyLabel: string) => {
    if (variant === 'B') {
      return `Demander un regard extérieur sur « ${journeyLabel} »`;
    }
    return `Faire le point avec « ${journeyLabel} »`;
  };

  return {
    variant,
    getJourneyCtaLabel
  };
};
