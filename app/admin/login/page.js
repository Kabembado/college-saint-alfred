import { redirect } from 'next/navigation';
import { isAdmin, motDePasseConfigure } from '@/lib/auth';
import { Alertes } from '@/components/ui';
import { actionConnexion } from '../actions';

export default async function Login({ searchParams }) {
  if (await isAdmin()) redirect('/admin');
  const sp = await searchParams;
  return (
    <div className="panel login-box">
      <h2>Connexion à l'administration</h2>
      {!motDePasseConfigure() ? (
        <div className="alert alert-error">
          Aucun mot de passe n'est défini. Sur Vercel, ouvrez <strong>Settings → Environment Variables</strong>, ajoutez la
          variable <code>ADMIN_PASSWORD</code> avec le mot de passe de votre choix, puis redéployez le site.
        </div>
      ) : (
        <>
          <Alertes searchParams={sp} />
          <form action={actionConnexion} className="form">
            <label>Mot de passe
              <input type="password" name="mot_de_passe" required autoFocus autoComplete="current-password" />
            </label>
            <button className="btn btn-blue">Se connecter</button>
          </form>
        </>
      )}
      <p><a href="/">← Retour au site</a></p>
    </div>
  );
}
