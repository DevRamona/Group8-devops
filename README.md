# FarmSafe

> Empowering Rwandan farmers with technology-driven agricultural solutions

## African Context

FarmSafe addresses critical challenges faced by smallholder farmers in Rwanda, where agriculture employs over 70% of the population but faces significant hurdles including climate change impacts, limited access to market information, and inadequate weather tracking. By providing localized weather data, crop price tracking, and farmer management tools tailored to Rwandan agricultural conditions, FarmSafe helps farmers make informed decisions that can improve yields, reduce losses, and increase income in one of Africa's most agriculture-dependent economies.

## Team Members

- Nana Koramah Abeasi - Frontend developer
- Ramona Ingabire - DevOps Engineers
- Cecilia Munayani Banda - Backend developer/ DevSecOps Tasks

## Project Overview

FarmSafe is a comprehensive web application designed to support Rwandan farmers by providing essential agricultural information and management tools. The platform serves as a centralized hub where farmers can access personalized profiles, track seasonal weather patterns specific to their regions, monitor crop prices, and manage their farming operations more effectively and efficiently.

The application features a modern, responsive interface with a clean design that prioritizes usability for farmers who may have varying levels of digital literacy. By focusing on Rwanda's agricultural context, FarmSafe incorporates local crop varieties, regional weather patterns, and market dynamics specific to East African farming communities.

### Target Users
- Smallholder farmers in Rwanda
- Agricultural cooperatives and associations
- Wholesale crop buyers
- Farm managers and agricultural consultants

### Core Features
- **Farmer Profiles**: Comprehensive farmer management with contact information, farm details, and crop specialization
- **Regional Weather Tracking**: Localized weather information tailored to Rwandan districts and farming seasons
- **Crop Price Monitoring**: Real-time market price tracking for major Rwandan crops

## Technology Stack

- **Backend**: Node.js/Express with TypeScript
- **Frontend**: React with TypeScript and Vite
- **Database**: MongoDB with Mongoose ODM
- **Containerization**: Docker and Docker Compose
- **CI/CD**: GitHub Actions
- **Other**: React Router for navigation, React Icons for UI elements, CORS for API communication, Tailwind CSS for styling

## Getting Started

### Prerequisites

**For Local Development:**
- Node.js 20+ and npm
- MongoDB (local installation or MongoDB Atlas account)
- Git

**For Docker Deployment:**
- Docker Desktop (or Docker Engine + Docker Compose)
- Git

## Getting Started

### Option 1: Docker Compose (Recommended)

The easiest way to run the entire application is using Docker Compose:

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd Group8-devops/FarmSafe
```

2. **Create environment file**
```bash

echo "JWT_SECRET=your_secret_key_here" > .env
```

3. **Start all services with Docker Compose**
```bash
docker-compose up -d
```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

5. **Stop services**
```bash
docker-compose down
```

6. **View logs**
```bash
docker-compose logs -f
```

### Option 2: Local Development

1. **Clone the repository**
```bash
git clone [your-repo-url]
cd Group8-devops
```

2. **Set up MongoDB**
   - Install MongoDB locally, or
   - Use MongoDB Atlas (free tier available)
   - Create a database named `farmsafe_db`

3. **Configure backend environment**
```bash
cd FarmSafe/backend
cp env.example .env
```

4. **Install backend dependencies**
```bash
cd FarmSafe/backend
npm install
```

5. **Install frontend dependencies**
```bash
cd FarmSafe/frontend
npm install
```

6. **Start the backend**
```bash
cd FarmSafe/backend
npm run dev
```

7. **Start the frontend** (in a new terminal)
```bash
cd FarmSafe/frontend
npm run dev
```

### Usage

1. Open your browser and navigate to `http://localhost:5173` (local) or `http://localhost` (Docker)
2. Register a new account or log in
3. Browse the dashboard to see farmer information, weather, and crop data
4. Use the sidebar navigation for different sections

## Docker Configuration

### Dockerfiles

- **Backend Dockerfile** (`FarmSafe/Dockerfile`): Multi-stage build for the API (compiles TypeScript, runs as non-root)
- **Frontend Dockerfile** (`FarmSafe/frontend/Dockerfile`): Multi-stage build with nginx for serving React app

### Docker Compose

