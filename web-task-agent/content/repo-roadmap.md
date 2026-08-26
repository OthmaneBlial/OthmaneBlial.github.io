# Roadmap — Web Task Agent

## La thèse

Web Task Agent ne doit pas devenir « un agent web de plus ». Il doit devenir le poste de recherche web **local, durable et vérifiable** qui transforme une question confuse en package de décision : on lance une enquête, on peut l'interrompre, reprendre, auditer ses sources et transmettre une conclusion avec ses contradictions.

> From a messy web question to an evidence-backed decision package — locally, resumably, and with the sources still attached.

Les étoiles ne sont pas un livrable. Elles sont une conséquence d'une promesse publique, facile à essayer, crédible par la preuve et utile au point d'être recommandée.

## État d'exécution — 26 août 2026

Cette roadmap sert aussi de contrat de livraison. Les statuts ci-dessous distinguent ce qui est versionné et vérifié localement de ce qui exige une décision du mainteneur ou une action publique.

| Chantier | État vérifié | Preuve disponible |
| --- | --- | --- |
| Fondation open source | Livré localement | MIT, sécurité, support, code de conduite, templates GitHub, Dependabot et métadonnées npm `0.2.0` versionnés |
| Première minute produit | Livré localement | Trois démos déterministes, receipts sources, README orienté package et site local contrôlé visuellement |
| Catalogue de cas d'usage | Livré | 243 workflows exécutables : 3 historiques et 240 scénarios générés, filtrables et documentés |
| Packs, exports et comparaison | Livré | 5 packs à revue humaine, `workflow scaffold`/validation de décision-sources-fraîcheur-coût-risques, exports Markdown/JSON/CSV, redaction et diff de runs |
| Confiance et confidentialité | Livré localement | Politique de sources, `robots.txt`, cadence et plafond par domaine, liste de revue humaine, redirections signalées, détection d'injection, contrat de confidentialité et sauvegarde/restauration SQLite |
| Qualité et dérive | Livré localement | Build, 117 tests unitaires, 4 intégrations, génération, 305 liens Markdown, audit des secrets de publication et audit des dépendances de production dans la CI |
| Publication et distribution | Bloqué par décision explicite | Le dépôt est encore privé : ouverture, release GitHub/npm, Topics, image sociale, Pages et discussions exigent l'autorisation du mainteneur |

Le mot « livré » ne veut pas dire que le projet a déjà gagné des étoiles : cela signifie que le comportement est présent dans `main` et couvert par les contrôles indiqués. La visibilité et les signaux publics restent une étape distincte.

## Diagnostic initial — 26 août 2026

### Ce qui existe réellement

- Base TypeScript locale avec CLI, Chrome DevTools Protocol/Lightpanda, SQLite, file d'attente, worker, dashboard local, reprise après interruption, traces de prompts et packages de sortie.
- Chaîne de recherche : recherche → fetch → extraction → regroupement des preuves → contradictions → synthèse.
- Trois workflows historiques : `android-opportunity`, `article-research`, `market-opportunity`, complétés par 240 scénarios de catalogue.
- Tests automatisés déterministes pour la reprise, les contrôles, le stockage, les preuves, le packaging, la politique de sources et plusieurs échecs de runtime.
- Installateur, site de documentation statique, receipts versionnées et contrat de confidentialité présents.

### Ce qui bloque l'adoption aujourd'hui

- Le dépôt est **privé**, donc aucune étoile, aucun fork ou contribution publique n'est encore possible. C'est le principal verrou de distribution.
- Les métadonnées GitHub publiques (description, Topics, image sociale, homepage), une release et un mini-site accessible restent à publier après cette décision.
- L'expérience réelle de source/LLM reste volontairement séparée des tests déterministes : elle devra être validée avec des jeux de clés et sources choisis par l'opérateur.
- Aucune campagne communautaire ne doit précéder cette ouverture, une première release et une démonstration publique vérifiable.

## Positionnement à verrouiller

