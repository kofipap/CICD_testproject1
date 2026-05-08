# Node.js Docker App

A simple REST API built with **pure Node.js** (no frameworks) that uses a `data.json` file for storage — fully containerised with Docker.

---

## Project Structure

```
nodejs-docker-app/
├── server.js          # HTTP server & route handlers
├── data.json          # JSON "database"
├── package.json       # Project metadata
├── Dockerfile         # Multi-stage Docker build
├── docker-compose.yml # Local dev / deployment helper
└── .dockerignore      # Files excluded from the image
```

---

## Running Locally (without Docker)

```bash
node server.js
# → Server running on http://localhost:3000
```

---

## Running with Docker

### Build & run manually

```bash
# Build the image
docker build -t nodejs-docker-app .

# Run the container
docker run -p 3000:3000 nodejs-docker-app
```

### Using Docker Compose (recommended)

```bash
# Start (builds automatically on first run)
docker compose up

# Run in background
docker compose up -d

# Stop
docker compose down
```

---

## API Endpoints

| Method | URL         | Description        |
|--------|-------------|--------------------|
| GET    | `/`         | API info           |
| GET    | `/users`    | List all users     |
| GET    | `/users/:id`| Get user by ID     |
| POST   | `/users`    | Create a new user  |

### Example requests

```bash
# List all users
curl http://localhost:3000/users

# Get user with ID 1
curl http://localhost:3000/users/1

# Add a new user
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Dan Brown","email":"dan@example.com","role":"editor"}'
```

---

## Environment Variables

| Variable | Default | Description           |
|----------|---------|-----------------------|
| `PORT`   | `3000`  | Port the server binds |
