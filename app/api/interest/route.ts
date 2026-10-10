import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { json, sameOrigin } from '@/lib/http';
export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  const { data: session } = await auth.getSession();
  if (!session?.user) return json({ error: 'Sign in to save your interest.' }, 401);
  const body = await request.json().catch(() => null);
  if (!['monthly','annual'].includes(body?.plan)) return json({ error: 'Choose a plan.' }, 400);
  await db()`INSERT INTO auspice_interest(user_id,plan) VALUES(${session.user.id},${body.plan}) ON CONFLICT(user_id) DO UPDATE SET plan=EXCLUDED.plan`;
  return json({ saved: true });
}
