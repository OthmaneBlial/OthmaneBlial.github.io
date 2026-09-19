# AetherTerm — audit du dépôt et feuille de route vers une première release crédible

> Audit initial du 19 septembre 2026 sur `main` (`c367976`). La section « Ce que montre réellement le dépôt » décrit ce **point de départ historique**, avant les changements suivis dans « Suivi d'exécution ». Les cases cochées indiquent les tâches validées depuis cet audit ; les cases ouvertes signalent encore du travail. Les releases, métadonnées et protections éventuelles du dépôt GitHub distant n'ont pas été auditées lors de l'audit initial.

## Décision de produit et règle de publication

**Cible proposée pour v1 :** un terminal Web **auto-hébergé, réservé à un opérateur**, permettant de gérer plusieurs agents Linux explicitement autorisés. Le serveur relaie des sessions PTY ; il ne parle pas le protocole SSH. Le mode local doit fonctionner sans exposition réseau ; le mode distant exige authentification, autorisation par appareil et transport chiffré vérifiés de bout en bout. Collaboration, SaaS, enregistrement des sessions, support Windows et compatibilité SSH sont hors périmètre v1 tant qu'ils ne sont pas implémentés et testés.

L'intérêt potentiel est la simplicité d'un agent Linux relié à une console privée, avec une installation reproductible et des limites de sécurité lisibles. **Aucun avantage concurrentiel ni volume de stars n'est établi par le dépôt actuel.** Avant d'affirmer une différence avec ttyd, Wetty, Apache Guacamole ou une autre solution, mesurer sur versions identifiées les mêmes tâches, les mêmes contraintes et le même niveau de sécurité ; consigner les sources et les limites dans `docs/POSITIONING.md`.

| Axe de positionnement à vérifier | Ce que prouve AetherTerm aujourd'hui | Conclusion permise |
| --- | --- | --- |
| Accès type SSH | Le code relaie des WebSockets vers `/bin/bash` ; aucun serveur ni client SSH. | Retirer « SSH replacement » ; aucune compatibilité SSH à revendiquer. |
| Passerelle de terminal Web | Une page Web ouvre un PTY par agent, avec affichage textuel et entrée ligne par ligne. | Comparer plus tard facilité d'installation, terminal interactif, sécurité et maintenance sur scénarios identiques. |
| Accès distant multi-appareils | Le serveur peut enregistrer plusieurs IDs, mais les exemples et sessions simultanées ne sont pas fiables. | Ne pas annoncer une solution multi-appareils mature avant les tests des phases 1–2. |

**Interdiction de publication v1 tant qu'une tâche P0 échoue.** Ne pas exposer ce code actuel sur un réseau non fiable : le navigateur peut ouvrir un shell sans authentification. Les P1 constituent le seuil de release documentée ; les P2 améliorent l'adoption sans masquer une lacune P0/P1. Chaque phase a une porte de sortie : une commande passée localement, un workflow CI vert, un paquet construit ou une page de release créée ne valent preuve que pour ce qu'ils testent. Les faits externes (publication, téléchargement, essais utilisateurs) exigent leurs propres vérifications.

## Ce que montre réellement le dépôt

| Domaine | Fait vérifiable | Conséquence |
| --- | --- | --- |
| Produit | `server/main.py` expose `/ws` et `/client` ; `client/main.py` lance `/bin/bash` dans un PTY ; `web/index.html` affiche la sortie et envoie une ligne de commande. | Prototype fonctionnel de relais WebSocket, pas remplacement SSH ni émulateur de terminal complet. |
| Accès au shell | `server/main.py:83-140` accepte `/ws`, liste les appareils et crée une session sans authentifier le navigateur. `term_input` et `resize` vérifient seulement l'existence de l'ID, pas son propriétaire. | Toute personne atteignant le serveur peut demander un shell ; un autre navigateur connaissant un ID peut injecter des entrées. |
| Identité de l'agent | `server/main.py:16-20` contient trois jetons publics ; `:161-180` accepte tout identifiant d'appareil avec n'importe quel jeton valide et journalise huit caractères du jeton. `client/main.py:115` impose `--token`. | Aucune attribution sûre entre identité de l'agent et appareil ; secrets dans le code, les arguments de processus et les exemples systemd. |
| Transport | `client/main.py:15` et `web/index.html:190-192` utilisent `ws://` ; le serveur ne configure pas TLS. Le navigateur affiche pourtant « encrypted ». | Les affirmations de chiffrement du README, des bannières et de l'interface sont fausses pour le lancement documenté. |
| Sessions | Un seul `session_id`, `fd` et `read_task` par agent (`client/main.py:41-81`) ; l'ID est remplacé à une deuxième demande. Pas de fermeture de PTY à la déconnexion du navigateur ; `server/main.py:203-205` retire l'appareil sans supprimer ses sessions. | Plusieurs utilisateurs/sessions, déconnexions et reprises peuvent perdre, croiser ou laisser tourner des processus. |
| Terminal et UX | `web/index.html:156-170` rend du texte dans un `div` et reçoit une ligne dans un `input` ; `:303-385` supprime les séquences ANSI et remplace approximativement des caractères ; `:287-299` lance une commande de démonstration sans demande. L'URL WS est fixée à `localhost:8001`. | Programmes plein écran, touches de contrôle, Unicode et accès depuis un téléphone ou un autre port ne sont pas correctement couverts. |
| Installation | `server/requirements.txt` et `client/requirements.txt` ne fixent aucune version ; pas de manifeste de paquet, verrouillage, conteneur ni vérification d'installation propre. Le README revendique Python 3.8+ sans matrice de tests. | Installation et compatibilité non reproductibles ; `pip install` global dans le guide. |
| Présentation | `README.md` revendique sécurité, reconnexion, multi-appareils et usage mobile au-delà des preuves ; il mentionne `docs/` et des `__init__.py` absents. Ses exemples `abc123`, `token1`… ne sont pas autorisés par le serveur. Aucune capture ou démo suivie par Git. | Première expérience et crédibilité fragiles ; le README ne fournit pas de preuve visuelle du produit. |
| Qualité et distribution | Aucun test, workflow `.github/`, changelog, manifeste de release ou binaire suivi dans ce checkout ; aucun tag local. `.gitignore` ignore seulement deux dossiers `__pycache__`. | Pas de garde automatique ni de chemin vérifié vers une version téléchargeable. L'état des releases distantes est non vérifié. |

