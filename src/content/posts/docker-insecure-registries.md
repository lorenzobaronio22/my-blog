---
title: Docker Insecure Registries: HTTP Configuration
description: Configuring access to private Docker registries running over plain HTTP in isolated networks.
pubDate: 2026-04-11
tags: [homelab, docker, registry]
---

## Intro

This post covers how to configure Docker to trust and authenticate with insecure HTTP registries.

## Private Insecure Registries

In isolated networks where security overhead is minimal, running a private registry over plain HTTP can simplify setup. However, Docker requires explicit configuration to allow these connections.

### Configure Insecure Registry

Add the registry to Docker's configuration:

```json
{
  "insecure-registries": ["192.168.1.50:5000"]
}
```

Save this to `/etc/docker/daemon.json` and restart Docker:

```bash
sudo systemctl restart docker
```

### Connect to Insecure Registry

Once configured, login and pull:

```bash
docker login http://192.168.1.50:5000
docker pull 192.168.1.50:5000/myapp:latest
```

## Security Considerations

This is convenient for internal development but only use this for truly isolated networks. For any registry exposed beyond your network boundary, use proper HTTPS and authentication.
