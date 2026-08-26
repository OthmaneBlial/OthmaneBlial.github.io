# Roadmap — Web Task Agent

## La décision produit

Web Task Agent ne gagnera pas parce qu'il possède plus de workflows ou un navigateur plus autonome. Les catégories « browser agent » et « deep research avec citations » sont déjà très encombrées. Sa promesse mémorable doit être plus étroite :

> **Une décision web locale que quelqu'un d'autre peut vérifier, contredire, reprendre et comparer — sans devoir faire confiance au modèle.**

Le produit à rendre célèbre n'est donc pas un agent qui browse, mais le **Decision Receipt** : un paquet portable qui relie une recommandation à ses preuves, ses contradictions, ses limites, sa fraîcheur et sa prochaine validation humaine.

Les étoiles sont un signal tardif, pas le livrable. Elles arrivent lorsque ce reçu est assez utile pour être partagé, assez clair pour être essayé, et assez solide pour survivre à un collègue sceptique.

## Audit au 26 août 2026

### Ce qui est réellement solide

- Le cœur technique est crédible : CLI TypeScript, état SQLite durable, file/worker, reprise après incident, CDP avec Chrome ou Lightpanda, politiques de sources, redaction, exports et dashboard limité à la boucle locale.
- La chaîne a de la substance : recherche → acquisition → extraction → regroupement des preuves → contradictions → synthèse → package de décision. Elle est déjà couverte par des tests de récupération, stockage, politique de sources, injection, emballage et erreurs de runtime.
- La première preuve existe : huit démos déterministes, sans clé ni navigateur, génèrent un `receipt.html`, un brief, un rapport, des sources et un manifeste. Le README et le site ouvrent ce reçu avant la configuration.
- Le dépôt est sain pour une contribution : MIT, `SECURITY.md`, confidentialité, code de conduite, support, CI Node 22, Dependabot, modèle de PR et deux formulaires d'issues structurés.
- La distribution publique est amorcée : dépôt public, Pages disponible, release GitHub `v0.4.0` et miroir GitHub Packages. Les checks locaux de cette analyse ont validé 124 tests unitaires, 4 intégrations, la génération des exemples/receipts, la synchronisation de la documentation et les liens Markdown.

### Ce qui manque vraiment

| Écart | Pourquoi il bloque l'adoption | Décision de roadmap |
| --- | --- | --- |
| La promesse reste large | « 243 workflows » décrit la quantité, pas la raison de recommander le projet. Les visiteurs peuvent le classer comme un énième crawler/agent. | Mettre le Decision Receipt et le *decision diff* au centre ; le catalogue devient une preuve secondaire. |
| Le reçu est visuel, pas encore vérifiable de bout en bout | Il présente des sources, mais n'expose pas encore une matrice claim→extrait→snapshot, les limites de fraîcheur, ni une vérification d'intégrité hors ligne. | Définir un protocole de receipt versionné, validable et content-addressed. |
| La première exécution publique est encore trop coûteuse | Le chemin principal installe un script via `curl | bash`. Le miroir GitHub Packages nécessite un token `read:packages`; la release `v0.4.0` n'a pas d'asset téléchargeable. | Choisir et tester un unique chemin public sans authentification avant toute campagne. |
| La preuve est surtout interne/déterministe | Les fixtures prouvent le contrat, mais pas encore qu'un tiers peut auditer un résultat live, un changement de sources ou une reprise. | Publier un corpus d'évaluation reproductible et trois golden paths, avec limites explicites. |
| Les garde-fous restent peu visibles | Le projet a déjà DNS/redirect policy, robots, rate limits, quarantaine d'injection, redaction et stockage local, mais le visiteur ne peut pas facilement inspecter ces décisions. | Rendre les politiques, flux de données et refus visibles dans chaque receipt. |
| La communauté n'a pas encore de boucle d'entrée | Le dépôt public part de 0 étoile, fork et issue lors de cet audit. Des policies sans premiers sujets, issues finies et cas partagés ne créent pas de conversation. | Créer une boucle de revue de receipts et de contributions étroites, puis distribuer des artefacts utiles. |

