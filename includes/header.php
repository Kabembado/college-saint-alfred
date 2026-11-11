<?php
/**
 * En-tête commun aux pages publiques.
 * Variables attendues : $titre (string), $page (clé de l'onglet actif).
 */
require_once __DIR__ . '/functions.php';

$onglets = [
    'accueil'      => ['Accueil', 'index.php'],
    'historique'   => ['Historique', 'historique.php'],
    'autorisation' => ['Autorisation', 'autorisation.php'],
    'palmares'     => ['Palmarès', 'palmares.php'],
    'enseignants'  => ['Liste des enseignants', 'enseignants.php'],
    'contact'      => ['Nous contacter', 'contact.php'],
];
$page  = $page ?? '';
$titre = $titre ?? '';
?>
<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?= e(($titre ? $titre . ' – ' : '') . param('nom_ecole')) ?></title>
    <meta name="description" content="<?= e(param('nom_ecole')) ?> : école privée (maternelle, primaire et secondaire) à la Muya, Mbujimayi, Kasaï Oriental, RDC.">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="icon" href="assets/img/logo.svg" type="image/svg+xml">
</head>
<body>
<header class="site-header">
    <div class="topbar">
        <div class="container topbar-inner">
            <span>📍 La Muya, Mbujimayi – Kasaï Oriental, RDC</span>
            <?php if (param('telephone')): ?><span>📞 <?= e(param('telephone')) ?></span><?php endif; ?>
        </div>
    </div>
    <div class="container header-inner">
        <a class="brand" href="index.php">
            <img src="assets/img/logo.svg" alt="" width="52" height="52">
            <span>
                <strong><?= e(param('nom_ecole')) ?></strong>
                <small><?= e(param('devise')) ?></small>
            </span>
        </a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="menu" aria-label="Ouvrir le menu">☰</button>
        <nav id="menu" class="nav">
            <?php foreach ($onglets as $cle => [$libelle, $lien]): ?>
                <a href="<?= e($lien) ?>" class="<?= $cle === $page ? 'active' : '' ?>"<?= $cle === $page ? ' aria-current="page"' : '' ?>><?= e($libelle) ?></a>
            <?php endforeach; ?>
        </nav>
    </div>
</header>
<main>
