import { requireAdmin } from '@/lib/auth';
import { baseConfiguree, db } from '@/lib/db';
import { Alertes, BaseManquante } from '@/components/ui';
import ConfirmButton from '@/components/ConfirmButton';
import { EXAMENS, toutesLesClasses } from '@/lib/structure';
import { nombreFr, pourcentage } from '@/lib/format';
import { actionLaureat, actionResultat, actionSupprimerLaureat, actionSupprimerResultat } from '../actions';

function anneeParDefaut() {
  // Les examens se terminent en juillet : on propose la dernière année scolaire achevée.
  const d = new Date();
  const fin = d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1;
  return `${fin - 1}-${fin}`;
}

export default async function AdminPalmares({ searchParams }) {
  await requireAdmin();
  if (!baseConfiguree()) return <BaseManquante />;
  const sql = await db();
  const resultats = await sql`SELECT * FROM resultats ORDER BY annee_scolaire DESC, examen, classe_option`;
  const laureats = await sql`SELECT * FROM laureats ORDER BY annee_scolaire DESC, pourcentage DESC NULLS LAST`;
  const annee = anneeParDefaut();

  return (
    <>
      <h1>Palmarès</h1>
      <Alertes searchParams={await searchParams} />
      <datalist id="classes">
        {toutesLesClasses().map((c) => <option key={c} value={c} />)}
      </datalist>

      <div className="panel">
        <h2>Ajouter un résultat d'examen</h2>
        <form action={actionResultat} className="form">
          <div className="row">
            <label>Année scolaire * <input name="annee_scolaire" required placeholder="2024-2025" defaultValue={annee} /></label>
            <label>Examen
              <select name="examen">{EXAMENS.map((e) => <option key={e}>{e}</option>)}</select>
            </label>
          </div>
          <label>Classe / Option <input name="classe_option" list="classes" placeholder="Ex. Option Électricité" /></label>
          <div className="row">
            <label>Nombre d'inscrits <input type="number" min="0" name="inscrits" required /></label>
            <label>Nombre de réussis <input type="number" min="0" name="reussis" required /></label>
          </div>
          <button className="btn btn-blue">Ajouter le résultat</button>
        </form>
      </div>

      <div className="panel">
        <h2>Ajouter un lauréat</h2>
        <form action={actionLaureat} className="form">
          <div className="row">
            <label>Année scolaire * <input name="annee_scolaire" required placeholder="2024-2025" defaultValue={annee} /></label>
            <label>Nom complet de l'élève * <input name="nom_complet" required /></label>
          </div>
          <div className="row">
            <label>Classe / Option <input name="classe_option" list="classes" /></label>
            <label>Pourcentage obtenu <input name="pourcentage" inputMode="decimal" placeholder="Ex. 78,5" /></label>
          </div>
          <label>Distinction (facultatif)
            <input name="distinction" placeholder="Ex. Premier de l'Examen d'État au niveau de l'école" />
          </label>
          <button className="btn btn-blue">Ajouter le lauréat</button>
        </form>
      </div>

      <div className="panel">
        <h2>Résultats enregistrés ({resultats.length})</h2>
        {resultats.length === 0 ? <p className="muted">Aucun résultat.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Année</th><th>Examen</th><th>Classe / Option</th><th>Inscrits</th><th>Réussis</th><th>%</th><th></th></tr></thead>
              <tbody>
                {resultats.map((r) => (
                  <tr key={r.id}>
                    <td>{r.annee_scolaire}</td><td>{r.examen}</td><td>{r.classe_option}</td>
                    <td>{r.inscrits}</td><td>{r.reussis}</td><td>{pourcentage(r.reussis, r.inscrits)}</td>
                    <td>
                      <form action={actionSupprimerResultat}>
                        <input type="hidden" name="id" value={r.id} />
                        <ConfirmButton message="Supprimer ce résultat ?" />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="panel">
        <h2>Lauréats enregistrés ({laureats.length})</h2>
        {laureats.length === 0 ? <p className="muted">Aucun lauréat.</p> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Année</th><th>Nom</th><th>Classe / Option</th><th>%</th><th></th></tr></thead>
              <tbody>
                {laureats.map((l) => (
                  <tr key={l.id}>
                    <td>{l.annee_scolaire}</td><td>{l.nom_complet}</td><td>{l.classe_option}</td>
                    <td>{l.pourcentage !== null ? nombreFr(l.pourcentage) : '—'}</td>
                    <td>
                      <form action={actionSupprimerLaureat}>
                        <input type="hidden" name="id" value={l.id} />
                        <ConfirmButton message="Supprimer ce lauréat ?" />
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
