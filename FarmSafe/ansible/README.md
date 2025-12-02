# Ansible Playbook Setup Guide

## Installing Ansible on Windows

### Option 1: Install via pip (Recommended)

1. **Install Python** (if not already installed):
   - Download from https://www.python.org/downloads/
   - Make sure to check "Add Python to PATH" during installation

2. **Install Ansible**:
   ```powershell
   pip install ansible
   ```

### Option 2: Use WSL (Windows Subsystem for Linux)

1. **Install WSL**:
   ```powershell
   wsl --install
   ```

2. **Inside WSL, install Ansible**:
   ```bash
   sudo apt update
   sudo apt install ansible -y
   ```

## Setting Up Your Inventory

Edit `FarmSafe/ansible/inventory` with your VM details:

```ini
[servers]
your-vm ansible_host=YOUR_VM_IP ansible_user=ec2-user ansible_ssh_private_key_file=~/.ssh/your-key.pem
```

**Example:**
```ini
[servers]
app-server ansible_host=3.232.86.51 ansible_user=ec2-user ansible_ssh_private_key_file=C:/Users/Ramona Ingabire/.ssh/farmsafe-key-3.pem
```

## Running the Playbooks

### Setup Playbook (Initial Server Configuration)

This playbook sets up the server with Docker, Docker Compose, and required packages:

```bash
cd FarmSafe/ansible
ansible-playbook -i inventory playbook.yml
```

Or if using WSL:

```bash
cd /mnt/c/Users/Ramona\ Ingabire/Desktop/Group8-devops/FarmSafe/ansible
ansible-playbook -i inventory playbook.yml
```

### Deployment Playbook (Application Deployment)

This playbook deploys the application to the server:

```bash
cd FarmSafe/ansible
ansible-playbook -i inventory deploy.yml
```

Or with custom JWT secret:

```bash
ansible-playbook -i inventory deploy.yml -e jwt_secret=your_secret_here
```

## What Each Playbook Does

### playbook.yml (Setup)
- Updates package index
- Installs Docker
- Installs Docker Compose (as a plugin)
- Installs required packages (git, curl, unzip, python3-pip)
- Starts and enables Docker service
- Adds user to docker group
- Verifies installations
- Checks network connectivity

### deploy.yml (Deployment)
- Clones/updates the repository
- Creates .env file with configuration
- Stops existing containers
- Builds and starts new containers
- Verifies deployment health
- Displays deployment status

## Troubleshooting

**If you get "command not found":**
- Make sure Python and pip are in your PATH
- Try: `python -m pip install ansible`
- Or use WSL as shown above

**If SSH connection fails:**
- Verify your SSH key path is correct
- Test SSH manually through bastion: `ssh -i ~/.ssh/your-key.pem -J ec2-user@BASTION_IP ec2-user@APP_PRIVATE_IP`
- Make sure the VM's security group allows SSH from your IP
- Check that the inventory file has the correct ProxyJump configuration

**If deployment fails:**
- Ensure the repository is accessible (public or SSH key configured)
- Verify Docker and Docker Compose are installed (run setup playbook first)
- Check that the app directory exists and has correct permissions
- Review container logs: `docker compose logs` on the target server


