<?php
require_once __DIR__ . '/_layout.php';
require_admin();

$sections = ['direction', 'maternelle', 'primaire', 'secondaire'];

/** Enregistre la photo envoyée et retourne le nom de fichier ('' si aucune). */
function enregistrer_photo(): string
{
    $f = $_FILES['photo'] ?? null;
    if (!$f || $f['error'] === UPLOAD_ERR_NO_FILE) {
        return '';
    }
    if ($f['error'] !== UPLOAD_ERR_OK || $f['size'] > UPLOAD_MAX_BYTES) {
        throw new RuntimeException('Photo refusée : fichier trop lourd (2 Mo maximum) ou envoi incomplet.');
    }
    $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
    if (!isset($types[$mime]) || @getimagesize($f['tmp_name']) === false) {
        throw new RuntimeException('Photo refusée : formats acceptés JPG, PNG ou WEBP.');
    }
    if (!is_dir(UPLOAD_DIR)) {
        mkdir(UPLOAD_DIR, 0775, true);
    }
    $nom = bin2hex(random_bytes(12)) . '.' . $types[$mime];
    if (!move_uploaded_file($f['tmp_name'], UPLOAD_DIR . '/' . $nom)) {
        throw new RuntimeException("Impossible d'enregistrer la photo sur le serveur.");
    }
    return $nom;
}

function supprimer_photo(string $nom): void
{
    if ($nom !== '' && preg_match('/^[a-f0-9]{24}\.(jpg|png|webp)$/', $nom)) {
        @unlink(UPLOAD_DIR . '/' . $nom);
    }
}

function trouver(int $id): ?array
{
    $s = db()->prepare('SELECT * FROM enseignants WHERE id = ?');
    $s->execute([$id]);
    return $s->fetch() ?: null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_check()) {
        flash('error', 'Session expirée, veuillez réessayer.');
        redirect('enseignants.php');
    }
    $id = (int) ($_POST['id'] ?? 0);

    if (($_POST['action'] ?? '') === 'delete') {
        if ($t = trouver($id)) {
            supprimer_photo($t['photo']);
            db()->prepare('DELETE FROM enseignants WHERE id = ?')->execute([$id]);
            flash('success', 'Enseignant supprimé.');
        }
        redirect('enseignants.php');
    }

    $data = [
        'nom'           => post('nom'),
        'postnom'       => post('postnom'),
        'prenom'        => post('prenom'),
        'sexe'          => in_array(post('sexe'), ['M', 'F'], true) ? post('sexe') : '',
        'section'       => in_array(post('section'), $sections, true) ? post('section') : 'secondaire',
        'fonction'      => post('fonction') ?: 'Enseignant(e)',
        'classe_cours'  => post('classe_cours'),
        'qualification' => post('qualification'),
        'ordre'         => (int) post('ordre'),
    ];
    if ($data['nom'] === '') {
        flash('error', 'Le nom est obligatoire.');
        redirect('enseignants.php' . ($id ? '?edit=' . $id : ''));
    }

    try {
        $photo = enregistrer_photo();
    } catch (RuntimeException $ex) {
        flash('error', $ex->getMessage());
        $photo = '';
    }

    $ancien = $id ? trouver($id) : null;
    if ($ancien) {
        if ($photo !== '' || isset($_POST['retirer_photo'])) {
            supprimer_photo($ancien['photo']);
            $data['photo'] = $photo;
        }
        $sets = implode(', ', array_map(fn($k) => "$k = :$k", array_keys($data)));
        $data['id'] = $id;
        db()->prepare("UPDATE enseignants SET $sets WHERE id = :id")->execute($data);
        flash('success', 'Enseignant modifié.');
    } else {
        $data['photo'] = $photo;
        $cols = implode(', ', array_keys($data));
        $vals = ':' . implode(', :', array_keys($data));
        db()->prepare("INSERT INTO enseignants ($cols) VALUES ($vals)")->execute($data);
        flash('success', 'Enseignant ajouté.');
    }
    redirect('enseignants.php');
}

$edit = isset($_GET['edit']) ? trouver((int) $_GET['edit']) : null;
$v = $edit ?? ['id' => 0, 'nom' => '', 'postnom' => '', 'prenom' => '', 'sexe' => '', 'section' => 'primaire',
               'fonction' => 'Enseignant(e)', 'classe_cours' => '', 'qualification' => '', 'photo' => '', 'ordre' => 0];
