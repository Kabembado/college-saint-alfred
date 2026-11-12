import { requireAdmin } from '@/lib/auth';
import { baseConfiguree, db } from '@/lib/db';
import { Alertes, BaseManquante } from '@/components/ui';
import ConfirmButton from '@/components/ConfirmButton';
import { actionBasculerLu, actionSupprimerMessage } from '../actions';

export default async function Messages({ searchParams }) {
  await requireAdmin();
  if (!baseConfiguree()) return <BaseManquante />;
  const sql = await db();
  const messages = await sql`SELECT * FROM messages ORDER BY recu_le DESC, id DESC`;
  return (
    <>
      <h1>Messages reçus</h1>
      <Alertes searchParams={await searchParams} />
      {messages.length === 0 && <div className="empty">Aucun message pour le moment.</div>}
      {messages.map((m) => (
        <div className="panel" key={m.id} style={m.lu ? {} : { borderLeft: '5px solid var(--or)' }}>
          <h2 style={{ fontSize: '1.15rem' }}>
            {m.lu ? '' : '🆕 '}{m.sujet || 'Sans sujet'} — {m.nom}
          </h2>
          <p className="muted">
            Reçu le {new Date(m.recu_le).toLocaleString('fr-FR', { timeZone: 'Africa/Lubumbashi' })}
            {m.telephone && <> · 📞 <a href={`tel:${m.telephone.replace(/[^0-9+]/g, '')}`}>{m.telephone}</a></>}
            {m.email && <> · ✉️ <a href={`mailto:${m.email}`}>{m.email}</a></>}
          </p>
          <p style={{ whiteSpace: 'pre-line' }}>{m.message}</p>
          <div className="actions">
            <form action={actionBasculerLu}>
              <input type="hidden" name="id" value={m.id} />
              <button className="btn btn-blue btn-small">{m.lu ? 'Marquer non lu' : 'Marquer comme lu'}</button>
            </form>
            <form action={actionSupprimerMessage}>
              <input type="hidden" name="id" value={m.id} />
              <ConfirmButton message="Supprimer ce message ?" />
            </form>
          </div>
        </div>
      ))}
    </>
  );
}
