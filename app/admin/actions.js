'use server';
import crypto from 'node:crypto';
import { redirect } from 'next/navigation';
import { put, del } from '@vercel/blob';
import { db, CLES_PARAMETRES } from '@/lib/db';
import { connecter, deconnecter, requireAdmin } from '@/lib/auth';
import { SECTIONS_PERSONNEL, EXAMENS } from '@/lib/structure';
import { texte } from '@/lib/format';

function retour(chemin, type, message) {
  const sep = chemin.includes('?') ? '&' : '?';
  redirect(`${chemin}${sep}${type}=${encodeURIComponent(message)}`);
}

const entier = (fd, k) => {
  const n = parseInt(String(fd.get(k) ?? ''), 10);
  return Number.isFinite(n) ? n : 0;
};
const idDe = (fd) => entier(fd, 'id');

/* ---------- Connexion ---------- */

export async function actionConnexion(formData) {
  const ok = await connecter(String(formData.get('mot_de_passe') ?? ''));
  if (!ok) {
    await new Promise((r) => setTimeout(r, 1000)); // ralentit les essais répétés
    retour('/admin/login', 'err', 'Mot de passe incorrect.');
  }
  redirect('/admin');
}

export async function actionDeconnexion() {
  await deconnecter();
  redirect('/admin/login');
}

/* ---------- Paramètres ---------- */

export async function actionParametres(formData) {
  await requireAdmin();
  const sql = await db();
  for (const cle of CLES_PARAMETRES) {
    if (formData.has(cle)) {
      const valeur = texte(formData, cle, 20000);
      await sql`INSERT INTO parametres (cle, valeur) VALUES (${cle}, ${valeur})
                ON CONFLICT (cle) DO UPDATE SET valeur = EXCLUDED.valeur`;
    }
  }
  retour('/admin/parametres', 'ok', 'Paramètres enregistrés.');
}

/* ---------- Enseignants ---------- */

const TYPES_IMAGES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

function signatureImageValide(buf, type) {
  if (type === 'image/jpeg') return buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
  if (type === 'image/png') return buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (type === 'image/webp') return buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP';
  return false;
}

/** Envoie la photo vers Vercel Blob ; retourne son URL, '' si aucune, ou lève une erreur lisible. */
async function enregistrerPhoto(fichier) {
  if (!fichier || typeof fichier === 'string' || fichier.size === 0) return '';
  if (fichier.size > 2 * 1024 * 1024) throw new Error('Photo trop lourde (2 Mo maximum).');
  const ext = TYPES_IMAGES[fichier.type];
  const buf = Buffer.from(await fichier.arrayBuffer());
  if (!ext || !signatureImageValide(buf, fichier.type)) throw new Error('Formats de photo acceptés : JPG, PNG ou WEBP.');
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("Stockage des photos non activé : créez un « Blob store » dans l'onglet Storage de Vercel.");
  }
  const nom = `enseignants/${crypto.randomBytes(12).toString('hex')}.${ext}`;
  const blob = await put(nom, buf, { access: 'public', contentType: fichier.type });
  return blob.url;
}

async function supprimerPhoto(url) {
  if (url && process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await del(url);
    } catch {
      /* photo déjà absente */
    }
  }
}

export async function actionEnseignant(formData) {
  await requireAdmin();
  const sql = await db();
  const id = idDe(formData);
  const d = {
    nom: texte(formData, 'nom', 100),
    postnom: texte(formData, 'postnom', 100),
    prenom: texte(formData, 'prenom', 100),
    sexe: ['M', 'F'].includes(texte(formData, 'sexe')) ? texte(formData, 'sexe') : '',
    section: SECTIONS_PERSONNEL.includes(texte(formData, 'section')) ? texte(formData, 'section') : 'secondaire',
    fonction: texte(formData, 'fonction', 100) || 'Enseignant(e)',
    classe_cours: texte(formData, 'classe_cours', 200),
    qualification: texte(formData, 'qualification', 100),
    ordre: entier(formData, 'ordre'),
  };
  const page = '/admin/enseignants' + (id ? `?edit=${id}` : '');
  if (!d.nom) retour(page, 'err', 'Le nom est obligatoire.');

  let photo = '';
  let avertissement = '';
  try {
    photo = await enregistrerPhoto(formData.get('photo'));
  } catch (e) {
    avertissement = ' (Photo non enregistrée : ' + e.message + ')';
  }

  if (id) {
    const [ancien] = await sql`SELECT photo FROM enseignants WHERE id = ${id}`;
    if (!ancien) retour('/admin/enseignants', 'err', 'Enseignant introuvable.');
    if (photo || formData.get('retirer_photo')) {
      await supprimerPhoto(ancien.photo);
      d.photo = photo;
    }
    await sql`UPDATE enseignants SET ${sql(d)} WHERE id = ${id}`;
    retour('/admin/enseignants', avertissement ? 'err' : 'ok', 'Enseignant modifié.' + avertissement);
  } else {
    d.photo = photo;
    await sql`INSERT INTO enseignants ${sql(d)}`;
    retour('/admin/enseignants', avertissement ? 'err' : 'ok', 'Enseignant ajouté.' + avertissement);
  }
}