$liste = db()->query("SELECT * FROM enseignants ORDER BY
    CASE section WHEN 'direction' THEN 0 WHEN 'maternelle' THEN 1 WHEN 'primaire' THEN 2 ELSE 3 END, ordre, nom")->fetchAll();

admin_header('Enseignants', 'enseignants');
?>
<h1>Enseignants</h1>

<div class="panel">
    <h2><?= $edit ? 'Modifier un enseignant' : 'Ajouter un enseignant' ?></h2>
    <form method="post" enctype="multipart/form-data" class="form">
        <?= csrf_field() ?>
        <input type="hidden" name="id" value="<?= (int) $v['id'] ?>">
        <div class="row">
            <label>Nom * <input name="nom" required value="<?= e($v['nom']) ?>"></label>
            <label>Postnom <input name="postnom" value="<?= e($v['postnom']) ?>"></label>
        </div>
        <div class="row">
            <label>Prénom <input name="prenom" value="<?= e($v['prenom']) ?>"></label>
            <label>Sexe
                <select name="sexe">
                    <option value="">—</option>
                    <option value="M" <?= $v['sexe'] === 'M' ? 'selected' : '' ?>>Masculin</option>
                    <option value="F" <?= $v['sexe'] === 'F' ? 'selected' : '' ?>>Féminin</option>
                </select>
            </label>
        </div>
        <div class="row">
            <label>Section
                <select name="section">
                    <?php foreach ($sections as $s): ?>
                        <option value="<?= e($s) ?>" <?= $v['section'] === $s ? 'selected' : '' ?>><?= e(section_label($s)) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Fonction <input name="fonction" value="<?= e($v['fonction']) ?>" placeholder="Enseignant(e), Préfet, Directeur, Titulaire…"></label>
        </div>
        <div class="row">
            <label>Classe / Cours <input name="classe_cours" value="<?= e($v['classe_cours']) ?>" placeholder="Ex. 3ème primaire, ou Mathématiques – Option Électricité"></label>
            <label>Qualification <input name="qualification" value="<?= e($v['qualification']) ?>" placeholder="Ex. D6, G3, L2…"></label>
        </div>
        <div class="row">
            <label>Photo (JPG, PNG ou WEBP, 2 Mo max)
                <input type="file" name="photo" accept="image/jpeg,image/png,image/webp">
                <?php if ($v['photo']): ?>
                    <span class="hint"><label style="display:inline"><input type="checkbox" name="retirer_photo" style="width:auto"> Retirer la photo actuelle</label></span>
                <?php endif; ?>
            </label>
            <label>Ordre d'affichage <input type="number" name="ordre" value="<?= (int) $v['ordre'] ?>"><span class="hint">Les plus petits nombres s'affichent en premier.</span></label>
        </div>
        <div class="actions">
            <button class="btn btn-blue"><?= $edit ? 'Enregistrer les modifications' : 'Ajouter' ?></button>
            <?php if ($edit): ?><a class="btn btn-small" href="enseignants.php">Annuler</a><?php endif; ?>
        </div>
    </form>
</div>

<div class="panel">
    <h2>Liste (<?= count($liste) ?>)</h2>
    <?php if (!$liste): ?>
        <p class="muted">Aucun enseignant enregistré.</p>
    <?php else: ?>
        <div class="table-wrap">
            <table>
                <thead><tr><th>Nom complet</th><th>Section</th><th>Fonction</th><th>Classe / Cours</th><th></th></tr></thead>
                <tbody>
                <?php foreach ($liste as $t): ?>
                    <tr>
                        <td><?= e(trim($t['nom'] . ' ' . $t['postnom'] . ' ' . $t['prenom'])) ?></td>
                        <td><?= e(section_label($t['section'])) ?></td>
                        <td><?= e($t['fonction']) ?></td>
                        <td><?= e($t['classe_cours']) ?></td>
                        <td class="actions">
                            <a class="btn btn-blue btn-small" href="?edit=<?= (int) $t['id'] ?>">Modifier</a>
                            <?= delete_button((int) $t['id']) ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    <?php endif; ?>
</div>
<?php admin_footer(); ?>
