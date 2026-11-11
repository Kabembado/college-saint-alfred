<?php
require_once __DIR__ . '/config.php';

/**
 * Retourne la connexion PDO (SQLite) et crée le schéma au premier appel.
 */
function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $dir = dirname(DB_PATH);
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }

    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $pdo->exec('PRAGMA foreign_keys = ON');

    init_schema($pdo);
    return $pdo;
}

function init_schema(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS parametres (
            cle    TEXT PRIMARY KEY,
            valeur TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS enseignants (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
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
            cree_le       TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS resultats (
            id             INTEGER PRIMARY KEY AUTOINCREMENT,
            annee_scolaire TEXT NOT NULL,
            examen         TEXT NOT NULL,
            classe_option  TEXT NOT NULL DEFAULT '',
            inscrits       INTEGER NOT NULL DEFAULT 0,
            reussis        INTEGER NOT NULL DEFAULT 0,
            cree_le        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS laureats (
            id             INTEGER PRIMARY KEY AUTOINCREMENT,
            annee_scolaire TEXT NOT NULL,
            nom_complet    TEXT NOT NULL,
            classe_option  TEXT NOT NULL DEFAULT '',
            pourcentage    REAL,
            distinction    TEXT NOT NULL DEFAULT '',
            cree_le        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS autorisations (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            intitule  TEXT NOT NULL,
            reference TEXT NOT NULL DEFAULT '',
            date_doc  TEXT NOT NULL DEFAULT '',
            autorite  TEXT NOT NULL DEFAULT '',
            objet     TEXT NOT NULL DEFAULT '',
            ordre     INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS messages (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            nom       TEXT NOT NULL,
            telephone TEXT NOT NULL DEFAULT '',
            email     TEXT NOT NULL DEFAULT '',
            sujet     TEXT NOT NULL DEFAULT '',
            message   TEXT NOT NULL,
            lu        INTEGER NOT NULL DEFAULT 0,
            recu_le   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
    ");

    // Valeurs par défaut des paramètres (n'écrase jamais une valeur existante).
    $defaults = [
        'nom_ecole'     => 'Collège Saint Alfred',
        'devise'        => 'Discipline – Travail – Excellence',
        'adresse'       => 'Commune de la Muya, Ville de Mbujimayi, Province du Kasaï Oriental, République Démocratique du Congo',
        'telephone'     => '',
        'email'         => '',
        'heures'        => "Lundi – Vendredi : 7h30 – 15h00\nSamedi : 8h00 – 12h00",
        'promoteur'     => '',
        'prefet'        => '',
        'annee_creation'=> '',
        'historique'    => "Le Collège Saint Alfred est une école privée agréée qui œuvre dans la commune de la Muya, à Mbujimayi, dans la province du Kasaï Oriental.\n\nDepuis sa création, l'établissement s'est donné pour mission d'offrir aux enfants et aux jeunes une éducation de qualité, fondée sur la discipline, le travail et les valeurs morales.\n\nL'école organise aujourd'hui trois sections : la maternelle, le primaire et le secondaire, avec six options techniques et générales au cycle des humanités.\n\n(Ce texte est modifiable depuis l'espace d'administration : ajoutez-y la date de création, le nom du fondateur et les grandes étapes de l'école.)",
        'autorisation_intro' => "Le Collège Saint Alfred est un établissement d'enseignement privé fonctionnant conformément à la législation scolaire de la République Démocratique du Congo. Les documents officiels autorisant son fonctionnement sont repris ci-dessous.",
        'admin_password_hash' => '',
    ];
    $stmt = $pdo->prepare('INSERT OR IGNORE INTO parametres (cle, valeur) VALUES (?, ?)');
    foreach ($defaults as $k => $v) {
        $stmt->execute([$k, $v]);
    }
}
