import { auth } from '@/lib/auth/server';
import { db } from '@/lib/db';
import { z } from 'zod';

type Access = { user: { id: string; name: string }; status?: never; error?: never }
  | { user?: never; status: number; error: string };

/** Fresh provider session AND current database role; no client-supplied authority. */
export async function requireAdmin(): Promise<Access> {
  try {
    // SDK 0.5.0-beta's server implementation checks the string "true", although
    // inherited Better Auth types declare a boolean. Keep the runtime bypass
    // explicit until the SDK fixes that mismatch; tests assert the actual value.
    const { data: session, error } = await auth.getSession({ query: { disableCookieCache: 'true' as unknown as boolean } });
    if (error) return { status: 503, error: 'Account verification is unavailable. Please try again.' };
    if (!session?.user || !z.uuid().safeParse(session.user.id).success) return { status: 401, error: 'Sign in to continue.' };
    const rows = await db()`SELECT id::text AS id,name,role,banned,"emailVerified" FROM neon_auth."user" WHERE id=${session.user.id}::uuid LIMIT 1`;
    const user = rows[0];
    const roles = typeof user?.role === 'string' ? user.role.split(',').map((role: string) => role.trim()) : [];
    if (!user || user.banned || !user.emailVerified || !roles.includes('admin')) return { status: 403, error: 'A verified administrator account is required.' };
    return { user: { id: user.id, name: user.name } };
  } catch {
    return { status: 503, error: 'Account verification is unavailable. Please try again.' };
  }
}

export const adminListInput = z.object({
  page: z.coerce.number().int().min(0).max(10000).default(0),
  search: z.string().trim().max(120).default(''),
  field: z.enum(['email', 'name']).default('email'),
});

export const adminActionInput = z.discriminatedUnion('action', [
  z.object({ action: z.literal('ban'), confirmed: z.literal(true), reason: z.string().trim().min(5).max(300), duration: z.enum(['day', 'week', 'month', 'indefinite']) }).strict(),
  z.object({ action: z.literal('unban'), confirmed: z.literal(true) }).strict(),
  z.object({ action: z.literal('revoke'), confirmed: z.literal(true) }).strict(),
]);

export const adminPageSize = 20;
export const banDurations = { day: 86400, week: 604800, month: 2592000 } as const;

export function publicAdminUser(user: {
  id: string; name: string; email: string; emailVerified: boolean; createdAt: Date | string;
  role?: string | null; banned?: boolean | null; banExpires?: Date | string | null;
}) {
  // Explicit projection: never expose tokens, sessions, metadata, or journal data.
  return { id: user.id, name: user.name, email: user.email, emailVerified: user.emailVerified,
    role: user.role || 'user', banned: Boolean(user.banned), banExpires: user.banExpires || null, createdAt: user.createdAt };
}
