export type AnalyticsEventName =
  | 'journey_selected'
  | 'journey_cta_clicked'
  | 'contact_submit_success'
  | 'contact_submit_error'
  | 'q1_start'
  | 'q1_complete'
  | 'q2_start'
  | 'q2_complete'
  | 'resource_click'
  | 'relinium_optin_click'
  | 'fit_start'
  | 'fit_outcome';

export type AnalyticsEventPayload = Record<string, string | number | boolean | null | undefined>;

const debugStoreKey = '__PP_EVENTS__';

const isEnabled = () => {
  try {
    const config = useRuntimeConfig?.();
    if (config?.public?.analyticsEnabled === false) return false;
    return true;
  } catch {
    return true;
  }
};

const pushDebugEvent = (name: AnalyticsEventName, payload?: AnalyticsEventPayload) => {
  if (typeof window === 'undefined') return;
  const store = (window as any)[debugStoreKey] ?? [];
  store.push({ name, payload, timestamp: Date.now() });
  (window as any)[debugStoreKey] = store;
};

const trackEvent = (name: AnalyticsEventName, payload?: AnalyticsEventPayload) => {
  if (!isEnabled()) return;
  try {
    if (typeof console !== 'undefined' && console?.debug) {
      console.debug('[analytics]', name, payload ?? {});
    }
    pushDebugEvent(name, payload);
  } catch {
    // fail-safe : ne pas casser l’app si la console ou le store sont indisponibles
  }
};

export function useAnalytics() {
  return { trackEvent };
}