### Pour qui

- Équipes produit, fondateurs et analystes qui doivent transformer des retours publics, alternatives et signaux de marché en décision.
- Développeurs et chercheurs qui veulent garder l'exécution et les preuves sur leur machine.
- Équipes de contenu qui veulent une enquête traçable plutôt qu'un texte sans sources.

### Différenciation

Le navigateur, le crawl et la planification sont déjà concurrentiels. La valeur rare est de répondre : **quelles sources ont conduit à cette recommandation, qu'est-ce qui la contredit, et que se passe-t-il si le job tombe ?**

Le moat open source est le contrat de recherche : source canonique, snapshot, extraction, qualité, fraîcheur, contradiction, citation, reprise et package de décision. Un concurrent peut refaire un prompt, pas aussi facilement une expérience locale réellement auditable.

### Ce que le projet n'est pas

- Pas un SaaS de scraping hébergé.
- Pas un clone généraliste de Browser Use, Firecrawl ou LangGraph.
- Pas une promesse d'autonomie sans supervision.
- Pas un catalogue de prompts interchangeables sans preuves ni format de sortie.

---

## P0 — Devenir publiable, compréhensible et essayable

Ces éléments sont bloquants. Il ne faut pas lancer une campagne de visibilité avant eux.

### 1. Publication responsable

**But :** permettre de regarder, fork, tester et contribuer sans ambiguïté.

À faire :

- Décision explicite de rendre le dépôt public.
- Licence open source choisie (`MIT` ou `Apache-2.0` après validation de compatibilité).
- `SECURITY.md`, politique de signalement, `CODE_OF_CONDUCT.md`, `SUPPORT.md`, templates d'issues et sujets GitHub.
- Description GitHub, URL de démo, image sociale et première release versionnée.
- Audit des secrets, de l'état local et des captures avant publication.

**Acceptation :** un inconnu peut comprendre licence, limites de sécurité, support et installation sans demander au mainteneur.

### 2. Première minute = preuve produit

**But :** obtenir un premier package utile sans lire le code.

À faire :

- README reconstruit autour d'un scénario phare : question → recherche → preuves → brief de décision.
- GIF/capture courte et rapport d'exemple lisible : résumé, recommandation, incertitudes, citations, contradictions et prochaine validation.
- Trois exécutions golden versionnées, avec sources publiques et reproductibles :
  - voix du client ;
  - analyse concurrentielle ;
  - brief d'article technique avec contradictions.
- Pré-requis et messages d'erreur exacts, testés depuis une machine propre.
- Page « Why this instead? » qui compare honnêtement le projet à un crawler, un agent navigateur et un framework d'agents.

**Acceptation :** une personne nouvelle produit et comprend un résultat en moins de 15 minutes, puis remonte du brief à une source sans ouvrir SQLite.

### 3. Catalogue de centaines de workflows, sans prompts creux

**But :** montrer l'étendue réelle du produit tout en gardant une qualité et une navigation strictes.

À faire :

- Registre data-driven, plutôt que des centaines de blocs de code copiés-collés.
- Au moins 200 scénarios exécutables organisés par décision et domaine : voix du client, concurrents, gaps produit, pricing, segmentation, parcours d'achat, positionnement, demande de contenu, intégrations, entrée de marché, validation, churn/rétention.
- Pour chaque scénario : objectif, stratégie de requêtes, sources à privilégier, livrables du brief, exemple de commande, emplacement de sortie stable et workflows liés.
- `workflow list --category` et `workflow list --search` pour naviguer sans liste interminable.
- Génération contrôlée de la documentation du catalogue depuis le registre, avec test anti-doublon des ids et chemins.

**Acceptation :** chaque entrée est réellement lançable par la CLI, produit le même contrat d'artefacts et une recherche par catégorie donne immédiatement un scénario exploitable.

### 4. Éliminer la dette de confiance

À faire :

