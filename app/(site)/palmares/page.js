import { lire } from '@/lib/db';
import { PageHead } from '@/components/ui';
import { nombreFr, pourcentage } from '@/lib/format';

export const metadata = { title: 'Palmarès' };

export default async function Palmares({ searchParams }) {
  const sp = await searchParams;
  const annees = (
    await lire(
      (sql) => sql`SELECT annee_scolaire FROM resultats UNION SELECT annee_scolaire FROM laureats ORDER BY annee_scolaire DESC`
    )
  ).map((r) => r.annee_scolaire);

  let annee = typeof sp?.annee === 'string' ? sp.annee : '';
  if (!annees.includes(annee)) annee = annees[0] || '';

  const resultats = annee
    ? await lire((sql) => sql`SELECT * FROM resultats WHERE annee_scolaire = ${annee} ORDER BY examen, classe_option`)
    : [];
  const laureats = annee
    ? await lire(
        (sql) => sql`SELECT * FROM laureats WHERE annee_scolaire = ${annee} ORDER BY pourcentage DESC NULLS LAST, nom_complet`
      )
    : [];

  return (
    <>
      <PageHead titre="Palmarès" sousTitre="Résultats aux examens officiels et meilleurs élèves" />
      <section className="container section">
        {annees.length === 0 ? (
          <div className="empty">Les résultats (ENAFEP, TENASOSP, Examen d'État…) et les lauréats seront publiés ici.</div>
        ) : (
          <>
            <div className="filter">
              <span>Année scolaire :</span>
              <div className="tabs" style={{ margin: 0 }}>
                {annees.map((a) => (
                  <a key={a} href={`?annee=${encodeURIComponent(a)}`} className={a === annee ? 'active' : ''}>{a}</a>
                ))}
              </div>
            </div>

            {resultats.length > 0 && (
              <>
                <h2 className="section-title">Résultats aux examens – {annee}</h2>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Examen</th><th>Classe / Option</th><th>Inscrits</th><th>Réussis</th><th>Taux de réussite</th></tr>
                    </thead>
                    <tbody>
                      {resultats.map((r) => (
                        <tr key={r.id}>
                          <td>{r.examen}</td>
                          <td>{r.classe_option}</td>
                          <td>{r.inscrits}</td>
                          <td>{r.reussis}</td>
                          <td><span className="badge">{pourcentage(r.reussis, r.inscrits)}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {laureats.length > 0 && (
              <>
                <h2 className="section-title">Nos lauréats – {annee}</h2>
                <div className="laureats">
                  {laureats.map((l, i) => (
                    <div className={'laureat' + (i < 3 ? ' top' : '')} key={l.id}>
                      <span className="rang">{i + 1}</span>
                      <div>
                        <strong>{l.nom_complet}</strong>
                        <small>{[l.classe_option, l.distinction].filter(Boolean).join(' · ')}</small>
                      </div>
                      {l.pourcentage !== null && <span className="score">{nombreFr(l.pourcentage)} %</span>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </>
  );
}
