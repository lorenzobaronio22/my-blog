---
title: "Quarkus Project Setup and Native Builds"
description: Quick reference for initializing Quarkus projects and building optimized native images for containerized deployments.
pubDate: 2026-04-11
tags: [java, quarkus, docker, native]
---

For comprehensive documentation, refer to the [official Quarkus site](https://quarkus.io/).

## Creating a New Quarkus Project

Start a new Quarkus project with the official CLI. The Maven coordinates follow the standard `group.id:artifact-id` pattern:

```bash
quarkus create app io.example:my-service
```

This generates a Maven-based project structure with standard Quarkus dependencies and a basic REST endpoint ready to extend.

## Building Native Images

Quarkus projects build both traditional JVM artifacts (faster initial builds, but requires a JVM at runtime) and native executables (slower build, but tiny runtime footprint and instant startup).

### Native Build with Container

The most practical approach for production deployments is building the native image inside a container, which ensures consistent build environments across machines:

```bash
./mvnw package -Pnative -Dquarkus.native.container-build=true -Dquarkus.container-image.build=true
```

This Maven command uses the `native` profile to compile to native code, delegates the actual compilation to a container (avoiding platform-specific build tool dependencies), and automatically creates a Docker image from the result. The image is tagged with the project's artifact ID and version.

## Building and Running Locally

For development or testing, you may want more control over the Docker build process:

```bash
# 1. Generate the native executable
./mvnw clean package

# 2. Build a Docker image from the local Dockerfile
docker build -f src/main/docker/Dockerfile.native -t my-service:latest .

# 3. Run the container
docker run --rm --network host my-service:latest
```

The `--network host` flag allows the containerized application to bind to host ports directly. Remove this if you're mapping ports explicitly with `-p` instead.

Quarkus generates appropriate Dockerfiles in `src/main/docker/` — choose `Dockerfile.native` for native images or `Dockerfile.jvm` for traditional JVM deployments.