- Synchroniser README, docs, site statique, exemples et carte des tests depuis une source canonique ou un générateur.
- Mettre à jour la dépendance vulnérable et vérifier la lockfile.
- CI : build, unité, intégration, génération du catalogue, liens Markdown, exemples CLI et détection de dérive documentaire.
- Badges uniquement pour ce qui est réel : CI d'abord, release ensuite, jamais de faux badge de popularité ou couverture.

**Acceptation :** `npm ci && npm test && npm run generate:workflows` passe proprement en CI et ne laisse aucun changement non versionné.

---

## P1 — Faire du catalogue un produit

### 5. Packs de décision composables

Un workflow est un point de départ ; un pack termine une décision.

- Packs : « Valider une idée », « Préparer un lancement », « Comprendre un churn », « Écrire un article défendable », « Choisir une intégration ».
- Ordre explicite, artefacts d'entrée/sortie et revue humaine entre étapes ; aucun lancement coûteux en cascade sans confirmation.
- Réutilisation sûre de mémoire locale et de sources déjà vérifiées.
- Mode `dry-run` : budget, sources visées, dossiers de sortie et permissions avant exécution.

**Acceptation :** une décision complète se mène en 2–4 étapes, reprend après incident et affiche son coût avant l'appel LLM.

### 6. Sorties immédiatement partageables

- Format de rapport versionné avec citations, raison de qualité, date de collecte et section « ce qui invaliderait cette conclusion ».
- Exports Markdown, JSON et CSV ; aucune synchronisation hors machine par défaut.
- Comparaison de runs : nouvelles sources, sources disparues, conclusions modifiées.
- Export redacted avec aperçu de ce qui quittera la machine.

**Acceptation :** un décideur non technique lit le brief, un développeur réutilise les données, et l'opérateur sait exactement ce qu'il partage.

### 7. Contribution de workflows facile, mais exigeante

- `workflow scaffold` qui crée définition, exemple, test de requêtes et fixture de package.
- Schéma validé : objectif, sources préférées/interdites, livrables, fraîcheur, coûts et risques.
- Guide de contribution : besoin répétable, requêtes non redondantes, contrat de sortie et test de non-régression.
- Labels `good first workflow`, `workflow-review`, `needs-evidence`, `help wanted`.

**Acceptation :** un contributeur ajoute un workflow sans comprendre tout l'orchestrateur et ne peut pas livrer une simple variante de prompt sous un nouveau nom.

---

## P2 — Gagner la confiance sur les sujets difficiles

### 8. Acquisition web responsable

- Politique explicite : sites autorisés, `robots.txt` lorsque pertinent, rate limits, user-agent, limites de login et interdiction de contourner des accès.
- Garde-fous contre SSRF, URL privées, téléchargements dangereux, redirections suspectes et contenu malveillant.
- Détection et traçage des instructions présentes dans les pages afin de les séparer des instructions de l'opérateur.
- Liste rouge configurable, budget par domaine et revue humaine pour les actions sensibles.

**Acceptation :** l'opérateur comprend pourquoi une source est refusée, ralentie ou soumise à revue sans chercher dans les logs bruts.

### 9. Confidentialité observable et choix d'infrastructure

- Contrat local-first précis : données conservées sur disque, données envoyées au LLM, données visibles par Lightpanda/Chrome et télémétrie — par défaut, aucune télémétrie non essentielle.
- Redaction des secrets dans logs, rapports et traces ; rétention/suppression vérifiables de l'état local.
- Adaptateurs de modèles documentés : une option cloud et une option locale/compatible, testées.
- Chrome/CDP de base, Lightpanda en option ; différences de capacité visibles.

**Acceptation :** la confidentialité est décrite, testée et observable, pas seulement affichée.

### 10. Fiabilité de long terme

- Tests de reprise dans chaque étape, queue expirée, crash processus, stockage saturé et panne fournisseur.
- E2E par fixtures pour trois packs ; réseau réel séparé et opt-in.
- Budget de performance/coût par preset avec avertissement avant dérive.
- Migration SQLite, sauvegarde/restauration et diagnostics sans fuite de données.