### Garde-fou de vérité

Un hash prouve qu'un artefact n'a pas changé ; il ne prouve ni qu'une page est vraie, ni qu'elle est complète, fraîche ou autorisée. Une citation ne donne pas le droit de contourner un accès. Une sortie de modèle ne sera pas promise comme reproductible mot pour mot. Le produit doit plutôt rendre reproductibles les **entrées, politiques, captures, versions et contrôles**, puis exposer ce qui peut varier.

---

## P0 — Faire du Decision Receipt le produit

**Objectif :** une personne doit comprendre, vérifier et partager une décision sans installer l'agent ni lire la base SQLite.

### 1. Publier le contrat `Decision Receipt v1`

- Définir un schéma JSON versionné pour : décision, claims, statut de support (`supported`, `contradicted`, `insufficient`), sources, extraits capturés, URL canonique, date de collecte, politique de fraîcheur, contradictions, limites, action suivante et redactions.
- Ajouter une matrice **claim → preuves favorables/contraires → extrait → snapshot** dans les exports HTML et JSON. Une recommandation matérielle sans preuve directe doit être marquée `insufficient`, jamais remplie par une citation décorative.
- Ajouter un manifeste d'intégrité : version du schéma, versions CLI/workflow/policy/prompt/modèle, empreinte de configuration expurgée, fichier/snapshot SHA-256 et graphe des artefacts.
- Fournir `web-task-agent receipt verify <dir>` : vérification hors ligne des chemins, hashes, IDs de source, URL sûres et références claim→extrait. Afficher clairement ce que cette vérification ne prouve pas.
- Étiqueter de façon impossible à rater les états **fixture déterministe**, **run live**, **run incomplet**, **données périmées** et **interprétation de modèle**.

**Preuve d'acceptation :** une fixture de falsification modifie un rapport, un snapshot ou un extrait et `receipt verify` échoue sur l'élément précis ; CI refuse un claim matériel non sourcé, une URL dangereuse, une date de capture absente ou une référence vers un extrait inexistant.

### 2. Créer le cas d'usage signature : « qu'est-ce qui a changé dans cette décision ? »

Le premier héros ne doit pas être « fais une recherche ». Il doit répondre à une question qui justifie le receipt : **une veille de concurrent/segment a-t-elle réellement changé notre décision ?**

- Construire un golden path `decision-change-review` sur un jeu public et stable : décision initiale, nouveaux signaux, sources disparues, contradictions résolues/non résolues, conclusion modifiée ou inchangée, et validation humaine restante.
- Transformer l'existant `job compare` en receipt lisible : « changé parce que… », avec provenance, frais de collecte, et distinction entre changement de source, de politique, de modèle ou de synthèse.
- Ajouter une page courte : quand utiliser ce projet plutôt qu'un navigateur agent, un crawler ou un chatbot ; ne revendiquer aucune supériorité d'exactitude sans évaluation.

**Preuve d'acceptation :** un lecteur ouvre deux receipts puis leur diff et peut expliquer la décision finale, sa contradiction principale et la prochaine vérification en moins de cinq minutes.

### 3. Réduire la vitrine à trois golden paths

Conserver les 243 workflows, mais arrêter de les utiliser comme promesse principale. Mettre en avant trois décisions récurrentes :

1. `decision-change-review` — vérifier si un signal public change une décision de marché/produit ;
2. `competitor-map` — préparer un choix avec sources favorables et contraires ;
3. `launch-risk-review` — révéler les hypothèses et validations restantes avant un lancement.

Pour chaque chemin : question exacte, politique de sources, commande, arbre de sortie, receipt rendu, limitation/invalidation, et test de dérive. Le README, Pages, release notes et documentation doivent pointer vers les mêmes trois objets.

**Preuve d'acceptation :** une personne choisit un cas en moins d'une minute sans parcourir le catalogue ; les trois chemins passent dans CI et leurs artefacts générés restent synchronisés.

