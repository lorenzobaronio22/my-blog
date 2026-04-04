#!/usr/bin/env bash
set -euo pipefail

# Install helper CLIs often used in GitHub Actions-oriented workflows.
if ! command -v jq >/dev/null 2>&1; then
  sudo apt-get update
  sudo apt-get install -y jq
fi
