<?php
require_once __DIR__ . '/_layout.php';
require_admin();

$champs = [
    'nom_ecole'          => ['Nom de l\'école', 'text'],
    'devise'             => ['Devise', 'text'],
    'annee_creation'     => ['Année de création', 'text'],
    'promoteur'          => ['Promoteur / Fondateur', 'text'],
    'prefet'             => ['Chef d\'établissement (Préfet / Directeur)', 'text'],
    'telephone'          => ['Téléphone', 'text'],
    'email'              => ['E-mail', 'email'],
    'adresse'            => ['Adresse', 'textarea'],
    'heures'             => ['Heures d\'ouverture', 'textarea'],
    'historique'         => ['Texte de la page « Historique »', 'big'],
    'autorisation_intro' => ['Texte d\'introduction de la page « Autorisation »', 'big'],
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!csrf_check()) {
        flash('error', 'Session expirée, veuillez réessayer.');
    } else {
        foreach ($champs as $cle => $_) {
            set_param($cle, post($cle));
        }
        $nouveau = (string) ($_POST['nouveau_mdp'] ?? '');
        if ($nouveau !== '') {
            if (mb_strlen($nouveau) < 8) {
                flash('error', 'Le nouveau mot de passe doit contenir au moins 8 caractères (non modifié).');
            } else {
                set_param('admin_password_hash', password_hash($nouveau, PASSWORD_DEFAULT));
                flash('success', 'Mot de passe modifié.');
            }
        }
        flash('success', 'Paramètres enregistrés.');
    }
    redirect('parametres.php');
}

admin_header('Textes & coordonnées', 'parametres');
?>
<h1>Textes & coordonnées</h1>
<form method="post" class="form panel">
    <?= csrf_field() ?>
    <?php foreach ($champs as $cle => [$lib, $type]): ?>
        <label><?= e($lib) ?>
            <?php if ($type === 'textarea' || $type === 'big'): ?>
                <textarea name="<?= e($cle) ?>" rows="<?= $type === 'big' ? 12 : 3 ?>"><?= e(param($cle)) ?></textarea>
                <?php if ($type === 'big'): ?><span class="hint">Laissez une ligne vide entre deux paragraphes.</span><?php endif; ?>
            <?php else: ?>
                <input type="<?= e($type) ?>" name="<?= e($cle) ?>" value="<?= e(param($cle)) ?>">
            <?php endif; ?>
        </label>
    <?php endforeach; ?>
    <label>Nouveau mot de passe administrateur
        <input type="password" name="nouveau_mdp" autocomplete="new-password">
        <span class="hint">Laissez vide pour conserver le mot de passe actuel.</span>
    </label>
    <button class="btn btn-blue">Enregistrer</button>
</form>
<?php admin_footer(); ?>
