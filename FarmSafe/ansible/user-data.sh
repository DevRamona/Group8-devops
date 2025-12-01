#!/bin/bash
set -e

# Minimal bootstrap for Ansible
# We only need to ensure Python is available for Ansible to connect and manage the node.
# The actual application deployment is handled by the Ansible playbook.

echo "=== Bootstrap Started at $(date) ==="

# Update package cache and install python
dnf update -y
dnf install -y python3 python3-pip

echo "=== Bootstrap Completed at $(date) ==="