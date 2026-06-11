# Railway Deployment - Your Quick Reference

## Your Credentials (Stored Safely in .env)

```
✅ MongoDB: snaplink cluster (credentials in .env)
✅ Upstash Redis: one-hedgehog-99858.upstash.io (credentials in .env)
✅ Ready for deployment!
```

---

## Step 1: Prepare Your Code ✅ DONE

- ✅ `.env` created for local testing
- ✅ `.gitignore` protects secrets
- ✅ Code ready for production

---

## Step 2: Test Locally (Optional but Recommended)

```bash
npm run install:all
npm run dev
```

Test:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000/health
- Create a test link and verify click tracking works

---

## Step 3: Push to GitHub

```bash
git add .
git commit -m "Add deployment configs"
git push origin main
```

---

## Step 4: Deploy on Railway

### 4.1 Create Railway Account
- Go to https://railway.app
- Click **"Start Project"**
- Select **"Deploy from GitHub"**
- Select your repository
- Click **"Deploy"**

### 4.2 Railway Will Auto-Detect Services
You should see:
- `server` (Node.js backend)
- `client` (React frontend)

### 4.3 Set Environment Variables

**For Backend Service:**
1. Click the **"server"** service
2. Go to **Variables** tab
3. Add these 7 variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `MONGODB_URI` | `mongodb+srv://snaplink:PASSWORD@cluster0.mqcdswo.mongodb.net/url_shortener?retryWrites=true&w=majority` |
| `REDIS_URL` | Get from Upstash (see UPSTASH_REDIS_SETUP.md) |
| `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `GOOGLE_CLIENT_ID` | Your Google OAuth ID |
| `GOOGLE_CLIENT_SECRET` | Your Google OAuth Secret |
| `CLIENT_URL` | Will update later with frontend URL |

### 4.4 Create Worker Service
1. In Railway → Click **"New Service"**
2. Select **"GitHub Repo"** → same repo
3. Select **Dockerfile** or **Manual Build**
4. Configure:
   - Build: `npm install --prefix server`
   - Start: `npm run worker --prefix server`
5. Add same variables as backend (except `CLIENT_URL`)

### 4.5 Configure Frontend Service
1. Click the **"client"** service
2. Build Command: `npm run build --prefix client`
3. Start Command: `npx serve -s client/dist -l 3000`
4. Add variable:
   - `VITE_API_URL` = Your backend service URL

### 4.6 Update Backend CLIENT_URL
1. Go back to backend service
2. Edit `CLIENT_URL` = Your frontend service URL
3. Restart backend

---

## Step 5: Verify Everything Works

### Check Logs
1. Railway Dashboard → Each service → **Logs** tab
2. Look for success messages:
   - `"Database connected successfully"`
   - `"Redis connected"`
   - `"Server listening on port 3000"`

### Test the App
1. Open your frontend URL
2. Try Google login
3. Create a short link
4. Click it
5. Check analytics
6. Open backend /health endpoint

---

## Your Railway URLs (After Deployment)

```
Backend: https://url-shortener-api.railway.app
Worker: (background service, no URL)
Frontend: https://url-shortener-client.railway.app
```

Copy these and save them!

---

## Troubleshooting Checklist

### MongoDB Not Connecting
- [ ] MongoDB Atlas Network Access: Allow `0.0.0.0/0`
- [ ] MONGODB_URI includes database name: `.../url_shortener`
- [ ] Password is correct in `.env` file

### Redis Not Connecting
- [ ] REDIS_URL is in Redis protocol format (not REST)
- [ ] Check Upstash console for exact URL
- [ ] Test locally first: `node -e "import IORedis from 'ioredis'; const r = new IORedis('YOUR_URL'); r.ping();"`

### CORS Error
- [ ] Update backend `CLIENT_URL` to actual frontend URL
- [ ] Restart backend service
- [ ] Clear browser cache

### Logs Show Errors
1. Go to Railway → Service → Logs
2. Look for error messages
3. Search for the error in documentation
4. Or restart the service

---

## Useful Railway Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs -t api
railway logs -t worker
railway logs -t client

# View environment variables
railway variables

# Restart service
railway up
```

---

## That's It! 🎉

Your app is now deployed with:
- ✅ MongoDB Atlas (snaplink cluster)
- ✅ Upstash Redis
- ✅ Node.js backend
- ✅ React frontend
- ✅ Background workers
- ✅ Total cost: ~$5-10/month

**Any issues? Check these files:**
- `YOUR_DEPLOYMENT_SETUP.md` - Full setup guide
- `UPSTASH_REDIS_SETUP.md` - Redis configuration
- `DEPLOYMENT_ALTERNATIVES.md` - Other platforms

