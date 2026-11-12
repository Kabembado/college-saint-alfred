import { getParams, lire } from '@/lib/db';
import { PageHead, Paragraphes } from '@/components/ui';

export const metadata = { title: 'Autorisation' };

export default async function Autorisation() {
  const p = await getParams();
  const docs = await lire((sql) => sql`SELECT * FROM autorisations ORDER BY ordre, id`);
  return (
    <>
      <PageHead titre="Autorisation de fonctionnement" sousTitre="Documents officiels de l'établissement" />
      <section className="container section">
        <div className="prose"><Paragraphes texte={p.autorisation_intro} /></div>
        {docs.length === 0 ? (
          <div className="empty">Les références des documents officiels (arrêtés, agréments) seront publiées prochainement.</div>
        ) : (
          <div className="doc-list">
            {docs.map((d) => (
              <article className="doc" key={d.id}>
                <div className="doc-icon">📜</div>
                <div>
                  <h3>{d.intitule}</h3>
                  <ul className="doc-meta">
                    {d.reference && <li><strong>Référence :</strong> {d.reference}</li>}
                    {d.date_doc && <li><strong>Date :</strong> {d.date_doc}</li>}
                    {d.autorite && <li><strong>Délivré par :</strong> {d.autorite}</li>}
                  </ul>
                  {d.objet && <p style={{ whiteSpace: 'pre-line' }}>{d.objet}</p>}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
