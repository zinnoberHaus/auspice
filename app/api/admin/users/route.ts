import { auth } from '@/lib/auth/server';
import { requireAdmin, adminListInput, adminPageSize, publicAdminUser } from '@/lib/admin';
import { json } from '@/lib/http';

export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  const access = await requireAdmin();
  if (!access.user) return json({ error: access.error }, access.status);
  const params = new URL(request.url).searchParams;
  const input = adminListInput.safeParse({ page: params.get('page') ?? undefined, search: params.get('search') ?? undefined, field: params.get('field') ?? undefined });
  if (!input.success) return json({ error: 'Check the page number and search (maximum 120 characters).' }, 400);
  const { page, search, field } = input.data;
  try {
    const result = await auth.admin.listUsers({ query: {
      limit: adminPageSize, offset: page * adminPageSize, sortBy: 'createdAt', sortDirection: 'desc',
      ...(search ? { searchValue: search, searchField: field, searchOperator: 'contains' as const } : {}),
    } });
    if (result.error || !result.data) return json({ error: 'The user directory could not be loaded.' }, result.error?.status === 403 ? 403 : 502);
    return json({ users: result.data.users.map(publicAdminUser), total: result.data.total, page, pageSize: adminPageSize });
  } catch {
    return json({ error: 'The user directory could not be loaded. Please try again.' }, 502);
  }
}
