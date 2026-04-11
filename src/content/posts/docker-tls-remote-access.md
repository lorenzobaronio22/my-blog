---
title: Securing Docker Remote Access with TLS
description: Configuring encrypted, authenticated Docker daemon access over the network for homelab multi-host deployments.
pubDate: 2026-04-11
tags: [homelab, docker, security, tls]
---

## Intro

Managing Docker across multiple hosts in a homelab requires secure remote access to the Docker daemon. The standard approach is to expose the daemon over TLS with certificate-based authentication. This ensures traffic is encrypted and both client and server verify each other's identity. This post covers the TLS setup I use for homelab environments where I need to manage containers across multiple machines.

See the official Docker Security Guide for reference: [Protect the Docker daemon socket](https://docs.docker.com/engine/security/protect-access/)

## Security Model

The model is straightforward:

- A Certificate Authority (CA) issues certificates
- The Docker host gets a server certificate signed by the CA
- Each client gets its own certificate signed by the CA
- Docker daemon requires TLS and validates certificates

This prevents unauthorized access and eavesdropping on the Docker socket.

## Certificate Generation

I generate three sets of certificates: CA, server (daemon), and client. All use 4096-bit RSA for stronger security.

### 1. Create the Certificate Authority

```bash
openssl genrsa -aes256 -out ca-key.pem 4096
# Enter passphrase when prompted
```

Then create the CA certificate:

```bash
openssl req -new -x509 -days 3650 -key ca-key.pem -sha256 -out ca.pem
# Enter CA passphrase
# Fill in organizational details:
# Country: US, State: California, City: Example
# Organization: Example Organization, Unit: IT
# Common Name: docker-ca
# Email: admin@example.com
```

### 2. Create the Server (Daemon) Certificate

Generate the server's private key:

```bash
openssl genrsa -out server-key.pem 4096
```

Create a certificate signing request for your Docker host:

```bash
openssl req -subj "/CN=docker-host.example.com" -sha256 -new \
  -key server-key.pem -out server.csr
```

Add the Subject Alternative Name (SAN) to include the IP address and/or hostname:

```bash
echo "subjectAltName = DNS:docker-host.example.com,IP:203.0.113.42,IP:127.0.0.1" >> extfile.cnf
echo "extendedKeyUsage = serverAuth" >> extfile.cnf
```

Sign the server certificate with the CA:

```bash
openssl x509 -req -days 3650 -sha256 -in server.csr \
  -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
  -out server-cert.pem -extfile extfile.cnf
# Enter CA passphrase when prompted
```

### 3. Create a Client Certificate

Generate the client's private key:

```bash
openssl genrsa -out client-key.pem 4096
```

Create client certificate signing request:

```bash
openssl req -subj "/CN=client" -new -key client-key.pem -out client.csr
```

Add client-specific attributes:

```bash
echo "extendedKeyUsage = clientAuth" > extfile-client.cnf
```

Sign the client certificate:

```bash
openssl x509 -req -days 3650 -sha256 -in client.csr \
  -CA ca.pem -CAkey ca-key.pem -CAcreateserial \
  -out client-cert.pem -extfile extfile-client.cnf
# Enter CA passphrase when prompted
```

### 4. Cleanup

Remove temporary CSR files:

```bash
rm -v client.csr server.csr extfile.cnf extfile-client.cnf
```

### 5. Set Proper Permissions

Restrict private key access and make certs world-readable where needed:

```bash
chmod -v 0400 ca-key.pem client-key.pem server-key.pem
chmod -v 0444 ca.pem server-cert.pem client-cert.pem
```

## Configure Docker Daemon

Store certificates in a dedicated directory (e.g., `/etc/docker/tls/`) and configure the Docker daemon to use them.

Edit the Docker service configuration:

```bash
sudo systemctl edit docker.service
```

Add or modify the `ExecStart` line in the `[Service]` section:

```systemd
[Service]
ExecStart=
ExecStart=/usr/bin/dockerd \
  -H fd:// \
  -H tcp://203.0.113.42:2376 \
  --tlsverify \
  --tlscacert=/etc/docker/tls/ca.pem \
  --tlscert=/etc/docker/tls/server-cert.pem \
  --tlskey=/etc/docker/tls/server-key.pem
```

Key flags:

- `-H tcp://...` exposes the daemon on the network interface and port
- `--tlsverify` requires client certificates
- `--tlscacert` validates client certificates
- `--tlscert` and `--tlskey` are the server credentials

Reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart docker.service
```

Verify the daemon is listening:

```bash
sudo netstat -lntp | grep dockerd
```

You should see the daemon listening on port 2376 (default TLS port).

## Using Client Certificates

On a remote client, copy the client certificates and connect:

```bash
# Setup local directory
mkdir -p ~/.docker/tls/docker-host.example.com/
cp /path/to/ca.pem ~/.docker/tls/docker-host.example.com/
cp /path/to/client-cert.pem ~/.docker/tls/docker-host.example.com/
cp /path/to/client-key.pem ~/.docker/tls/docker-host.example.com/
```

Set environment variables:

```bash
export DOCKER_HOST=tcp://docker-host.example.com:2376
export DOCKER_CERT_PATH=~/.docker/tls/docker-host.example.com
export DOCKER_TLS_VERIFY=1
```

Then use Docker commands normally:

```bash
docker ps
docker images
```

Or set these in your shell profile or Docker CLI config for persistence.
