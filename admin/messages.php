<?php
require_once __DIR__ . '/_layout.php';
require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && csrf_check()) {
    $id = (int) ($_POST['id'] ?? 0);
    if (($_POST['action'] ?? '') === 'delete') {
        db()->prepare('DELETE FROM messages WHERE id = ?')->execute([$id]);
        flash('success', 'Message supprimé.');
    } elseif (($_POST['action'] ?? '') === 'lu') {
        db()->prepare('UPDATE messages SET lu = 1 - lu WHERE id = ?')->execute([$id]);
    }
    redirect('messages.php');
}

$messages = db()->query('SELECT * FROM messages ORDER BY recu_le DESC, id DESC')->fetchAll();
admin_header('Messages', 'messages');
?>
<h1>Messages reçus</h1>
<?php if (!$messages): ?>
    <div class="empty">Aucun message pour le moment.</div>
<?php endif; ?>
<?php foreach ($messages as $m): ?>
    <div class="panel" style="<?= $m['lu'] ? '' : 'border-left:5px solid var(--or)' ?>">
        <h2 style="font-size:1.15rem"><?= $m['lu'] ? '' : '🆕 ' ?><?= e($m['sujet'] ?: 'Sans sujet') ?> — <?= e($m['nom']) ?></h2>
        <p class="muted">
            Reçu le <?= e($m['recu_le']) ?> (UTC)
            <?php if ($m['telephone']): ?> · 📞 <a href="tel:<?= e($m['telephone']) ?>"><?= e($m['telephone']) ?></a><?php endif; ?>
            <?php if ($m['email']): ?> · ✉️ <a href="mailto:<?= e($m['email']) ?>"><?= e($m['email']) ?></a><?php endif; ?>
        </p>
        <p><?= nl2br(e($m['message'])) ?></p>
        <div class="actions">
            <form method="post"><?= csrf_field() ?>
                <input type="hidden" name="action" value="lu"><input type="hidden" name="id" value="<?= (int) $m['id'] ?>">
                <button class="btn btn-blue btn-small"><?= $m['lu'] ? 'Marquer non lu' : 'Marquer comme lu' ?></button>
            </form>
            <?= delete_button((int) $m['id']) ?>
        </div>
    </div>
<?php endforeach; ?>
<?php admin_footer(); ?>
