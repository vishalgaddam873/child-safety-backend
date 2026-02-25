# Example API Data

Use these after starting the backend and creating a user (register + login). Replace `YOUR_JWT` with the token from login response.

## Register parent

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"parent@example.com","password":"secret123","name":"Ramesh","phone":"+919876543210"}'
```

## Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"parent@example.com","password":"secret123"}'
```

Response includes `token`. Use it as `Authorization: Bearer <token>`.

## Create child

```bash
curl -X POST http://localhost:5000/api/children \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "name": "Priya",
    "age": 8,
    "emergencyContacts": [
      {"name": "Neighbour", "phone": "+919876543210", "relation": "Neighbour"},
      {"name": "School", "phone": "+911234567890", "relation": "School"}
    ]
  }'
```

Response includes `child.secureId` (64-char hex). Use it for:
- Public scan URL: `https://your-frontend.com/scan/<secureId>`
- Record scan: `POST /api/scan/<secureId>`

## Record a scan (public, no auth)

```bash
curl -X POST http://localhost:5000/api/scan/REPLACE_WITH_CHILD_SECURE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": 28.6139,
    "longitude": 77.2090,
    "accuracy": 20,
    "timestamp": "2025-02-25T10:00:00.000Z",
    "deviceInfo": {"userAgent": "Mozilla/5.0...", "platform": "Linux"}
  }'
```

## Get scan history (protected)

```bash
curl "http://localhost:5000/api/scan/child/CHILD_MONGO_ID/history?limit=10" \
  -H "Authorization: Bearer YOUR_JWT"
```

## Get last location (protected)

```bash
curl "http://localhost:5000/api/scan/child/CHILD_MONGO_ID/last" \
  -H "Authorization: Bearer YOUR_JWT"
```
