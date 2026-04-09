---
title: Securely Expose Services with Cloudflare and Tailscale
description: Notes on using one Cloudflare Tunnel with Tailscale across home Proxmox and cloud VPS services.
pubDate: 2025-07-05
updatedDate: 2026-04-09
tags: [homelab, cloudflare, tailscale, networking]
---

## Intro

This is the ingress pattern I use for self-hosted services distributed across two environments:

- Home lab workloads in a Proxmox cluster
- Cloud workloads on a VPS

Both environments join the same Tailscale tailnet. A single Cloudflare Tunnel endpoint enters that tailnet and reaches services in either location.

Without this approach, I would need separate tunnels for each private network (home and cloud).

## Topology

```text
Internet
  |
  v
Cloudflare Edge (HTTPS)
  |
  v
Cloudflare Tunnel (cloudflared)
  |
  v
Tailscale node (tailnet entry point)
  |
  +--> Home lab services (Proxmox: Docker/LXC/VM)
  |
  +--> Cloud services (VPS: Docker)
```

## Core Pattern

`cloudflared` runs with `network_mode: service:tailscale-cloudflare-tunnel`, so tunnel egress uses the Tailscale container network namespace.

```yaml
services:
  cloudflared:
    command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TOKEN}
    container_name: cloudflared
    image: cloudflare/cloudflared:latest
    network_mode: service:tailscale-cloudflare-tunnel
    restart: unless-stopped

  tailscale-cloudflare-tunnel:
    image: tailscale/tailscale:latest
    container_name: tailscale-cloudflare-tunnel
    hostname: cloudflare-tunnel
    environment:
      - TS_AUTHKEY=${TS_AUTHKEY}
      - TS_EXTRA_ARGS=--advertise-tags=tag:container
      - TS_STATE_DIR=/var/lib/tailscale
    volumes:
      - ./tailscale/state:/var/lib/tailscale
    devices:
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - net_admin
      - sys_module
    restart: unless-stopped
```

Notes:

- The sidecar joins the tailnet with `TS_AUTHKEY`.
- `cloudflared` can resolve and reach tailnet services (for example via MagicDNS names).
- Service location becomes irrelevant as long as it is reachable on the same tailnet.

## Workload Placement Notes

- Docker services: Tailscale sidecar per app or per service group.
- Proxmox LXC services: Tailscale agent inside each LXC.

For LXC, `/dev/net/tun` access is required:

```text
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind,create=file
```

## Optional: Internal HTTPS with Tailscale Serve

For plain HTTP apps, `tailscale serve` can expose internal HTTPS with Tailscale-managed certs.

```bash
tailscale serve --bg 3000
tailscale serve status
```

Example status:

```text
https://pingvin.tail00000.ts.net (tailnet only)
|-- / proxy http://127.0.0.1:3000
```

## Why This Design

- No inbound ports opened at home or on the VPS.
- One public tunnel entry point for multi-site private infrastructure.
- Consistent access policy through Cloudflare + Tailscale identities.

## References

- Cloudflare Tunnel docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- Tailscale docs: https://tailscale.com/docs/
- Tailscale Serve docs: https://tailscale.com/kb/1312/serve
- Tailscale Docker image: https://hub.docker.com/r/tailscale/tailscale
- Proxmox VE docs: https://pve.proxmox.com/wiki/Main_Page
