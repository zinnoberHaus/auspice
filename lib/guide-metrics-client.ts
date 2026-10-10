import { guideMetricsOptedOut, type GuideMetric, type GuidePrivacySignals } from './guide-metrics';

function browserPrivacy(): GuidePrivacySignals {
  if (typeof navigator === 'undefined') return {};
  const signals = navigator as Navigator & GuidePrivacySignals;
  return { doNotTrack: signals.doNotTrack, globalPrivacyControl: signals.globalPrivacyControl };
}

/** Best effort only: never await this before following the guide's normal link. */
export function sendGuideMetric(
  metric: GuideMetric,
  privacy: GuidePrivacySignals = browserPrivacy(),
  send: typeof fetch = globalThis.fetch,
): void {
  if (guideMetricsOptedOut(privacy)) return;
  try {
    void send('/api/guide-metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guide: metric.guide, event: metric.event }),
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      // CORS mode preserves Origin with no-referrer; a fixed local URL and
      // redirect:error prevent forwarding this request to another origin.
      mode: 'cors',
      redirect: 'error',
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Unsupported fetch or a blocked collector must not affect reading a guide.
  }
}
