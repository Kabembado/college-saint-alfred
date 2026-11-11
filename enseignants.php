<?php
$page  = 'enseignants';
$titre = 'Liste des enseignants';
require __DIR__ . '/includes/header.php';

$sections = ['direction', 'maternelle', 'primaire', 'secondaire'];
$filtre = $_GET['section'] ?? '';
if (!in_array($filtre, $sections, true)) {
    $filtre = '';
}

if ($filtre) {
    $stmt = db()->prepare('SELECT * FROM enseignants WHERE section = ? ORDER BY ordre, nom');
    $stmt->execute([$filtre]);
} else {
    $stmt = db()->query("SELECT * FROM enseignants ORDER BY
        CASE section WHEN 'direction' THEN 0 WHEN 'maternelle' THEN 1 WHEN 'primaire' THEN 2 ELSE 3 END, ordre, nom");
}
$liste = $stmt->fetchAll();

$groupes = [];
foreach ($liste as $ens) {
    $groupes[$ens['section']][] = $ens;
}
?>
<section class="page-head">
    <div class="container">
        <h1>Liste des enseignants</h1>
        <p>Le personnel éducatif du <?= e(param('nom_ecole')) ?></p>
    </div>
</section>

<section class="container section">
    <div class="tabs" role="tablist">
        <a href="enseignants.php" class="<?= $filtre === '' ? 'active' : '' ?>">Tous</a>
        <?php foreach ($sections as $sec): ?>
            <a href="?section=<?= e($sec) ?>" class="<?= $filtre === $sec ? 'active' : '' ?>"><?= e(section_label($sec)) ?></a>
        <?php endforeach; ?>
    </div>

    <?php if (!$liste): ?>
        <div class="empty">Aucun enseignant n'est encore enregistré pour cette section.</div>
    <?php endif; ?>

    <?php foreach ($groupes as $sec => $membres): ?>
        <h2 class="section-title"><?= e(section_label($sec)) ?> <small>(<?= count($membres) ?>)</small></h2>
        <div class="teachers">
            <?php foreach ($membres as $t):
                $nomComplet = trim($t['nom'] . ' ' . $t['postnom'] . ' ' . $t['prenom']);
                $initiales = mb_strtoupper(mb_substr($t['nom'], 0, 1) . mb_substr($t['prenom'] ?: $t['postnom'], 0, 1));
                $civ = $t['sexe'] === 'F' ? 'Mme' : ($t['sexe'] === 'M' ? 'M.' : '');
            ?>
                <article class="teacher">
                    <?php if ($t['photo']): ?>
                        <img src="<?= e(UPLOAD_URL . '/' . $t['photo']) ?>" alt="Photo de <?= e($nomComplet) ?>" loading="lazy">
                    <?php else: ?>
                        <div class="avatar" aria-hidden="true"><?= e($initiales) ?></div>
                    <?php endif; ?>
                    <h3><?= e(trim($civ . ' ' . $nomComplet)) ?></h3>
                    <p class="role"><?= e($t['fonction']) ?></p>
                    <?php if ($t['classe_cours']): ?><p><?= e($t['classe_cours']) ?></p><?php endif; ?>
                    <?php if ($t['qualification']): ?><p class="muted"><?= e($t['qualification']) ?></p><?php endif; ?>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endforeach; ?>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