**Acceptation :** une panne ne détruit ni le progrès ni les preuves, et un résultat incomplet ou ancien est explicitement signalé.

---

## P3 — Boucles d'adoption méritées

### 11. Démontrer, puis distribuer

- « Research receipts » versionnées : question utile, sortie publique, décision prise et limites.
- Démos ciblées : lancement produit, concurrents, issues GitHub, sujet technique, avis d'apps.
- Mini-site public : promesse, trois démonstrations, installation et confidentialité.
- Partage communautaire après preuve seulement (Show HN, communautés devtools/product/data pertinentes), avec une démo adaptée à chaque audience.

**Acceptation :** chaque post renvoie vers une expérience vérifiable et le README répond aux questions que cette démo suscite.

### 12. GitHub comme espace de collaboration

- Issues orientées résultat ; Discussions pour les workflows et receipts ; issues pour bugs/propositions actionnables.
- `CONTRIBUTING.md` avec architecture, environnement, tests ciblés et règles de revue.
- Reconnaissance des contributeurs par workflows/packs et releases régulières avec notes concrètes.

**Acceptation :** un visiteur trouve une première contribution en moins de cinq minutes et comprend comment elle sera revue.

---

## Mesures à suivre, sans surveillance cachée

| Signal | Ce qu'il mesure | Décision associée |
| --- | --- | --- |
| Temps au premier package utile | Activation réelle | Réduire friction d'installation/configuration |
| Taux de reprise réussie | Valeur de la durabilité | Prioriser recovery et queue |
| Citations ouvertes depuis un brief | Confiance/auditabilité | Améliorer la sortie |
| Workflows exécutés, copiés, contribués | Utilité du catalogue | Garder les familles demandées, retirer les doublons |
| Issues converties en PRs | Santé communautaire | Simplifier le kit contributeur |
| Forks, étoiles, mentions, démos réutilisées | Distribution méritée | Investir dans les preuves qui circulent |

Mesurer uniquement par consentement explicite ou à partir de signaux publics GitHub. Le produit reste silencieux par défaut. Les étoiles sont un indicateur tardif : une hausse sans installations, packages lisibles ou contributeurs ne valide pas le produit.

## Ordre d'exécution

1. Publication responsable : licence, sécurité, dépôt public, release, métadonnées.
2. Preuve produit : scénario phare, trois runs golden, README et rapport lisible.
3. Catalogue exécutable : 200+ cas, génération, filtres CLI et tests.
4. Contrat de confiance : sécurité web, redaction, politiques de source, audit et CI anti-dérive.
5. Packs et partage : séquences de décision, exports sûrs, receipts publiques.
6. Communauté et distribution : contributions faciles, démos ciblées, releases et conversations utiles.

Ne pas inverser cet ordre : une campagne avant preuve et sécurité produirait des visites, pas une confiance durable.

## Hors périmètre volontaire, pour l'instant

- SaaS multi-tenant ou scraping hébergé.
- Actions externes à haut risque (achats, formulaires ou comptes tiers).
- Marketplace de workflows sans revue de qualité.
- Intégrer chaque LLM, navigateur et réseau social avant de solidifier le contrat d'exécution.
- Métriques de croissance collectées à l'insu des opérateurs.

## Références de marché

- [Browser Use — tâches d'agent navigateur](https://docs.browser-use.com/cloud/agent/quickstart)
- [Firecrawl — agent de découverte et extraction web](https://docs.firecrawl.dev/developer-guides/usage-guides/choosing-the-data-extractor)
- [LangChain Deep Agents — exécution durable et validation humaine](https://docs.langchain.com/oss/python/deepagents/overview)

Ces outils confirment que le navigateur, le crawl et la planification sont concurrentiels. Web Task Agent doit donc gagner sur le package de décision local, la qualité de l'évidence, la reprise et la transparence d'exécution.
