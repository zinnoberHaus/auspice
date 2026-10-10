import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { json } from '@/lib/http';
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return json({ user: null });
  const sql = db();
  const usage = await sql`SELECT count(*)::int AS used FROM auspice_readings WHERE user_id=${session.user.id} AND status IN ('completed','pending') AND created_at >= date_trunc('month',now() AT TIME ZONE 'UTC') AT TIME ZONE 'UTC'`;
  return json({ user: { id: session.user.id, name: session.user.name, email: session.user.email, emailVerified: session.user.emailVerified }, usage: { used: usage[0].used, limit: 3, period: 'calendar month, UTC' }, plan: 'free' });
}
