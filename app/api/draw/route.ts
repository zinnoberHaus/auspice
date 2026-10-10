import { drawTarot, drawTarotCards } from '@/lib/traditions';
export const dynamic = 'force-dynamic';
export function GET(request: Request) {
  const spread = new URL(request.url).searchParams.get('spread');
  const headers = { 'Cache-Control': 'no-store' };
  if (!spread) return Response.json(drawTarot(), { headers });
  const counts: Record<string, number> = { one: 1, three: 3, cross: 10 };
  if (!Object.hasOwn(counts, spread)) return Response.json({ error: 'Choose a one-card, three-card or Celtic Cross spread.' }, { status: 400, headers });
  return Response.json({ cards: drawTarotCards(counts[spread]) }, { headers });
}
