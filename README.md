# FarmSafe

> Empowering Rwandan farmers with technology-driven agricultural solutions

## African Context

FarmSafe addresses critical challenges faced by smallholder farmers in Rwanda, where agriculture employs over 70% of the population but faces significant hurdles including climate change impacts, limited access to market information, and inadequate weather tracking. By providing localized weather data, crop price tracking, and farmer management tools tailored to Rwandan agricultural conditions, FarmSafe helps farmers make informed decisions that can improve yields, reduce losses, and increase income in one of Africa's most agriculture-dependent economies.

## Team Members

- Nana Koramah Abeasi - Frontend developer
- Ramona Ingabire - DevOps engineer
- Cecilia Munayani Banda - Backend developer

## Project Overview

FarmSafe is a comprehensive web application designed to support Rwandan farmers by providing essential agricultural information and management tools. The platform serves as a centralized hub where farmers can access personalized profiles, track seasonal weather patterns specific to their regions, monitor crop prices, and manage their farming operations more effectively.

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
- **Database**: Sequelize ORM with mock data for development
- **Other**: React Router for navigation, React Icons for UI elements, CORS for API communication

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git

### Installation

1. Clone the repository
```bash
   git clone [your-repo-url]
   cd Group8-devops
```

2. Install backend dependencies
```bash
   cd FarmSafe/backend
   npm install
```

3. Install frontend dependencies
```bash
   cd ../frontend
   npm install
```

4. Build and start the backend
```bash
   cd ../backend
   npm run build
   npm start
```

5. Start the frontend (in a new terminal)
```bash
   cd ../frontend
   npm run dev
```

### Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Browse the farmer list to see all registered farmers
3. Click on any farmer card to view their detailed profile
4. Use the sidebar navigation for different sections (Profile, Weather, Crop Prices)

## Project Structure

```
FarmSafe/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── dist/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   ├── public/
│   └── package.json
└── README.md
```

## Links

- [Project Board] https://github.com/users/DevRamona/projects/1

## License

This project is licensed under the [MIT License].

Copyright (c) 2025 FarmSafe