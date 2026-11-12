import { paragraphes } from '@/lib/format';

export function Paragraphes({ texte }) {
  return paragraphes(texte).map((p, i) => (
    <p key={i} style={{ whiteSpace: 'pre-line' }}>
      {p}
    </p>
  ));
}

export function PageHead({ titre, sousTitre }) {
  return (
    <section className="page-head">
      <div className="container">
        <h1>{titre}</h1>
        {sousTitre && <p>{sousTitre}</p>}
      </div>
    </section>
  );
}

/** Messages de confirmation / d'erreur transmis par l'URL (?ok=… / ?err=…). */
export function Alertes({ searchParams }) {
  const ok = typeof searchParams?.ok === 'string' ? searchParams.ok : '';
  const err = typeof searchParams?.err === 'string' ? searchParams.err : '';
  return (
    <>
      {ok && <div className="alert alert-success">{ok}</div>}
      {err && <div className="alert alert-error">{err}</div>}
    </>
  );
}

export function BaseManquante() {
  return (
    <div className="alert alert-error">
      La base de données n'est pas encore branchée. Sur Vercel : <strong>Storage → Create Database → Neon</strong>, puis
      connectez-la au projet et redéployez (voir le fichier README).
    </div>
  );
}
