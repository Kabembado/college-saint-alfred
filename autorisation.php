<?php
$page  = 'autorisation';
$titre = 'Autorisation';
require __DIR__ . '/includes/header.php';
$docs = db()->query('SELECT * FROM autorisations ORDER BY ordre, id')->fetchAll();
?>
<section class="page-head">
    <div class="container">
        <h1>Autorisation de fonctionnement</h1>
        <p>Documents officiels de l'établissement</p>
    </div>
</section>

<section class="container section">
    <div class="prose"><?= paragraphes(param('autorisation_intro')) ?></div>

    <?php if (!$docs): ?>
        <div class="empty">Les références des documents officiels (arrêtés, agréments) seront publiées prochainement.</div>
    <?php else: ?>
        <div class="doc-list">
            <?php foreach ($docs as $d): ?>
                <article class="doc">
                    <div class="doc-icon">📜</div>
                    <div>
                        <h3><?= e($d['intitule']) ?></h3>
                        <ul class="doc-meta">
                            <?php if ($d['reference']): ?><li><strong>Référence :</strong> <?= e($d['reference']) ?></li><?php endif; ?>
                            <?php if ($d['date_doc']): ?><li><strong>Date :</strong> <?= e($d['date_doc']) ?></li><?php endif; ?>
                            <?php if ($d['autorite']): ?><li><strong>Délivré par :</strong> <?= e($d['autorite']) ?></li><?php endif; ?>
                        </ul>
                        <?php if ($d['objet']): ?><p><?= nl2br(e($d['objet'])) ?></p><?php endif; ?>
                    </div>
                </article>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
