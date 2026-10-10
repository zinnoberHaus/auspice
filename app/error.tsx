'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="public-main"><section className="auth-panel"><h1>A moment’s pause.</h1><p>This page could not be opened. Please try again.</p><button className="button" onClick={reset}>Try again</button></section></main>}