---

## P1 — Enlever toute friction entre curiosité et première preuve

**Dépendance :** P0. Promouvoir un setup compliqué avant de montrer un receipt vérifiable transformerait la curiosité en abandon.

### 4. Choisir une distribution publique sans authentification

- Décider d'un seul chemin canonique, maintenu et documenté : archive de release vérifiée ou package npm public. Le miroir GitHub Packages peut rester une option, mais ne doit pas être l'installation recommandée au grand public tant qu'il exige un PAT.
- Si la publication npm est autorisée : réserver/contrôler le nom, publier uniquement depuis un tag vérifié et rendre `npx web-task-agent@<version> demo export …` fonctionnel sans clé. Ne jamais confondre un package tiers au même nom avec un artefact du projet.
- Si npm n'est pas autorisé : attacher au release le tarball exact, son SHA-256, des notes d'installation sans `curl | bash` obligatoire et une commande de vérification.
- Automatiser le chemin de release sur tag : `npm ci`, `release:check`, tarball, installation dans un dossier neuf, export de démo, checksum, release GitHub et provenance. Aucun publish sur un simple push de branche.

**Preuve d'acceptation :** depuis une machine propre macOS et Linux/Node 22, le chemin documenté installe la version publiée, lance la démo et ouvre le receipt sans clé, token, navigateur ou modification manuelle. Tag, CLI, changelog, tarball, registre et release portent exactement la même version.

### 5. Faire de la première minute un test, pas une promesse

- Remplacer la multiplicité d'appels à l'action par une seule séquence visuelle : **question → package local → receipt vérifiable** ; la configuration de navigateur/LLM vient ensuite.
- Ajouter un GIF ou une courte vidéo terminal→receipt, plus une capture statique accessible et un transcript texte. Ne pas cacher la différence entre fixture, recherche live et données actuelles.
- Enregistrer le test de première réussite dans `docs/first-success.md` : environnement propre, commande exacte, durée, fichiers créés, limites et sortie attendue.
- Ajouter ce test aux candidats de release et publier son receipt de test. Garder les tests réseau/LLM live opt-in et séparés des tests déterministes.

**Preuve d'acceptation :** trois personnes externes au projet atteignent un receipt sans aide en moins de 60 secondes ; leurs blocages sont publiés/corrigés avant une campagne de visibilité.

### 6. Transformer la confiance en surface produit

- Créer une page « Trust model » avec un diagramme : ce qui reste local, ce qui peut être envoyé au navigateur et au endpoint LLM choisi, ce qui est expurgé, ce qu'un receipt prouve/ne prouve pas, et comment supprimer/restaurer/exporter l'état.
- Joindre à chaque run live un **capability/acquisition ledger** : domaines autorisés/refusés, DNS public, chaîne de redirection, décision robots/rate-limit, signal d'injection, quarantaine et approbation humaine éventuelle.
- Ajouter un manifeste de flux de données : rétention locale, catégories envoyées au modèle, hôte/modèle cible, trace/prompt retenu ou non, règles de redaction. Ne jamais mettre de cookies, secrets ou contenu brut sensible dans le receipt partageable.
- Écrire un threat model public, incluant explicitement les limites : pas d'authentification de sites, pas d'actions externes, pas de contournement d'accès.

**Preuve d'acceptation :** un nouveau lecteur répond aux cinq questions du trust model sans lire le code ; les tests confirment que secrets, cookies, URL privées et sources rejetées n'apparaissent jamais dans rapports, traces, receipts ou exports.

---

## P2 — Prouver la qualité au lieu de l'affirmer

**Dépendance :** P0 et P1. Un benchmark de « précision » sans contrat de preuve ne serait pas crédible.

### 7. Publier un corpus d'évaluation d'auditabilité

