import { db } from './db';
import { guides } from './guides';
import { sameOrigin } from './http';
import {
  guideMetricBodyLimit,
  guideMetricDailyLimit,
  guideMetricsEnabled,
  guideMetricsOptedOut,
  parseGuideMetric,
  type GuideMetric,
} from './guide-metrics';

const publishedGuides = new Set(guides.map(({ slug }) => slug));

export async function incrementGuideMetric(metric: GuideMetric): Promise<void> {
  await db()`INSERT INTO auspice_guide_metrics(day, guide, event, count)
    VALUES ((now() AT TIME ZONE 'UTC')::date, ${metric.guide}, ${metric.event}, 1)
    ON CONFLICT (day, guide, event) DO UPDATE
      SET count = LEAST(auspice_guide_metrics.count + 1, ${guideMetricDailyLimit})
      WHERE auspice_guide_metrics.count < ${guideMetricDailyLimit}`;
}

function response(status: number): Response {
  return new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });
}

class BodyTooLarge extends Error {}

/** Bound bytes while streaming, including when Content-Length is absent. */
async function readBody(request: Request): Promise<string> {
  if (!request.body) return '';
  const reader = request.body.getReader();
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let size = 0;
  let text = '';
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > guideMetricBodyLimit) {
        void reader.cancel().catch(() => {});
        throw new BodyTooLarge();
      }
      text += decoder.decode(chunk.value, { stream: true });
    }
    return text + decoder.decode();
  } finally {
    reader.releaseLock();
  }
}

type Dependencies = {
  enabled?: () => boolean;
  allowedGuides?: ReadonlySet<string>;
  increment?: (metric: GuideMetric) => Promise<void>;
};

/** Dependencies let tests exercise the same pipeline without live database access. */
export function createGuideMetricsHandler(dependencies: Dependencies = {}) {
  const enabled = dependencies.enabled ?? (() => guideMetricsEnabled(process.env));
  const allowedGuides = dependencies.allowedGuides ?? publishedGuides;
  const increment = dependencies.increment ?? incrementGuideMetric;
  return async function POST(request: Request): Promise<Response> {
    if (!sameOrigin(request)) return response(403);
    if (new URL(request.url).search) return response(400);
    if (!enabled() || guideMetricsOptedOut({
      doNotTrack: request.headers.get('dnt'),
      globalPrivacyControl: request.headers.get('sec-gpc') === '1',
    })) return response(204);
    if (request.headers.get('content-type')?.split(';', 1)[0].trim().toLowerCase() !== 'application/json') return response(415);
    const declaredLength = request.headers.get('content-length');
    if (declaredLength !== null && (!/^\d+$/.test(declaredLength) || Number(declaredLength) > guideMetricBodyLimit)) return response(413);

    let value: unknown;
    try {
      value = JSON.parse(await readBody(request));
    } catch (error) {
      return response(error instanceof BodyTooLarge ? 413 : 400);
    }
    const metric = parseGuideMetric(value, allowedGuides);
    if (!metric) return response(400);
    try {
      await increment(metric);
      return response(204);
    } catch {
      // No payload, headers, query strings, or credentials are logged here.
      return response(503);
    }
  };
}
