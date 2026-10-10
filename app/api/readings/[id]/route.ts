import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { json, sameOrigin } from '@/lib/http';
import { z } from 'zod';
type Context = { params: Promise<{ id: string }> };
export async function DELETE(request: Request, context: Context) {
  if (!sameOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  const { data: session } = await auth.getSession();
  if (!session?.user) return json({ error: 'Sign in to manage your journal.' }, 401);
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return json({ error: 'Reading not found.' }, 404);
  // Erase private content while retaining the minimal usage record until period end.
  const rows = await db()`UPDATE auspice_readings SET result=NULL,note='',deleted_at=now() WHERE id=${id}::uuid AND user_id=${session.user.id} AND deleted_at IS NULL RETURNING id`;
  return rows.length ? json({ deleted: true }) : json({ error: 'Reading not found.' }, 404);
}
export async function PATCH(request: Request, context: Context) {
  if (!sameOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  const { data: session } = await auth.getSession();
  if (!session?.user) return json({ error: 'Sign in to manage your journal.' }, 401);
  const { id } = await context.params;
  const input = z.object({ note: z.string().max(5000) }).safeParse(await request.json().catch(() => null));
  if (!input.success || !z.uuid().safeParse(id).success) return json({ error: 'Check your note (maximum 5,000 characters).' }, 400);
  const rows = await db()`UPDATE auspice_readings SET note=${input.data.note} WHERE id=${id}::uuid AND user_id=${session.user.id} AND deleted_at IS NULL AND status='completed' RETURNING id`;
  return rows.length ? json({ saved: true }) : json({ error: 'Reading not found.' }, 404);
}
