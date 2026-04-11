---
title: Docker Installation and Post-Install Configuration
description: My approach to installing Docker and configuring it for rootless operation in a homelab.
pubDate: 2026-04-11
tags: [homelab, docker, linux]
---

## Intro

Docker is a core part of my homelab infrastructure. I run it on multiple host machines, and I prefer rootless Docker when possible to contain permissions and reduce surface area. This post covers my installation process and post-installation configuration steps that I use across my environment.

## Standard Docker Installation

The official Docker documentation provides the most reliable installation path for different Linux distributions:

[Docker Engine Installation Guide](https://docs.docker.com/engine/install/)

Follow the steps for your specific distro. I typically use the convenience script for standardized Ubuntu and Debian hosts, though the manual repository method is equally valid depending on your security posture.

## Rootless Docker

Rootless Docker runs the daemon without root privileges, which is a significant security win for homelab environments. It limits the blast radius if the daemon is compromised.

### Installation Considerations

Reference material:

- **Portainer Blog** (rootless setup patterns): [https://www.portainer.io/blog/portainer-and-rootless-docker](https://www.portainer.io/blog/portainer-and-rootless-docker)
- **Docker Docs** (official guide): [https://docs.docker.com/engine/security/rootless/](https://docs.docker.com/engine/security/rootless/)

One important caveat: **Rootless Docker does not work well under WSL2** because the kernel modules required by the installation script (like `iptables` modules) cannot be loaded in that environment. I've found this is a platform limitation worth knowing upfront.

When running on native Linux, the rootless setup handles most of the configuration automatically through the install script.

## Post-Installation Setup

After Docker is installed, I apply a few standard post-install configurations:

[Docker Post-Install Configuration Guide](https://docs.docker.com/engine/install/linux-postinstall/)

### Manage Docker as Non-Root User

Create a `docker` group and add your user:

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

Then log out and back in (or use `newgrp docker`) to apply group membership changes.

### Configure Log Rotation

By default, Docker logs can consume disk space quickly. I configure JSON file logging with rotation to keep things under control:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "10"
  }
}
```

Save this to `/etc/docker/daemon.json` and restart Docker:

```bash
sudo systemctl restart docker
```

Then verify:

```bash
docker info | grep Logging
```

This configuration limits each container's logs to a 10MB file, keeping a maximum of 10 rotated files per container. It removes the burden of manual cleanup and prevents runaway disk usage.
