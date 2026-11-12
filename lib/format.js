/** Découpe un texte en paragraphes (séparés par une ligne vide). */
export function paragraphes(texte) {
  return String(texte || '')
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function pourcentage(reussis, inscrits) {
  if (!inscrits) return '—';
  return (Math.round((reussis * 1000) / inscrits) / 10).toLocaleString('fr-FR', { minimumFractionDigits: 1 }) + ' %';
}

export function nombreFr(n) {
  return Number(n).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function nomComplet(t) {
  return [t.nom, t.postnom, t.prenom].filter(Boolean).join(' ');
}

export function texte(formData, cle, max = 500) {
  return String(formData.get(cle) ?? '').trim().slice(0, max);
}
