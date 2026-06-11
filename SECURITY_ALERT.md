# 🚨 Security Alert: MongoDB Password Exposed

## What Happened?

Your MongoDB password (`snaplink2004`) was briefly visible in documentation files pushed to GitHub.

**Status**: ✅ Documentation cleaned, but password needs rotation

---

## ✅ Fix (2 minutes)

### Step 1: Change MongoDB Password

1. Go to https://cloud.mongodb.com
2. Select **Cluster0**
3. Go to **Security** → **Database Access**
4. Click on your user: `snaplink`
5. Click **Edit** → **Change Password**
6. Generate a strong password (or use MongoDB's auto-generate)
7. **Update Password** and copy it

### Step 2: Update Your .env

Replace the old password with the new one:

```env
# Old (exposed):
MONGODB_URI=mongodb+srv://snaplink:snaplink2004@cluster0.mqcdswo.mongodb.net/url_shortener?retryWrites=true&w=majority

# New:
MONGODB_URI=mongodb+srv://snaplink:YOUR_NEW_PASSWORD@cluster0.mqcdswo.mongodb.net/url_shortener?retryWrites=true&w=majority
```

### Step 3: Test Locally

```bash
npm start --prefix server
# Should see: "MongoDB Atlas connected successfully"
```

### Step 4: Push Changes

```bash
git add .
git commit -m "Security: Remove MongoDB credentials from docs"
git push origin main
```

---

## 📋 Security Checklist

- [x] Documentation credentials removed
- [ ] MongoDB password regenerated
- [ ] `.env` updated with new password
- [ ] Tested locally
- [ ] Pushed to GitHub
- [ ] Deploy to Railway with new credentials

---

## 🔐 Best Practices Going Forward

1. **Never commit `.env`** (already protected by .gitignore ✓)
2. **Never put credentials in documentation** (now fixed ✓)
3. **Rotate credentials if exposed** (do this now)
4. **Use strong passwords**: 20+ chars, mixed case, numbers, symbols
5. **Enable 2FA on MongoDB Atlas**: Security → Two-Factor Authentication

---

## Why This Matters

- ❌ Anyone with your old MongoDB credentials could access your database
- ❌ They could read all your links and analytics data
- ❌ They could modify or delete data
- ✅ Rotating password immediately revokes old credentials

---

## ✅ You're Secure Now

**After changing your password:**
- Old credentials are invalid ✓
- GitHub shows no credentials ✓
- Only your local `.env` has the new password (protected) ✓
- Ready to deploy to Railway ✓

---

## Next Steps

1. Change MongoDB password now (2 min)
2. Update `.env` (1 min)
3. Test locally (2 min)
4. Push to GitHub (1 min)
5. Deploy to Railway (10 min)

**Total security fix: ~5 minutes**

---

## Questions?

- **MongoDB Docs**: https://docs.mongodb.com/manual/security/
- **Atlas Security**: https://www.mongodb.com/docs/atlas/security/
- **GitHub Best Practices**: https://docs.github.com/en/code-security/secret-scanning/

**Your app is safe once you change the password!** 🔒
