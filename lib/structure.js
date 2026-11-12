// Organisation pédagogique du Collège Saint Alfred.
export const STRUCTURE = {
  maternelle: {
    titre: 'Section Maternelle',
    icone: '🧸',
    classes: ['1ère maternelle', '2ème maternelle', '3ème maternelle'],
  },
  primaire: {
    titre: 'Section Primaire',
    icone: '📘',
    classes: ['1ère primaire', '2ème primaire', '3ème primaire', '4ème primaire', '5ème primaire', '6ème primaire'],
  },
  secondaire: {
    titre: 'Section Secondaire',
    icone: '🎓',
    classes: ['7ème année (Éducation de base)', '8ème année (Éducation de base)'],
    options: [
      { nom: 'Mécanique Générale', icone: '⚙️' },
      { nom: 'Électricité', icone: '💡' },
      { nom: 'Coupe et Couture', icone: '🧵' },
      { nom: 'Pédagogie Générale', icone: '👩‍🏫' },
      { nom: 'Commerciale et Informatique', icone: '💻' },
      { nom: 'Construction', icone: '🏗️' },
    ],
    niveauxOptions: ['1ère', '2ème', '3ème', '4ème'],
  },
};

export const SECTIONS_PERSONNEL = ['direction', 'maternelle', 'primaire', 'secondaire'];

export function sectionLabel(cle) {
  return (
    { direction: 'Direction / Administration', maternelle: 'Maternelle', primaire: 'Primaire', secondaire: 'Secondaire' }[cle] ||
    cle
  );
}

export const EXAMENS = [
  'ENAFEP (fin du primaire)',
  "TENASOSP (fin de l'éducation de base)",
  "Examen d'État",
  'Résultats internes',
];

export function toutesLesClasses() {
  const s = STRUCTURE;
  return [
    ...s.maternelle.classes,
    ...s.primaire.classes,
    ...s.secondaire.classes,
    ...s.secondaire.options.map((o) => 'Option ' + o.nom),
  ];
}
