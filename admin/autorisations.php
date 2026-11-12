<?php
require_once __DIR__ . '/_layout.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_check()) {
        flash('error', 'Session expirée, veuillez réessayer.');
        redirect('autorisations.php');
    }
    $id = (int) ($_POST['id'] ?? 0);
    if (($_POST['action'] ?? '') === 'delete') {
        db()->prepare('DELETE FROM autorisations WHERE id = ?')->execute([$id]);
        flash('success', 'Document supprimé.');
        redirect('autorisations.php');
    }
    $data = [
        'intitule'  => post('intitule'),
        'reference' => post('reference'),
        'date_doc'  => post('date_doc'),
        'autorite'  => post('autorite'),
        'objet'     => post('objet'),
        'ordre'     => (int) post('ordre'),
    ];
    if ($data['intitule'] === '') {
        flash('error', "L'intitulé est obligatoire.");
    } elseif ($id) {
        $data['id'] = $id;
        db()->prepare('UPDATE autorisations SET intitule=:intitule, reference=:reference, date_doc=:date_doc,
                       autorite=:autorite, objet=:objet, ordre=:ordre WHERE id=:id')->execute($data);
        flash('success', 'Document modifié.');
    } else {
        db()->prepare('INSERT INTO autorisations (intitule, reference, date_doc, autorite, objet, ordre)
                       VALUES (:intitule, :reference, :date_doc, :autorite, :objet, :ordre)')->execute($data);
        flash('success', 'Document ajouté.');
    }
    redirect('autorisations.php');
}

$edit = null;
if (isset($_GET['edit'])) {
    $s = db()->prepare('SELECT * FROM autorisations WHERE id = ?');
    $s->execute([(int) $_GET['edit']]);
    $edit = $s->fetch() ?: null;
}
$v = $edit ?? ['id' => 0, 'intitule' => '', 'reference' => '', 'date_doc' => '', 'autorite' => '', 'objet' => '', 'ordre' => 0];
$liste = db()->query('SELECT * FROM autorisations ORDER BY ordre, id')->fetchAll();

admin_header('Autorisations', 'autorisations');
?>
<h1>Documents d'autorisation</h1>
<p class="muted">Le texte d'introduction de la page se modifie dans <a href="parametres.php">Textes & coordonnées</a>.</p>

<div class="panel">
    <h2><?= $edit ? 'Modifier le document' : 'Ajouter un document' ?></h2>
    <form method="post" class="form">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="<?= (int) $v['id'] ?>">
        <label>Intitulé * <input name="intitule" required value="<?= e($v['intitule']) ?>" placeholder="Ex. Arrêté ministériel d'agrément"></label>
        <div class="row">
            <label>Référence / Numéro <input name="reference" value="<?= e($v['reference']) ?>" placeholder="Ex. N° MINEPST/CAB.MIN/…"></label>
            <label>Date <input name="date_doc" value="<?= e($v['date_doc']) ?>" placeholder="Ex. 15/09/2010"></label>
        </div>
        <div class="row">
            <label>Délivré par <input name="autorite" value="<?= e($v['autorite']) ?>" placeholder="Ex. Ministère de l'EPST / Division provinciale"></label>
            <label>Ordre d'affichage <input type="number" name="ordre" value="<?= (int) $v['ordre'] ?>"></label>
        </div>
        <label>Objet / description <textarea name="objet" rows="3"><?= e($v['objet']) ?></textarea></label>
        <div class="actions">
            <button class="btn btn-blue"><?= $edit ? 'Enregistrer' : 'Ajouter' ?></button>
            <?php if ($edit): ?><a class="btn btn-small" href="autorisations.php">Annuler</a><?php endif; ?>
        </div>
    </form>
</div>

<div class="panel">
    <h2>Documents publiés (<?= count($liste) ?>)</h2>
    <?php if (!$liste): ?><p class="muted">Aucun document.</p><?php else: ?>
    <div class="table-wrap"><table>
        <thead><tr><th>Intitulé</th><th>Référence</th><th>Date</th><th></th></tr></thead>
        <tbody>
        <?php foreach ($liste as $d): ?>
            <tr>
                <td><?= e($d['intitule']) ?></td><td><?= e($d['reference']) ?></td><td><?= e($d['date_doc']) ?></td>
                <td class="actions"><a class="btn btn-blue btn-small" href="?edit=<?= (int) $d['id'] ?>">Modifier</a><?= delete_button((int) $d['id']) ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table></div>
    <?php endif; ?>
</div>
<?php admin_footer(); ?>
