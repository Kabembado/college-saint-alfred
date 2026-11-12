<?php
require_once __DIR__ . '/../includes/functions.php';

function admin_header(string $titre, string $actif = ''): void
{
    $liens = [
        'index'         => ['Tableau de bord', 'index.php'],
        'enseignants'   => ['Enseignants', 'enseignants.php'],
        'palmares'      => ['Palmarès', 'palmares.php'],
        'autorisations' => ['Autorisations', 'autorisations.php'],
        'messages'      => ['Messages', 'messages.php'],
        'parametres'    => ['Textes & coordonnées', 'parametres.php'],
    ];
    ?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title><?= e($titre) ?> – Administration</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="icon" href="../assets/img/logo.svg" type="image/svg+xml">
</head>
<body class="admin-body">
<?php if (is_admin()): ?>
<div class="admin-bar">
    <div class="container">
        <strong>⚙️ <?= e(param('nom_ecole')) ?> – Administration</strong>
        <?php foreach ($liens as $cle => [$lib, $url]): ?>
            <a href="<?= e($url) ?>" class="<?= $cle === $actif ? 'active' : '' ?>"><?= e($lib) ?></a>
        <?php endforeach; ?>
        <a href="../index.php" target="_blank">Voir le site ↗</a>
        <a href="logout.php">Déconnexion</a>
    </div>
</div>
<?php endif; ?>
<main class="admin-main container">
    <?= flashes() ?>
    <?php
}

function admin_footer(): void
{
    ?>
</main>
<script src="../assets/js/main.js"></script>
</body>
</html>
    <?php
}

/** Bouton de suppression protégé par CSRF. */
function delete_button(int $id, string $label = 'Supprimer'): string
{
    return '<form method="post" data-confirm="Confirmer la suppression ?">' . csrf_field()
        . '<input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="' . $id . '">'
        . '<button class="btn btn-danger btn-small">' . e($label) . '</button></form>';
}