export async function actionSupprimerEnseignant(formData) {
  await requireAdmin();
  const sql = await db();
  const [t] = await sql`DELETE FROM enseignants WHERE id = ${idDe(formData)} RETURNING photo`;
  if (t) await supprimerPhoto(t.photo);
  retour('/admin/enseignants', 'ok', 'Enseignant supprimé.');
}

/* ---------- Palmarès ---------- */

function anneeScolaire(formData) {
  const a = texte(formData, 'annee_scolaire', 20);
  const m = a.match(/^(\d{4})\s*[-–/]\s*(\d{4})$/);
  return m ? `${m[1]}-${m[2]}` : null;
}

export async function actionResultat(formData) {
  await requireAdmin();
  const annee = anneeScolaire(formData);
  if (!annee) retour('/admin/palmares', 'err', "L'année scolaire doit être au format 2024-2025.");
  const inscrits = Math.max(0, entier(formData, 'inscrits'));
  const reussis = Math.max(0, entier(formData, 'reussis'));
  if (reussis > inscrits) retour('/admin/palmares', 'err', "Le nombre de réussis ne peut pas dépasser le nombre d'inscrits.");
  const examen = EXAMENS.includes(texte(formData, 'examen')) ? texte(formData, 'examen') : EXAMENS[0];
  const sql = await db();
  await sql`INSERT INTO resultats (annee_scolaire, examen, classe_option, inscrits, reussis)
            VALUES (${annee}, ${examen}, ${texte(formData, 'classe_option', 200)}, ${inscrits}, ${reussis})`;
  retour('/admin/palmares', 'ok', 'Résultat ajouté.');
}

export async function actionLaureat(formData) {
  await requireAdmin();
  const annee = anneeScolaire(formData);
  if (!annee) retour('/admin/palmares', 'err', "L'année scolaire doit être au format 2024-2025.");
  const nom = texte(formData, 'nom_complet', 200);
  if (!nom) retour('/admin/palmares', 'err', 'Le nom du lauréat est obligatoire.');
  const brut = texte(formData, 'pourcentage', 10).replace(',', '.');
  const pct = brut === '' || !Number.isFinite(Number(brut)) ? null : Math.min(100, Math.max(0, Number(brut)));
  const sql = await db();
  await sql`INSERT INTO laureats (annee_scolaire, nom_complet, classe_option, pourcentage, distinction)
            VALUES (${annee}, ${nom}, ${texte(formData, 'classe_option', 200)}, ${pct}, ${texte(formData, 'distinction', 300)})`;
  retour('/admin/palmares', 'ok', 'Lauréat ajouté.');
}

export async function actionSupprimerResultat(formData) {
  await requireAdmin();
  const sql = await db();
  await sql`DELETE FROM resultats WHERE id = ${idDe(formData)}`;
  retour('/admin/palmares', 'ok', 'Résultat supprimé.');
}

export async function actionSupprimerLaureat(formData) {
  await requireAdmin();
  const sql = await db();
  await sql`DELETE FROM laureats WHERE id = ${idDe(formData)}`;
  retour('/admin/palmares', 'ok', 'Lauréat supprimé.');
}

/* ---------- Autorisations ---------- */

export async function actionAutorisation(formData) {
  await requireAdmin();
  const id = idDe(formData);
  const d = {
    intitule: texte(formData, 'intitule', 300),
    reference: texte(formData, 'reference', 200),
    date_doc: texte(formData, 'date_doc', 50),
    autorite: texte(formData, 'autorite', 200),
    objet: texte(formData, 'objet', 2000),
    ordre: entier(formData, 'ordre'),
  };
  if (!d.intitule) retour('/admin/autorisations' + (id ? `?edit=${id}` : ''), 'err', "L'intitulé est obligatoire.");
  const sql = await db();
  if (id) {
    await sql`UPDATE autorisations SET ${sql(d)} WHERE id = ${id}`;
    retour('/admin/autorisations', 'ok', 'Document modifié.');
  }
  await sql`INSERT INTO autorisations ${sql(d)}`;
  retour('/admin/autorisations', 'ok', 'Document ajouté.');
}

export async function actionSupprimerAutorisation(formData) {
  await requireAdmin();
  const sql = await db();
  await sql`DELETE FROM autorisations WHERE id = ${idDe(formData)}`;
  retour('/admin/autorisations', 'ok', 'Document supprimé.');
}

/* ---------- Messages ---------- */

export async function actionBasculerLu(formData) {
  await requireAdmin();
  const sql = await db();
  await sql`UPDATE messages SET lu = NOT lu WHERE id = ${idDe(formData)}`;
  redirect('/admin/messages');
}

export async function actionSupprimerMessage(formData) {
  await requireAdmin();
  const sql = await db();
  await sql`DELETE FROM messages WHERE id = ${idDe(formData)}`;
  retour('/admin/messages', 'ok', 'Message supprimé.');
}
