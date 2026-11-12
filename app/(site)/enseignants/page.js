import { lire, getParams } from '@/lib/db';
import { PageHead } from '@/components/ui';
import { SECTIONS_PERSONNEL, sectionLabel } from '@/lib/structure';
import { nomComplet } from '@/lib/format';

export const metadata = { title: 'Liste des enseignants' };

export default async function Enseignants({ searchParams }) {
  const sp = await searchParams;
  const filtre = SECTIONS_PERSONNEL.includes(sp?.section) ? sp.section : '';
  const p = await getParams();
  const liste = await lire((sql) => sql`
    SELECT * FROM enseignants
    ${filtre ? sql`WHERE section = ${filtre}` : sql``}
    ORDER BY CASE section WHEN 'direction' THEN 0 WHEN 'maternelle' THEN 1 WHEN 'primaire' THEN 2 ELSE 3 END, ordre, nom`);

  const groupes = {};
  for (const t of liste) (groupes[t.section] ||= []).push(t);

  return (
    <>
      <PageHead titre="Liste des enseignants" sousTitre={`Le personnel éducatif du ${p.nom_ecole}`} />
      <section className="container section">
        <div className="tabs">
          <a href="/enseignants" className={filtre === '' ? 'active' : ''}>Tous</a>
          {SECTIONS_PERSONNEL.map((s) => (
            <a key={s} href={`?section=${s}`} className={filtre === s ? 'active' : ''}>{sectionLabel(s)}</a>
          ))}
        </div>

        {liste.length === 0 && <div className="empty">Aucun enseignant n'est encore enregistré pour cette section.</div>}

        {Object.entries(groupes).map(([sec, membres]) => (
          <div key={sec}>
            <h2 className="section-title">{sectionLabel(sec)} <small>({membres.length})</small></h2>
            <div className="teachers">
              {membres.map((t) => {
                const nc = nomComplet(t);
                const initiales = ((t.nom[0] || '') + ((t.prenom || t.postnom)[0] || '')).toUpperCase();
                const civ = t.sexe === 'F' ? 'Mme' : t.sexe === 'M' ? 'M.' : '';
                return (
                  <article className="teacher" key={t.id}>
                    {t.photo ? (
                      <img src={t.photo} alt={`Photo de ${nc}`} loading="lazy" />
                    ) : (
                      <div className="avatar" aria-hidden="true">{initiales}</div>
                    )}
                    <h3>{[civ, nc].filter(Boolean).join(' ')}</h3>
                    <p className="role">{t.fonction}</p>
                    {t.classe_cours && <p>{t.classe_cours}</p>}
                    {t.qualification && <p className="muted">{t.qualification}</p>}
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
