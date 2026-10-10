'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { sendGuideMetric } from '@/lib/guide-metrics-client';

/** Mounted only in a public guide, with its slug supplied by the server. */
export default function GuideMetrics({ guide, href, enabled }: {
  guide: string;
  href: string;
  enabled: boolean;
}) {
  const viewedGuide = useRef<string | null>(null);
  useEffect(() => {
    if (!enabled || viewedGuide.current === guide) return;
    viewedGuide.current = guide;
    sendGuideMetric({ guide, event: 'view' });
  }, [guide, enabled]);

  return <Link className="button" href={href} onClick={() => {
    if (enabled) sendGuideMetric({ guide, event: 'open_sanctuary' });
  }}>Open the almanac <span aria-hidden="true">↗</span></Link>;
}
