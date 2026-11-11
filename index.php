<?php
$page  = 'accueil';
$titre = 'Accueil';
require __DIR__ . '/includes/header.php';
$s = structure();
$nbEnseignants = (int) db()->query('SELECT COUNT(*) FROM enseignants')->fetchColumn();
?>
<section class="hero">
    <div class="container hero-inner">
        <h1>Bienvenue au <?= e(param('nom_ecole')) ?></h1>
        <p class="lead">École privée de la commune de la Muya, à Mbujimayi (Kasaï Oriental, RDC).
            Nous accompagnons vos enfants de la maternelle jusqu'aux humanités.</p>
        <div class="hero-actions">
            <a class="btn btn-gold" href="contact.php">Inscrire mon enfant</a>
            <a class="btn btn-outline" href="historique.php">Découvrir l'école</a>
        </div>
    </div>
</section>

<section class="container stats">
    <div class="stat"><strong>3</strong><span>Sections</span></div>
    <div class="stat"><strong><?= count($s['secondaire']['options']) ?></strong><span>Options aux humanités</span></div>
    <div class="stat"><strong><?= $nbEnseignants ?: '—' ?></strong><span>Enseignants</span></div>
</section>

<section class="container section">
    <h2 class="section-title">Nos sections</h2>
    <div class="cards">
        <?php foreach (['maternelle', 'primaire'] as $k): ?>
            <article class="card">
                <div class="card-icon"><?= $s[$k]['icone'] ?></div>
                <h3><?= e($s[$k]['titre']) ?></h3>
                <ul class="pill-list">
                    <?php foreach ($s[$k]['classes'] as $c): ?><li><?= e($c) ?></li><?php endforeach; ?>
                </ul>
            </article>
        <?php endforeach; ?>
        <article class="card">
            <div class="card-icon"><?= $s['secondaire']['icone'] ?></div>
            <h3><?= e($s['secondaire']['titre']) ?></h3>
            <p class="muted">Éducation de base</p>
            <ul class="pill-list">
                <?php foreach ($s['secondaire']['classes'] as $c): ?><li><?= e($c) ?></li><?php endforeach; ?>
            </ul>
            <p class="muted">Humanités : <?= e(implode(', ', $s['secondaire']['niveaux_options'])) ?> année dans chaque option</p>
        </article>
    </div>
</section>

<section class="section alt">
    <div class="container">
        <h2 class="section-title">Options du cycle secondaire (Humanités)</h2>
        <div class="options-grid">
            <?php
            $icones = ['⚙️', '💡', '🧵', '👩‍🏫', '💻', '🏗️'];
            foreach ($s['secondaire']['options'] as $i => $opt): ?>
                <div class="option">
                    <span class="option-icon"><?= $icones[$i] ?? '📗' ?></span>
                    <strong><?= e($opt) ?></strong>
                    <small><?= e(implode(' · ', $s['secondaire']['niveaux_options'])) ?></small>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<section class="container section">
    <div class="cta">
        <div>
            <h2>Inscriptions ouvertes</h2>
            <p>Pour toute information sur les inscriptions, les frais scolaires ou les options, contactez la direction.</p>
        </div>
        <a class="btn btn-gold" href="contact.php">Nous contacter</a>
    </div>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
