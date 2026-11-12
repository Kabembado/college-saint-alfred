import { getParams } from '@/lib/db';
import { PageHead, Paragraphes } from '@/components/ui';

export const metadata = { title: 'Historique' };

export default async function Historique() {
  const p = await getParams();
  return (
    <>
      <PageHead titre="Historique" sousTitre={`L'histoire du ${p.nom_ecole}`} />
      <section className="container section two-col">
        <article className="prose">
          <Paragraphes texte={p.historique} />
        </article>
        <aside className="side-card">
          <h3>En bref</h3>
          <dl>
            <dt>Statut</dt><dd>École privée</dd>
            {p.annee_creation && (<><dt>Année de création</dt><dd>{p.annee_creation}</dd></>)}
            {p.promoteur && (<><dt>Promoteur / Fondateur</dt><dd>{p.promoteur}</dd></>)}
            {p.prefet && (<><dt>Chef d'établissement</dt><dd>{p.prefet}</dd></>)}
            <dt>Localisation</dt><dd>Commune de la Muya, Mbujimayi, Kasaï Oriental, RDC</dd>
            <dt>Sections</dt><dd>Maternelle, Primaire, Secondaire</dd>
          </dl>
        </aside>
      </section>
    </>
  );
}
