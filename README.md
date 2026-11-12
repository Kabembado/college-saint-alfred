# Site web du Collège Saint Alfred

Site dynamique de l'école privée **Collège Saint Alfred** – Commune de la Muya, Mbujimayi, Kasaï Oriental (RDC).

## Onglets du site

| Onglet | Fichier | Contenu |
|---|---|---|
| Accueil | `index.php` | Présentation, sections (maternelle, primaire, secondaire) et les 6 options |
| Historique | `historique.php` | Histoire de l'école (texte modifiable) |
| Autorisation | `autorisation.php` | Arrêtés / agréments officiels |
| Palmarès | `palmares.php` | Résultats ENAFEP, TENASOSP, Examen d'État et lauréats, par année scolaire |
| Liste des enseignants | `enseignants.php` | Personnel par section, avec photo |
| Nous contacter | `contact.php` | Coordonnées + formulaire (messages lus dans l'administration) |

## Administration

Adresse : `votre-site/admin/`

À la **première visite**, le site demande de créer le mot de passe administrateur.
Faites-le **immédiatement après la mise en ligne**. Depuis l'administration, on peut :

- modifier l'historique, le texte d'autorisation, le téléphone, l'e-mail, l'adresse ;
- ajouter / modifier / supprimer les enseignants (avec photo) ;
- publier les résultats d'examens et les lauréats ;
- ajouter les références des documents d'autorisation ;
- lire les messages envoyés via « Nous contacter ».

## Hébergement

- PHP 8.1 ou plus récent, avec l'extension **pdo_sqlite** (présente chez la plupart des hébergeurs).
- Copier tous les fichiers sur l'hébergement (par FTP ou le gestionnaire de fichiers).
- Les dossiers `data/` et `uploads/enseignants/` doivent être accessibles en écriture par le serveur.
- La base de données (`data/college.sqlite`) est créée automatiquement.
- **Sauvegarde** : copier régulièrement `data/college.sqlite` et `uploads/enseignants/`.

## Tester sur son ordinateur

```bash
php -S localhost:8000
```
puis ouvrir http://localhost:8000

## Modifier les classes et options

La liste des classes et des options est dans `includes/structure.php`.
