---
title: "Git Reference"
description: A personal reference for Git uncommon workflows.
pubDate: 2026-04-11
tags: [git, homelab, linux]
---

## Intro

This is a reference post for Git workflows I have used or use not regularly — both in my homelab and general development.

## HTTP Credential Management

Git can cache HTTP credentials locally so you are not prompted on every operation. The `store` helper saves credentials to a plain text file on disk, so only use this on machines you control and trust.

[Reference](https://stackoverflow.com/questions/35942754/how-can-i-save-username-and-password-in-git)

### Save Credentials

```bash
# Configure the credential helper globally
git config --global credential.helper store
# Run a command that requires authentication — you will be prompted once
git pull
# Subsequent commands will use the stored credentials
git pull
```

### Update Credentials

If your credentials change (for example, after rotating a personal access token), a failed authentication will automatically invalidate the stored entry. You can then re-enter the new credentials on the next attempt.

```bash
# This will fail with the old, invalid credentials
git pull
# Re-run and enter the new credentials when prompted
git pull
```

## Re-Tagging

To move an existing tag to a new commit — for example, when a release tag needs to be updated — you can force-overwrite it both locally and on the remote.

```bash
# Overwrite the local tag
git tag -f v1
# Force-push the updated tag to origin
git push -f origin tag v1
```

## Backup and Restore a GitHub Repository

If the primary remote is ever lost or needs to be migrated, a mirror clone preserves the full history of all branches and refs.

### Backup

```bash
# Create a mirror clone — includes all branches, tags, and refs
git clone --mirror git@github.com:username/example.git
# Keep the mirror up to date over time
git remote update
```

### Restore

```bash
# Remove pull request refs, which are read-only and cannot be pushed
git for-each-ref --format 'delete %(refname)' refs/pull | git update-ref --stdin
# Push everything to the new remote
git push --mirror git@github.com:username/new-example.git
```
