'use client';
import {useState,type FormEvent} from 'react';
import {authClient} from '@/lib/auth/client';
export default function EmailVerification({email}:{email:string}){
 const [code,setCode]=useState('');const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);const [sent,setSent]=useState(false);
 async function send(){setBusy(true);try{const r=await authClient.emailOtp.sendVerificationOtp({email,type:'email-verification'});setMessage(r.error?.message||'Check your inbox for a verification code.');if(!r.error)setSent(true);}catch{setMessage('Could not send your code. Please try again.');}finally{setBusy(false);}}
 async function verify(e:FormEvent){e.preventDefault();setBusy(true);try{const r=await authClient.emailOtp.verifyEmail({email,otp:code});if(r.error)setMessage(r.error.message||'That code could not be verified.');else location.reload();}catch{setMessage('Could not verify that code. Please try again.');}finally{setBusy(false);}}
 return <section className="verification-panel"><h2>One small step before your first reading.</h2><p>Verify {email} to start your personal readings.</p><button className="button-secondary" onClick={send} disabled={busy}>{sent?'Send a new code':'Send verification code'}</button><form onSubmit={verify}><label className="form-field">Verification code<input className="input" value={code} onChange={e=>setCode(e.target.value)} autoComplete="one-time-code" inputMode="numeric" required/></label><button className="button" disabled={busy}>Verify my email</button></form>{message&&<p role="status">{message}</p>}</section>;
}
