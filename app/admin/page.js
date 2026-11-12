import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { baseConfiguree, db } from '@/lib/db';
import { BaseManquante } from '@/components/ui';

export default async function Tableau() {
  await requireAdmin();
  if (!baseConfiguree()) return <BaseManquante />;
  const sql = await db();
  const [c] = await sql`SELECT
    (SELECT COUNT(*) FROM enseignants)::int AS enseignants,
    (SELECT COUNT(*) FROM resultats)::int AS resultats,
    (SELECT COUNT(*) FROM laureats)::int AS laureats,
    (SELECT COUNT(*) FROM autorisations)::int AS autorisations,
    (SELECT COUNT(*) FROM messages WHERE NOT lu)::int AS non_lus`;
  const tuiles = [
    ['/admin/enseignants', c.enseignants, 'Enseignants'],
    ['/admin/palmares', c.resultats, "Résultats d'examens"],
    ['/admin/palmares', c.laureats, 'Lauréats'],
    ['/admin/autorisations', c.autorisations, "Documents d'autorisation"],
    ['/admin/messages', c.non_lus, 'Messages non lus'],
  ];
  return (
    <>
      <h1>Tableau de bord</h1>
      {!process.env.BLOB_READ_WRITE_TOKEN && (
        <div className="alert alert-error">
          Le stockage des photos n'est pas activé (Vercel → Storage → Blob). Le site fonctionne, mais sans photos d'enseignants.
        </div>
      )}
      <div className="dash">
        {tuiles.map(([href, n, lib]) => (
          <Link key={lib} href={href}><strong>{n}</strong><span>{lib}</span></Link>
        ))}
      </div>
      <div className="panel">
        <h2>Que voulez-vous faire ?</h2>
        <ul>
          <li><Link href="/admin/parametres">Modifier l'historique, le texte d'autorisation, le téléphone, l'e-mail…</Link></li>
          <li><Link href="/admin/enseignants">Ajouter ou modifier un enseignant</Link></li>
          <li><Link href="/admin/palmares">Publier les résultats d'examens et les lauréats</Link></li>
          <li><Link href="/admin/autorisations">Ajouter les références des arrêtés / agréments</Link></li>
          <li><Link href="/admin/messages">Lire les messages reçus via « Nous contacter »</Link></li>
        </ul>
      </div>
    </>
  );
}
