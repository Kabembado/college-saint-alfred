<?php
/**
 * Configuration générale du site du Collège Saint Alfred.
 */

// Chemin de la base de données SQLite (créée automatiquement au premier lancement).
define('DB_PATH', __DIR__ . '/../data/college.sqlite');

// Dossier de stockage des photos des enseignants.
define('UPLOAD_DIR', __DIR__ . '/../uploads/enseignants');
define('UPLOAD_URL', 'uploads/enseignants');
define('UPLOAD_MAX_BYTES', 2 * 1024 * 1024); // 2 Mo

// Fuseau horaire de Mbujimayi (RDC).
date_default_timezone_set('Africa/Lubumbashi');

// Sessions sécurisées.
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
        'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_start();
}
