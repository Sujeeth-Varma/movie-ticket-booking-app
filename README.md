# Movie Ticket Booking App

A full‑stack movie ticket booking application with a Java Spring Boot backend and a Next.js frontend. It uses PostgreSQL for data persistence. The app supports movie listings, showtimes, seat selection, and ticket booking with JWT-based authentication.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the App](#running-the-app)
- [Docker Setup](#docker-setup)
- [Usage](#usage)
- [Contributing](#contributing)
- [Contact](#contact)

---

## Features

- RESTful APIs with Spring Boot (Java)
- JWT authentication
- PostgreSQL for relational data (movies, shows, seats, bookings, users)
- Next.js frontend (React) for browsing movies, selecting seats, and booking
- Docker Compose to run DB, backend, and frontend together

---

## Tech Stack

| Component          | Technology                 |
|--------------------|----------------------------|
| **Backend**        | Java, Spring Boot          |
| **Frontend**       | Next.js, React             |
| **Database**       | PostgreSQL                 |
| **Auth**           | JWT                         |
| **Deployment**     | Docker, docker-compose     |

---

## Project Structure

```
movie-ticket-booking-app/
├── movie-booking-backend/  ← Spring Boot backend project
├── frontend/               ← Next.js frontend project
├── docker-compose.yml      ← Compose file to run DB + backend + frontend
└── README.md               ← You are here
```

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Java (JDK 21)
- Node.js 18+ and npm (or yarn)
- Docker & Docker Compose V2 (if using containers)
- PostgreSQL (only if running locally without Docker)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Sujeeth-Varma/movie-ticket-booking-app.git
cd movie-ticket-booking-app
```

---

### Running the App

#### Using Docker

If using docker-compose:

```bash
docker compose up --build
```

This will:
- Run PostgreSQL on port 5432
- Build and run backend on port 8080
- Build and run frontend on port 3000

To stop:
```bash
docker compose down
```

Add `-v` to also remove DB data volume:
```bash
docker compose down -v
```

---

#### Locally (without Docker)

Backend setup:

```bash
cd movie-booking-backend
mvn clean install   # or ./mvnw clean install
```

Start Backend:

```bash
mvn spring-boot:run
```

By default, backend reads DB settings from `application.properties`. For local Postgres, ensure these are correct or export env vars matching your setup (e.g., `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`).

Frontend setup:

```bash
cd ../frontend
npm install
```

Start Frontend:

```bash
npm run dev
# or `npm run start` after a production build (`npm run build`)
```

Access the application:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080`

---

## Docker Setup

The project includes a `docker-compose.yml` file for easy containerization:

```bash
# Build and start all services
docker compose up --build

# Run in detached mode
docker compose up -d

# Stop all services
docker compose down
```

Ports exposed on host:
- DB: 5432
- Backend: 8080
- Frontend: 3000

---

## Usage

1. Start the stack (Docker) or run backend and frontend locally.
2. Open the frontend at `http://localhost:3000`.
3. Authenticate (login/register).
4. Browse movies and shows, select a showtime.
5. Choose available seats and proceed to booking.
6.  Confirm the booking.
7. Review booking confirmation.

---

## Contributing

Contributions are welcome! If you want to contribute:

1. Fork the project
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes & test thoroughly
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Submit a pull request

Please ensure code is formatted, tested, and well-documented.

---

## Contact

If you have questions or suggestions, feel free to reach out:

- Author: Sujeeth Varma
- GitHub: https://github.com/Sujeeth-Varma

---

Need help with setup or have feature requests? Feel free to open an issue on GitHub!