The `docker-compose.yml` file orchestrates three services:
- **mongodb**: MongoDB database with persistent volume
- **backend**: Express API server
- **frontend**: React application served via nginx

### Building Individual Services

```bash
cd FarmSafe/backend
docker build -t farmsafe-backend .

cd FarmSafe/frontend
docker build -t farmsafe-frontend .
```

## Production Deployment

### Accessing the Application

The application is deployed on AWS and is accessible via the Bastion Host's public IP address. The bastion host acts as a reverse proxy, forwarding all HTTP requests to the application instance running in a private subnet.

**Application URL**: `http://<bastion-public-ip>`

To get the bastion host's public IP address:
```bash
cd FarmSafe/terraform
terraform output bastion_public_ip
```

Or check the Terraform outputs after deployment:
- **Bastion Public IP**: Available in `terraform output bastion_public_ip`
- **App Private IP**: Available in `terraform output app_private_ip`

### Architecture

- **Bastion Host**: Public-facing EC2 instance with nginx reverse proxy
- **Application Instance**: Private EC2 instance running Docker containers (backend + MongoDB)
- **Security**: Application instance is in a private subnet, only accessible through the bastion

### Infrastructure

The infrastructure is managed with Terraform and includes:
- VPC with public and private subnets
- Bastion host in public subnet (with Elastic IP)
- Application instance in private subnet
- Security groups configured for proper access control
- RDS database for persistent data storage

## CI/CD Pipeline

### GitHub Actions (CI)

The project includes a CI pipeline (`.github/workflows/ci.yml`) that:
- **Triggers**: on pushes to feature branches and on pull requests targeting `main`
- **Quality checks**:
  - **Linting** for both backend and frontend
  - **TypeScript type checking**
- **Safety checks**:
  - **Tests** (at least one test required to pass)
  - **Container validation**: builds Docker images and validates `docker-compose` configuration

### Deployment Pipeline (CD)

The CD pipeline (`.github/workflows/cd.yml`) automatically:
- **Triggers** on pushes to the `main` branch
- **Uses SSH** to connect securely to the bastion host using a GitHub Actions secret-backed SSH key
- **Jumps from bastion → app instance** using an SSH `ProxyJump` configuration
- **Fetches and deploys the latest code** on the application instance by:
  - Stashing any local changes on the server (to avoid conflicts)
  - Hard-resetting to `origin/main`
  - Rebuilding and restarting all services with `docker compose down`, `docker compose build --no-cache`, and `docker compose up -d`
- **Performs health checks** on:
  - Backend: `http://localhost:5000`
  - Frontend: `http://localhost`
- **Publishes a deployment summary** in the GitHub Actions run, including:
  - Deployment status
  - Commit SHA and author
  - **Production URL**: `http://farmsafe-dev-alb-1865447178.us-east-1.elb.amazonaws.com/`

### Running Tests Locally

```bash
cd FarmSafe/backend
npm test

cd FarmSafe/frontend
npm test
```

### Branch Protection

The `main` branch is protected and requires:
- CI checks to pass before merging
- Code review from team members
- No direct pushes (must use pull requests)

## Git-to-Production Workflow

This section describes the end-to-end flow from a code change in Git to a live deployment in production.

1. **Create a feature branch**
   - From your local machine:
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/<short-description>
   ```
2. **Make a small, visible change**
   - For example, update a button label or heading in the frontend so the change is easy to see in production.
   - Commit your work:
   ```bash
   git add .
   git commit -m "feat: update dashboard button text"
   git push -u origin feature/<short-description>
   ```
3. **Open a Pull Request (PR) into `main`**
   - Go to the GitHub repository.
   - Create a PR from `feature/<short-description>` into `main`.
   - Describe the change briefly and link to any relevant issue or task.
4. **CI checks run automatically**
   - GitHub Actions runs the CI workflow (`ci.yml`) on the PR:
     - **Linting**, **type checking**, **tests**, and **container validation** must all succeed.
   - The PR will show green status checks when CI passes.
5. **Review and merge the PR**
   - A teammate reviews the PR.
   - Once approvals and status checks are in place, merge into `main` (no direct pushes allowed).
6. **CD pipeline deploys to production**
   - The push to `main` triggers the CD workflow (`cd.yml`).
   - The workflow connects over SSH to the bastion host, jumps to the private app instance, pulls the latest code, rebuilds Docker images, restarts services, and performs health checks.
   - A deployment summary is attached to the GitHub Actions run (including commit, author, and production URL).
7. **Verify the change is live**
   - Open the production URL in a browser:
     - `http://farmsafe-dev-alb-1865447178.us-east-1.elb.amazonaws.com/`
   - Confirm that the visible change (e.g., updated button text) is present in the UI.

