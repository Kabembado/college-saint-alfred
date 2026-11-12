import 'server-only';
import postgres from 'postgres';

const DEFAUTS = {
  nom_ecole: 'Collège Saint Alfred',
  devise: 'Discipline – Travail – Excellence',
  adresse:
    'Commune de la Muya, Ville de Mbujimayi, Province du Kasaï Oriental, République Démocratique du Congo',
  telephone: '',
  email: '',
  heures: 'Lundi – Vendredi : 7h30 – 15h00\nSamedi : 8h00 – 12h00',
  promoteur: '',
  prefet: '',
  annee_creation: '',
  historique:
    "Le Collège Saint Alfred est une école privée qui œuvre dans la commune de la Muya, à Mbujimayi, dans la province du Kasaï Oriental.\n\n" +
    "Depuis sa création, l'établissement s'est donné pour mission d'offrir aux enfants et aux jeunes une éducation de qualité, fondée sur la discipline, le travail et les valeurs morales.\n\n" +
    "L'école organise aujourd'hui trois sections : la maternelle, le primaire et le secondaire, avec six options au cycle des humanités.\n\n" +
    "(Ce texte est modifiable depuis l'espace d'administration : ajoutez-y la date de création, le nom du fondateur et les grandes étapes de l'école.)",
  autorisation_intro:
    "Le Collège Saint Alfred est un établissement d'enseignement privé fonctionnant conformément à la législation scolaire de la République Démocratique du Congo. Les documents officiels autorisant son fonctionnement sont repris ci-dessous.",
};

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS parametres (
    cle    TEXT PRIMARY KEY,
    valeur TEXT NOT NULL DEFAULT ''
  );
  CREATE TABLE IF NOT EXISTS enseignants (
    id            SERIAL PRIMARY KEY,
    nom           TEXT NOT NULL,
    postnom       TEXT NOT NULL DEFAULT '',
    prenom        TEXT NOT NULL DEFAULT '',
    sexe          TEXT NOT NULL DEFAULT '',
    section       TEXT NOT NULL,
    fonction      TEXT NOT NULL DEFAULT 'Enseignant(e)',
    classe_cours  TEXT NOT NULL DEFAULT '',
    qualification TEXT NOT NULL DEFAULT '',
    photo         TEXT NOT NULL DEFAULT '',
    ordre         INTEGER NOT NULL DEFAULT 0,
    cree_le       TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS resultats (
    id             SERIAL PRIMARY KEY,
    annee_scolaire TEXT NOT NULL,
    examen         TEXT NOT NULL,
    classe_option  TEXT NOT NULL DEFAULT '',
    inscrits       INTEGER NOT NULL DEFAULT 0,
    reussis        INTEGER NOT NULL DEFAULT 0,
    cree_le        TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS laureats (
    id             SERIAL PRIMARY KEY,
    annee_scolaire TEXT NOT NULL,
    nom_complet    TEXT NOT NULL,
    classe_option  TEXT NOT NULL DEFAULT '',
    pourcentage    REAL,
    distinction    TEXT NOT NULL DEFAULT '',
    cree_le        TIMESTAMPTZ NOT NULL DEFAULT now()
  );
  CREATE TABLE IF NOT EXISTS autorisations (
    id        SERIAL PRIMARY KEY,
    intitule  TEXT NOT NULL,
    reference TEXT NOT NULL DEFAULT '',
    date_doc  TEXT NOT NULL DEFAULT '',
    autorite  TEXT NOT NULL DEFAULT '',
    objet     TEXT NOT NULL DEFAULT '',
    ordre     INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS messages (
    id        SERIAL PRIMARY KEY,
    nom       TEXT NOT NULL,
    telephone TEXT NOT NULL DEFAULT '',
    email     TEXT NOT NULL DEFAULT '',
    sujet     TEXT NOT NULL DEFAULT '',
    message   TEXT NOT NULL,
    lu        BOOLEAN NOT NULL DEFAULT false,
    recu_le   TIMESTAMPTZ NOT NULL DEFAULT now()
  );
`;

function connexionUrl() {
  // Neon (intégration Vercel) fournit DATABASE_URL ; on accepte aussi POSTGRES_URL.
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
}

export function baseConfiguree() {
  return connexionUrl() !== '';
}

const g = globalThis;

async function initialiser(sql) {
  await sql.unsafe(SCHEMA);
  for (const [cle, valeur] of Object.entries(DEFAUTS)) {
    await sql`INSERT INTO parametres (cle, valeur) VALUES (${cle}, ${valeur}) ON CONFLICT (cle) DO NOTHING`;
  }
}

/** Retourne le client SQL, après avoir créé les tables si nécessaire. */
export async function db() {
  const url = connexionUrl();
  if (!url) {
    throw new Error(
      "Base de données non configurée : ajoutez une base Neon (Postgres) au projet Vercel, ou définissez DATABASE_URL."
    );
  }
  if (!g.__csaSql) {
    g.__csaSql = postgres(url, { max: 1, prepare: false, idle_timeout: 20 });
  }
  if (!g.__csaReady) {
    g.__csaReady = initialiser(g.__csaSql).catch((err) => {
      g.__csaReady = null; // réessaiera au prochain appel
      throw err;
    });
  }
  await g.__csaReady;
  return g.__csaSql;
}

/** Paramètres du site (textes, coordonnées). Valeurs par défaut si la base est absente. */
export async function getParams() {
  if (!baseConfiguree()) return { ...DEFAUTS };
  const sql = await db();
  const rows = await sql`SELECT cle, valeur FROM parametres`;
  const p = { ...DEFAUTS };
  for (const r of rows) p[r.cle] = r.valeur;
  return p;
}

export const CLES_PARAMETRES = Object.keys(DEFAUTS);

/** Exécute une lecture ; renvoie [] si la base n'est pas encore configurée. */
export async function lire(fn) {
  if (!baseConfiguree()) return [];
  const sql = await db();
  return fn(sql);
}
