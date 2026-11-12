import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE = 'csa_admin';
const DUREE_MS = 8 * 60 * 60 * 1000; // 8 heures

function cleSecrete() {
  const mdp = process.env.ADMIN_PASSWORD;
  if (!mdp) return null;
  // Changer ADMIN_PASSWORD sur Vercel déconnecte automatiquement toutes les sessions.
  return crypto
    .createHash('sha256')
    .update('csa-session:' + mdp + ':' + (process.env.SESSION_SECRET || ''))
    .digest();
}

function signer(valeur, cle) {
  return crypto.createHmac('sha256', cle).update(valeur).digest('hex');
}

function egal(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function motDePasseConfigure() {
  return !!process.env.ADMIN_PASSWORD;
}

export async function isAdmin() {
  const cle = cleSecrete();
  if (!cle) return false;
  const jeton = (await cookies()).get(COOKIE)?.value;
  if (!jeton) return false;
  const [exp, sig] = jeton.split('.');
  if (!exp || !sig || Date.now() > Number(exp)) return false;
  return egal(sig, signer(exp, cle));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login');
}

/** Vérifie le mot de passe et ouvre la session. */
export async function connecter(motDePasse) {
  const cle = cleSecrete();
  if (!cle || !egal(motDePasse, process.env.ADMIN_PASSWORD)) return false;
  const exp = String(Date.now() + DUREE_MS);
  (await cookies()).set(COOKIE, `${exp}.${signer(exp, cle)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DUREE_MS / 1000,
  });
  return true;
}

export async function deconnecter() {
  (await cookies()).delete(COOKIE);
}
