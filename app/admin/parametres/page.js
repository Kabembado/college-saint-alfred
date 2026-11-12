import { requireAdmin } from '@/lib/auth';
import { baseConfiguree, getParams } from '@/lib/db';
import { Alertes, BaseManquante } from '@/components/ui';
import { actionParametres } from '../actions';

const CHAMPS = [
  ['nom_ecole', "Nom de l'école", 'text'],
  ['devise', 'Devise', 'text'],
  ['annee_creation', 'Année de création', 'text'],
  ['promoteur', 'Promoteur / Fondateur', 'text'],
  ['prefet', "Chef d'établissement (Préfet / Directeur)", 'text'],
  ['telephone', 'Téléphone', 'text'],
  ['email', 'E-mail', 'email'],
  ['adresse', 'Adresse', 'textarea'],
  ['heures', "Heures d'ouverture", 'textarea'],
  ['historique', 'Texte de la page « Historique »', 'big'],
  ['autorisation_intro', "Texte d'introduction de la page « Autorisation »", 'big'],
];

export default async function Parametres({ searchParams }) {
  await requireAdmin();
  if (!baseConfiguree()) return <BaseManquante />;
  const p = await getParams();
  return (
    <>
      <h1>Textes & coordonnées</h1>
      <Alertes searchParams={await searchParams} />
      <form action={actionParametres} className="form panel">
        {CHAMPS.map(([cle, lib, type]) => (
          <label key={cle}>{lib}
            {type === 'text' || type === 'email' ? (
              <input type={type} name={cle} defaultValue={p[cle]} />
            ) : (
              <>
                <textarea name={cle} rows={type === 'big' ? 12 : 3} defaultValue={p[cle]} />
                {type === 'big' && <span className="hint">Laissez une ligne vide entre deux paragraphes.</span>}
              </>
            )}
          </label>
        ))}
        <p className="hint">Le mot de passe administrateur se change sur Vercel (variable <code>ADMIN_PASSWORD</code>).</p>
        <button className="btn btn-blue">Enregistrer</button>
      </form>
    </>
  );
}