- Préparer 8–12 cas publics, juridiquement redistribuables et figés : choix de produit, changement de concurrent, source contradictoire, information expirée, crash/reprise, redirection dangereuse, injection indirecte et export expurgé.
- Pour chaque cas, définir un oracle humain : claims attendus, contre-source indispensable, état de fraîcheur, comportement de récupération et navigation qui doit être refusée.
- Mesurer et versionner : couverture claim-citation, claims insuffisamment supportés, rappel des contradictions, diversité/fraîcheur de sources, refus de navigation non sûre, détection d'injection, exactitude de reprise et qualité du diff.
- Publier les dénominateurs, limites, versions modèle/prompt/policy et score précédent. Un seuil de régression bloque une release ; il ne sert pas à annoncer que l'agent est « plus intelligent ».

**Preuve d'acceptation :** CI produit un scorecard lisible et machine-readable ; chaque métrique pointe vers ses fixtures, son oracle et ses limites ; une régression intentionnelle échoue de façon déterministe.

### 8. Attaquer les limites connues avec des fixtures adversariales

- Étendre les tests à l'injection directe/indirecte et obfusquée, redirections cross-origin, DNS rebinding/réseaux privés, URLs avec identifiants, contenu hostile et persistance interdite.
- Prévisualiser les extensions de politiques/domains/capacités avant le run et exiger une confirmation humaine pour tout élargissement. Le modèle ne reçoit jamais shell, cookies, réseau local, sessions authentifiées ou actions d'écriture.
- Ajouter une receipt de sécurité déterministe : politique refusée, raison et preuve de non-persistence.

**Preuve d'acceptation :** le corpus rouge démontre que chaque charge interdite est bloquée ou mise en quarantaine avant navigation/persistance, et que la raison est compréhensible dans le ledger.

---

## P3 — Créer une communauté autour des artefacts, pas autour d'une promesse virale

**Dépendance :** au moins P0, P1 et un premier scorecard P2 doivent être publics.

### 9. Lancer trois études de cas qui invitent la critique

- Pour chaque golden path, publier une étude avant/après : question, politique de sources, receipt, décision, limite/invalidation et commande reproductible.
- Les partager une fois dans les communautés où cette décision existe réellement : local-first devtools, builders d'agents navigateurs, praticiens product/research. Demander une critique de preuve, pas une étoile.
- Convertir chaque retour utile en issue/Discussion, fixture, correction ou note de release. Ne pas inventer de benchmark, de traction ou de fraîcheur.

**Preuve d'acceptation :** chaque publication mène à un artefact différent et vérifiable ; toute assertion publique importante a une limite et une source ; le retour reçu laisse une trace de décision mainteneur.

### 10. Rendre la première contribution finie et sûre

- Créer trois issues réellement prêtes : revue d'un receipt, amélioration d'une fixture/test et ajout d'un workflow borné. Chacune définit résultat, politique de sources, test, reviewer et périmètre.
- Organiser les Discussions autour de `First-run help`, `Receipt review`, `Workflow ideas` et `Show your decision package`; amorcer chaque espace avec une contribution substantielle, pas avec une catégorie vide.
- Mettre à jour `CONTRIBUTING.md` : une contribution de workflow requiert un problème approuvé, une fixture, une règle d'invalidation, une analyse de risque et un test. Le catalogue ne doit pas devenir une collection de prompts renommés.
- Ajouter `ISSUE_TEMPLATE/config.yml` pour diriger questions, sécurité et propositions vers la bonne surface.

**Preuve d'acceptation :** la page Contribute affiche un parcours `good first issue` autonome ; un contributeur peut livrer une PR courte sans connaître l'orchestrateur entier et le mainteneur peut la juger à partir d'un contrat explicite.

### 11. Mesurer l'activation avant les étoiles

Ne jamais ajouter d'analytics cachées au produit. Utiliser seulement les statistiques GitHub/registre, retours consentis et signaux publics.

