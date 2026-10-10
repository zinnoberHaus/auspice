import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/admin';
import AdminClient from './admin-client';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'User management', robots: { index: false, follow: false } };

export default async function AdminPage() {
  const access = await requireAdmin();
  if (!access.user && access.status === 401) redirect('/account');
  if (!access.user) return <main className="public-main"><section className="auth-panel"><Link href="/account" className="text-link">Your account</Link><h1>Operator access</h1><p>{access.error}</p><p>Access is assigned to an identified owner account by the project administrator.</p></section></main>;
  return <><header className="public-header"><Link className="public-brand" href="/">Auspice</Link><nav className="public-nav"><Link href="/account">Your account</Link><Link href="/sanctuary">Sanctuary</Link></nav></header><AdminClient operatorId={access.user.id} /></>;
}
