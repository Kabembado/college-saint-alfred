<?php
/**
 * Organisation pédagogique du Collège Saint Alfred.
 */
return [
    'maternelle' => [
        'titre'   => 'Section Maternelle',
        'icone'   => '🧸',
        'classes' => ['1ère maternelle', '2ème maternelle', '3ème maternelle'],
    ],
    'primaire' => [
        'titre'   => 'Section Primaire',
        'icone'   => '📘',
        'classes' => ['1ère primaire', '2ème primaire', '3ème primaire', '4ème primaire', '5ème primaire', '6ème primaire'],
    ],
    'secondaire' => [
        'titre'   => 'Section Secondaire',
        'icone'   => '🎓',
        'classes' => ['7ème année (Éducation de base)', '8ème année (Éducation de base)'],
        'options' => [
            'Mécanique Générale',
            'Électricité',
            'Coupe et Couture',
            'Pédagogie Générale',
            'Commerciale et Informatique',
            'Construction',
        ],
        'niveaux_options' => ['1ère', '2ème', '3ème', '4ème'],
    ],
];
