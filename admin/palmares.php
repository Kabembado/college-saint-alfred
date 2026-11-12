<?php
require_once __DIR__ . '/_layout.php';
require_admin();

$examens = ['ENAFEP (fin du primaire)', 'TENASOSP (fin de l\'éducation de base)', 'Examen d\'État', 'Résultats internes'];
$s = structure();
$classesOptions = array_merge(
    $s['maternelle']['classes'],
    $s['primaire']['classes'],
    $s['secondaire']['classes'],
    array_map(fn($o) => 'Option ' . $o, $s['secondaire']['options'])
);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_check()) {
        flash('error', 'Session expirée, veuillez réessayer.');
        redirect('palmares.php');
    }
    $type = $_POST['type'] ?? '';
    $table = $type === 'laureat' ? 'laureats' : 'resultats';
    $id = (int) ($_POST['id'] ?? 0);

    if (($_POST['action'] ?? '') === 'delete') {
        db()->prepare("DELETE FROM $table WHERE id = ?")->execute([$id]);
        flash('success', 'Élément supprimé.');
        redirect('palmares.php');
    }

    $annee = post('annee_scolaire');
    if (!preg_match('/^\d{4}\s*[-–\/]\s*\d{4}$/', $annee)) {
        flash('error', "L'année scolaire doit être au format 2024-2025.");
        redirect('palmares.php');
    }
    $annee = preg_replace('/\s*[-–\/]\s*/', '-', $annee);

    if ($table === 'resultats') {
        $inscrits = max(0, (int) post('inscrits'));
        $reussis = max(0, (int) post('reussis'));
        if ($reussis > $inscrits) {
            flash('error', 'Le nombre de réussis ne peut pas dépasser le nombre d\'inscrits.');
            redirect('palmares.php');
        }
        db()->prepare('INSERT INTO resultats (annee_scolaire, examen, classe_option, inscrits, reussis) VALUES (?, ?, ?, ?, ?)')
            ->execute([$annee, post('examen'), post('classe_option'), $inscrits, $reussis]);
        flash('success', 'Résultat ajouté.');
    } else {
        if (post('nom_complet') === '') {
            flash('error', 'Le nom du lauréat est obligatoire.');
            redirect('palmares.php');
        }
        $pct = post('pourcentage') === '' ? null : min(100, max(0, (float) str_replace(',', '.', post('pourcentage'))));
        db()->prepare('INSERT INTO laureats (annee_scolaire, nom_complet, classe_option, pourcentage, distinction) VALUES (?, ?, ?, ?, ?)')
            ->execute([$annee, post('nom_complet'), post('classe_option'), $pct, post('distinction')]);
        flash('success', 'Lauréat ajouté.');
    }
    redirect('palmares.php');
}

$resultats = db()->query('SELECT * FROM resultats ORDER BY annee_scolaire DESC, examen, classe_option')->fetchAll();
$laureats = db()->query('SELECT * FROM laureats ORDER BY annee_scolaire DESC, pourcentage DESC')->fetchAll();
// Les examens se terminent en juillet : on propose la dernière année scolaire achevée.
$fin = (int) date('n') >= 7 ? (int) date('Y') : (int) date('Y') - 1;
$anneeDefaut = ($fin - 1) . '-' . $fin;

admin_header('Palmarès', 'palmares');
?>
<h1>Palmarès</h1>
<datalist id="classes"><?php foreach ($classesOptions as $c): ?><option value="<?= e($c) ?>"><?php endforeach; ?></datalist>

<div class="panel">
    <h2>Ajouter un résultat d'examen</h2>
    <form method="post" class="form">
        <?= csrf_field() ?><input type="hidden" name="type" value="resultat">
        <div class="row">
            <label>Année scolaire * <input name="annee_scolaire" required placeholder="2024-2025" value="<?= e($anneeDefaut) ?>"></label>
            <label>Examen
                <select name="examen"><?php foreach ($examens as $ex): ?><option><?= e($ex) ?></option><?php endforeach; ?></select>
            </label>
        </div>
        <label>Classe / Option <input name="classe_option" list="classes" placeholder="Ex. Option Électricité"></label>
        <div class="row">
            <label>Nombre d'inscrits <input type="number" min="0" name="inscrits" required></label>
            <label>Nombre de réussis <input type="number" min="0" name="reussis" required></label>
        </div>
        <button class="btn btn-blue">Ajouter le résultat</button>
    </form>
</div>

<div class="panel">
    <h2>Ajouter un lauréat</h2>
    <form method="post" class="form">
        <?= csrf_field() ?><input type="hidden" name="type" value="laureat">
        <div class="row">
            <label>Année scolaire * <input name="annee_scolaire" required placeholder="2024-2025" value="<?= e($anneeDefaut) ?>"></label>
            <label>Nom complet de l'élève * <input name="nom_complet" required></label>
        </div>
        <div class="row">
            <label>Classe / Option <input name="classe_option" list="classes"></label>
            <label>Pourcentage obtenu <input name="pourcentage" inputmode="decimal" placeholder="Ex. 78,5"></label>
        </div>
        <label>Distinction (facultatif) <input name="distinction" placeholder="Ex. Premier de l'Examen d'État au niveau de l'école"></label>
        <button class="btn btn-blue">Ajouter le lauréat</button>
    </form>
</div>

<div class="panel">
    <h2>Résultats enregistrés (<?= count($resultats) ?>)</h2>
    <?php if (!$resultats): ?><p class="muted">Aucun résultat.</p><?php else: ?>
    <div class="table-wrap"><table>
        <thead><tr><th>Année</th><th>Examen</th><th>Classe / Option</th><th>Inscrits</th><th>Réussis</th><th>%</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($resultats as $r): ?>
            <tr>
                <td><?= e($r['annee_scolaire']) ?></td><td><?= e($r['examen']) ?></td><td><?= e($r['classe_option']) ?></td>
                <td><?= (int) $r['inscrits'] ?></td><td><?= (int) $r['reussis'] ?></td>
                <td><?= pourcentage((int) $r['reussis'], (int) $r['inscrits']) ?></td>
                <td><form method="post" data-confirm="Supprimer ce résultat ?"><?= csrf_field() ?>
                    <input type="hidden" name="type" value="resultat"><input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= (int) $r['id'] ?>"><button class="btn btn-danger btn-small">Supprimer</button></form></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table></div>
    <?php endif; ?>
</div>

<div class="panel">
    <h2>Lauréats enregistrés (<?= count($laureats) ?>)</h2>
    <?php if (!$laureats): ?><p class="muted">Aucun lauréat.</p><?php else: ?>
    <div class="table-wrap"><table>
        <thead><tr><th>Année</th><th>Nom</th><th>Classe / Option</th><th>%</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($laureats as $l): ?>
            <tr>
                <td><?= e($l['annee_scolaire']) ?></td><td><?= e($l['nom_complet']) ?></td><td><?= e($l['classe_option']) ?></td>
                <td><?= $l['pourcentage'] !== null ? e(number_format((float) $l['pourcentage'], 1, ',', ' ')) : '—' ?></td>
                <td><form method="post" data-confirm="Supprimer ce lauréat ?"><?= csrf_field() ?>
                    <input type="hidden" name="type" value="laureat"><input type="hidden" name="action" value="delete">
                    <input type="hidden" name="id" value="<?= (int) $l['id'] ?>"><button class="btn btn-danger btn-small">Supprimer</button></form></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table></div>
    <?php endif; ?>
</div>
<?php admin_footer(); ?>