**Essais effectués pour cet audit :** syntaxe Python des deux modules et JavaScript intégré validée ; installation non figée des dépendances dans un environnement Python 3.13 temporaire hors dépôt ; serveur et agent exécutés sur `127.0.0.1`. Un navigateur WebSocket **sans jeton** a reçu la liste d'appareils et un `session_started`. Un second navigateur WebSocket, également sans jeton, a envoyé une commande dans cette session et sa sortie a été observée sur la première connexion. La page d'accueil a été regardée à largeur normale et à 375 px ; aucune erreur de débordement n'a été relevée **sur cet écran vide**. L'interaction graphique complète et les autres tailles d'écran n'ont pas été validées. L'essai n'évalue pas la tenue en charge ni le comportement sur Linux distant. Aucun fichier du projet n'a été modifié par ces essais.

## Phases et dépendances

| Phase | Priorité | Porte de sortie |
| --- | --- | --- |
| 0. Cadrage et vérité des promesses | P0 | Cas d'usage, limites et modèle de menace écrits ; messages dangereux retirés. |
| 1. Sécurité d'accès | P0 | Impossible de lister, ouvrir ou piloter un shell sans identité et droit sur l'appareil ; transport distant sûr. |
| 2. Session et terminal fiables | P0 | PTY isolé par session, fermeture propre, terminal interactif et Unicode testés. |
| 3. Produit et expérience | P1 | Parcours d'installation et d'usage compréhensible, accessible et vérifié sur desktop/mobile. |
| 4. Architecture, tests et qualité | P1 | Suite automatisée, configuration stable, dépendances et comportement vérifiés. |
| 5. Documentation et preuves produit | P1 | Installation propre reproductible, README exact, captures et comparaison sourcées. |
| 6. CI, distribution, release et GitHub | P1 | Artefacts installés/testés, release et page GitHub vérifiées, support contributeur prêt. |
| 7. Vidéo réelle du produit terminé | P2, **dernière** | Vidéo issue d'une version finalisée et vérifiée, exportée et lue intégralement. |

## Suivi d'exécution

Une case est cochée seulement après satisfaction de **tous** les critères d'acceptation et validations de la tâche. Les étapes partielles restent ouvertes, même si leurs fichiers ont été modifiés. Les preuves sont consignées dans les commits, les tests et, pour les services externes, les vérifications de la ressource publiée.

