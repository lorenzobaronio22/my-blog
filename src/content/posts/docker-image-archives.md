---
title: Docker Image Archives Offline Transfer
description: Saving and loading Docker images as offline archives for transfer between hosts without registry access.
pubDate: 2026-04-11
tags: [homelab, docker, images]
---

## Intro

In my homelab, not all hosts have direct internet access. To solve this, I use Docker's image archiving to move images between hosts without relying on public or private registries. This approach works completely offline and requires no network connectivity or registry configuration.

## Offline Image Archives

The goal is to save a Docker image as a `.tar` archive, transfer it via external drive or local network, and load it on any other Docker host without needing registry access or internet connectivity.

### Save an Image to Archive

```bash
docker save image_name > /path/to/archive/image.tar
```

### Load Image from Archive

On the destination host:

```bash
docker load < /path/to/archive/image.tar
```

## Benefits

This approach is ideal for:

- Hosts in isolated environments with no public internet access
- Transferring images via external storage (USB drives, etc.)
- Air-gapped networks where registry access is not available
- Quick local transfers without needing to push to and pull from a registry
