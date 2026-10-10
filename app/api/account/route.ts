import { auth } from '@/lib/auth/server';
import { json, sameOrigin } from '@/lib/http';
import { z } from 'zod';
import { db } from '@/lib/db';
export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ error: 'Invalid origin.' },403);
  const { data: session }=await auth.getSession({query:{disableCookieCache:'true'}});
  if(!session?.user)return json({error:'Please sign in again.'},401);
  const input=z.object({password:z.string().min(1).max(128),confirmation:z.literal('DELETE')}).safeParse(await request.json().catch(()=>null));
  if(!input.success)return json({error:'Enter your password and type DELETE.'},400);
  // The hosted provider currently returns 404 for delete-user. Reauthenticate
  // through its supported password endpoint; never inspect password hashes.
  const verified=await auth.signIn.email({email:session.user.email,password:input.data.password});
  if(verified.error||verified.data?.user.id!==session.user.id)
    return json({error:'Your password could not be verified.'},400);
  // Neon stores this identity and its sessions in Postgres. Provider foreign
  // keys and migration 002 erase sessions, credentials and app data atomically.
  // ID comes only from the authenticated session, never the request body.
  await db()`DELETE FROM neon_auth."user" WHERE id=${session.user.id}::uuid`;
  await auth.signOut();
  return json({deleted:true});
}
