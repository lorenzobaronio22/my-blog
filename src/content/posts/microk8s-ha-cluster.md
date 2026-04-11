---
title: Building a 3-Node MicroK8s Cluster with NFS Storage
description: Notes from building a highly available MicroK8s homelab cluster via Portainer and adding dynamic NFS-backed persistent volumes.
pubDate: 2026-04-11
tags: [kubernetes, microk8s, homelab, storage, nfs]
---

## Intro

I wanted a lightweight Kubernetes setup for my homelab, so I tested the MicroK8s cluster creation flow from Portainer.

Reference documentation:

- [Portainer MicroK8s setup guide](https://docs.portainer.io/admin/environments/add/kube-create/microk8s)

This post summarizes the infrastructure layout I used and how I configured persistent storage using NFS CSI.

## Infrastructure Layout

I provisioned Ubuntu 24.04 LTS virtual machines on Proxmox:

| Role          | Hostname       | VM ID | IP          |
| ------------- | -------------- | ----- | ----------- |
| Control Plane | mk8s-cp-0      | 120   | 192.0.2.120 |
| Control Plane | mk8s-cp-1      | 121   | 192.0.2.121 |
| Control Plane | mk8s-cp-2      | 122   | 192.0.2.122 |
| Storage       | mk8s-storage-0 | 124   | 192.0.2.124 |

I used the Proxmox helper script to speed up VM creation:

- [Ubuntu 24.04 VM helper](https://tteck.github.io/Proxmox/#ubuntu-2404-vm)
- [Cloud-init prerequisite discussion](https://github.com/tteck/Proxmox/discussions/2072)

After provisioning, I had to install and enable SSH manually on the hosts:

```bash
sudo apt install -y openssh-server
sudo systemctl enable --now ssh
```

For high availability, all three Kubernetes nodes were configured as control-plane nodes.

## Persistent Storage with NFS CSI

To support persistent volumes, I followed the official MicroK8s NFS documentation:

- [Use NFS in MicroK8s](https://microk8s.io/docs/how-to-nfs)

On the storage VM, I exported an NFS share at `/srv/microk8s/data`.

I initially set broad permissions during setup to avoid UID/GID mismatches while validating the cluster:

```bash
sudo chmod 777 /srv/microk8s/data
```

For production use, I recommend replacing this with explicit ownership and narrower permissions.

## NFS StorageClass

I created the following `StorageClass` for dynamic provisioning:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: nfs-csi
provisioner: nfs.csi.k8s.io
parameters:
  server: 192.0.2.124
  share: /srv/microk8s/data
reclaimPolicy: Delete
volumeBindingMode: Immediate
mountOptions:
  - hard
  - nfsvers=4.2
```
