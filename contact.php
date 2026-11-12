<?php
require_once __DIR__ . '/includes/functions.php';

$erreurs = [];
$valeurs = ['nom' => '', 'telephone' => '', 'email' => '', 'sujet' => '', 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    foreach ($valeurs as $k => $_) {
        $valeurs[$k] = mb_substr(post($k), 0, $k === 'message' ? 5000 : 200);
    }

    if (!csrf_check()) {
        $erreurs[] = 'La session a expiré, veuillez renvoyer le formulaire.';
    }
    // Champ piège anti-robots : doit rester vide.
    if (post('site_web') !== '') {
        $erreurs[] = 'Envoi refusé.';
    }
    if ($valeurs['nom'] === '') {
        $erreurs[] = 'Veuillez indiquer votre nom.';
    }
    if ($valeurs['telephone'] === '' && $valeurs['email'] === '') {
        $erreurs[] = 'Indiquez au moins un numéro de téléphone ou une adresse e-mail.';
    }
    if ($valeurs['email'] !== '' && !filter_var($valeurs['email'], FILTER_VALIDATE_EMAIL)) {
        $erreurs[] = "L'adresse e-mail n'est pas valide.";
    }
    if (mb_strlen($valeurs['message']) < 5) {
        $erreurs[] = 'Veuillez écrire votre message.';
    }

    if (!$erreurs) {
        $stmt = db()->prepare('INSERT INTO messages (nom, telephone, email, sujet, message) VALUES (?, ?, ?, ?, ?)');
        $stmt->execute(array_values($valeurs));
        flash('success', 'Merci ! Votre message a bien été envoyé. La direction vous répondra dans les meilleurs délais.');
        redirect('contact.php');
    }
}

$page  = 'contact';
$titre = 'Nous contacter';
require __DIR__ . '/includes/header.php';
$sujets = ['Inscription', 'Frais scolaires', 'Résultats / bulletins', 'Recrutement', 'Autre'];
?>
<section class="page-head">
    <div class="container">
        <h1>Nous contacter</h1>
        <p>Une question ? Une inscription ? Écrivez-nous ou passez à l'école.</p>
    </div>
</section>

<section class="container section two-col">
    <div>
        <?= flashes() ?>
        <?php if ($erreurs): ?>
            <div class="alert alert-error"><ul><?php foreach ($erreurs as $er): ?><li><?= e($er) ?></li><?php endforeach; ?></ul></div>
        <?php endif; ?>

        <form method="post" class="form" novalidate>
            <?= csrf_field() ?>
            <div class="hp" aria-hidden="true">
                <label>Site web <input type="text" name="site_web" tabindex="-1" autocomplete="off"></label>
            </div>
            <label>Nom complet *
                <input type="text" name="nom" required maxlength="200" value="<?= e($valeurs['nom']) ?>">
            </label>
            <div class="row">
                <label>Téléphone
                    <input type="tel" name="telephone" maxlength="200" placeholder="+243 …" value="<?= e($valeurs['telephone']) ?>">
                </label>
                <label>E-mail
                    <input type="email" name="email" maxlength="200" value="<?= e($valeurs['email']) ?>">
                </label>
            </div>
            <label>Sujet
                <select name="sujet">
                    <?php foreach ($sujets as $s): ?>
                        <option <?= $valeurs['sujet'] === $s ? 'selected' : '' ?>><?= e($s) ?></option>
                    <?php endforeach; ?>
                </select>
            </label>
            <label>Message *
                <textarea name="message" rows="6" required maxlength="5000"><?= e($valeurs['message']) ?></textarea>
            </label>
            <button class="btn btn-gold" type="submit">Envoyer le message</button>
        </form>
    </div>

    <aside class="side-card">
        <h3>Coordonnées</h3>
        <dl>
            <dt>Adresse</dt><dd><?= nl2br(e(param('adresse'))) ?></dd>
            <?php if (param('telephone')): ?><dt>Téléphone</dt><dd><a href="tel:<?= e(preg_replace('/[^0-9+]/', '', param('telephone'))) ?>"><?= e(param('telephone')) ?></a></dd><?php endif; ?>
            <?php if (param('email')): ?><dt>E-mail</dt><dd><a href="mailto:<?= e(param('email')) ?>"><?= e(param('email')) ?></a></dd><?php endif; ?>
            <?php if (param('heures')): ?><dt>Heures d'ouverture</dt><dd><?= nl2br(e(param('heures'))) ?></dd><?php endif; ?>
        </dl>
    </aside>
</section>
<?php require __DIR__ . '/includes/footer.php'; ?>
