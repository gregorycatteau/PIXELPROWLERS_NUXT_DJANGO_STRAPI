const parseDisabledJourneyIds = (value: string) =>
  new Set(value.split(',').map((token) => token.trim().toLowerCase()).filter(Boolean));

export const isJourneyIdDisabled = (journeyId: string, disabledConfig: string) => {
  if (!journeyId) return false;
  const normalized = journeyId.trim().toLowerCase();
  if (!normalized) return false;
  const disabledSet = parseDisabledJourneyIds(disabledConfig);
  return disabledSet.has(normalized);
};

export const getDisabledJourneyIds = (disabledConfig: string) => parseDisabledJourneyIds(disabledConfig);
