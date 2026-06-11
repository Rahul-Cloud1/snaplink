# 🚀 Deployment Quick Start Guide

> You have **MongoDB** ✓, **Upstash Redis** ✓, and **Cron-jobs** ✓. You're ready to deploy!

## Choose Your Platform

### **Render** ⭐ (Recommended for your app)
**Why?** Perfect for full-stack apps with background workers

**Pros:**
- ✅ Runs Node.js backend continuously
- ✅ Runs background workers (your click tracker)
- ✅ Supports cron jobs
- ✅ Free tier available
- ✅ Easy Redis & MongoDB integration

**Cost:** Free tier or $7/mo starter

**👉 Go to:** [Render.com](https://render.com)

---

### **Vercel** (Frontend only)
**Why?** Best for frontend alone, serverless backend

**Cons for your app:**
- ❌ No good support for background workers
- ❌ Your click tracker worker won't run well
- ❌ Expensive for long-running processes

**Use Vercel only if:** You want frontend only, move backend to Render

**👉 Go to:** [Vercel.com](https://vercel.com)

---

## 📋 Files Created for You

I've created deployment configuration files:

1. **`render.yaml`** - Render multi-service config (API + Worker + Frontend)
2. **`DEPLOYMENT.md`** - Complete step-by-step guide
3. **`RENDER_CHECKLIST.md`** - Pre/post deployment checklist
4. **`EXTERNAL_SERVICES.md`** - MongoDB, Redis, Google OAuth setup
5. **`.env.example`** - Environment variables reference
6. **`.github/workflows/deploy.yml`** - (Optional) Auto-deployment

---

## ⚡ 5-Minute Quick Start

### Step 1: Prepare Your Code
```bash
# Push to GitHub (required for Render)
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/url-shortener.git
git push -u origin main
```

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize GitHub access

### Step 3: Create First Service (Backend API)
1. Dashboard → **New +** → **Web Service**
2. Select your GitHub repo
3. Fill in:
   ```
   Name: url-shortener-api
   Build: cd server && npm install
   Start: cd server && npm start
   ```
4. Add Environment Variables (from `EXTERNAL_SERVICES.md`):
   - `MONGODB_URI` → Your MongoDB connection string
   - `REDIS_URL` → Your Upstash Redis URL
   - `JWT_SECRET` → Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `GOOGLE_CLIENT_ID` → From Google OAuth
   - `GOOGLE_CLIENT_SECRET` → From Google OAuth
   - `CLIENT_URL` → Leave blank (update after frontend deployed)

5. Click **Deploy**

**⏳ Wait 2-3 minutes for deployment**

### Step 4: Create Second Service (Background Worker)
1. Dashboard → **New +** → **Background Worker**
2. Select same repo
3. Fill in:
   ```
   Name: url-shortener-worker
   Build: cd server && npm install
   Start: cd server && npm run worker
   ```
4. Add **same environment variables** as API (except `CLIENT_URL`)
5. Click **Deploy**

### Step 5: Create Third Service (Frontend)
1. Dashboard → **New +** → **Static Site**
2. Select same repo
3. Fill in:
   ```
   Name: url-shortener-client
   Build: cd client && npm install && npm run build
   Publish Dir: client/dist
   ```
4. Add Environment Variable:
   - `VITE_API_URL` → Copy the URL of your API service from Step 3
   
5. Click **Deploy**

**✅ Done! Your app is live**

---

## 🔗 Get Your Live URLs

After all 3 services are deployed:

1. Go to Render Dashboard
2. Click each service to get its URL
3. Update in appropriate places:
   - **Backend**: `CLIENT_URL` = Frontend URL
   - **Frontend**: `VITE_API_URL` = Backend URL
4. **Redeploy** both after updating

---

## ✨ Test Your Deployment

1. **Visit your frontend URL** → Should load with no errors
2. **Try Google login** → Should work
3. **Create a short link** → Should succeed
4. **Click the link** → Should increment analytics
5. **Check worker logs** → Should show click processing

---

## 🔥 Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| "CORS Error" | Update Backend `CLIENT_URL` to your frontend URL, redeploy |
| "MongoDB connection failed" | Add `0.0.0.0/0` to MongoDB Atlas Network Access |
| "Redis connection timeout" | Check Upstash password is correct in `REDIS_URL` |
| "Worker not running" | Check worker logs - look for Redis connection errors |
| "Frontend shows 404" | Ensure build command and publish directory are correct |

---

## 📞 Need Help?

**Detailed guides available:**
- `DEPLOYMENT.md` - Full step-by-step walkthrough
- `RENDER_CHECKLIST.md` - Pre/post deployment checklist
- `EXTERNAL_SERVICES.md` - Configuring MongoDB, Redis, Google OAuth

---

## 🎯 Next Steps

1. ✅ Push code to GitHub
2. ✅ Create Render account
3. ✅ Deploy 3 services
4. ✅ Test your app
5. ⭐ Star this repo if helpful!

**Estimated time: 20 minutes**

