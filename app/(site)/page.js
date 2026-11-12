import Link from 'next/link';
import { getParams, lire } from '@/lib/db';
import { STRUCTURE } from '@/lib/structure';

export default async function Accueil() {
  const p = await getParams();
  const [compte] = await lire((sql) => sql`SELECT COUNT(*)::int AS n FROM enseignants`);
  const nbEnseignants = compte?.n || 0;
  const s = STRUCTURE;

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Bienvenue au {p.nom_ecole}</h1>
          <p className="lead">
            École privée de la commune de la Muya, à Mbujimayi (Kasaï Oriental, RDC). Nous accompagnons vos enfants de
            la maternelle jusqu'aux humanités.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-gold" href="/contact">Inscrire mon enfant</Link>
            <Link className="btn btn-outline" href="/historique">Découvrir l'école</Link>
          </div>
        </div>
      </section>

      <section className="container stats">
        <div className="stat"><strong>3</strong><span>Sections</span></div>
        <div className="stat"><strong>{s.secondaire.options.length}</strong><span>Options aux humanités</span></div>
        <div className="stat"><strong>{nbEnseignants || '—'}</strong><span>Enseignants</span></div>
      </section>

      <section className="container section">
        <h2 className="section-title">Nos sections</h2>
        <div className="cards">
          {['maternelle', 'primaire'].map((k) => (
            <article className="card" key={k}>
              <div className="card-icon">{s[k].icone}</div>
              <h3>{s[k].titre}</h3>
              <ul className="pill-list">
                {s[k].classes.map((c) => <li key={c}>{c}</li>)}
              </ul>
            </article>
          ))}
          <article className="card">
            <div className="card-icon">{s.secondaire.icone}</div>
            <h3>{s.secondaire.titre}</h3>
            <p className="muted">Éducation de base</p>
            <ul className="pill-list">
              {s.secondaire.classes.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <p className="muted">Humanités : {s.secondaire.niveauxOptions.join(', ')} année dans chaque option</p>
          </article>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="section-title">Options du cycle secondaire (Humanités)</h2>
          <div className="options-grid">
            {s.secondaire.options.map((o) => (
              <div className="option" key={o.nom}>
                <span className="option-icon">{o.icone}</span>
                <strong>{o.nom}</strong>
                <small>{s.secondaire.niveauxOptions.join(' · ')}</small>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container section">
        <div className="cta">
          <div>
            <h2>Inscriptions ouvertes</h2>
            <p>Pour toute information sur les inscriptions, les frais scolaires ou les options, contactez la direction.</p>
          </div>
          <Link className="btn btn-gold" href="/contact">Nous contacter</Link>
        </div>
      </section>
    </>
  );
}