| Signal | Décision qu'il éclaire |
| --- | --- |
| Installation propre → receipt ouvert | Friction du premier succès |
| Critiques de claims / receipts partagés | Valeur réelle de l'auditabilité |
| Téléchargements de release ou installs vérifiés | Crédibilité de la distribution |
| Issues/Discussions externes et délai de réponse | Santé de la boucle communautaire |
| PRs de workflow avec fixture/eval | Qualité de la contribution |
| Visiteurs, clones, forks, étoiles, références | Portée — uniquement après les signaux précédents |

Prendre un baseline public le jour de lancement, puis revoir ces signaux après chaque étude de cas et release. Une hausse d'étoiles sans install réussie, receipt partagé ou contribution ne valide pas le produit.

---

## P4 — Ouvrir l'écosystème une fois le contrat prouvé

**Dépendance :** Receipt v1, vérificateur, golden paths, scorecard et distribution sans token.

- Proposer une API d'ingestion minimaliste qui transforme des résultats provenant de Browser Use, Stagehand ou GPT Researcher en receipt validé. Commencer par **un** adaptateur demandé par des utilisateurs ; ne pas recréer leur moteur navigateur.
- Versionner la compatibilité du receipt et publier une fixture d'interopérabilité. L'extension doit enrichir l'évidence, pas rendre le projet dépendant d'un fournisseur hébergé.
- Ajouter une signature opérateur seulement après que la vérification non signée est utile et que l'expérience de gestion de clés est définie. Une signature atteste d'une clé, pas de la vérité d'une décision.
- Explorer les packs récurrents/scheduling uniquement si les premiers utilisateurs demandent une décision répétée et acceptent la politique de fraîcheur/coût explicite.

**Preuve d'acceptation :** un résultat externe peut produire un receipt conforme puis passer `receipt verify`; l'adaptateur conserve les limites, politiques et sources plutôt que de présenter un texte généré comme une preuve.

## Ordre d'exécution non négociable

1. Receipt v1, vérificateur, labels de vérité et golden path de changement de décision.
2. Trois golden paths et une vitrine qui les rend plus visibles que les 243 workflows.
3. Une installation publique sans token, testée en environnement propre, puis release avec artifact/provenance.
4. Trust model, ledger d'acquisition et manifeste de flux de données.
5. Corpus/scorecard et tests adversariaux.
6. Études de cas, discussions, starter issues et mesure de l'activation.
7. Un seul adaptateur d'écosystème demandé par des utilisateurs réels.

Ne pas inverser cet ordre : du trafic vers une installation avec token ou un receipt non vérifiable créerait de la curiosité, pas de la confiance durable.

## Hors périmètre volontaire

- SaaS multi-tenant, proxy de scraping hébergé ou télémetrie produit silencieuse.
- Agents connectés à des comptes, cookies, réseau local, shell ou actions externes à écriture.
- Marketplace ouverte de workflows sans contrat de source, fixture, sécurité et évaluation.
- Course au nombre de modèles, navigateurs, intégrations ou workflows avant la preuve du receipt.
- Promesses de vérité, d'exactitude supérieure, de fraîcheur universelle ou de viralité.

## Références de recherche

- [Browser Use](https://github.com/browser-use/browser-use), [Stagehand](https://github.com/browserbase/stagehand) et [GPT Researcher](https://github.com/assafelovic/gpt-researcher) : le contrôle du navigateur et les rapports cités sont déjà des attentes de base ; l'opportunité est la décision vérifiable et diffable.
- [Hugging Face Open Deep Research](https://huggingface.co/blog/open-deep-research) : les projets de recherche d'agents exposent aussi outils, état, coût et évaluation, pas seulement des réponses.
- [NIST AI RMF Core](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/), [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf) et [OWASP LLM01 Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) : base du corpus d'évaluation, des limites de confiance et des tests adversariaux.
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework/using-privacy-framework-11) et [SLSA provenance](https://slsa.dev/spec/v1.2/provenance) : inspiration pour le manifeste de flux de données et la provenance d'artefacts, sans revendiquer une conformité SLSA.
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) et [GitHub supply-chain security](https://docs.github.com/en/code-security/concepts/supply-chain-security/supply-chain-security) : release versionnée, attestations et provenance de publication.
