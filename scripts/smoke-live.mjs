import { randomBytes,randomUUID } from 'node:crypto';
import { createRequire } from 'node:module';
const require=createRequire(process.cwd()+'/package.json');
const {neon}=require('@neondatabase/serverless');
if(process.env.AUSPICE_RUN_LIVE_TEST!=='1'||!process.env.AUSPICE_TEST_URL)throw new Error('Explicit AUSPICE_RUN_LIVE_TEST=1 and AUSPICE_TEST_URL are required. This test creates synthetic accounts and requests one interpretation.');
const sql=neon(process.env.DATABASE_URL);
const base=new URL(process.env.AUSPICE_TEST_URL).origin;
const idSet=[];
const client=()=>{const jar=new Map();return async(path,method='GET',data)=>{const r=await fetch(base+path,{method,headers:{Origin:base,'Content-Type':'application/json',Cookie:[...jar].map(([k,v])=>`${k}=${v}`).join('; ')},body:data?JSON.stringify(data):undefined});for(const line of r.headers.getSetCookie()){const pair=line.split(';')[0];const at=pair.indexOf('=');jar.set(pair.slice(0,at),pair.slice(at+1));}let body;try{body=await r.json();}catch{body={};}return {status:r.status,body};};};
function check(value,label){if(!value)throw new Error(label);console.log('PASS',label);}
try{
 const one=client(),two=client();let password;
 for(const [index,c] of [one,two].entries()){
  password=randomBytes(24).toString('base64url');
  const r=await c('/api/auth/sign-up/email','POST',{name:'Auspice automated QA',email:`auspice-qa-${randomUUID()}@example.invalid`,password});
  check(r.status===200&&!!r.body.user,`signup ${index}`); idSet.push(r.body.user.id);
  check((await c('/api/readings','POST',{tradition:'tarot',question:'What can I reflect on today?'})).status===403,'unverified reading denied');
  // Verify only synthetic non-deliverable test identities to exercise authorized APIs.
  await sql`UPDATE neon_auth."user" SET "emailVerified"=true WHERE id=${r.body.user.id} AND name='Auspice automated QA' AND email LIKE '%@example.invalid'`;
  await c('/api/auth/sign-out','POST',{});
  const signin=await c('/api/auth/sign-in/email','POST',{email:r.body.user.email,password});check(signin.status===200,'sign-in restores verified fixture');
 }
 const request={tradition:'tarot',question:'How can I make more time for creative writing?',requestId:randomUUID()};
 const reading=await one('/api/readings','POST',request);if(reading.status!==200)console.log('reading error',reading.status,reading.body.error);check(reading.status===200&&reading.body.reading?.symbols.length===3,'real interpretation saved');const id=reading.body.reading.id;
 const replay=await one('/api/readings','POST',request);check(replay.body.reading?.id===id,'retry returns same reading');
 check((await one('/api/session')).body.usage.used===1,'retry uses one allowance');
 check((await two(`/api/readings/${id}`,'PATCH',{note:'forbidden'})).status===404,'other owner cannot edit');
 check((await two(`/api/readings/${id}`,'DELETE')).status===404,'other owner cannot delete');
 check((await one(`/api/readings/${id}`,'PATCH',{note:'A small writing session before lunch.'})).status===200,'journal note saved');
 const exported=await one('/api/account/export');check(exported.body.readings[0].note.includes('writing session'),'journal export retains note');
 check((await one(`/api/readings/${id}`,'DELETE')).status===200,'reading deletion succeeds');
 check((await one('/api/readings','POST',request)).status===410,'deleted request returns410');
 check((await one('/api/session')).body.usage.used===1,'delete does not reset allowance');
 check((await one('/api/readings')).body.readings.length===0,'deleted content not listed');
 check((await one('/api/auth/sign-out','POST',{})).status===200,'signout succeeds');
 check((await one('/api/readings')).status===401,'signed-out protected API denied');
 check((await two('/api/account','DELETE',{password:'not-the-password',confirmation:'DELETE'})).status===400,'incorrect password cannot delete account');
 check((await sql`SELECT id FROM neon_auth."user" WHERE id=${idSet[1]}`).length===1,'incorrect password leaves identity intact');
 const erased=await two('/api/account','DELETE',{password,confirmation:'DELETE'});if(erased.status!==200)console.log('deletion error',erased.status);check(erased.status===200,'account deletion succeeds');
 check((await sql`SELECT id FROM neon_auth."user" WHERE id=${idSet[1]}`).length===0,'deleted identity is gone');
 check((await two('/api/session')).body.user===null,'deleted account no longer has a session');
 check((await sql`SELECT id FROM neon_auth."user" WHERE id=${idSet[0]}`).length===1,'account deletion preserves the other identity');
}catch(e){console.error('FAIL',e.message);process.exitCode=1;}
finally{for(const id of idSet)await sql`DELETE FROM neon_auth."user" WHERE id=${id} AND name='Auspice automated QA' AND email LIKE '%@example.invalid'`;console.log('Synthetic fixtures cleaned');}
