'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const ONGLETS = [
  ['/', 'Accueil'],
  ['/historique', 'Historique'],
  ['/autorisation', 'Autorisation'],
  ['/palmares', 'Palmarès'],
  ['/enseignants', 'Liste des enseignants'],
  ['/contact', 'Nous contacter'],
];

export default function Nav() {
  const chemin = usePathname();
  const [ouvert, setOuvert] = useState(false);
  return (
    <>
      <button
        className="nav-toggle"
        aria-expanded={ouvert}
        aria-controls="menu"
        aria-label="Ouvrir le menu"
        onClick={() => setOuvert(!ouvert)}
      >
        ☰
      </button>
      <nav id="menu" className={'nav' + (ouvert ? ' open' : '')}>
        {ONGLETS.map(([href, libelle]) => {
          const actif = href === '/' ? chemin === '/' : chemin.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={actif ? 'active' : ''}
              aria-current={actif ? 'page' : undefined}
              onClick={() => setOuvert(false)}
            >
              {libelle}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
