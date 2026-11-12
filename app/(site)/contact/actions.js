'use server';
import { db, baseConfiguree } from '@/lib/db';
import { texte } from '@/lib/format';

export async function envoyerMessage(_etat, formData) {
  const v = {
    nom: texte(formData, 'nom', 200),
    telephone: texte(formData, 'telephone', 100),
    email: texte(formData, 'email', 200),
    sujet: texte(formData, 'sujet', 100),
    message: texte(formData, 'message', 5000),
  };
  const erreurs = [];
  if (texte(formData, 'site_web') !== '') erreurs.push('Envoi refusé.'); // piège à robots
  if (!v.nom) erreurs.push('Veuillez indiquer votre nom.');
  if (!v.telephone && !v.email) erreurs.push('Indiquez au moins un numéro de téléphone ou une adresse e-mail.');
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) erreurs.push("L'adresse e-mail n'est pas valide.");
  if (v.message.length < 5) erreurs.push('Veuillez écrire votre message.');
  if (!baseConfiguree()) erreurs.push("Le formulaire n'est pas encore activé. Merci de nous appeler directement.");
  if (erreurs.length) return { ok: false, erreurs, valeurs: v };

  const sql = await db();
  await sql`INSERT INTO messages (nom, telephone, email, sujet, message)
            VALUES (${v.nom}, ${v.telephone}, ${v.email}, ${v.sujet}, ${v.message})`;
  return { ok: true, erreurs: [], valeurs: {} };
}
