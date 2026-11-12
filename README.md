# Site web du Collège Saint Alfred

Site dynamique de l'école privée **Collège Saint Alfred**, commune de la Muya, Mbujimayi, Kasaï Oriental (RDC).
Conçu pour être hébergé gratuitement sur **Vercel** (Next.js + base de données Neon/Postgres + Vercel Blob pour les photos).

## Onglets du site

| Onglet | Adresse | Contenu |
|---|---|---|
| Accueil | `/` | Présentation, sections (maternelle, primaire, secondaire) et les 6 options |
| Historique | `/historique` | Histoire de l'école (texte modifiable) |
| Autorisation | `/autorisation` | Arrêtés / agréments officiels |
| Palmarès | `/palmares` | Résultats ENAFEP, TENASOSP, Examen d'État et lauréats, par année scolaire |
| Liste des enseignants | `/enseignants` | Personnel par section, avec photo |
| Nous contacter | `/contact` | Coordonnées + formulaire (messages lus dans l'administration) |
| Administration | `/admin` | Gestion de tout le contenu |

---

## Mettre le site en ligne sur Vercel (pas à pas)

### 1. Importer le projet
1. Allez sur **https://vercel.com** et cliquez sur **Sign Up** → **Continue with GitHub**.
2. Cliquez sur **Add New… → Project**.
3. Choisissez le dépôt **college-saint-alfred** → **Import**.
4. Vercel reconnaît automatiquement **Next.js**. Ne changez rien et cliquez sur **Deploy**.
   *(Si le code se trouve sur une autre branche que `main`, fusionnez-la d'abord dans `main` sur GitHub.)*

Le site s'affiche déjà, mais sans base de données : passez aux étapes suivantes.

### 2. Ajouter la base de données (gratuit)
1. Dans votre projet Vercel, ouvrez l'onglet **Storage**.
2. **Create Database** → choisissez **Neon** (Serverless Postgres) → acceptez l'offre gratuite → **Create**.
3. Quand Vercel le demande, **connectez la base au projet** (cochez *Production*, *Preview*, *Development*).
   La variable `DATABASE_URL` est ajoutée automatiquement. Les tables sont créées toutes seules à la première visite.

### 3. Ajouter le stockage des photos (gratuit)
1. Toujours dans **Storage** → **Create** → **Blob** → donnez un nom (ex. `photos-csa`) → **Create**.
2. Connectez-le au projet. La variable `BLOB_READ_WRITE_TOKEN` est ajoutée automatiquement.

### 4. Choisir le mot de passe de l'administration
1. **Settings → Environment Variables**.
2. Ajoutez : **Key** = `ADMIN_PASSWORD`, **Value** = votre mot de passe (au moins 12 caractères, gardez-le secret).
3. **Save**.

### 5. Redéployer
Onglet **Deployments** → les **⋯** du dernier déploiement → **Redeploy**.
(Nécessaire pour que les nouvelles variables soient prises en compte.)

### 6. Utiliser le site
- Le site est accessible à l'adresse donnée par Vercel (ex. `college-saint-alfred.vercel.app`).
- L'administration : ajoutez `/admin` à l'adresse, puis entrez le mot de passe.
- Pour un nom de domaine personnalisé (ex. `collegesaintalfred.com`) : **Settings → Domains**.

### Changer le mot de passe
Modifiez `ADMIN_PASSWORD` dans **Settings → Environment Variables**, puis redéployez.
Toutes les sessions ouvertes sont alors déconnectées.

---

## Variables d'environnement

| Variable | Origine | Rôle |
|---|---|---|
| `DATABASE_URL` | Ajoutée par Neon | Connexion à la base Postgres (`POSTGRES_URL` est aussi acceptée) |
| `BLOB_READ_WRITE_TOKEN` | Ajoutée par Vercel Blob | Envoi des photos des enseignants |
| `ADMIN_PASSWORD` | À créer vous-même | Mot de passe de l'administration |
| `SESSION_SECRET` | Facultatif | Chaîne aléatoire supplémentaire pour signer les sessions |

## Tester sur son ordinateur (facultatif)

Prérequis : Node.js 20 ou plus récent.

```bash
npm install
# Créez un fichier .env.local avec DATABASE_URL=… et ADMIN_PASSWORD=…
npm run dev
```
puis ouvrez http://localhost:3000

## Modifier les classes et options

La liste des classes et des options est dans `lib/structure.js`.
