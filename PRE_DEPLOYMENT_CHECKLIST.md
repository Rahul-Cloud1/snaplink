# 🚀 Pre-Deployment Checklist

## ✅ Your Status

| Component | Status | Details |
|-----------|--------|---------|
| Server | ✅ Running | Working on localhost |
| MongoDB | ✅ Connected | snaplink cluster |
| Redis | ✅ Ready | Upstash configured |
| Google OAuth | ✅ Configured | Client ID & Secret set |
| Frontend | ✅ Ready | React + Vite |
| Backend API | ✅ Working | All endpoints functional |

---

## 📋 Pre-Deployment Tasks

### 1. Generate Strong JWT_SECRET

Replace `your_jwt_secret_here_change_in_production` in `.env`:

**Option A: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Output example:
```
a7f3d9e2b1c4f6a8d3e9f2b1c4d7e9a1f3b5d7f9a1c3e5f7b9d1e3f5a7b9
```

**Option B: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Then update `.env`:**
```env
JWT_SECRET=YOUR_GENERATED_HEX_STRING_HERE
```

### 2. Get Redis URL from Upstash

1. Go to https://console.upstash.io
2. Select database: **one-hedgehog-99858**
3. Click **Details** tab
4. Find **Redis CLI** section
5. Copy the URL format: `redis://:PASSWORD@HOST:PORT`

**Then update `.env`:**
```env
REDIS_URL=redis://:YOUR_PASSWORD@one-hedgehog-99858.upstash.io:6379
```

### 3. Verify MongoDB is Whitelisted

1. Go to https://cloud.mongodb.com
2. Select cluster **Cluster0**
3. Security → **Network Access**
4. Verify: `0.0.0.0/0` is allowed (or add Railway IPs)

✅ Status: Should already be configured

### 4. Verify Google OAuth Redirect URIs

1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials
3. Click your OAuth Client ID
4. **Authorized redirect URIs** should include:
   ```
   http://localhost:5173
   http://localhost:5173/callback
   http://localhost:3000
   http://localhost:3000/callback
   ```

✅ Status: Already configured for local testing

---

## 🔐 Final Security Check

Before pushing to GitHub:

```bash
# Check .gitignore includes .env
cat .gitignore | grep .env
# Should show: .env, client/.env, server/.env

# Verify .env is NOT tracked
git status
# Should NOT show .env in changes

# Verify no secrets in code
grep -r "snaplink" . --exclude-dir=node_modules
# Should only show in .env (not tracked)
```

---

## 📤 Push to GitHub

```bash
# Stage all changes
git add .

# Commit
git commit -m "Add deployment configuration and credentials"

# Push to main branch
git push origin main
```

**Note:** `.env` with secrets is NOT pushed (protected by .gitignore) ✓

---

## 🚀 Deploy on Railway

### Quick Deployment (5 minutes)

1. **Go to** https://railway.app
2. **Click** "New Project"
3. **Select** "Deploy from GitHub repo"
4. **Choose** your URL Shortener repository
5. **Wait** for Railway to auto-detect services (1 min)

You should see 3 services:
- ✅ `server` (Node.js)
- ✅ `client` (Node.js)
- ⚠️ May need manual setup for worker

### Configure Backend Service

1. Click **"server"** service
2. Go to **Settings** tab
3. Verify:
   - Build Command: `npm install --prefix server`
   - Start Command: `npm start --prefix server`
   - Port: 3000

4. Go to **Variables** tab
5. Add 8 environment variables:

```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb+srv://snaplink:YOUR_PASSWORD@cluster0.mqcdswo.mongodb.net/url_shortener?retryWrites=true&w=majority
REDIS_URL=redis://:YOUR_PASSWORD@one-hedgehog-99858.upstash.io:6379
JWT_SECRET=YOUR_GENERATED_HEX_STRING
GOOGLE_CLIENT_ID=your_client_id_from_console
GOOGLE_CLIENT_SECRET=your_client_secret_from_console
CLIENT_URL=<will_update_after_frontend_deployed>
```

6. **Deploy** ✓

### Configure Worker Service

1. **New Service** → **GitHub Repo** → Select your repo
2. Settings:
   - Build Command: `npm install --prefix server`
   - Start Command: `npm run worker --prefix server`

3. Add variables (same as backend, except no CLIENT_URL)
4. **Deploy** ✓

### Configure Frontend Service

1. Click **"client"** service
2. Build Command: `npm run build --prefix client`
3. Start Command: `npx serve -s client/dist -l 3000`

4. Add variable:
   ```env
   VITE_API_URL=<your_backend_url_from_railway>
   ```

5. **Deploy** ✓

### Update Backend with Frontend URL

1. Go back to backend service
2. Update `CLIENT_URL` = Your frontend Railway URL
3. **Restart** backend service

---

## ✅ Post-Deployment Verification

### Test Health Check
```bash
# Backend health
curl https://your-backend.railway.app/health
# Should return: {"ok":true,"service":"url-shortener-api"}
```

### Test Frontend
```bash
# Visit your frontend URL
https://your-frontend.railway.app
# Should load React app
```

### Test Google Login
1. Click "Login with Google"
2. Select your account
3. Should redirect back to dashboard
4. Check if logged in

### Test Link Creation
1. Create a short link
2. Click it (should redirect)
3. Check analytics

---

## 🔄 Update Google OAuth for Production

1. Go to https://console.cloud.google.com
2. APIs & Services → Credentials
3. Click your OAuth Client ID
4. Add **Authorized redirect URIs**:
   ```
   https://your-frontend.railway.app
   https://your-frontend.railway.app/callback
   https://your-backend.railway.app/callback
   ```

5. **Save** ✓

---

## 🎯 Summary

### You Have ✅
- MongoDB connected and verified
- Redis configured (Upstash)
- Google OAuth credentials
- Server running locally
- All deployment files ready

### To Deploy ✅
1. Generate JWT_SECRET
2. Get Redis URL from Upstash
3. Push to GitHub
4. Deploy on Railway (5 steps)
5. Update Google OAuth redirect URIs
6. Verify all endpoints work

### Estimated Deployment Time
- **Setup**: 5 minutes (JWT, Redis URL)
- **Railway**: 10 minutes (create services)
- **Verification**: 5 minutes (test endpoints)
- **Total**: ~20 minutes

---

## 📚 Reference

- **RAILWAY_QUICK_START.md** - Quick deployment guide
- **YOUR_DEPLOYMENT_SETUP.md** - Detailed setup
- **UPSTASH_REDIS_SETUP.md** - Redis configuration
- **GOOGLE_OAUTH_SETUP.md** - Google OAuth details
- **API_TESTING_GUIDE.md** - Test your API

---

## 🚀 Ready to Deploy?

**Option 1: Quick Deploy Now**
```bash
# 1. Generate JWT_SECRET and update .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and update JWT_SECRET in .env

# 2. Get Redis URL from Upstash and update .env

# 3. Push to GitHub
git add .
git commit -m "Ready for Railway deployment"
git push origin main

# 4. Go to railway.app and follow the 5 steps above
```

**Option 2: Test More Locally First**
```bash
npm run dev
# Test all features in http://localhost:5173
# Create links, track clicks, test analytics, etc.
# Then deploy when confident
```

---

**Everything is ready! You're 5 minutes away from going live.** 🎉
