</main>
<footer class="site-footer">
    <div class="container footer-grid">
        <div>
            <h3><?= e(param('nom_ecole')) ?></h3>
            <p><?= e(param('devise')) ?></p>
            <p>École privée – Maternelle, Primaire et Secondaire.</p>
        </div>
        <div>
            <h3>Adresse</h3>
            <p><?= nl2br(e(param('adresse'))) ?></p>
        </div>
        <div>
            <h3>Contact</h3>
            <?php if (param('telephone')): ?><p>📞 <?= e(param('telephone')) ?></p><?php endif; ?>
            <?php if (param('email')): ?><p>✉️ <a href="mailto:<?= e(param('email')) ?>"><?= e(param('email')) ?></a></p><?php endif; ?>
            <p><a href="contact.php">Écrivez-nous →</a></p>
        </div>
    </div>
    <div class="container footer-bottom">
        © <?= date('Y') ?> <?= e(param('nom_ecole')) ?> – Mbujimayi, RDC ·
        <a href="admin/">Administration</a>
    </div>
</footer>
<script src="assets/js/main.js"></script>
</body>
</html>
