---
title: "Running Kubernetes the Hard Way on AMD64 Homelab Nodes"
description: Notes from my Kubernetes the Hard Way lab run, including AMD64-specific changes, known guide gaps, and troubleshooting observations.
pubDate: 2026-04-11
tags: [kubernetes, homelab, linux]
---

## Intro

I used Kubernetes the Hard Way to close some gaps in my Kubernetes fundamentals. In the past, I relied on highly automated setups and struggled to debug the final cluster state. This walkthrough forced me to understand each moving part directly.

Main reference repository:

- [https://github.com/kelseyhightower/kubernetes-the-hard-way](https://github.com/kelseyhightower/kubernetes-the-hard-way)

## Lab Topology

I ran the lab on one local hypervisor host using a mix of LXC containers and VMs.

| Name    | ID  | Role                          | CPU | RAM   | Storage | IP          | Type |
| ------- | --- | ----------------------------- | --- | ----- | ------- | ----------- | ---- |
| jumpbox | 115 | Administration host           | 1   | 512MB | 10GB    | 192.0.2.115 | LXC  |
| server  | 117 | Kubernetes control plane host | 1   | 2GB   | 20GB    | 192.0.2.117 | LXC  |
| node-0  | 118 | Kubernetes worker node        | 1   | 2GB   | 20GB    | 192.0.2.118 | VM   |
| node-1  | 119 | Kubernetes worker node        | 1   | 2GB   | 20GB    | 192.0.2.119 | VM   |

## Key Deviations from the Guide

Most steps were identical to upstream documentation. The main differences were related to architecture-specific binaries and one missing file in the guide.

### 1) Jumpbox Downloads: ARM64 -> AMD64

I updated `downloads.txt` to pull AMD64 binaries instead of ARM64 binaries.

```text
https://storage.googleapis.com/kubernetes-release/release/v1.28.3/bin/linux/amd64/kubectl
https://storage.googleapis.com/kubernetes-release/release/v1.28.3/bin/linux/amd64/kube-apiserver
https://storage.googleapis.com/kubernetes-release/release/v1.28.3/bin/linux/amd64/kube-controller-manager
https://storage.googleapis.com/kubernetes-release/release/v1.28.3/bin/linux/amd64/kube-scheduler
https://github.com/kubernetes-sigs/cri-tools/releases/download/v1.28.0/crictl-v1.28.0-linux-amd64.tar.gz
https://github.com/opencontainers/runc/releases/download/v1.1.9/runc.amd64
https://github.com/containernetworking/plugins/releases/download/v1.3.0/cni-plugins-linux-amd64-v1.3.0.tgz
https://github.com/containerd/containerd/releases/download/v1.7.8/containerd-1.7.8-linux-amd64.tar.gz
https://storage.googleapis.com/kubernetes-release/release/v1.28.3/bin/linux/amd64/kube-proxy
https://storage.googleapis.com/kubernetes-release/release/v1.28.3/bin/linux/amd64/kubelet
https://github.com/etcd-io/etcd/releases/download/v3.4.27/etcd-v3.4.27-linux-amd64.tar.gz
```

### 2) Compute Resource File

My `machines.txt` looked like this:

```text
192.0.2.117 server.kubernetes.local server
192.0.2.118 node-0.kubernetes.local node-0 10.200.0.0/24
192.0.2.119 node-1.kubernetes.local node-1 10.200.1.0/24
```

### 3) Authentication Config Generation

The command below can fail if `kubelet` already exists from an earlier step:

```bash
mkdir /var/lib/{kube-proxy,kubelet}
```

In my case, this warning was non-blocking and file copy operations still succeeded.

### 4) Missing Encryption Config File

I had to add `configs/encryption-config.yaml` manually, as discussed in:

- [https://github.com/kelseyhightower/kubernetes-the-hard-way/issues/787](https://github.com/kelseyhightower/kubernetes-the-hard-way/issues/787)

```yaml
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration

resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            - name: key1
              secret: ${ENCRYPTION_KEY}
      - identity: {}
```

### 5) etcd Bootstrap Commands (AMD64)

```bash
scp \
  downloads/etcd-v3.4.27-linux-amd64.tar.gz \
  units/etcd.service \
  root@server:~/
```

```bash
{
  tar -xvf etcd-v3.4.27-linux-amd64.tar.gz
  mv etcd-v3.4.27-linux-amd64/etcd* /usr/local/bin/
}
```

### 6) Worker Bootstrap Commands (AMD64)

```bash
for host in node-0 node-1; do
  scp \
    downloads/runc.amd64 \
    downloads/crictl-v1.28.0-linux-amd64.tar.gz \
    downloads/cni-plugins-linux-amd64-v1.3.0.tgz \
    downloads/containerd-1.7.8-linux-amd64.tar.gz \
    downloads/kubectl \
    downloads/kubelet \
    downloads/kube-proxy \
    configs/99-loopback.conf \
    configs/containerd-config.toml \
    configs/kubelet-config.yaml \
    configs/kube-proxy-config.yaml \
    units/containerd.service \
    units/kubelet.service \
    units/kube-proxy.service \
    root@$host:~/
done
```

```bash
{
  mkdir -p containerd
  tar -xvf crictl-v1.28.0-linux-amd64.tar.gz
  tar -xvf containerd-1.7.8-linux-amd64.tar.gz -C containerd
  tar -xvf cni-plugins-linux-amd64-v1.3.0.tgz -C /opt/cni/bin/
  mv runc.amd64 runc
  chmod +x crictl kubectl kube-proxy kubelet runc
  mv crictl kubectl kube-proxy kubelet runc /usr/local/bin/
  mv containerd/bin/* /bin/
}
```

Related reference:

- [https://gist.github.com/triangletodd/02f595cd4c0dc9aac5f7763ca2264185](https://gist.github.com/triangletodd/02f595cd4c0dc9aac5f7763ca2264185)

## Notes During Route Provisioning

When running `ip route add` via SSH, I saw the following output:

```text
Pseudo-terminal will not be allocated because stdin is not a terminal.
Linux node-0 6.1.0-25-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.106-3 (2024-08-26) x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
```

This looked noisy, but route provisioning still completed successfully.

## Smoke Test Result and Open Question

The final smoke test command:

```bash
curl -I http://node-0:32277
```

still failed for me, consistent with this issue:

- [https://github.com/kelseyhightower/kubernetes-the-hard-way/issues/796](https://github.com/kelseyhightower/kubernetes-the-hard-way/issues/796)

Traffic routing from nodes to pods was clear after manually adding routes in the previous step. What remained unclear was service IP routing behavior (for example, an internal service IP like `10.32.0.184`) in this lab setup.

## Conclusion

The lab was useful and mostly reproducible with AMD64-specific binary substitutions. The two main gotchas were:

- the missing encryption config file in the guide;
- lingering ambiguity around the final service-access smoke test.

Even with those rough edges, this run gave me a much better mental model of how a Kubernetes cluster is assembled from first principles.
