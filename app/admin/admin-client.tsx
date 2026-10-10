'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
import styles from './admin.module.css';

type ManagedUser = { id: string; name: string; email: string; emailVerified: boolean; role: string; banned: boolean; banExpires: string | null; createdAt: string };
type Action = 'ban' | 'unban' | 'revoke';
const actionNames = { ban: 'Suspend account', unban: 'Restore access', revoke: 'Sign out all sessions' };

export default function AdminClient({ operatorId }: { operatorId: string }) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [draft, setDraft] = useState('');
  const [field, setField] = useState<'email' | 'name'>('email');
  const [query, setQuery] = useState({ search: '', field: 'email' });
  const [revision, setRevision] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [selection, setSelection] = useState<{ user: ManagedUser; action: Action } | null>(null);
  const [reason, setReason] = useState('');
  const [duration, setDuration] = useState('week');
  const [confirmed, setConfirmed] = useState(false);
  const confirmationPanel = useRef<HTMLElement>(null);

  useEffect(() => {
    if (selection) { confirmationPanel.current?.focus({ preventScroll: true }); confirmationPanel.current?.scrollIntoView({ block: 'start' }); }
  }, [selection]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setUsers([]);
    const params = new URLSearchParams({ page: String(page), search: query.search, field: query.field });
    fetch(`/api/admin/users?${params}`, { cache: 'no-store', signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The user directory could not be loaded.');
      setUsers(data.users); setTotal(data.total); setPageSize(data.pageSize);
    }).catch(cause => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'The user directory could not be loaded.'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [page, query, revision]);

  function search(event: FormEvent) {
    event.preventDefault(); setSelection(null); setPage(0); setQuery({ search: draft.trim(), field });
  }
  function choose(user: ManagedUser, action: Action) {
    setSelection({ user, action }); setReason(''); setDuration('week'); setConfirmed(false); setMessage(''); setError('');
  }
  async function apply(event: FormEvent) {
    event.preventDefault(); if (!selection) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(selection.user.id)}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: selection.action, confirmed, ...(selection.action === 'ban' ? { reason, duration } : {}) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'The account action could not be completed.');
      setMessage(`${actionNames[selection.action]} completed for ${selection.user.email}.`); setSelection(null); setRevision(value => value + 1);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'The account action could not be completed.'); }
    finally { setBusy(false); }
  }

  return <main className={`public-main ${styles.main}`}><div className={styles.heading}><div><p className="quiet-label">Operator console</p><h1>User management</h1><p>Manage account access and active sessions.</p></div><button className="button-secondary" disabled={loading || busy} onClick={() => setRevision(value => value + 1)}>Refresh</button></div>
    <form className={styles.search} onSubmit={search}><label className="form-field">Search by<select className="input" value={field} onChange={event => setField(event.target.value as 'email' | 'name')} disabled={busy}><option value="email">Email</option><option value="name">Name</option></select></label><label className={`form-field ${styles.searchText}`}>Find an account<input className="input" type="search" value={draft} maxLength={120} onChange={event => setDraft(event.target.value)} placeholder="Email address or name" disabled={busy} /></label><button className="button" disabled={loading || busy}>Search</button></form>
    {error && <p className="status-message error" role="alert">{error}</p>}{message && <p className="status-message" role="status">{message}</p>}
    {selection && <section className={styles.confirmation} aria-label="Confirm account action" tabIndex={-1} ref={confirmationPanel}><h2>{actionNames[selection.action]}</h2><p><strong>{selection.user.name}</strong> · {selection.user.email}</p><p>{selection.action === 'ban' ? 'Suspension blocks sign-in and revokes existing sessions. The reason can be shown to the account holder.' : selection.action === 'unban' ? 'The account holder will be able to sign in again. Previously revoked sessions remain signed out.' : 'The account holder will need to sign in again on each device. This does not prevent a new sign-in.'}</p><form onSubmit={apply}>{selection.action === 'ban' && <><label className="form-field">Reason<textarea className="input" value={reason} onChange={event => setReason(event.target.value)} minLength={5} maxLength={300} required rows={2} disabled={busy} /></label><label className="form-field">Duration<select className="input" value={duration} onChange={event => setDuration(event.target.value)} disabled={busy}><option value="day">24 hours</option><option value="week">7 days</option><option value="month">30 days</option><option value="indefinite">Until access is restored</option></select></label></>}<label className="consent"><input type="checkbox" checked={confirmed} onChange={event => setConfirmed(event.target.checked)} required disabled={busy} />I confirm this action for {selection.user.email}.</label><div className="account-actions"><button className="button" disabled={busy || !confirmed}>{busy ? 'Applying…' : actionNames[selection.action]}</button><button className="button-secondary" type="button" disabled={busy} onClick={() => setSelection(null)}>Cancel</button></div></form></section>}
    {loading ? <p role="status">Loading accounts…</p> : !error && !users.length ? <p>No accounts match this search.</p> : <ul className={styles.users}>{users.map(user => <li key={user.id} className={styles.user}><div className={styles.identity}><h2>{user.name || 'Unnamed account'}{user.id === operatorId && <small> · You</small>}</h2><p className={styles.email}>{user.email}</p><p className={styles.details}>{user.emailVerified ? 'Email verified' : 'Email unverified'} · {user.role} · Joined {new Date(user.createdAt).toLocaleDateString()}</p><p className={styles.details}>{user.banned ? `Suspended${user.banExpires ? ` until ${new Date(user.banExpires).toLocaleString()}` : ' until restored'}` : 'Active'}</p><code className={styles.id}>{user.id}</code></div><div className={styles.actions}>{user.id !== operatorId && <><button className="button-secondary" disabled={busy || (!user.banned && user.role.split(',').map(role => role.trim()).includes('admin'))} onClick={() => choose(user, user.banned ? 'unban' : 'ban')}>{user.banned ? 'Restore access' : 'Suspend'}</button><button className="text-link" disabled={busy} onClick={() => choose(user, 'revoke')}>Sign out all sessions</button></>}</div></li>)}</ul>}
    {!loading && !error && <nav className={styles.pagination} aria-label="User directory pages"><button className="button-secondary" disabled={busy || page === 0} onClick={() => { setSelection(null); setPage(value => value - 1); }}>Previous</button><span>Page {page + 1} · {total} {total === 1 ? 'account' : 'accounts'}</span><button className="button-secondary" disabled={busy || (page + 1) * pageSize >= total} onClick={() => { setSelection(null); setPage(value => value + 1); }}>Next</button></nav>}
  </main>;
}
