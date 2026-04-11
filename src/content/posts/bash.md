---
title: "Bash Quick Reference"
description: A personal reference for Bash commands and utilities I have used.
pubDate: 2026-04-11
tags: [linux, bash]
---

## Intro

This is a reference post for Bash commands and utilities I have used. The [official Bash manual](https://www.gnu.org/software/bash/manual/bash.html) is the definitive resource for anything more in-depth.

## Timing a Script

The `time` builtin measures how long a command or script takes to run. It works for any executable, not just shell scripts.

```bash
time yourscript.sh
```

It also works for Python scripts or any other command:

```bash
time python script.py
```

This outputs three time values:

- **Real** — Wall clock time from start to finish. Includes time spent waiting on I/O, time slices used by other processes, and any blocking.
- **User** — CPU time spent in user-mode code (outside the kernel). Only counts actual CPU cycles consumed by the process itself.
- **Sys** — CPU time spent inside the kernel on behalf of the process (system calls). Does not include user-space library code.

## Generating Random Strings

Two quick options for generating random strings — useful for secrets, tokens, or temporary identifiers.

Using `$RANDOM` piped through `md5sum` (produces a 20-character hex string):

```bash
echo $RANDOM | md5sum | head -c 20; echo
```

Using `openssl` for a cryptographically secure base64-encoded string:

```bash
openssl rand -base64 32
```

For more options and approaches, see [this reference](https://linuxhint.com/generate-random-string-bash/).
