import Link from 'next/link';
import { isAdmin } from '@/lib/auth';
import { actionDeconnexion } from './actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Administration', robots: { index: false, follow: false } };

const LIENS = [
  ['/admin', 'Tableau de bord'],
  ['/admin/enseignants', 'Enseignants'],
  ['/admin/palmares', 'Palmarès'],
  ['/admin/autorisations', 'Autorisations'],
  ['/admin/messages', 'Messages'],
  ['/admin/parametres', 'Textes & coordonnées'],
];

export default async function AdminLayout({ children }) {
  const connecte = await isAdmin();
  return (
    <div className="admin-body" style={{ minHeight: '100vh' }}>
      {connecte && (
        <div className="admin-bar">
          <div className="container">
            <strong>⚙️ Collège Saint Alfred – Administration</strong>
            {LIENS.map(([href, lib]) => (
              <Link key={href} href={href}>{lib}</Link>
            ))}
            <a href="/" target="_blank" rel="noopener">Voir le site ↗</a>
            <form action={actionDeconnexion} style={{ margin: 0 }}>
              <button className="btn btn-small btn-outline">Déconnexion</button>
            </form>
          </div>
        </div>
      )}
      <main className="admin-main container">{children}</main>
    </div>
  );
}
