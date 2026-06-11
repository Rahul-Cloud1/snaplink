# 🎯 Google OAuth Setup Complete

Your Google OAuth credentials are now configured!

## ✅ Your Credentials Added

```
Client ID: YOUR_CLIENT_ID (from Google Cloud Console)
Client Secret: YOUR_CLIENT_SECRET (from Google Cloud Console)
Status: ✅ Added to .env (keep .env in .gitignore!)
```

---

## 🔐 Configure Authorized Redirect URIs

Your Google OAuth app needs to know where users can log in from. You must add these URIs:

### In Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click your OAuth 2.0 Client ID (web application)
5. Under **Authorized redirect URIs**, add ALL of these:

#### For Local Development:
```
http://localhost:5173
http://localhost:5173/callback
http://localhost:3000
http://localhost:3000/callback
```

#### For Railway Production:
```
https://YOUR_FRONTEND_URL.railway.app
https://YOUR_FRONTEND_URL.railway.app/callback
https://YOUR_API_URL.railway.app/callback
```

**Replace:** `YOUR_FRONTEND_URL` and `YOUR_API_URL` with your actual Railway URLs

6. Click **Save**

---

## 🚀 Ready to Test Locally

### Start your dev server:
```bash
npm run install:all
npm run dev
```

### Test Google Login:
1. Open http://localhost:5173
2. Click "Login with Google"
3. Should redirect to Google login
4. After login, should redirect back to your app
5. Check console for any errors

### If Login Fails:

**Error: "redirect_uri_mismatch"**
- ✅ Fix: Add the exact redirect URI to Google Cloud Console
- Make sure there are NO trailing slashes

**Error: "Invalid client"**
- ✅ Fix: Check Client ID is correct (verify copy-paste)

**Error: "CORS error"**
- ✅ Fix: Check your backend is running on port 3000
- Check `CLIENT_URL` in backend

---

## 📋 Checklist

### Before Deploying to Railway:

- [ ] Google OAuth works locally
- [ ] You can log in with Google
- [ ] No errors in browser console
- [ ] Backend and frontend URLs from Railway are ready
- [ ] You've added Railway URLs to Google OAuth redirect URIs

### When Deploying to Railway:

1. **Deploy backend and frontend first**
2. **Get your Railway URLs** from dashboard
3. **Update Google OAuth** with Railway redirect URIs
4. **Set these in Railway environment:**
   ```
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   CLIENT_URL=https://YOUR_FRONTEND_URL.railway.app
   ```
5. **Restart backend service**
6. **Test login on your Railway app**

---

## 🎯 Summary

You now have:
- ✅ MongoDB connected (`snaplink` cluster)
- ✅ Redis configured (Upstash)
- ✅ Google OAuth credentials
- ✅ All `.env` variables ready
- ✅ Ready to deploy!

---

## Next Steps

1. **Test locally**: `npm run dev`
2. **Push to GitHub**: `git push origin main`
3. **Deploy on Railway**: Follow RAILWAY_QUICK_START.md
4. **Add Railway URLs to Google OAuth**: (after deployment)
5. **Test production login**: Verify Google login works on Railway

---

**Everything is ready! Ready to deploy?** 🚀

See **RAILWAY_QUICK_START.md** for deployment steps.
