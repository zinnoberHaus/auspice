export const guideMetricEvents = ['view', 'open_sanctuary'] as const;
export type GuideMetricEvent = (typeof guideMetricEvents)[number];
export type GuideMetric = { guide: string; event: GuideMetricEvent };

export const guideMetricBodyLimit = 512;
export const guideMetricDailyLimit = 1_000_000;

export type GuidePrivacySignals = {
  doNotTrack?: string | null;
  globalPrivacyControl?: boolean;
};

export function guideMetricsOptedOut(signals: GuidePrivacySignals): boolean {
  return signals.globalPrivacyControl === true || signals.doNotTrack === '1' || signals.doNotTrack === 'yes';
}

export function guideMetricsEnabled(environment: Record<string, string | undefined>): boolean {
  if (environment.AUSPICE_GUIDE_METRICS === '0') return false;
  return environment.AUSPICE_GUIDE_METRICS === '1' || environment.VERCEL_ENV === 'production';
}

/** No arbitrary properties, URLs, identifiers, or content enter the counter. */
export function parseGuideMetric(value: unknown, allowedGuides: ReadonlySet<string>): GuideMetric | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length !== 2 || !keys.includes('guide') || !keys.includes('event')) return null;
  if (typeof record.guide !== 'string' || !allowedGuides.has(record.guide)) return null;
  if (record.event !== 'view' && record.event !== 'open_sanctuary') return null;
  return { guide: record.guide, event: record.event };
}
