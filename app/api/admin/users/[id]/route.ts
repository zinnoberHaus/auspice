import { auth } from '@/lib/auth/server';
import { requireAdmin, adminActionInput, banDurations } from '@/lib/admin';
import { json, sameOrigin } from '@/lib/http';
import { z } from 'zod';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!sameOrigin(request)) return json({ error: 'Invalid origin.' }, 403);
  const access = await requireAdmin();
  if (!access.user) return json({ error: access.error }, access.status);
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) return json({ error: 'User not found.' }, 404);
  if (id === access.user.id) return json({ error: 'Use your own account settings to manage your sessions. You cannot suspend yourself here.' }, 409);
  if (Number(request.headers.get('content-length')) > 4096) return json({ error: 'This request is too large.' }, 413);
  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 4096) return json({ error: 'This request is too large.' }, 413);
    body = JSON.parse(text);
  } catch { return json({ error: 'Check the account action and try again.' }, 400); }
  const input = adminActionInput.safeParse(body);
  if (!input.success) return json({ error: 'Confirm the action. Suspensions need a reason of 5–300 characters and a duration.' }, 400);
  try {
    const lookup = await auth.admin.listUsers({ query: { filterField: 'id', filterValue: id, filterOperator: 'eq', limit: 1 } });
    if (lookup.error || !lookup.data) return json({ error: 'The account could not be checked. Nothing was changed.' }, lookup.error?.status === 403 ? 403 : 502);
    const target = lookup.data.users.find((user) => user.id === id);
    if (!target) return json({ error: 'User not found.' }, 404);
    if (input.data.action === 'ban' && target.role?.split(',').map((role) => role.trim()).includes('admin')) return json({ error: 'Administrator suspension requires the account recovery process.' }, 409);
    const action = input.data;
    const result = action.action === 'ban'
      ? await auth.admin.banUser({ userId: id, banReason: action.reason, ...(action.duration === 'indefinite' ? {} : { banExpiresIn: banDurations[action.duration] }) })
      : action.action === 'unban'
        ? await auth.admin.unbanUser({ userId: id })
        : await auth.admin.revokeUserSessions({ userId: id });
    if (result.error || !result.data) return json({ error: 'The account action could not be completed. Refresh before retrying.' }, result.error?.status === 403 ? 403 : 502);
    if (action.action === 'revoke' && !('success' in result.data && result.data.success)) return json({ error: 'Session revocation was not confirmed. Refresh before retrying.' }, 502);
    console.info('admin_account_action', { actorId: access.user.id, targetId: id, action: action.action, at: new Date().toISOString() });
    return json({ success: true, action: action.action });
  } catch {
    return json({ error: 'The account action could not be confirmed. Refresh before retrying.' }, 502);
  }
}
