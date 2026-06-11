# 🧪 API Testing Guide

Your server is running and responding! Here's how to test all endpoints.

## Prerequisites

Make sure you have:
- Server running: `npm start --prefix server` (port 3000)
- Frontend running: `npm run dev --prefix client` (port 5173)

---

## Endpoints to Test

### 1️⃣ Health Check
```
GET http://localhost:5000/health
```

**Expected Response (200):**
```json
{
  "ok": true,
  "service": "url-shortener-api"
}
```

**Test with curl:**
```bash
curl http://localhost:5000/health
```

---

### 2️⃣ Create Short Link (Anonymous)
```
POST http://localhost:5000/api/shorten
Content-Type: application/json

{
  "originalUrl": "https://www.example.com",
  "customSlug": "mylink",
  "expiresAt": "2026-12-31T23:59:59Z"
}
```

**Expected Response (201):**
```json
{
  "link": {
    "id": "507f1f77bcf86cd799439011",
    "slug": "mylink",
    "originalUrl": "https://www.example.com",
    "shortUrl": "http://localhost:5000/mylink",
    "customSlug": true,
    "expiresAt": "2026-12-31T23:59:59.000Z",
    "createdAt": "2026-06-11T10:00:00.000Z",
    "totalClicks": 0
  }
}
```

**Test with curl:**
```bash
curl -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -H "x-owner-key: my-unique-key-12345" \
  -d '{
    "originalUrl": "https://www.google.com",
    "customSlug": "google"
  }'
```

---

### 3️⃣ Get Your Links ✅ YOU TESTED THIS!
```
GET http://localhost:5000/api/shorten/links
```

**Headers needed:**
```
x-owner-key: same-key-as-above
```

**Expected Response (200):**
```json
{
  "links": [
    {
      "id": "507f1f77bcf86cd799439011",
      "slug": "google",
      "originalUrl": "https://www.google.com",
      "shortUrl": "http://localhost:5000/google",
      "customSlug": true,
      "expiresAt": null,
      "createdAt": "2026-06-11T10:00:00.000Z",
      "totalClicks": 0
    }
  ]
}
```

**Test with curl:**
```bash
curl http://localhost:5000/api/shorten/links \
  -H "x-owner-key: my-unique-key-12345"
```

---

### 4️⃣ Get Single Link Analytics
```
GET http://localhost:5000/api/analytics/:slug
```

**Example:**
```
GET http://localhost:5000/api/analytics/google
```

**Expected Response (200):**
```json
{
  "link": {
    "id": "507f1f77bcf86cd799439011",
    "slug": "google",
    "originalUrl": "https://www.google.com",
    "totalClicks": 3,
    "analytics": {
      "topCountries": [
        { "country": "US", "clicks": 2 },
        { "country": "CA", "clicks": 1 }
      ],
      "topDevices": [
        { "device": "desktop", "clicks": 2 },
        { "device": "mobile", "clicks": 1 }
      ],
      "clicksOverTime": [
        { "date": "2026-06-11", "clicks": 3 }
      ]
    }
  }
}
```

**Test with curl:**
```bash
curl http://localhost:5000/api/analytics/google
```

---

### 5️⃣ Google Login
```
POST http://localhost:3000/api/auth/google
Content-Type: application/json

{
  "token": "GOOGLE_ID_TOKEN_FROM_FRONTEND"
}
```

**Note:** You can't test this with curl - use the frontend UI

**Test via Frontend:**
1. Open http://localhost:5173
2. Click "Login with Google"
3. Select your Google account
4. Should redirect and set token

---

### 6️⃣ Click a Short Link
```
GET http://localhost:5000/:slug
```

**Example:**
```
GET http://localhost:5000/google
```

**Expected:**
- Status: 302 (Redirect)
- Location: https://www.google.com
- Tracked in analytics ✓

**Test with curl:**
```bash
curl -L http://localhost:5000/google
```

---

## 🧪 Complete Testing Script

Run this to test everything:

```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🧪 Testing URL Shortener API\n"

# 1. Health Check
echo "1️⃣  Testing Health Check..."
curl -s http://localhost:5000/health | jq .

# 2. Create Link
echo -e "\n\n2️⃣  Creating a short link..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/shorten \
  -H "Content-Type: application/json" \
  -H "x-owner-key: test-key-123" \
  -d '{
    "originalUrl": "https://github.com",
    "customSlug": "github"
  }')
echo "$RESPONSE" | jq .
SLUG=$(echo "$RESPONSE" | jq -r '.link.slug')

# 3. Get Links
echo -e "\n\n3️⃣  Fetching your links..."
curl -s http://localhost:5000/api/shorten/links \
  -H "x-owner-key: test-key-123" | jq .

# 4. Test Redirect
echo -e "\n\n4️⃣  Testing redirect (should go to GitHub)..."
curl -s -I http://localhost:5000/$SLUG | head -10

# 5. Check Analytics
echo -e "\n\n5️⃣  Checking analytics..."
curl -s http://localhost:5000/api/analytics/$SLUG | jq .

echo -e "\n\n✅ Testing complete!"
```

**Save as** `test-api.sh` and run:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🔍 Testing via Postman/Insomnia

### Import Collection

Create a new collection with these requests:

| Request | Method | URL | Headers | Body |
|---------|--------|-----|---------|------|
| Health | GET | `localhost:5000/health` | - | - |
| Create Link | POST | `localhost:5000/api/shorten` | `x-owner-key: test-123` | `{"originalUrl":"https://google.com"}` |
| Get Links | GET | `localhost:5000/api/shorten/links` | `x-owner-key: test-123` | - |
| Analytics | GET | `localhost:5000/api/analytics/ABC123` | - | - |
| Redirect | GET | `localhost:5000/ABC123` | - | - |

---

## 📊 Expected Test Results

| Endpoint | Status | Notes |
|----------|--------|-------|
| `/health` | 200 ✅ | Server is running |
| `POST /api/shorten` | 201 ✅ | Link created |
| `GET /api/shorten/links` | 200 ✅ | Your links retrieved |
| `GET /api/analytics/:slug` | 200 ✅ | Analytics data |
| `GET /:slug` | 302 ✅ | Redirects to URL |
| `POST /api/auth/google` | 200 ✅ | Login works |

---

## ✅ Your Current Status

- ✅ Server is running
- ✅ `/api/shorten/links` endpoint works (you tested it!)
- ✅ API is responding correctly
- ✅ Ready for more testing or deployment

---

## 🚀 Next Steps

1. **Test a few more endpoints** (create link, click it, check analytics)
2. **Test via frontend UI**:
   - Open http://localhost:5173
   - Try creating a link
   - Try the analytics
   - Try Google login

3. **If all works**: Deploy to Railway
   - Follow RAILWAY_QUICK_START.md
   - Your API will be live!

---

## 🐛 Common Issues

| Error | Fix |
|-------|-----|
| "Connection refused" | Server not running: `npm start --prefix server` |
| "CORS Error" | Set `CLIENT_URL` env var correctly |
| "MongoDB error" | Check `.env` MONGODB_URI |
| "Redis error" | Check `.env` REDIS_URL |
| "404 - Not found" | Check endpoint URL spelling |

---

**Want to test something specific? Let me know!** 🚀
