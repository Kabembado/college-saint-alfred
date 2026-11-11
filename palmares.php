<?php
$page  = 'palmares';
$titre = 'Palmarès';
require __DIR__ . '/includes/header.php';

$annees = db()->query('SELECT annee_scolaire FROM resultats
                       UNION SELECT annee_scolaire FROM laureats
                       ORDER BY annee_scolaire DESC')->fetchAll(PDO::FETCH_COLUMN);
$annee = $_GET['annee'] ?? ($annees[0] ?? '');
if (!in_array($annee, $annees, true)) {
    $annee = $annees[0] ?? '';
}

$res = db()->prepare('SELECT * FROM resultats WHERE annee_scolaire = ? ORDER BY examen, classe_option');
$res->execute([$annee]);
$resultats = $res->fetchAll();

$lau = db()->prepare('SELECT * FROM laureats WHERE annee_scolaire = ? ORDER BY pourcentage DESC, nom_complet');
$lau->execute([$annee]);
$laureats = $lau->fetchAll();
?>
<section class="page-head">
    <div class="container">
        <h1>Palmarès</h1>
        <p>Résultats aux examens officiels et meilleurs élèves</p>
    </div>
</section>

<section class="container section">
    <?php if (!$annees): ?>
        <div class="empty">Les résultats (ENAFEP, TENASOSP, Examen d'État…) et les lauréats seront publiés ici.</div>
    <?php else: ?>
        <form class="filter" method="get">
            <label for="annee">Année scolaire :</label>
            <select id="annee" name="annee" onchange="this.form.submit()">
                <?php foreach ($annees as $a): ?>
                    <option value="<?= e($a) ?>" <?= $a === $annee ? 'selected' : '' ?>><?= e($a) ?></option>
                <?php endforeach; ?>
            </select>
            <noscript><button class="btn btn-small">Afficher</button></noscript>
        </form>

        <?php if ($resultats): ?>
            <h2 class="section-title">Résultats aux examens – <?= e($annee) ?></h2>
            <div class="table-wrap">
                <table>
                    <thead><tr><th>Examen</th><th>Classe / Option</th><th>Inscrits</th><th>Réussis</th><th>Taux de réussite</th></tr></thead>
                    <tbody>
                    <?php foreach ($resultats as $r): ?>
                        <tr>
                            <td><?= e($r['examen']) ?></td>
                            <td><?= e($r['classe_option']) ?></td>
                            <td><?= (int) $r['inscrits'] ?></td>
                            <td><?= (int) $r['reussis'] ?></td>
                            <td><span class="badge"><?= pourcentage((int) $r['reussis'], (int) $r['inscrits']) ?></span></td>
                        </tr>
                    <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        <?php endif; ?>

        <?php if ($laureats): ?>
            <h2 class="section-title">Nos lauréats – <?= e($annee) ?></h2>
            <div class="laureats">
                <?php foreach ($laureats as $i => $l): ?>
                    <div class="laureat <?= $i < 3 ? 'top' : '' ?>">
                        <span class="rang"><?= $i + 1 ?></span>
                        <div>
                            <strong><?= e($l['nom_complet']) ?></strong>
                            <small><?= e($l['classe_option']) ?><?= $l['distinction'] ? ' · ' . e($l['distinction']) : '' ?></small>
                        </div>
                        <?php if ($l['pourcentage'] !== null): ?>
                            <span class="score"><?= number_format((float) $l['pourcentage'], 1, ',', ' ') ?> %</span>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    <?php endif; ?>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
