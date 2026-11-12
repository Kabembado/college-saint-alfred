<?php
require_once __DIR__ . '/_layout.php';

if (is_admin()) {
    redirect('index.php');
}

$hash = param('admin_password_hash');
$premiereFois = $hash === '';
$erreur = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $mdp = (string) ($_POST['mot_de_passe'] ?? '');
    if (!csrf_check()) {
        $erreur = 'Session expirée, veuillez réessayer.';
    } elseif ($premiereFois) {
        if (mb_strlen($mdp) < 8) {
            $erreur = 'Le mot de passe doit contenir au moins 8 caractères.';
        } elseif ($mdp !== (string) ($_POST['confirmation'] ?? '')) {
            $erreur = 'Les deux mots de passe ne correspondent pas.';
        } else {
            set_param('admin_password_hash', password_hash($mdp, PASSWORD_DEFAULT));
            session_regenerate_id(true);
            $_SESSION['admin'] = true;
            flash('success', 'Mot de passe administrateur créé. Bienvenue !');
            redirect('index.php');
        }
    } elseif (password_verify($mdp, $hash)) {
        session_regenerate_id(true);
        $_SESSION['admin'] = true;
        redirect('index.php');
    } else {
        sleep(1); // ralentit les tentatives répétées
        $erreur = 'Mot de passe incorrect.';
    }
}

admin_header('Connexion');
?>
<div class="panel login-box">
    <h2><?= $premiereFois ? 'Créer le mot de passe administrateur' : 'Connexion à l\'administration' ?></h2>
    <?php if ($premiereFois): ?>
        <p class="muted">Première utilisation : choisissez le mot de passe qui protégera l'espace d'administration.</p>
    <?php endif; ?>
    <?php if ($erreur): ?><div class="alert alert-error"><?= e($erreur) ?></div><?php endif; ?>
    <form method="post" class="form">
        <?= csrf_field() ?>
        <label>Mot de passe
            <input type="password" name="mot_de_passe" required autofocus autocomplete="<?= $premiereFois ? 'new-password' : 'current-password' ?>">
        </label>
        <?php if ($premiereFois): ?>
            <label>Confirmer le mot de passe
                <input type="password" name="confirmation" required autocomplete="new-password">
            </label>
        <?php endif; ?>
        <button class="btn btn-blue"><?= $premiereFois ? 'Créer et se connecter' : 'Se connecter' ?></button>
    </form>
    <p><a href="../index.php">← Retour au site</a></p>
</div>
<?php admin_footer(); ?>
