# Child Safety QR – Backend

Node.js + Express + MongoDB + Socket.io API for the Child Safety QR Tracking System. Production-ready and suitable for deployment in India.

## Features

- **Auth**: Email/password register & login, JWT, role-based access
- **Parent APIs**: Register, login, update profile
- **Child APIs**: CRUD, photo upload, secure QR ID per child
- **Scan API**: Public `POST /api/scan/:secureId` with location & device; rate-limited
- **Real-time**: Socket.io notifies parent when QR is scanned
- **Scan logs**: History and last location APIs
- **Security**: Rate limiting, secure child IDs, validation, encrypted sensitive fields

## Folder Structure

```
backend/
├── src/
│   ├── config/       # Environment config
│   ├── controllers/
│   ├── middlewares/  # auth, validate, rateLimit
│   ├── models/       # User, Child, ScanLog
│   ├── routes/
│   ├── services/
│   ├── sockets/      # Socket.io parent notifications
│   ├── utils/        # encrypt, secureId
│   ├── app.js
│   └── server.js
├── uploads/          # Child photos (created at runtime)
├── .env.example
├── Dockerfile
└── package.json
```

## Setup

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)

### Install and run

```bash
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, ENCRYPTION_KEY, CORS_ORIGINS
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

### Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for JWT signing |
| `JWT_EXPIRES_IN` | Token expiry (e.g. 7d) |
| `ENCRYPTION_KEY` | 32-char key for encrypting sensitive data |
| `CORS_ORIGINS` | Comma-separated frontend origins |
| `SCAN_RATE_LIMIT_MAX` | Max scan requests per IP per 15 min |
| `MAX_UPLOAD_SIZE` | Max upload size in MB |

## API Overview

### Auth

- `POST /api/auth/register` – Register parent (email, password, name, phone)
- `POST /api/auth/login` – Login (email, password) → returns `user` and `token`
- `GET /api/auth/me` – Current user (Bearer token)
- `PATCH /api/auth/profile` – Update name, phone (Bearer token)

### Children (all require Bearer token)

- `GET /api/children` – List children
- `GET /api/children/:childId` – Get one child
- `POST /api/children` – Create child (name, age, emergencyContacts[])
- `PATCH /api/children/:childId` – Update child
- `DELETE /api/children/:childId` – Delete child
- `POST /api/children/:childId/photo` – Upload photo (multipart, field `photo`)

### Scan (public and protected)

- `POST /api/scan/:secureId` – **Public**. Body: `latitude`, `longitude`, `accuracy?`, `timestamp?`, `deviceInfo?`. Records scan and notifies parent via Socket.io.
- `GET /api/scan/child/:childId/history?limit=&skip=` – Scan history (Bearer)
- `GET /api/scan/child/:childId/last` – Last location (Bearer)

### Socket.io

- **URL**: Same host as API, path `/socket.io`
- **Auth**: `auth.token` or query `token` (JWT)
- **Event (server → client)**: `scan` – payload has `childId`, `parentId`, `log` (location, time, device), `childName`

## Deployment

### Docker

```bash
docker build -t child-safety-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI="mongodb://..." \
  -e JWT_SECRET="..." \
  -e ENCRYPTION_KEY="..." \
  -e CORS_ORIGINS="https://your-frontend.com" \
  child-safety-backend
```

For production, use a reverse proxy (e.g. Nginx) and ensure WebSocket (Socket.io) is allowed.

### Example data

After registering and logging in:

1. Create a child: `POST /api/children` with `{ "name": "Rahul", "age": 8, "emergencyContacts": [{ "name": "Neighbour", "phone": "+919876543210", "relation": "Neighbour" }] }`
2. Response includes `child.secureId`. Use it in frontend as `/scan/[secureId]` and for `POST /api/scan/:secureId`.
