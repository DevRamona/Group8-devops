# DevSecOps Security Overview

This document explains the security tools integrated into our CI/CD pipeline:

- **Trivy:** Scans filesystem and container images for vulnerabilities.
- **Tfsec:** Scans Terraform code for misconfigurations.
- **GitHub Actions Security Checks:** Ensures PRs meet security and quality gates before merging.

This document supports Task 3 by describing our "shift-left" approach.