This is the same Git-to-production flow you should demonstrate in your 10–15 minute video.

## Operations & Troubleshooting

- **CI/CD logs**
  - **CI**: Check the `Actions` tab in GitHub for runs of `ci.yml` on your branch or PR.
  - **CD**: Check `cd.yml` runs (triggered on `main`) for detailed deployment logs, including SSH connection steps, Docker rebuild, and health checks.
- **SSH access**
  - Use the bastion host as a jump box for debugging:
  ```bash
  ssh -i <your-key.pem> ec2-user@<bastion-public-ip>
  # From bastion, SSH to the private app instance if needed
  ssh ec2-user@<app-private-ip>
  ```
- **Docker and application logs on the app instance**
  - To see running containers:
  ```bash
  docker compose ps
  ```
  - To follow logs for all services:
  ```bash
  docker compose logs -f
  ```
  - If services are unhealthy, restart them:
  ```bash
  docker compose down
  docker compose up -d
  ```
- **Common issues**
  - **CI fails**:
    - Run the same commands locally (`npm test`, `npm run lint`, `npm run build`) in both `backend` and `frontend` to reproduce and fix.
  - **CD fails**:
    - Inspect the `cd.yml` job logs in GitHub Actions for SSH errors, Git issues, or Docker build errors.
  - **App not reachable from the browser**:
    - Confirm the production URL is correct and DNS has propagated.
    - Check that the load balancer and security groups allow HTTP traffic (port 80).
    - Verify that containers are up and passing health checks on the app instance.

## Demo Video

To see the complete Git-to-production workflow in action, refer to the recorded demo video:

- **Git-to-Production Demo (10–15 minutes)**: _link to be added once the video is uploaded (e.g., YouTube, Google Drive, or institutional platform)_

## Project Structure

```
FarmSafe/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── __tests__/
│   │   └── server.ts
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── jest.config.js
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── vite.config.ts
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── README.md
```

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   User/Client   │◄──►│  Bastion Host   │◄──►│  App Instance   │
│                 │    │                 │    │                 │
│   Browser       │    │  Nginx Reverse  │    │ Docker Containers│
│   (HTTP/HTTPS)  │    │  Proxy (Port 80)│    │                 │
└─────────────────┘    └─────────────────┘    │ • Backend API   │
                                              │   (Node.js/TS)  │
                                              │ • Frontend SPA  │
                                              │   (React/nginx) │
                                              │ • MongoDB       │
                                              └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │                 │
                                              │   RDS Database  │
                                              │   (PostgreSQL)  │
                                              │                 │
                                              └─────────────────┘
```

### Architecture Components

- **Bastion Host**: Public-facing entry point with nginx reverse proxy forwarding requests to the application instance
- **Application Instance**: Private EC2 instance running Docker containers for backend, frontend, and MongoDB
- **Backend**: Node.js/Express API server serving both REST endpoints and static frontend files
- **Frontend**: React SPA served directly by the backend for simplified deployment
- **Database**: AWS RDS PostgreSQL instance for persistent data storage
- **Security**: Security groups restrict access between components, bastion allows public HTTP access

### Network Flow
1. User accesses application via bastion host's public IP
2. Bastion nginx proxies requests to application instance (private IP)
3. Application instance serves frontend static files and API responses
4. Database connections use private networking within VPC

## Live Application

**Application URLs**:

- Main app: `http://farmsafe-dev-alb-1865447178.us-east-1.elb.amazonaws.com/`
- Login page: `http://farmsafe-dev-alb-1865447178.us-east-1.elb.amazonaws.com/login`

## Links

- [Project Board] https://github.com/users/DevRamona/projects/1

## License

This project is licensed under the [MIT License].

Copyright (c) 2025 FarmSafe