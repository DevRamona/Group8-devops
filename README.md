# FarmSafe

> Empowering Rwandan farmers with technology-driven agricultural solutions

## African Context

FarmSafe addresses critical challenges faced by smallholder farmers in Rwanda, where agriculture employs over 70% of the population but faces significant hurdles including climate change impacts, limited access to market information, and inadequate weather tracking. By providing localized weather data, crop price tracking, and farmer management tools tailored to Rwandan agricultural conditions, FarmSafe helps farmers make informed decisions that can improve yields, reduce losses, and increase income in one of Africa's most agriculture-dependent economies.

## Team Members

- Nana Koramah Abeasi - Frontend developer
- Ramona Ingabire - DevOps engineers
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

## CI/CD Pipeline

### GitHub Actions

The project includes a CI pipeline (`.github/workflows/ci.yml`) that:
- Triggers on pushes to any branch (except main) and pull requests to main
- Runs linting checks for both backend and frontend
- Executes TypeScript type checking
- Runs tests (minimum 1 test required)
- Builds Docker images to validate containerization
- Validates docker-compose configuration

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

## Links

- [Project Board] https://github.com/users/DevRamona/projects/1

## License

This project is licensed under the [MIT License].

Copyright (c) 2025 FarmSafe