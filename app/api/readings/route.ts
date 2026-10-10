import { randomUUID } from 'node:crypto';
import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { json, sameOrigin } from '@/lib/http';
import { readingInput, interpret } from '@/lib/reading';
export const maxDuration = 60;

export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return json({ error: 'Sign in to open your journal.' }, 401);
  const rows = await db()`SELECT result, note FROM auspice_readings WHERE user_id=${session.user.id} AND status='completed' AND deleted_at IS NULL ORDER BY created_at DESC LIMIT 100`;
  return json({ readings: rows.map(r => ({ ...r.result, note: r.note })) });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Please send your reading from Auspice.' }, 403);
  const { data: session } = await auth.getSession();
  if (!session?.user) return json({ error: 'Create a free account to receive and save your personal reading.' }, 401);
  if (!session.user.emailVerified) return json({ error: 'Verify your email from your account page before starting a personal reading.' }, 403);
  if (Number(request.headers.get('content-length')) > 20000) return json({ error: 'This question is too long.' }, 413);
  let data: unknown;
  try { const body = await request.text(); if (body.length > 20000) return json({ error: 'This question is too long.' }, 413); data = JSON.parse(body); } catch { return json({ error: 'Please check your question and try again.' }, 400); }
  const parsed = readingInput.safeParse(data);
  if (!parsed.success) return json({ error: parsed.error.issues[0].message }, 400);
  const input = parsed.data;
  const sql = db();
  const requestId = input.requestId || randomUUID();
  const rows = await sql`SELECT auspice_reserve_reading(${session.user.id},${requestId}::uuid,${input.tradition}) AS reservation`;
  const reservation = rows[0].reservation;
  if (reservation.state === 'completed') return json({ reading: reservation.reading, saved: true });
  if (reservation.state === 'deleted') return json({ error: 'That reading was deleted. Start a new reading when you are ready.' }, 410);
  if (reservation.state === 'pending') return json({ error: 'Your reading is still being prepared. Check your journal in a moment.' }, 409);
  if (reservation.state === 'failed') return json({ error: 'That attempt did not complete. Please start a new reading.' }, 409);
  if (reservation.state === 'limit') return json({ error: 'You have used your 3 free readings this month. Your allowance renews on the first of next month (UTC). Your journal and daily card remain available.' }, 429);
  if (reservation.state === 'rate_limit') return json({ error: 'Please pause for an hour before trying another reading.' }, 429);
  try {
    const reading = await interpret(input, reservation.id);
    const updated = await sql`UPDATE auspice_readings SET status='completed',result=${JSON.stringify(reading)}::jsonb WHERE id=${reservation.id} AND user_id=${session.user.id} AND status='pending' RETURNING id`;
    if (!updated.length) return json({ error: 'Your reading expired. Please start a new one.' }, 409);
    return json({ reading, saved: true });
  } catch (error) {
    await sql`UPDATE auspice_readings SET status='failed' WHERE id=${reservation.id} AND user_id=${session.user.id}`;
    console.error('reading_generation_failed', { name: error instanceof Error ? error.name : 'unknown' });
    return json({ error: 'Your reading could not be completed. Your allowance has not been used. Please try again shortly.' }, 503);
  }
}
