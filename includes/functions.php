<?php
require_once __DIR__ . '/db.php';

/** Échappement HTML. */
function e(?string $s): string
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Texte multi-lignes : échappé, paragraphes séparés par une ligne vide. */
function paragraphes(?string $texte): string
{
    $blocs = preg_split('/\R{2,}/', trim((string) $texte));
    $html = '';
    foreach ($blocs as $b) {
        if ($b !== '') {
            $html .= '<p>' . nl2br(e($b)) . "</p>\n";
        }
    }
    return $html;
}

/** Lit un paramètre du site. */
function param(string $cle, string $defaut = ''): string
{
    static $cache = null;
    if ($cache === null) {
        $cache = [];
        foreach (db()->query('SELECT cle, valeur FROM parametres') as $row) {
            $cache[$row['cle']] = $row['valeur'];
        }
    }
    return $cache[$cle] ?? $defaut;
}

function set_param(string $cle, string $valeur): void
{
    $stmt = db()->prepare('INSERT INTO parametres (cle, valeur) VALUES (?, ?)
                           ON CONFLICT(cle) DO UPDATE SET valeur = excluded.valeur');
    $stmt->execute([$cle, $valeur]);
}

function structure(): array
{
    static $s = null;
    return $s ??= require __DIR__ . '/structure.php';
}

/* ---------- CSRF ---------- */

function csrf_token(): string
{
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}

function csrf_check(): bool
{
    return isset($_POST['csrf']) && hash_equals(csrf_token(), (string) $_POST['csrf']);
}

/* ---------- Messages flash ---------- */

function flash(string $type, string $msg): void
{
    $_SESSION['flash'][] = ['type' => $type, 'msg' => $msg];
}

function flashes(): string
{
    $html = '';
    foreach ($_SESSION['flash'] ?? [] as $f) {
        $html .= '<div class="alert alert-' . e($f['type']) . '">' . e($f['msg']) . '</div>';
    }
    unset($_SESSION['flash']);
    return $html;
}

function redirect(string $url): never
{
    header('Location: ' . $url);
    exit;
}

function post(string $k): string
{
    return trim((string) ($_POST[$k] ?? ''));
}

/* ---------- Administration ---------- */

function is_admin(): bool
{
    return !empty($_SESSION['admin']);
}

function require_admin(): void
{
    if (!is_admin()) {
        redirect('login.php');
    }
}

/** Libellé d'une section à partir de sa clé. */
function section_label(string $cle): string
{
    $map = [
        'maternelle' => 'Maternelle',
        'primaire'   => 'Primaire',
        'secondaire' => 'Secondaire',
        'direction'  => 'Direction / Administration',
    ];
    return $map[$cle] ?? $cle;
}

function pourcentage(int $reussis, int $inscrits): string
{
    if ($inscrits <= 0) {
        return '—';
    }
    return number_format($reussis * 100 / $inscrits, 1, ',', ' ') . ' %';
}
