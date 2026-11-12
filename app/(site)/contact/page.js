import { getParams } from '@/lib/db';
import { PageHead } from '@/components/ui';
import ContactForm from './ContactForm';

export const metadata = { title: 'Nous contacter' };

export default async function Contact() {
  const p = await getParams();
  return (
    <>
      <PageHead titre="Nous contacter" sousTitre="Une question ? Une inscription ? Écrivez-nous ou passez à l'école." />
      <section className="container section two-col">
        <div>
          <ContactForm />
        </div>
        <aside className="side-card">
          <h3>Coordonnées</h3>
          <dl>
            <dt>Adresse</dt>
            <dd style={{ whiteSpace: 'pre-line' }}>{p.adresse}</dd>
            {p.telephone && (
              <>
                <dt>Téléphone</dt>
                <dd><a href={`tel:${p.telephone.replace(/[^0-9+]/g, '')}`}>{p.telephone}</a></dd>
              </>
            )}
            {p.email && (
              <>
                <dt>E-mail</dt>
                <dd><a href={`mailto:${p.email}`}>{p.email}</a></dd>
              </>
            )}
            {p.heures && (
              <>
                <dt>Heures d'ouverture</dt>
                <dd style={{ whiteSpace: 'pre-line' }}>{p.heures}</dd>
              </>
            )}
          </dl>
        </aside>
      </section>
    </>
  );
}
