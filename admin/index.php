<?php
require_once __DIR__ . '/_layout.php';
require_admin();

$db = db();
$compte = fn(string $sql) => (int) $db->query($sql)->fetchColumn();
$tuiles = [
    ['enseignants.php', $compte('SELECT COUNT(*) FROM enseignants'), 'Enseignants'],
    ['palmares.php', $compte('SELECT COUNT(*) FROM resultats'), 'Résultats d\'examens'],
    ['palmares.php', $compte('SELECT COUNT(*) FROM laureats'), 'Lauréats'],
    ['autorisations.php', $compte('SELECT COUNT(*) FROM autorisations'), 'Documents d\'autorisation'],
    ['messages.php', $compte('SELECT COUNT(*) FROM messages WHERE lu = 0'), 'Messages non lus'],
];

admin_header('Tableau de bord', 'index');
?>
<h1>Tableau de bord</h1>
<div class="dash">
    <?php foreach ($tuiles as [$url, $n, $lib]): ?>
        <a href="<?= e($url) ?>"><strong><?= $n ?></strong><span><?= e($lib) ?></span></a>
    <?php endforeach; ?>
</div>
<div class="panel">
    <h2>Que voulez-vous faire ?</h2>
    <ul>
        <li><a href="parametres.php">Modifier l'historique, le texte d'autorisation, le téléphone, l'e-mail…</a></li>
        <li><a href="enseignants.php">Ajouter ou modifier un enseignant</a></li>
        <li><a href="palmares.php">Publier les résultats d'examens et les lauréats</a></li>
        <li><a href="autorisations.php">Ajouter les références des arrêtés / agréments</a></li>
        <li><a href="messages.php">Lire les messages reçus via « Nous contacter »</a></li>
    </ul>
</div>
<?php admin_footer(); ?>