- [ ] 0.1 Contrat v1 et modèle de menace — documents rédigés ; revue par une autre personne encore requise.
- [x] 0.2 Communication honnête — README, bannières et exemples locaux alignés sur le code ; jetons publics supprimés ; revue des chaînes et démarrage local validés.
- [ ] 0.3 Valeur et comparaison avec retours réels — sources officielles et protocole de mesure documentés ; essais comparables et 3 à 5 retours consentis absents.
- [x] 1.1 Authentification navigateur et droits de session — le contrat v1 donne au seul opérateur accès à tous les appareils enrôlés, sans rôles supplémentaires ; visiteur anonyme, mauvaise origine et second navigateur ne peuvent pas contrôler une session. Rotation du mot de passe, déconnexion et expiration d'un cookie WebSocket actif vérifiées localement et dans le run Linux [35447380946](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35447380946). L'examen contradictoire externe de la phase 0 reste requis avant publication.
- [x] 1.2 Enrôlement et révocation d'agents — identité liée à l'appareil, fichier 0600, rotation et révocation vérifiées par tests et aller-retour réel sur boucle locale.
- [ ] 1.3 Transport distant chiffré — HTTPS/WSS direct et proxy Caddy 2.11.4 testés localement avec certificat approuvé/rejeté ; accès distant et navigateur graphique non vérifiés.
- [x] 1.4 Protocole et ressources bornés — schémas, trames, quotas de sessions, sessions opérateur et sockets bornés, démarrage borné à 10 s, envois serveur vers navigateur/agent bornés à 3 s et limiteurs IP distincts ; limite Uvicorn à 64 Kio et formulaire de connexion lu avec plafond de 4 Kio, test de trame excessive isolée. Le run Linux [35448700866](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35448700866) a relayé 4,7 Mio de sortie continue sur 12,7 s avec un second navigateur réactif, +0,1 Mio RSS et 0,26 s CPU ; le test de navigateur lent a relayé 1,6 Mio avec +0,1 Mio RSS et 0,07 s CPU, puis fermé sa session. Rafales de reconnexions et erreurs protocolaires sont couvertes par la suite. Ces mesures concernent un runner CI et ne constituent pas une capacité de production.
- [x] 2.1 PTY isolés et cycle de vie — deux shells et navigateurs, fermeture explicite, fermeture du navigateur, SIGTERM/SIGINT de l'agent et coupure/redémarrage du serveur validés localement et par le run Linux [35444767496](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35444767496) sur `f0b1cdd` ; aucune reprise d'ancien shell n'est revendiquée.
- [x] 2.2 Terminal interactif et Unicode exact — xterm.js local, UTF-8 fragmenté, couleurs ANSI, `less`, redimensionnement et collage Unicode réel testés avec Chrome et un PTY macOS ; bouton « Send Ctrl+C » interrompant `cat`, puis commande suivante, vérifié. Chromium, Firefox et WebKit sur Ubuntu CI [35449348945](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35449348945) valident chacun sortie Unicode, Ctrl+C, historique Flèche haut, édition et sauvegarde dans Vim, avec vrai agent/PTY et captures conservées. Presse-papiers hors Chrome et toucher physiques restent des limites de support et sont suivis en 3.2.
- [x] 2.3 Reconnexion et états d'erreur — ancien shell terminé et nouvel agent enregistré après redémarrage réel du serveur ; révocation arrête l'agent, backoff réinitialisé après succès. Le parcours Linux [35449348945](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35449348945) a coupé puis rétabli le réseau de Chromium, Firefox et WebKit : état hors ligne détecté en 0,02–0,06 s, reconnexion en 0,39–0,44 s, puis nouveau shell réel ouvert ; il vérifie aussi réauthentification après redémarrage du serveur. Délais propres aux runners, sans garantie de réseau réel.
- [ ] 3.1 Premier démarrage jusqu'au shell — appareils enrôlés hors ligne, description, dernière activité de ce processus, étapes d'enrôlement et récupération d'état vérifiés dans Chrome ; un clone frais de `main` à `36f0836` a installé le paquet dans un nouvel environnement macOS et passé `scripts.demo_local --check`, mais l'installation Linux propre et les 3 à 5 essais observés restent nécessaires.
- [ ] 3.2 Interface accessible et responsive — vrais boutons, focus et sortie lisible par lecteur d'écran ; débordement horizontal absent à 320, 375, 390, 768 et 1280 px dans Chromium, Firefox et WebKit [35451256655](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35451256655), captures réelles bureau/mobile du run [35446357041](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35446357041). Deux onglets de vrais shells exposent leur panneau et se naviguent par flèches/Home/End avec focus vérifié dans les trois moteurs [35449548707](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35449548707) ; interaction tactile physique et revue humaine au lecteur d'écran restent à faire.
- [x] 3.3 Assets Web maîtrisés et identité visuelle — xterm.js 6.0.0 et FitAddon 0.11.0 figés, build local et licences incluses ; favicon SVG et ICO, CSP et PTY testés ; wheel installé en venv macOS propre avec assets servis localement et PTY réel. Le run Linux [35446887099](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35446887099) valide les assets de l'image conteneur et un vrai shell Chromium quand toutes les requêtes Web externes sont bloquées. Cela ne prouve pas une installation de machine complètement déconnectée avant le téléchargement des dépendances.
- [x] 4.1 Architecture et configuration testables — factory FastAPI et état par instance ; `ServerConfig` refuse les fichiers d'identité confondus et les assets incomplets, `AgentConfig` refuse les paramètres invalides avant connexion. Agent/PTY séparés, sous-protocole `aetherterm.v1` contrôlé, logs d'audit JSON bornés ; redémarrage réel et isolation de deux instances testés. Ruff et mypy passent sur 16 modules dans [35448920673](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35448920673).
- [x] 4.2 Suite de tests utile — 26 tests Python couvrent auth, agents, injection entre navigateurs, protocole, PTY, reconnexion, charge bornée et restauration privée ; le parcours Chromium avec vrai shell vérifie redémarrage, coupure réseau, Unicode, Vim et interruption. La [matrice de preuves](docs/TEST_MATRIX.md) associe les frontières sensibles aux scénarios et aux limites ; les runs Linux [35448700866](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35448700866), [35448889467](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35448889467) et [35448920673](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35448920673) sont verts. Les essais physiques et externes ont des portes distinctes.
- [x] 4.3 Dépendances et maintenance vérifiables — manifeste Python, dépendances directes et transitives figées avec empreintes dans trois locks pour Python 3.13 ; installation neuve avec hashes sur macOS et dans tous les parcours Linux CI, builds du wheel, de l'archive source, de l'image et du binaire agent inclus. Ruff 0.16.7, mypy 2.3.1, scans du venv installé et de npm, ainsi que Gitleaks 8.30.1 sur l'historique complet passent dans [35448700866](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35448700866). Python 3.13 est la seule version déclarée ; les avis futurs nécessitent une veille et une mise à jour des locks.
- [ ] 5.1 Installation et déploiement reproductibles — guides local, wheel et conteneur écrits ; wheel installé hors checkout et conteneur testé avec un vrai PTY en CI Linux ; démo locale jetable démarrant serveur et agent, avec nettoyage vérifié sur macOS et ajouté à la CI Linux. Le parcours d'un clone frais `36f0836` avec lock runtime, contrôle des liens et `scripts.demo_local --check` passe sur macOS ; exemple de service systemd utilisateur pour boucle locale et contrôle de syntaxe ajoutés, mais essai humain Linux propre et cycle de vie du service restent requis.
- [ ] 5.2 Documentation architecture, sécurité et opérations — guides architecture, menaces, sécurité, TLS et opérations rédigés ; signalement privé GitHub activé et vérifié. Exercice automatisé en répertoire temporaire : sauvegarde/restauration des identités, invalidation d'une session navigateur et risque de réautorisation d'un ancien jeton après restauration d'un registre obsolète vérifiés ; revue contradictoire externe et exercice complet de récupération sur l'hôte cible encore requis.
- [ ] 5.3 README et captures réelles — captures Chromium bureau/mobile issues du PTY Linux réel, empreintes et provenance dans `docs/SCREENSHOTS.md` ; README et commandes encore à relire après finalisation du produit, comparaison et liens de release absents.
- [x] 6.1 CI bloquante — run `main` [35451805641](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35451805641) vert avec huit jobs et actions figées (Linux Python 3.13, 26 tests dont PTY réel, wheel installé, lint/typecheck, liens docs, assets Web, scans, Chromium/Firefox/WebKit, conteneur et binaire agent) ; captures navigateur conservées quand produites. La protection `main` exige les huit checks, branche à jour, historique linéaire et conversations résolues ; elle interdit force pushes et suppression. La [PR brouillon #1](https://github.com/OthmaneBlial/AetherTerm/pull/1) a montré `BLOCKED` lorsque le seul test volontaire de `linux-python` a échoué dans le [run 35449706256](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35449706256), tandis que les sept autres jobs passaient ; elle a été fermée sans merge et sa branche supprimée. L'administrateur conserve l'exception GitHub nécessaire aux pushes directs sur `main` demandés pour cette exécution : la règle ne bloque donc pas ses propres pushes.
- [ ] 6.2 Artefacts téléchargeables/installables — wheel et sdist conservés avec manifeste SHA-256 dans l'artifact CI [35452256389](https://github.com/OthmaneBlial/AetherTerm/actions/runs/35452256389) ; artifact téléchargé, deux empreintes vérifiées, wheel installé dans un nouveau venv macOS hors checkout et version `0.1.0a0` importée. Serveur conteneur non-root testé sur Linux CI ; le même run fournit l'agent Linux x86_64, reconnu comme ELF Linux x86-64 et vérifié contre `SHA256SUMS`. Le workflow tagué [.github/workflows/release.yml](.github/workflows/release.yml) attend maintenant la CI verte du même tag, reconstruit et hache ces fichiers, mais aucun tag/release public n'existe ; les artifacts CI expirent après sept jours, les autres plateformes et un second hôte restent non vérifiés.
- [ ] 6.3 Contributions et présentation GitHub — guide de contribution, politique de sécurité et modèles d'issues/PR ajoutés ; description et neuf topics factuels vérifiés sur la page GitHub, signalement privé activé. Un clone frais `36f0836` a suivi l'installation verrouillée et le contrôle d'onboarding macOS ; cela ne constitue pas encore un parcours par un contributeur humain externe. Image sociale 1280 × 640 préparée à partir de la vraie capture Chromium avec source HTML et empreinte dans `docs/SCREENSHOTS.md`, puis téléversée et confirmée visuellement dans les réglages publics du dépôt le 19 septembre 2026. Les liens de release et le parcours contributeur externe restent à vérifier.
- [ ] 6.4 Première release vérifiée — changelog, liste de contrôle et workflow de publication préparés ; aucun tag ni asset publié, portes P0/P1 encore ouvertes.
- [ ] 7.1 Capture du parcours final réel.
- [ ] 7.2 Montage, export et vérification vidéo.

### Phase 0 — Cadrage et vérité des promesses

#### 0.1 Définir le contrat v1 et son modèle de menace — P0
- **Objectif :** savoir qui peut piloter quel shell, depuis quel réseau et avec quels privilèges.
- **Changements :** formaliser opérateur unique, enrôlement d'agent, droits par appareil, durée/fin de session, modes local et distant, données sensibles, comportement en cas de proxy ; décider clairement des fonctions hors v1.
- **Fichiers :** nouveaux `docs/PRODUCT.md`, `docs/THREAT_MODEL.md`, éventuellement `docs/PROTOCOL.md` ; alignement de `README.md`.
- **Acceptation :** chaque route et chaque message WebSocket a une identité requise, une autorisation et une erreur définies ; un diagramme de flux distingue navigateur, serveur, agent et shell.
- **Validation :** revue de scénarios : visiteur anonyme, opérateur autorisé/non autorisé, agent usurpé, appareil déconnecté, navigateur croisé, proxy TLS ; revue par une autre personne avant la phase 1.
- **Dépendances/risques :** choix de sécurité à figer avant de coder ; éviter de promettre du multi-utilisateur si le contrat est mono-opérateur.

#### 0.2 Corriger immédiatement la communication trompeuse — P0
- **Objectif :** empêcher une installation dangereuse fondée sur des affirmations de sécurité erronées.
- **Changements :** retirer « secure », « encrypted WebSocket », « SSH replacement », « mobile » et « auto-reconnect » des surfaces où ces propriétés ne sont pas prouvées ; retirer les jetons d'exemple réels et les commandes d'exposition publique ; signaler explicitement le statut prototype et les limites jusqu'à la phase 6.
- **Fichiers :** `README.md`, bannières dans `server/main.py` et `client/main.py`, console de `web/index.html`.
- **Acceptation :** aucune instruction de démarrage ne laisse croire que `ws://` chiffre le trafic ni qu'un visiteur Web est authentifié ; exemples compatibles avec la configuration réelle.
- **Validation :** revue ligne à ligne des textes contre le code et essais de lancement local ; recherche des chaînes de promesse et des jetons dans le dépôt.
- **Dépendances/risques :** dépend du contrat 0.1 ; mettre de nouveau les promesses à jour quand elles deviennent effectivement vérifiées.

#### 0.3 Établir la valeur et la comparaison honnête — P1
- **Objectif :** choisir une raison concrète d'utiliser AetherTerm et un premier public testable.
- **Changements :** décrire trois tâches réelles (premier shell, deuxième appareil, récupération après coupure), mesurer temps/étapes/frictions, construire une matrice de comparaison sur versions et sources datées ; recueillir 3 à 5 retours consentis de personnes correspondant au public cible.
- **Fichiers :** `docs/PRODUCT.md`, nouveau `docs/POSITIONING.md`, `docs/RESEARCH_STATUS.md`, résumé factuel dans `README.md`.
- **Acceptation :** proposition de valeur en une phrase ; tableau avec critères identiques, « non vérifié » là où nécessaire ; décisions de périmètre reliées aux retours, sans inventer de traction.
- **Validation :** reproduire les trois tâches sur AetherTerm ; relire les sources concurrentes au moment de la comparaison ; conserver notes anonymisées et consentement hors dépôt si nécessaire.
- **Dépendances/risques :** l'audit présent n'a consulté aucune source externe concurrente ; absence de volontaires ne doit pas devenir une prétendue validation utilisateur.

### Phase 1 — Sécurité d'accès et de transport

#### 1.1 Authentifier le navigateur et autoriser chaque appareil/session — P0
- **Objectif :** empêcher l'accès anonyme et le détournement d'une session existante.
- **Changements :** ajouter une vraie connexion opérateur et sa durée de vie ; appliquer une vérification serveur à la négociation `/ws` puis à `list_devices`, `start_session`, `term_input`, `resize` et fermeture ; lier session, opérateur et appareil ; contrôler `Origin` et les droits par appareil ; rejeter la réutilisation d'ID entre connexions.
- **Fichiers :** refonte de `server/main.py` en modules `server/auth.py`, `server/sessions.py`, `server/protocol.py` ; état de connexion dans `web/`.
- **Acceptation :** un visiteur anonyme ne reçoit pas la liste ; un opérateur sans droit ne démarre rien ; un second navigateur ne peut écrire ni redimensionner une session qui ne lui appartient pas ; expiration/révocation ont un effet immédiat.
- **Validation :** tests WebSocket d'intégration à deux navigateurs et deux appareils ; rejouer l'essai d'injection ci-dessus et constater son refus ; tests d'origine et de session expirée.
- **Dépendances/risques :** 0.1 ; ne pas confondre ID de session imprévisible et autorisation ; protéger aussi l'interface statique selon le modèle retenu.

#### 1.2 Remplacer les jetons publics par un enrôlement d'agents — P0
- **Objectif :** attribuer à chaque agent une identité révocable et limiter les secrets exposés.
- **Changements :** supprimer `ALLOWED_TOKENS` codé en dur ; générer/enrôler un secret distinct par appareil via une commande explicite ; stocker hachage côté serveur et secret côté agent avec permissions restrictives ; prévoir rotation/révocation ; lire un fichier secret ou une variable d'environnement au lieu d'arguments visibles ; ne jamais journaliser de fragment de secret.
- **Fichiers :** `server/main.py` et futurs `server/auth.py`, `client/main.py`, configuration, exemples de service et `docs/SECURITY.md`.
- **Acceptation :** aucun secret fonctionnel dans Git ; un secret valide pour A ne peut enregistrer B ; révocation de A ferme ses connexions et empêche sa reprise ; logs et liste des processus ne révèlent pas le secret.
- **Validation :** tests identité/appareil, doublon, rotation, révocation et fuite dans logs ; analyse des exemples systemd et scan de secrets.
- **Dépendances/risques :** 1.1 ; concevoir la migration des anciens jetons publiés comme leur révocation, pas comme une simple suppression du fichier.

#### 1.3 Rendre le transport distant réellement chiffré — P0
- **Objectif :** protéger identités et commandes sur un réseau non fiable.
- **Changements :** calculer `ws`/`wss` depuis l'origine du navigateur ; ajouter `wss://` côté agent, vérification de certificat et configuration de confiance ; documenter une terminaison TLS de confiance et les en-têtes de proxy ; limiter `ws://` au mode local sur boucle locale ; refuser une configuration distante en clair par défaut.
- **Fichiers :** `web/index.html` ou nouveau client Web, `client/main.py`, configuration serveur, `docs/DEPLOYMENT.md`, exemples proxy.
- **Acceptation :** accès depuis un autre hôte/port opérationnel en HTTPS/WSS ; certificat invalide refusé ; jeton non transmis en clair dans le mode distant ; aucun contournement `verify=False`.
- **Validation :** test navigateur et agent derrière proxy TLS, test certificat invalide, test de démarrage distant non chiffré et inspection des journaux ; documenter la chaîne de confiance testée.
- **Dépendances/risques :** 1.1–1.2 ; certificats et réseaux de test nécessaires, mais aucun service externe imposé à l'utilisateur local.

#### 1.4 Borner le protocole et les ressources — P0
- **Objectif :** éviter qu'un message malformé, une sortie massive ou des connexions répétées n'épuisent le serveur.
- **Changements :** valider schémas/types, tailles d'entrée/sortie, `rows`/`cols`, formats base64 et états autorisés ; imposer délais, quotas de sessions, sorties bornées et backpressure ; remplacer le compteur IP en mémoire par un mécanisme adapté au déploiement retenu et séparer quotas navigateur/agent ; rendre les erreurs sûres et explicites.
- **Fichiers :** `server/main.py`, futurs `server/protocol.py` et `server/limits.py`, `client/main.py`.
- **Acceptation :** message inconnu/incomplet/surdimensionné refusé sans fermer d'autres sessions ; bornes mesurées ; pas de croissance illimitée du registre d'IP ou des buffers ; erreurs sans trace ni secret exposé au client.
- **Validation :** tests de cas limites et de charge modérée, reconnexion en rafale, sortie continue, fermeture lente ; contrôle mémoire/CPU et nettoyage.
- **Dépendances/risques :** 1.1 et architecture 4.1 ; un simple quota IP ne constitue pas une authentification.

### Phase 2 — Sessions et terminal utilisables

#### 2.1 Isoler les PTY et maîtriser leur cycle de vie — P0
- **Objectif :** obtenir une session indépendante par connexion autorisée et aucun shell orphelin.
- **Changements :** registre `session_id → PTY/processus/tâches` côté agent, association stricte appareil/session côté serveur ; événements `ready`, `close`, `exit` et déconnexion ; terminaison du groupe de processus, attente du fils et fermeture de FD ; politique explicite de reprise ou fermeture après coupure.
- **Fichiers :** `client/main.py` découpé en `client/pty.py`/`client/session.py`, `server/sessions.py`, protocole et UI.
- **Acceptation :** deux sessions parallèles sur le même agent ne mélangent jamais entrée/sortie ; fermer un onglet termine ou expire sa session selon la politique écrite ; la déconnexion de l'agent retire les sessions et affiche l'état ; aucun fils ne reste après arrêt normal.
- **Validation :** intégration avec deux navigateurs, deux appareils, fermeture/reconnexion, SIGINT/SIGTERM et recherche des processus/FD restants ; tests de concurrence.
- **Dépendances/risques :** phase 1 ; `pty.fork`, signaux et `/bin/bash` sont POSIX : périmètre Linux à confirmer en CI avant toute revendication multiplateforme.

#### 2.2 Fournir un vrai terminal interactif et un flux texte exact — P0
- **Objectif :** rendre les applications CLI courantes utilisables et préserver leurs octets.
- **Changements :** intégrer un émulateur terminal maintenu (p. ex. xterm.js) avec chargement maîtrisé ; passer les frappes, touches spéciales, copier/coller et dimensions du terminal ; encoder/décoder les octets avec `TextEncoder`/`TextDecoder` en flux ou un protocole binaire ; supprimer les substitutions de caractères et la suppression ANSI ; retirer les commandes `echo` automatiques.
- **Fichiers :** `web/index.html` ou `web/src/`, assets empaquetés, `client/main.py`, messages `term_data`/`resize`.
- **Acceptation :** `vim`/`less`, Ctrl+C, flèches, couleurs, redimensionnement, Unicode accentué/CJK et sortie fragmentée fonctionnent ; aucune commande n'est exécutée automatiquement à l'ouverture ; état prêt affiché seulement quand le PTY l'est.
- **Validation :** scénarios automatisés avec faux PTY + parcours manuel réel sur Linux ; contrôles de rendu desktop/mobile, capture du résultat, test octets Unicode coupés entre deux trames.
- **Dépendances/risques :** 2.1 ; taille et licences des assets Web, performance d'une sortie longue, comportement du presse-papiers mobile.

#### 2.3 Stabiliser les reconnexions et les états d'erreur — P0
- **Objectif :** rendre prévisibles les coupures réseau et les erreurs d'authentification.
- **Changements :** faire respecter ou retirer `--reconnect` ; réinitialiser le backoff après succès, distinguer refus définitif et panne transitoire, ajouter fermeture/retour d'état Web et politique de reprise ; interdire les envois quand le socket est fermé ; rafraîchir la liste des agents automatiquement.
- **Fichiers :** `client/main.py`, `web/`, `server/sessions.py`, documentation d'exploitation.
- **Acceptation :** fermeture du serveur affiche « hors ligne » ; retour du serveur permet la reconnexion selon la politique documentée sans commande dupliquée ; jeton révoqué n'entraîne pas de boucle infinie ; aucune sortie ne se réaffiche dans la mauvaise session.
- **Validation :** couper puis rétablir serveur, agent et navigateur à des moments distincts ; mesurer délai de retour et vérifier l'absence de processus/sessions fantômes.
- **Dépendances/risques :** 1.2, 2.1–2.2 ; reprise d'un shell existant demande un choix de sécurité explicite, ne pas la promettre par défaut.

### Phase 3 — Expérience produit et qualité visuelle

#### 3.1 Construire un parcours clair du premier démarrage au premier shell — P1
- **Objectif :** qu'une personne comprenne quoi lancer, sur quelle machine, et quand l'appareil est prêt.
- **Changements :** écran d'accueil avec statut réseau/authentification, étapes courtes pour enrôler un agent, liste à jour avec description/statut/dernière activité, états vide/chargement/erreur, action de fermer une session et messages de récupération précis ; supprimer les alertes et logs de sécurité trompeurs.
- **Fichiers :** `web/`, `server/` pour métadonnées d'appareil, `README.md`, guide de démarrage.
- **Acceptation :** premier shell obtenu depuis une installation propre sans éditer du Python ; appareil absent, refus d'accès et perte réseau expliqués par l'UI ; aucune action shell avant confirmation explicite.
- **Validation :** observation de 3 à 5 essais sur machine propre, journal des hésitations et chronométrage ; scénarios navigateur pour chaque état.
- **Dépendances/risques :** phases 1–2 ; ne jamais afficher une commande d'enrôlement contenant un secret réutilisable dans une capture publique.

#### 3.2 Donner au terminal une interface soignée et accessible — P1
- **Objectif :** rendre les contrôles utilisables au clavier, à la souris et au toucher sans ambiguïté.
- **Changements :** hiérarchie visuelle et états cohérents, vrais boutons d'appareil au lieu de `div @click`, focus visible, libellés accessibles, contraste, raccourcis documentés, adaptation du panneau terminal et des contrôles aux petits écrans ; traiter la largeur `100%` plus padding/bordure et le clavier mobile.
- **Fichiers :** `web/index.html` ou composants/styles issus de sa refonte, assets locaux.
- **Acceptation :** navigation complète au clavier ; aucune perte de contrôle à 320, 375, 390, 768 et 1280 px ; pas de débordement horizontal du document ni du terminal ; statut et erreurs annoncés sans dépendre seulement de la couleur.
- **Validation :** captures réelles aux quatre largeurs, inspection `scrollWidth`, console, tests clavier/lecteur d'écran de base et interaction tactile sur appareil ou navigateur mobile clairement identifié.
- **Dépendances/risques :** 2.2 et 3.1 ; le seul écran vide a été vu à 375 px durant l'audit, ce qui ne valide pas une session mobile.

#### 3.3 Maîtriser le chargement Web et l'identité visuelle — P1
- **Objectif :** une interface disponible et cohérente même quand le CDN tiers ne l'est pas.
- **Changements :** intégrer/figer les dépendances frontend et leurs licences, produire des assets versionnés livrés avec le paquet ; créer logo/favicon sobres, thème et messages homogènes ; réduire les requêtes externes et définir une politique CSP compatible avec l'application.
- **Fichiers :** `web/`, configuration de build/frontend, paquet serveur, `LICENSE`/notices, README.
- **Acceptation :** l'interface se charge sans accès à `cdn.jsdelivr.net`, sans erreur console ni ressource 404 ; assets présents dans le wheel et l'image ; aucune nouvelle dépendance non documentée.
- **Validation :** lancement hors ligne après installation du paquet, inspection réseau/console, build de production et audit de licences.
- **Dépendances/risques :** 2.2 ; coût de maintenance du bundler et intégration des assets Python.

### Phase 4 — Architecture, tests, sécurité continue

#### 4.1 Séparer transport, configuration et cycle de vie — P1
- **Objectif :** rendre les règles de sécurité et de session testables sans effets de bord à l'import.
- **Changements :** factory FastAPI et configuration typée, état par instance plutôt que dictionnaires globaux, gestion structurée des connexions, séparation agent/PTY, messages protocolaires versionnés, logs structurés avec masquage ; retirer impressions de « sécurité active » non contrôlées.
- **Fichiers :** `server/main.py`, `client/main.py`, nouveaux modules sous `server/` et `client/`, `docs/ARCHITECTURE.md`.
- **Acceptation :** démarrage/arrêt répétés sans état résiduel ; paramètres invalides refusés au lancement ; structure documentée assez clairement pour suivre une entrée du navigateur jusqu'au PTY.
- **Validation :** tests unitaires sur configuration/protocole, tests d'intégration multi-instance, revue du cycle de vie et des logs.
- **Dépendances/risques :** maintenir les contrats des phases 1–2 ; refactoriser par tranches afin de préserver les scénarios d'attaque et de terminal déjà couverts.

#### 4.2 Construire une suite de tests utile — P1
- **Objectif :** empêcher le retour des vulnérabilités et des régressions de terminal.
- **Changements :** ajouter `tests/` pour auth, droits par appareil, sessions, reconnexion, protocole invalide, sortie Unicode et PTY ; tests navigateur pour premier shell et états d'erreur ; fixtures sans secrets réels et serveur écoutant seulement sur loopback.
- **Fichiers :** `tests/`, éventuels `web/tests/`, `pyproject.toml`, scripts de test.
- **Acceptation :** la suite reproduit et bloque le cas d'injection constaté ; tests déterministes sur la version Python et la plate-forme annoncées ; scénarios critiques exécutés en CI.
- **Validation :** lancement local propre et CI, exécution répétée des tests concurrents, couverture des chemins sensibles examinée manuellement plutôt qu'un pourcentage seul.
- **Dépendances/risques :** phases 1–3 ; tests PTY à faire sur Linux natif, simulations seules insuffisantes pour promettre le comportement réel.

#### 4.3 Rendre dépendances et maintenance vérifiables — P1
- **Objectif :** installer les mêmes composants et détecter les problèmes avant une release.
- **Changements :** créer `pyproject.toml` avec version, plage Python réellement testée, extras serveur/agent/dev ; contraintes ou lock de build, mises à jour contrôlées, formatage/lint/typecheck adaptés, scan de dépendances et de secrets ; élargir `.gitignore` pour venv, caches, builds et captures sensibles.
- **Fichiers :** `pyproject.toml`, contraintes/lock, `.gitignore`, configuration des outils, `README.md`.
- **Acceptation :** installation neuve sur chaque Python officiellement supporté ; résolution reproductible pour build/release ; absence de dépendance critique connue non traitée ou documentée ; aucun secret/config locale suivi par Git.
- **Validation :** install en environnements propres, vérifications lint/type/tests, scan secrets et dépendances ; un échec bloque la CI.
- **Dépendances/risques :** 4.1 ; ne garder « Python 3.8+ » que si toute la matrice, dépendances incluses, passe réellement.

### Phase 5 — Onboarding, documentation et preuves

#### 5.1 Fournir une installation propre et un déploiement compréhensible — P1
- **Objectif :** permettre un premier usage sans copier des secrets publics ni modifier le code.
- **Changements :** guide local en venv avec commandes copiables, génération/enrôlement d'identités, exemple de configuration sans secret, guide TLS/proxy, service systemd sûr, dépannage et désinstallation ; script de démonstration **local uniquement** avec données jetables et arrêt propre ; ne pas installer via `pip` global.
- **Fichiers :** `README.md`, `docs/QUICKSTART.md`, `docs/DEPLOYMENT.md`, `docs/SECURITY.md`, `examples/`, éventuels scripts.
- **Acceptation :** depuis clone ou paquet neuf, deux terminaux suffisent pour serveur + agent et le navigateur ouvre un shell autorisé ; le mode distant sécurisé possède une procédure distincte ; les exemples d'appareils multiples utilisent de vrais enrôlements.
- **Validation :** suivre chaque commande sur Linux propre et sur la plate-forme hôte annoncée ; vérifier chemins, permissions des fichiers secrets, arrêt et nettoyage ; faire essayer le guide sans aide orale.
- **Dépendances/risques :** phases 1–4 ; un environnement de démonstration ne prouve pas une installation de production.

#### 5.2 Expliquer architecture, limites et opérations — P1
- **Objectif :** permettre à un administrateur d'évaluer le risque et de diagnostiquer une panne.
- **Changements :** diagramme exact, tableau des ports/flux, modèle de permissions, rotation/révocation, collecte minimale de logs, sauvegarde nécessaire ou absence de données durables, limites de charge, sécurité du shell et récupération après panne ; politique de divulgation responsable.
- **Fichiers :** `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/OPERATIONS.md`, `SECURITY.md`, `README.md`.
- **Acceptation :** documentation identifie ce qui est chiffré, authentifié, conservé ou non ; aucune promesse « sécurisé » sans configuration et test précis ; chemins de contact sécurité fonctionnels.
- **Validation :** revue contradictoire docs/code/config ; exercice de rotation de secret et arrêt d'un agent ; lecture par une personne externe.
- **Dépendances/risques :** 0.1 et phases 1–4 ; ne pas publier de configuration qui ouvre un shell sur Internet sans garde.

#### 5.3 Refaire le README et capturer des preuves réelles — P1
- **Objectif :** expliquer en quelques secondes pourquoi et comment essayer le produit fini.
- **Changements :** titre et promesse limitée, captures statiques desktop et mobile issues du produit réel, quickstart vérifié, fonctions effectivement testées, limites/support, architecture, comparaison sourcée, liens install/release/contribution ; captures expurgées pour cacher hôtes, comptes et secrets.
- **Fichiers :** `README.md`, `assets/screenshots/`, `docs/POSITIONING.md`, éventuels `docs/DEMO_SCRIPT.md`.
- **Acceptation :** chaque image correspond à une build identifiable ; toutes les commandes et liens fonctionnent ; aucun fichier absent dans l'arborescence documentée ; l'aperçu GitHub est lisible sur écran étroit.
- **Validation :** rendu Markdown, audit des liens, comparaison captures/produit exécuté, examen des informations sensibles et du poids des médias.
- **Dépendances/risques :** phases 1–4 et 5.1 ; réserver la **vraie vidéo montée** à la phase 7, sans la préproduire ici.

### Phase 6 — CI, distribution, release et accueil GitHub

#### 6.1 Automatiser les contrôles bloquants — P1
- **Objectif :** obtenir une preuve répétable à chaque PR et tag candidat.
- **Changements :** workflows `.github/workflows/` pour format/lint/type/tests, tests d'intégration PTY sur Linux, build wheel, installation propre, tests navigateur, scans de secrets/dépendances, contrôle des docs et assets ; permissions minimales, versions d'actions figées, artefacts d'échec utiles sans secrets.
- **Fichiers :** `.github/workflows/`, `pyproject.toml`, `tests/`, scripts de validation.
- **Acceptation :** PR bloquée si un test sécurité ou terminal échoue ; matrice exacte des Python/OS annoncés verte ; vérification du paquet construit, pas seulement du checkout.
- **Validation :** exécuter chaque job, provoquer volontairement un échec de contrôle en branche de test, examiner permissions/logs ; relever l'URL et le résultat du run exact avant toute affirmation publique.
- **Dépendances/risques :** 4.2–4.3, 5.1 ; coût CI des tests navigateur/PTY et disponibilité de runners d'architecture spécifique.

#### 6.2 Produire des artefacts téléchargeables et installables — P1
- **Objectif :** proposer une installation de release simple avec support de plate-forme explicite.
- **Changements :** construire wheel/sdist contenant serveur, agent et assets Web ; image conteneur serveur avec exécution non-root et configuration TLS/proxy documentée ; au minimum un binaire autonome **agent Linux x86_64** (et serveur si son mode de packaging est prouvé), plus ARM64/macOS seulement après build et essai natifs ; nommage/version, sommes SHA-256 et provenance des sources.
- **Fichiers :** `pyproject.toml`, fichiers de packaging, `Dockerfile`, scripts de build, workflows release, `docs/INSTALL.md`.
- **Acceptation :** chaque artefact annoncé se télécharge, s'installe et ouvre une session réelle sur son OS/architecture déclaré ; le wheel sert l'UI hors ligne ; le conteneur persiste uniquement les données prévues ; sommes publiées correspondent aux fichiers.
- **Validation :** installer les artefacts sur environnement neuf, exécuter le parcours serveur–agent–navigateur et vérifier signatures/sommes ; ne pas appeler un wheel « binaire autonome ».
- **Dépendances/risques :** 3.3, 4.3, 6.1 ; les outils de type PyInstaller doivent être testés sur la plate-forme cible ; ARM64 et autres OS restent « non supportés » tant que ces essais manquent.

#### 6.3 Préparer les contributions et la page du dépôt — P1
- **Objectif :** permettre aux utilisateurs de comprendre l'état du projet et aux contributeurs de travailler utilement.
- **Changements :** `CONTRIBUTING.md`, code de conduite si communauté active, modèles d'issues/PR, consignes de reproductions sans secrets, labels, liste de petites tâches, support et sécurité ; description/topics GitHub, image sociale et liens vers la documentation/release, une fois ces ressources publiées.
- **Fichiers :** `.github/`, `CONTRIBUTING.md`, `SECURITY.md`, `README.md`, paramètres GitHub à vérifier séparément.
- **Acceptation :** une personne externe peut reproduire l'environnement de test et proposer une petite correction ; les modèles dirigent vulnérabilités vers canal privé ; description/topics/liens affichés sur la page GitHub réelle.
- **Validation :** suivre `CONTRIBUTING.md` sur clone frais, ouvrir une issue/PR de test si approprié, inspecter la page publique ; ne pas inférer les paramètres GitHub du checkout local.
- **Dépendances/risques :** phases 4–5 ; maintenance des réponses et des signalements à prévoir avant d'ouvrir largement les contributions.

#### 6.4 Publier une première release avec un vrai contrôle de sortie — P1
- **Objectif :** rendre une version stable, traçable et vérifiable, pas seulement un tag.
- **Changements :** version unique, `CHANGELOG.md`, notes de release avec portée/limites/plate-formes, tag signé si la chaîne le permet, artefacts et SHA-256, procédure de rollback ; vérifier téléchargement et parcours complet depuis les fichiers publiés ; synchroniser README et métadonnées GitHub.
- **Fichiers :** `pyproject.toml`, `CHANGELOG.md`, `README.md`, workflow release, documentation d'exploitation ; release GitHub externe au checkout.
- **Acceptation :** P0/P1 précédents fermés avec preuves ; CI du commit/tag exact verte ; release et liens publics accessibles ; au moins un téléchargement neuf aboutit à une session autorisée ; aucune promesse de support OS non testé.
- **Validation :** relecture du diff et des notes, installation des fichiers réellement téléchargés, comparaison SHA-256, test smoke distant sécurisé et vérification de la page release publiée.
- **Dépendances/risques :** 6.1–6.3 et toutes les phases précédentes ; publication/credentials/validation humaine externes à établir au moment de l'exécution. Aucun tag local ou release distante n'est prouvé par cet audit.

### Phase 7 — **Dernière phase : vraie vidéo de démonstration du produit terminé**

**Condition stricte d'entrée :** toutes les tâches et validations des phases 0 à 6 sont terminées, la release destinée au public est vérifiée et le produit filmé correspond à ses artefacts publiés. Si une fonction ou une plate-forme manque, corriger la phase correspondante avant de filmer. Utiliser obligatoirement la skill **`ffmpeg-video-editor`** pour le montage, l'encodage et la vérification. Aucune maquette, image d'interface fictive ou affirmation hors champ de la démonstration.

#### 7.1 Capturer un parcours réel de bout en bout — P2
- **Objectif :** prouver visuellement le problème résolu et le fonctionnement de la version livrée.
- **Changements :** storyboard court : difficulté initiale d'accéder à un terminal Linux autorisé depuis un navigateur, installation/démarrage depuis l'artefact de release, enrôlement sûr, premier shell, second appareil ou fonctionnalité phare réellement prête, fermeture/reconnexion si validée ; enregistrer l'écran et, seulement si utile, une voix propre. Utiliser environnement jetable avec données non sensibles.
- **Fichiers :** nouveaux `assets/demo/source/` non publié si trop lourd/sensible, [docs/DEMO_SCRIPT.md](docs/DEMO_SCRIPT.md), référence de commit/tag et commandes de capture ; aucun changement de fonctionnalité pendant la vidéo. Le script de capture est préparé, mais aucune vidéo n'est encore produite.
- **Acceptation :** enregistrement brut montre les clics, commandes et réponses du produit réel sans coupe cachant un échec ; version et configuration identifiables ; secrets, hôtes privés et données personnelles absents.
- **Validation :** revoir chaque prise et la corréler à l'artefact/tag ; répéter le parcours sans privilège ou condition non documentés ; faire contrôler le script par une personne qui n'a pas préparé la démo.
- **Dépendances/risques :** 6.4 impératif ; réseau, timing et résolution peuvent faire varier la prise ; prévoir une nouvelle capture plutôt que simuler un résultat.

#### 7.2 Monter et exporter une vidéo concise — P2
- **Objectif :** offrir une démonstration claire et agréable à regarder dans le README et sur GitHub.
- **Changements :** appliquer la skill `ffmpeg-video-editor` : sonder les prises avec `ffprobe`, sélectionner les actions utiles, monter avec rythme, titres sobres, zooms/recadrages lisibles et audio normalisé si présent ; exporter MP4 H.264/AAC ou H.264 sans piste audio avec `yuv420p` et `+faststart`, résolution lisible dans GitHub ; décliner une version courte pour réseaux sociaux seulement si le cadrage reste compréhensible.
- **Fichiers :** `assets/demo/aetherterm-demo.mp4` ou asset de release selon poids, éventuelle version courte, sous-titres/transcription, `README.md` et description de release.
- **Acceptation :** problème, démarrage puis fonctionnalités principales visibles dans cet ordre ; aucun titre ne revendique une fonction absente ; intégration README pointe vers le fichier effectivement publié ; poids compatible avec le mode d'hébergement choisi.
- **Validation :** `ffprobe` sur chaque export pour durée, dimensions, flux/codecs et débit ; taille via système de fichiers ; décodage intégral avec `ffmpeg -f null -` et lecture humaine complète avec contrôle d'image, titres, synchronisation et audio ; vérifier la lecture depuis le lien GitHub final.
- **Dépendances/risques :** 7.1 ; montage et recadrage ne doivent pas faire passer une séquence non fonctionnelle pour une fonctionnalité réelle. **Aucune phase du roadmap ne suit cette vidéo.**
