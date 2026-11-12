import Link from 'next/link';
import Nav from '@/components/Nav';
import { getParams } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SiteLayout({ children }) {
  const p = await getParams();
  return (
    <>
      <header className="site-header">
        <div className="topbar">
          <div className="container topbar-inner">
            <span>📍 La Muya, Mbujimayi – Kasaï Oriental, RDC</span>
            {p.telephone && <span>📞 {p.telephone}</span>}
          </div>
        </div>
        <div className="container header-inner">
          <Link className="brand" href="/">
            <img src="/logo.svg" alt="" width="52" height="52" />
            <span>
              <strong>{p.nom_ecole}</strong>
              <small>{p.devise}</small>
            </span>
          </Link>
          <Nav />
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <h3>{p.nom_ecole}</h3>
            <p>{p.devise}</p>
            <p>École privée – Maternelle, Primaire et Secondaire.</p>
          </div>
          <div>
            <h3>Adresse</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{p.adresse}</p>
          </div>
          <div>
            <h3>Contact</h3>
            {p.telephone && <p>📞 {p.telephone}</p>}
            {p.email && (
              <p>
                ✉️ <a href={`mailto:${p.email}`}>{p.email}</a>
              </p>
            )}
            <p>
              <Link href="/contact">Écrivez-nous →</Link>
            </p>
          </div>
        </div>
        <div className="container footer-bottom">
          © {new Date().getFullYear()} {p.nom_ecole} – Mbujimayi, RDC · <Link href="/admin">Administration</Link>
        </div>
      </footer>
    </>
  );
}
