# Architecture actuelle

Ce document décrit le code du checkout, pas une installation de production validée. La cible et les limites de sécurité sont détaillées dans [PRODUCT.md](PRODUCT.md) et [THREAT_MODEL.md](THREAT_MODEL.md).

## Flux d'une session

```text
navigateur -- HTTP(S) /login --> serveur FastAPI
           -- WS(S) /ws -----> état serveur ---- WS(S) /client <---- agent
                                  |                               |
                                  +-- propriétaire de session      +-- PTY /bin/bash
```

1. L'administrateur crée un mot de passe opérateur et enrôle un appareil avec `aetherterm-admin`. Le secret de l'agent est écrit dans un fichier privé ; le registre serveur ne conserve que son empreinte.
2. Le navigateur se connecte avec le mot de passe. Le serveur émet un cookie HTTP seulement, lié à une session conservée en mémoire pendant au plus huit heures. `/web/` et `/ws` exigent cette session. Le POST de connexion/déconnexion et le WebSocket navigateur vérifient l'origine. Après une fermeture WebSocket inattendue, le navigateur consulte `/auth/status` sans cache : une session perdue après redémarrage conduit à une nouvelle connexion opérateur.
3. L'agent présente son ID et son secret sur `/client`. Le serveur vérifie leur association, refuse les identités révoquées et lie le socket à cet appareil. Un ID déjà connecté est refusé.
4. L'opérateur demande un shell sur un agent connecté. Le serveur crée un UUID de session et mémorise le socket navigateur propriétaire et l'appareil choisi. Seul ce socket peut envoyer des octets, redimensionner ou fermer cette session. L'agent crée un PTY distinct avec `/bin/bash`, sous les droits de son utilisateur système.
5. L'entrée et la sortie circulent en base64 dans des messages JSON WebSocket. Le navigateur rend les octets avec xterm.js local. La session est supprimée à la fermeture explicite, à la déconnexion du navigateur ou de l'agent, ou au redémarrage du serveur. Un shell existant n'est jamais repris automatiquement.

## Frontières et état

| Élément | Où il vit | Durée |
| --- | --- | --- |
| Vérificateur du mot de passe opérateur | `~/.config/aetherterm/operator.json` ou `AETHERTERM_OPERATOR_FILE` | Durable, fichier créé en `0600` |
| Empreintes et métadonnées des agents | `~/.config/aetherterm/agents.json` ou `AETHERTERM_AGENTS_FILE` | Durable, fichier créé en `0600` |
| Secret brut de chaque agent | Fichier privé passé avec `--token-file` | Durable jusqu'à rotation/révocation ; jamais dans Git ni dans un argument de processus |
| Cookies, sockets, liste des sessions et dernière activité | `ServerState` d'une instance FastAPI | Volatile ; perdu au redémarrage |
| Processus shell et tampon de terminal | Processus/PTY de l'agent et navigateur | Volatile ; fermé à la fin de la session |

`server.main.create_app()` crée un état indépendant par instance à partir de `ServerConfig`. Cette configuration refuse au démarrage un chemin partagé par les identités opérateur et agent ou un paquet d'assets Web incomplet. Le lancement documenté utilise un seul worker : plusieurs workers ne partagent ni les agents ni les sessions. Le CLI `aetherterm-server` écoute uniquement `127.0.0.1` et fixe la confiance des en-têtes de proxy à cette adresse. La terminaison TLS doit être effectuée par un proxy de confiance sur la même machine ; voir [DEPLOYMENT.md](DEPLOYMENT.md). HTTP/WS en clair est accepté uniquement pour un pair sur boucle locale. Un accès distant réel avec certificat public n'a pas encore été validé.

L'agent regroupe ses paramètres dans `AgentConfig` et vérifie avant connexion l'hôte/port, l'ID d'appareil, la description et la cohérence de `--tls`/`--ca-file`. Le fichier de jeton est lu seulement après cette validation, avec contrôle du propriétaire et des permissions. Les valeurs sont alors passées à la boucle de reconnexion et à `PtySession` ; aucun shell n'est créé par l'import d'un module.

## Limites et défaillances prévues

- Le navigateur et l'agent négocient le sous-protocole WebSocket `aetherterm.v1` avant tout message. Une connexion qui ne l'annonce pas est refusée. Chaque trame JSON reçue par le serveur est validée et limitée à 64 Kio ; les fragments de terminal sont limités à 16 Kio, les dimensions, sessions opérateur, connexions ouvertes et sessions PTY sont bornées. Le code impose aussi des limites par adresse IP, un délai de démarrage du shell et des envois serveur bornés. Ces limites ne remplacent pas une mesure de charge.
- La rotation ou révocation d'un appareil rend immédiatement son identité inactive et ferme sa connexion au prochain contrôle serveur. La déconnexion opérateur révoque son cookie et ferme ses sockets ; le changement du fichier opérateur invalide les sessions en mémoire au prochain contrôle.
- Le serveur écrit des événements d'audit JSON bornés, sans commandes ni octets du terminal. L'agent affiche son état de connexion. Aucune sortie de shell ou historique de commande n'est stocké par l'application. Les logs du proxy et de la plate-forme restent à configurer séparément.
- Un agent compromis, le compte système qui exécute `/bin/bash`, le serveur et le proxy TLS restent des domaines de confiance. AetherTerm ne fournit ni sandbox de shell, ni SSH, ni rôles multiples.
- Le wheel contient l'interface HTML, le JavaScript/CSS compilé, le favicon et les notices de licence. Le sdist inclut aussi les sources Web et le lock npm. Les fichiers sont servis localement ; aucun CDN n'est requis. Un wheel installé a été exercé sur macOS Python 3.13 et sur un runner Ubuntu 24.04 Python 3.13. Les autres systèmes et versions Python ne sont pas déclarés supportés.
