import Link from 'next/link';
import { requireAdmin } from '@/lib/auth';
import { baseConfiguree, db } from '@/lib/db';
import { Alertes, BaseManquante } from '@/components/ui';
import ConfirmButton from '@/components/ConfirmButton';
import { SECTIONS_PERSONNEL, sectionLabel } from '@/lib/structure';
import { nomComplet } from '@/lib/format';
import { actionEnseignant, actionSupprimerEnseignant } from '../actions';

const VIDE = {
  id: 0, nom: '', postnom: '', prenom: '', sexe: '', section: 'primaire',
  fonction: 'Enseignant(e)', classe_cours: '', qualification: '', photo: '', ordre: 0,
};

export default async function AdminEnseignants({ searchParams }) {
  await requireAdmin();
  if (!baseConfiguree()) return <BaseManquante />;
  const sp = await searchParams;
  const sql = await db();
  const editId = parseInt(sp?.edit, 10);
  const [edit] = editId ? await sql`SELECT * FROM enseignants WHERE id = ${editId}` : [];
  const v = edit || VIDE;
  const liste = await sql`SELECT * FROM enseignants ORDER BY
    CASE section WHEN 'direction' THEN 0 WHEN 'maternelle' THEN 1 WHEN 'primaire' THEN 2 ELSE 3 END, ordre, nom`;

  return (
    <>
      <h1>Enseignants</h1>
      <Alertes searchParams={sp} />

      <div className="panel">
        <h2>{edit ? 'Modifier un enseignant' : 'Ajouter un enseignant'}</h2>
        <form action={actionEnseignant} className="form" key={v.id}>
          <input type="hidden" name="id" value={v.id} />
          <div className="row">
            <label>Nom * <input name="nom" required defaultValue={v.nom} /></label>
            <label>Postnom <input name="postnom" defaultValue={v.postnom} /></label>
          </div>
          <div className="row">
            <label>Prénom <input name="prenom" defaultValue={v.prenom} /></label>
            <label>Sexe
              <select name="sexe" defaultValue={v.sexe}>
                <option value="">—</option>
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </label>
          </div>
          <div className="row">
            <label>Section
              <select name="section" defaultValue={v.section}>
                {SECTIONS_PERSONNEL.map((s) => <option key={s} value={s}>{sectionLabel(s)}</option>)}
              </select>
            </label>
            <label>Fonction
              <input name="fonction" defaultValue={v.fonction} placeholder="Enseignant(e), Préfet, Directeur, Titulaire…" />
            </label>
          </div>
          <div className="row">
            <label>Classe / Cours
              <input name="classe_cours" defaultValue={v.classe_cours} placeholder="Ex. 3ème primaire, ou Mathématiques – Option Électricité" />
            </label>
            <label>Qualification
              <input name="qualification" defaultValue={v.qualification} placeholder="Ex. D6, G3, L2…" />
            </label>
          </div>
          <div className="row">
            <label>Photo (JPG, PNG ou WEBP, 2 Mo max)
              <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" />
              {v.photo && (
                <span className="hint">
                  <img src={v.photo} alt="" width="48" height="48" style={{ borderRadius: '50%', objectFit: 'cover', verticalAlign: 'middle' }} />{' '}
                  <label style={{ display: 'inline' }}>
                    <input type="checkbox" name="retirer_photo" style={{ width: 'auto' }} /> Retirer la photo actuelle
                  </label>
                </span>
              )}
            </label>
            <label>Ordre d'affichage
              <input type="number" name="ordre" defaultValue={v.ordre} />
              <span className="hint">Les plus petits nombres s'affichent en premier.</span>
            </label>
          </div>
          <div className="actions">
            <button className="btn btn-blue">{edit ? 'Enregistrer les modifications' : 'Ajouter'}</button>
            {edit && <Link className="btn btn-small" href="/admin/enseignants">Annuler</Link>}
          </div>
        </form>
      </div>

      <div className="panel">
        <h2>Liste ({liste.length})</h2>
        {liste.length === 0 ? (
          <p className="muted">Aucun enseignant enregistré.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nom complet</th><th>Section</th><th>Fonction</th><th>Classe / Cours</th><th></th></tr></thead>
              <tbody>
                {liste.map((t) => (
                  <tr key={t.id}>
                    <td>{nomComplet(t)}</td>
                    <td>{sectionLabel(t.section)}</td>
                    <td>{t.fonction}</td>
                    <td>{t.classe_cours}</td>
                    <td className="actions">
                      <Link className="btn btn-blue btn-small" href={`/admin/enseignants?edit=${t.id}`}>Modifier</Link>
                      <form action={actionSupprimerEnseignant}>
                        <input type="hidden" name="id" value={t.id} />
                        <ConfirmButton message={`Supprimer ${nomComplet(t)} ?`} />
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
