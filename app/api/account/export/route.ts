import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { json } from '@/lib/http';
export async function GET() {
  const { data: session } = await auth.getSession();
  if (!session?.user) return json({ error: 'Sign in to export your data.' }, 401);
  const sql = db();
  const readings = await sql`SELECT result,note,created_at FROM auspice_readings WHERE user_id=${session.user.id} AND deleted_at IS NULL AND status='completed' ORDER BY created_at`;
  return new Response(JSON.stringify({ exportedAt: new Date().toISOString(), user: { name: session.user.name, email: session.user.email }, readings }, null, 2), { headers: { 'Content-Type': 'application/json', 'Content-Disposition': 'attachment; filename="auspice-journal.json"', 'Cache-Control': 'private, no-store' } });
}
