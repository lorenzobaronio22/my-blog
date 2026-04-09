---
title: Securely Expose Services with Cloudflare and Tailscale
description: Expose self-hosted services securely with Cloudflare Tunnels and Tailscale using Docker and LXC.
pubDate: 2025-07-05
updatedDate: 2025-07-05
tags: [homelab, cloudflare, tailscale, networking]
---

If you self-host services, you face a tradeoff: expose ports publicly (higher risk) or keep everything private (harder remote access).

This is the setup I use in production to avoid that tradeoff:

- **Cloudflare Tunnel** publishes a public HTTPS endpoint without opening inbound ports on my network.
- **Tailscale** gives every internal service a private identity on my **tailnet** (your private WireGuard-based network managed by Tailscale).

Result: services stay private, traffic is encrypted, and access is easier to manage.

## Prerequisites

Before using this pattern, make sure you have:

- A Cloudflare account with Zero Trust / Tunnel access
- A Tailscale account and an existing tailnet
- Docker or Docker Compose for containerized workloads
- Basic Linux/container familiarity (environment variables, volumes, networking)

## Architecture (High-Level)

```text
Internet User
  |
  v
Cloudflare Edge (HTTPS)
  |
  v
Cloudflare Tunnel (cloudflared)
  |
  v
Tailscale Sidecar (joined to your tailnet)
  |
  v
Internal Service (Docker or LXC)
```

I run `cloudflared` with a **Tailscale sidecar** (a helper container that provides networking to another container). `cloudflared` shares the sidecar network namespace, so it can reach anything available on the tailnet.

## Implementation Guide

### 1) Bridge Cloudflare Tunnel to Tailscale

Start with this Compose pattern:

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

How this works:

- The Tailscale container joins your tailnet using `TS_AUTHKEY`.
- `cloudflared` uses `network_mode: service:tailscale-cloudflare-tunnel`, so it can route traffic to tailnet services.
- With **MagicDNS** enabled (Tailscale-managed internal DNS names), Cloudflare Tunnel can target tailnet hostnames directly.

### 2) Put your apps on Tailscale

You can do this in two common ways:

- **Docker apps**: use a Tailscale sidecar per app or per service group.
- **LXC apps (Proxmox)**: install Tailscale directly in each container.

For LXC, allow access to the TUN device first:

```
lxc.cgroup2.devices.allow: c 10:200 rwm
lxc.mount.entry: /dev/net/tun dev/net/tun none bind, create=file
```

### 3) Add HTTPS internally with Tailscale Serve (optional, recommended)

If your app only serves plain HTTP internally, `tailscale serve` can expose it as HTTPS with Tailscale-managed certificates.

Example for an app on port `3000`:

```bash
tailscale serve --bg 3000
```

Check status:

```
tailscale serve status
https://pingvin.tail00000.ts.net (tailnet only)
|-- / proxy http://127.0.0.1:3000
```

For Dockerized apps, you can also use static `serve.json` config:

```json
{
  "TCP": {
    "443": {
      "HTTPS": true
    }
  },
  "Web": {
    "${TS_CERT_DOMAIN}:443": {
      "Handlers": {
        "/": {
          "Proxy": "http://nginx-app:80"
        }
      }
    }
  }
}
```

Minimal example with an Nginx app:

```yaml
services:
  nginx-app:
    image: nginx:latest
    container_name: nginx-app
    network_mode: service:tailscale-nginx
    restart: unless-stopped
  tailscale-nginx:
    image: tailscale/tailscale:latest
    container_name: tailscale-nginx
    hostname: nginx-app
    environment:
      - TS_AUTHKEY=${TS_AUTHKEY}
      - TS_EXTRA_ARGS=--advertise-tags=tag:container
      - TS_SERVE_CONFIG=/config/serve.json
      - TS_STATE_DIR=/var/lib/tailscale
    volumes:
      - ./tailscale/state:/var/lib/tailscale
      - ./tailscale/config:/config
    devices:
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - net_admin
      - sys_module
    restart: unless-stopped
```

## Conclusion

Cloudflare Tunnel + Tailscale is a practical pattern for internet reachability without publicly exposing your infrastructure. It works across Docker and LXC workloads and keeps security controls centralized.

## References

- Cloudflare Tunnel docs: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/
- Tailscale docs: https://tailscale.com/docs/
- Tailscale Serve docs: https://tailscale.com/kb/1312/serve
- Tailscale Docker image: https://hub.docker.com/r/tailscale/tailscale
- Proxmox VE docs: https://pve.proxmox.com/wiki/Main_Page
