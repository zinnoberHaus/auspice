import Link from "next/link";
import type { ReactNode } from "react";

export default function GuidesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="public-header">
        <Link className="public-brand" href="/" aria-label="Auspice home">Auspice<span aria-hidden="true"> ✦</span></Link>
        <nav className="public-nav" aria-label="Main navigation">
          <Link href="/guides">Guides</Link>
          <Link href="/pricing">Membership</Link>
          <Link className="button button-secondary" href="/sanctuary">Enter sanctuary</Link>
        </nav>
      </header>
      {children}
      <footer className="public-footer">
        <p>Auspice · A little space for reflection.</p>
        <nav aria-label="Footer navigation">
          <Link href="/guides">All guides</Link>{" · "}
          <Link href="/privacy">Privacy</Link>{" · "}
          <Link href="/terms">Terms</Link>
        </nav>
      </footer>
    </>
  );
}
