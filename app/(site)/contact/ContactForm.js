'use client';
import { useActionState } from 'react';
import { envoyerMessage } from './actions';

const SUJETS = ['Inscription', 'Frais scolaires', 'Résultats / bulletins', 'Recrutement', 'Autre'];

export default function ContactForm() {
  const [etat, action, envoi] = useActionState(envoyerMessage, { ok: false, erreurs: [], valeurs: {} });
  const v = etat.valeurs || {};

  if (etat.ok) {
    return (
      <div className="alert alert-success">
        Merci ! Votre message a bien été envoyé. La direction vous répondra dans les meilleurs délais.
      </div>
    );
  }

  return (
    <>
      {etat.erreurs.length > 0 && (
        <div className="alert alert-error">
          <ul>{etat.erreurs.map((e) => <li key={e}>{e}</li>)}</ul>
        </div>
      )}
      <form action={action} className="form">
        <div className="hp" aria-hidden="true">
          <label>Site web <input type="text" name="site_web" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <label>Nom complet *
          <input type="text" name="nom" required maxLength={200} defaultValue={v.nom} />
        </label>
        <div className="row">
          <label>Téléphone
            <input type="tel" name="telephone" maxLength={100} placeholder="+243 …" defaultValue={v.telephone} />
          </label>
          <label>E-mail
            <input type="email" name="email" maxLength={200} defaultValue={v.email} />
          </label>
        </div>
        <label>Sujet
          <select name="sujet" defaultValue={v.sujet || SUJETS[0]}>
            {SUJETS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label>Message *
          <textarea name="message" rows={6} required maxLength={5000} defaultValue={v.message} />
        </label>
        <button className="btn btn-gold" type="submit" disabled={envoi}>
          {envoi ? 'Envoi en cours…' : 'Envoyer le message'}
        </button>
      </form>
    </>
  );
}
