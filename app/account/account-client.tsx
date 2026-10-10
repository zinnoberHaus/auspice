'use client';
import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { authClient } from '@/lib/auth/client';
import EmailVerification from './email-verification';
type User = { id: string; name: string; email: string; emailVerified?: boolean };
export default function AccountClient() {
  const [user, setUser] = useState<User | null>(null);
  const [mode,setMode]=useState<'signin'|'signup'|'recover'|'verify'|'reset'>('signin');
  const [email,setEmail]=useState(''); const [name,setName]=useState(''); const [password,setPassword]=useState(''); const [code,setCode]=useState('');
  const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const [usage,setUsage]=useState<{used:number;limit:number}|null>(null);
  useEffect(()=>{ let active=true; fetch('/api/session').then(r=>r.json()).then(data=>{if(active){setUser(data.user);setUsage(data.usage);}}).catch(()=>setMessage('Your account could not be loaded. Please reload.')).finally(()=>{if(active)setLoading(false);}); return()=>{active=false;}; },[]);
  async function submit(event:FormEvent){event.preventDefault();setBusy(true);setMessage('');
    try {
      let result;
      if(mode==='signup')result=await authClient.signUp.email({email,password,name,callbackURL:'/account'});
      else if(mode==='recover')result=await authClient.emailOtp.sendVerificationOtp({email,type:'forget-password'});
      else if(mode==='reset')result=await authClient.emailOtp.resetPassword({email,otp:code,password});
      else if(mode==='verify')result=await authClient.emailOtp.verifyEmail({email,otp:code});
      else result=await authClient.signIn.email({email,password});
      if(result.error){setMessage(result.error.code==='INVALID_ORIGIN'?'Account access is temporarily unavailable. You can still explore the daily card and guide library.':result.error.message||'Please check your details and try again.'); if(result.error.code==='EMAIL_NOT_VERIFIED')setMode('verify');return;}
      if(mode==='recover'){setMessage('If that address has an account, a recovery code is on its way. Enter it with your new password.');setMode('reset');}
      else if(mode==='reset'){setMessage('Password updated. You can now sign in.');setMode('signin');setPassword('');history.replaceState(null,'','/account');}
      else if(mode==='signup'){const session=await authClient.getSession();if(session.data?.user){setUser(session.data.user);location.assign(session.data.user.emailVerified?'/sanctuary':'/account');}else{setMode('verify');setMessage('Check your email for a verification code.');}}
      else location.assign('/sanctuary');
    }catch{setMessage('We could not reach the account service. Please try again.');}finally{setBusy(false);}
  }
  async function signOut(){setBusy(true);try{const result=await authClient.signOut();if(result.error)throw new Error();setUser(null);setUsage(null);setMessage('You are signed out.');}catch{setMessage('Sign-out did not complete. Please try again.');}finally{setBusy(false);}}
  return <><header className="public-header"><Link className="public-brand" href="/">Auspice</Link><nav className="public-nav"><Link href="/sanctuary">Your sanctuary</Link><Link href="/guides">The library</Link></nav></header><main className="public-main"><section className="auth-panel">
    {loading?<p role="status">Opening your account…</p>:user?<><h1>A space of your own.</h1><p>Welcome, {user.name}.</p><p>{user.email}</p>{!user.emailVerified&&<EmailVerification email={user.email}/>}<p>Free membership{usage?` · ${Math.max(0,usage.limit-usage.used)} of ${usage.limit} readings remaining this month`:''}</p><p className="muted">Your free allowance renews on the first of each month, in UTC.</p><div className="account-actions"><Link className="button" href="/sanctuary">Return to your sanctuary</Link><a className="button-secondary" href="/api/account/export">Export your journal</a><button className="button-secondary" disabled={busy} onClick={signOut}>Sign out</button></div><p><Link href="/account/settings">Manage profile & data</Link></p></>:<><h1>{mode==='signup'?'Make space for yourself.':mode==='recover'?'Find your way back.':mode==='verify'?'Check your inbox.':mode==='reset'?'A fresh start.':'Welcome back.'}</h1><p>{mode==='signup'?'Three personal readings each month, a private journal, and room to reflect.':mode==='verify'?'Enter the verification code sent to your email.':'Your journal and your next perspective are waiting.'}</p><form onSubmit={submit}>
      {mode==='signup'&&<label className="form-field">Your name<input className="input" autoComplete="name" required maxLength={80} value={name} onChange={e=>setName(e.target.value)}/></label>}
      {<label className="form-field">Email<input className="input" type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label>}
      {['signin','signup','reset'].includes(mode)&&<label className="form-field">Password<input className="input" type="password" autoComplete={mode==='signin'?'current-password':'new-password'} minLength={8} maxLength={128} required value={password} onChange={e=>setPassword(e.target.value)}/></label>}
      {(mode==='verify'||mode==='reset')&&<label className="form-field">Verification code<input className="input" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={e=>setCode(e.target.value)}/></label>}
      {mode==='signup'&&<label className="consent"><input type="checkbox" required/> I am at least 18 and agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy notice</Link>.</label>}
      <button className="button" disabled={busy}>{busy?'One moment…':mode==='signup'?'Create free account':mode==='recover'?'Send recovery instructions':mode==='verify'?'Verify email':mode==='reset'?'Save new password':'Sign in'}</button>
    </form><div className="auth-switch"><button className="text-link" onClick={()=>{setMode(mode==='signup'?'signin':'signup');setMessage('');}}>{mode==='signup'?'Already have an account? Sign in':'New here? Create an account'}</button>{mode==='signin'&&<button className="text-link" onClick={()=>setMode('recover')}>Forgot your password?</button>}{mode==='verify'&&<button className="text-link" disabled={busy} onClick={async()=>{setBusy(true);try{const r=await authClient.emailOtp.sendVerificationOtp({email,type:'email-verification'});setMessage(r.error?.message||'A new code is on its way.');}catch{setMessage('The code could not be sent. Try again later.');}finally{setBusy(false);}}}>Send another code</button>}</div></>}
    {message&&<p className="status-message" role="status">{message}</p>}
  </section></main></>;
}
