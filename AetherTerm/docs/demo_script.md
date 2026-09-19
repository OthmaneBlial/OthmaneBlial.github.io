# AetherTerm — script de démonstration réel

Ce document prépare la capture de la phase 7. Il ne constitue pas une vidéo et ne remplace pas la validation du produit final. La capture ne pourra commencer qu'après fermeture des portes des phases 0 à 6 et vérification d'une release publique.

## Conditions d'entrée

- Utiliser le commit/tag de la release réellement publiée, pas un checkout de développement différent.
- Utiliser une machine Linux jetable pour l'agent et un navigateur séparé pour l'opérateur ; ne pas filmer une configuration qui n'a pas été testée.
- Créer les identités dans un répertoire temporaire avec un mot de passe et un jeton non réutilisables. Aucun secret, hostname privé, nom de compte ou contenu personnel ne doit apparaître dans l'image ou l'audio.
- Vérifier avant la prise que la CI du tag est verte, que les sommes SHA-256 correspondent aux fichiers téléchargés et que le parcours documenté fonctionne depuis ces artefacts.

## Parcours à enregistrer

1. **Problème réel — 5 à 8 secondes**
   - Montrer brièvement un terminal Linux autorisé et la console navigateur vide.
   - Titre sobre : `Un terminal privé pour un agent Linux enrôlé`.
   - Ne pas dire « remplacement SSH », « production-ready » ou « accès distant sécurisé » sans preuve de la release correspondante.

2. **Installation et démarrage — 15 à 25 secondes**
   - Montrer l'installation de l'artefact publié dans un environnement propre, avec les commandes réellement utilisées dans `docs/INSTALL.md`.
   - Montrer `aetherterm-admin init`, l'enrôlement d'un agent et le démarrage du serveur et de l'agent avec des fichiers de secrets privés.
   - Garder les valeurs sensibles hors champ ; afficher seulement des chemins temporaires anonymisés si nécessaire.

3. **Premier shell — 15 à 20 secondes**
   - Ouvrir `/web/`, se connecter avec le mot de passe temporaire et sélectionner l'appareil connecté.
   - Exécuter une commande non sensible et identifiable, par exemple `printf 'AETHERTERM_DEMO\\n'` puis `uname -s`.
   - Laisser visibles l'état connecté, le nom de l'appareil et la sortie réelle du PTY.

4. **Fonctions principales — 25 à 40 secondes**
   - Montrer une seconde session PTY indépendante si elle est toujours couverte par la release.
   - Montrer une interaction terminal réellement validée : historique, redimensionnement, Unicode ou édition Vim, sans couper une erreur.
   - Montrer la fermeture explicite d'une session et le retour à l'état vide.

5. **Récupération — 10 à 15 secondes**
   - Provoquer uniquement une coupure déjà validée par la matrice de tests.
   - Montrer l'état hors ligne, la reconnexion documentée et l'ouverture d'un nouveau shell. Ne pas laisser croire qu'un ancien shell est repris si la politique de la release le ferme.

6. **Fin — 5 secondes**
   - Se déconnecter et laisser apparaître l'écran de connexion.
   - Titre final : `AetherTerm · early alpha · voir les limites et la release dans le README`.

## Contrôle avant montage

- Conserver les prises brutes et noter le tag, le hash, l'OS, le navigateur et les artefacts utilisés.
- Rejouer le parcours complet sans accélérer une étape qui cacherait un échec.
- Retirer les prises contenant un secret, une erreur non expliquée ou une fonction absente de la release.
- Faire relire le script et une prise complète par une personne qui n'a pas préparé l'environnement, quand la porte de revue externe sera ouverte.

## Montage et exports (phase 7 uniquement)

Utiliser obligatoirement la skill `ffmpeg-video-editor` après la validation des phases 0 à 6. Le montage devra conserver l'ordre problème → installation → premier shell → fonctions principales → récupération, avec titres courts, recadrages lisibles et audio normalisé si une voix est enregistrée. Exporter une version README/GitHub et, seulement si le contexte reste compréhensible, une version courte pour les réseaux sociaux.

Vérifier chaque export avec `ffprobe` (durée, résolution, codecs, flux), contrôler le poids du fichier, décoder l'intégralité avec `ffmpeg -f null -` et effectuer une lecture humaine complète. Ne publier aucun lien vidéo avant cette vérification.
