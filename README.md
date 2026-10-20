# FitTrack — Fitness Tracker

**Train Smarter. Run Stronger.**

FitTrack is a full-stack fitness tracking web application designed to help users manage gym workouts, track running activities, and monitor fitness progress through a modern, responsive dashboard.

## Features

- **Dashboard:** View fitness activity and workout statistics.
- **Gym Workouts:** Explore exercises and manage workout sessions.
- **GPS Running:** Track outdoor runs using device location.
- **Yo-Yo Test:** Support for fitness endurance testing.
- **Progress Analytics:** Review workout history and fitness statistics.
- **User Authentication:** Register and sign in to your account.
- **Profile Management:** Manage personal fitness goals and profile information.
- **Responsive UI:** Access the application on desktop and mobile devices.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM

### Database
- PostgreSQL

## Project Structure

```text
FitTrack/
├── client/          # React frontend
├── server/          # Express backend and API
├── package.json     # Root scripts and dependencies
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js and npm
- Git
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/Sourxv20/FitTrack.git
cd FitTrack
```

### 2. Install dependencies

Install the root dependencies:

```bash
npm install
```

Install the frontend dependencies:

```bash
cd client
npm install
cd ..
```

Install the backend dependencies:

```bash
cd server
npm install
cd ..
```

### 3. Configure environment variables

Create the required environment file using the project's `.env.example` as a reference.

Configure the PostgreSQL connection, authentication secrets, and any other environment variables required by the application.

**Never commit real passwords, API keys, or authentication secrets to GitHub.**

### 4. Set up the database

Ensure PostgreSQL is running, create the required database, and configure the database connection.

Run the Prisma commands appropriate to the migrations included in the project.

### 5. Run the application

From the project root, run:

```bash
npm run dev
```

Open the local frontend URL printed in the terminal.

## Future Improvements

- Enhanced fitness analytics and reports
- Additional workout plans and exercise demonstrations
- Improved mobile experience
- Deployment to a production hosting environment

## Author

**Sourav Pandey**

GitHub: [@Sourxv20](https://github.com/Sourxv20)

## License

This project is developed for educational and personal learning purposes. A formal open-source license can be added if the project is intended for public reuse.
