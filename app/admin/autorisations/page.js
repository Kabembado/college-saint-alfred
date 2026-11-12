import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { baseConfiguree, db } from '@/lib/db';
import { Alertes, BaseManquante } from '@/components/ui';
import ConfirmButton from '@/components/ConfirmButton';
import { actionAutorisation, actionSupprimerAutorisation } from '../actions';

const VIDE = { id: 0, intitule: '', reference: '', date_doc: '', autorite: '', objet: '', ordre: 0 };

export default async function AdminAutorisations({ searchParams }) {
  await requireAdmin();
  if (!baseConfiguree()) return <BaseManquante />;
  const sp = await searchParams;
  const sql = await db();
  const editId = parseInt(sp?.edit, 10);
  const [edit] = editId ? await sql`SELECT * FROM autorisations WHERE id = ${editId}` : [];
  const v = edit || VIDE;
  const liste = await sql`SELECT * FROM autorisations ORDER BY ordre, id`;

  return (
    <>
      <h1>Documents d'autorisation</h1>
      <p className="muted">
        Le texte d'introduction de la page se modifie dans <Link href="/admin/parametres">Textes & coordonnées</Link>.
      </p>
      <Alertes searchParams={sp} />

      <div className="panel">
        <h2>{edit ? 'Modifier le document' : 'Ajouter un document'}</h2>
        <form action={actionAutorisation} className="form" key={v.id}>
          <input type="hidden" name="id" value={v.id} />
          <label>Intitulé *
            <input name="intitule" required defaultValue={v.intitule} placeholder="Ex. Arrêté ministériel d'agrément" />
          </label>
          <div className="row">
            <label>Référence / Numéro <input name="reference" defaultValue={v.reference} placeholder="Ex. N° MINEPST/CAB.MIN/…" /></label>
            <label>Date <input name="date_doc" defaultValue={v.date_doc} placeholder="Ex. 15/09/2010" /></label>
          </div>
          <div className="row">
            <label>Délivré par <input name="autorite" defaultValue={v.autorite} placeholder="Ex. Ministère de l'EPST / Division provinciale" /></label>
            <label>Ordre d'affichage <input type="number" name="ordre" defaultValue={v.ordre} /></label>
          </div>
          <label>Objet / description <textarea name="objet" rows={3} defaultValue={v.objet} /></label>
          <div className="actions">
            <button className="btn btn-blue">{edit ? 'Enregistrer' : 'Ajouter'}</button>
            {edit && <Link className="btn btn-small" href="/admin/autorisations">Annuler</Link>}
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Documents publiés ({liste.length})</h2>
        {liste.length === 0 ? (
          <p className="muted">Aucun document.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Intitulé</th><th>Référence</th><th>Date</th><th></th></tr></thead>
              <tbody>
                {liste.map((d) => (
                  <tr key={d.id}>
                    <td>{d.intitule}</td>
                    <td>{d.reference}</td>
                    <td>{d.date_doc}</td>
                    <td className="actions">
                      <Link className="btn btn-blue btn-small" href={`/admin/autorisations?edit=${d.id}`}>Modifier</Link>
                      <form action={actionSupprimerAutorisation}>
                        <input type="hidden" name="id" value={d.id} />
                        <ConfirmButton />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
