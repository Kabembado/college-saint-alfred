<?php
$page  = 'historique';
$titre = 'Historique';
require __DIR__ . '/includes/header.php';
?>
<section class="page-head">
    <div class="container">
        <h1>Historique</h1>
        <p>L'histoire du <?= e(param('nom_ecole')) ?></p>
    </div>
</section>

<section class="container section two-col">
    <article class="prose">
        <?= paragraphes(param('historique')) ?>
    </article>
    <aside class="side-card">
        <h3>En bref</h3>
        <dl>
            <dt>Statut</dt><dd>École privée</dd>
            <?php if (param('annee_creation')): ?><dt>Année de création</dt><dd><?= e(param('annee_creation')) ?></dd><?php endif; ?>
            <?php if (param('promoteur')): ?><dt>Promoteur / Fondateur</dt><dd><?= e(param('promoteur')) ?></dd><?php endif; ?>
            <?php if (param('prefet')): ?><dt>Chef d'établissement</dt><dd><?= e(param('prefet')) ?></dd><?php endif; ?>
            <dt>Localisation</dt><dd>Commune de la Muya, Mbujimayi, Kasaï Oriental, RDC</dd>
            <dt>Sections</dt><dd>Maternelle, Primaire, Secondaire</dd>
        </dl>
    </aside>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
