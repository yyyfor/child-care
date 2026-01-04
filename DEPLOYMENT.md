# Deployment Guide

This guide explains how to deploy your Maternal & Infant Care Guide application.

## Firebase Security Setup (REQUIRED BEFORE DEPLOYMENT)

Before deploying, you **must** secure your Firebase project:

### 1. Set Up Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **child-care-c5a10**
3. Navigate to **Firestore Database** → **Rules**
4. Copy the rules from `FIREBASE_SETUP.md`
5. Paste and click **Publish**

**Why this matters**: Without proper security rules, anyone could access or modify user data.

### 2. Configure Authorized Domains

This is **critical** for preventing unauthorized use of your Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **child-care-c5a10**
3. Go to **Authentication** → **Settings** tab → **Authorized domains**
4. You should see:
   - `localhost` (for development)
   - `child-care-c5a10.firebaseapp.com` (Firebase default)
5. Click **Add domain** and add:
   - `yyyfor.github.io` (your GitHub Pages domain)
6. **Optional but recommended**: Remove any domains you don't use

**What this does**: Only apps hosted on these domains can use your Firebase project.

### 3. Enable Email/Password Authentication

1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Configure email templates in the **Templates** tab

## Deployment Option 1: GitHub Pages (Recommended)

### Why GitHub Pages?
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Easy to set up
- ✅ Auto-deploys on git push

### Setup Steps

1. **Enable GitHub Pages**:
   - Go to: https://github.com/yyyfor/child-care/settings/pages
   - Under "Build and deployment":
     - Source: **Deploy from a branch**
     - Branch: **main** → **/ (root)**
     - Click **Save**

2. **Wait for deployment** (1-2 minutes)

3. **Your app will be live at**:
   ```
   https://yyyfor.github.io/child-care/
   ```

4. **Add this URL to Firebase Authorized Domains** (see step 2 above)

### Updating Your Deployment

Every time you push to the `main` branch, GitHub Pages automatically redeploys:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Wait 1-2 minutes and your changes will be live.

## Deployment Option 2: Firebase Hosting

### Why Firebase Hosting?
- ✅ CDN (faster worldwide)
- ✅ Better Firebase integration
- ✅ Custom domain support
- ✅ Preview channels

### Prerequisites

Install Firebase CLI:
```bash
npm install -g firebase-tools
```

### Deploy Steps

1. **Login to Firebase**:
   ```bash
   firebase login
   ```

2. **Deploy**:
   ```bash
   firebase deploy --only hosting
   ```

3. **Your app will be live at**:
   ```
   https://child-care-c5a10.web.app
   https://child-care-c5a10.firebaseapp.com
   ```

4. These domains are already authorized in Firebase

### Updating Firebase Hosting

```bash
firebase deploy --only hosting
```

## About Firebase API Keys in Public Repositories

### Are Firebase API keys secret?

**No.** Firebase API keys are specifically designed to be included in client-side code:

1. **They identify your project**, not authenticate it
2. **Security comes from**:
   - ✅ Firestore Security Rules (who can access what data)
   - ✅ Firebase Authentication (users must be logged in)
   - ✅ Authorized Domains (only your domains can use the project)

3. **Google's official stance**: "API keys for Firebase are not secret and can be included in code or checked into version control."

### What protects your app?

1. **Firestore Security Rules**: Users can only read/write their own notes
2. **Authentication**: Must be logged in to access notes
3. **Authorized Domains**: Only your websites can use your Firebase project
4. **Input Validation**: Server-side validation in security rules

### Additional Security (Optional)

If you want extra security:

1. **App Check** (prevents abuse):
   - Firebase Console → App Check
   - Register your web app
   - Adds reCAPTCHA verification

2. **Rate Limiting**:
   - Firestore security rules can include rate limiting
   - Prevents abuse even from authorized domains

3. **Monitor Usage**:
   - Firebase Console → Usage tab
   - Set up budget alerts
   - Monitor for unusual activity

## Testing Your Deployment

After deploying:

1. ✅ Visit your deployed URL
2. ✅ Click the **Notes** tab
3. ✅ Try creating an account
4. ✅ Add a test note
5. ✅ Verify it saves and loads
6. ✅ Try signing out and back in
7. ✅ Test on a different device/browser
8. ✅ Verify real-time sync

## Troubleshooting

### "Firebase: Error (auth/unauthorized-domain)"

**Solution**: Add your domain to Firebase Authorized Domains
- Go to Authentication → Settings → Authorized domains
- Add your GitHub Pages domain

### "Missing or insufficient permissions"

**Solution**: Check Firestore Security Rules
- Go to Firestore Database → Rules
- Verify rules from FIREBASE_SETUP.md are published

### Notes don't sync

**Checklist**:
- ✅ Firestore database created
- ✅ Security rules published
- ✅ User is logged in
- ✅ Check browser console for errors
- ✅ Verify internet connection

### Page loads but buttons don't work

**Solution**: Check browser console for JavaScript errors
- May need to clear cache
- Verify all files deployed correctly

## Production Checklist

Before going live:

- [ ] Firestore security rules published
- [ ] Email/Password authentication enabled
- [ ] Authorized domains configured
- [ ] Test user registration
- [ ] Test note creation/editing/deletion
- [ ] Test on mobile devices
- [ ] Test in different browsers
- [ ] Verify real-time sync works
- [ ] Set up Firebase usage alerts
- [ ] (Optional) Configure custom domain

## Monitoring

Keep an eye on:

1. **Firebase Usage**:
   - Console → Usage and billing
   - Stay within free tier limits

2. **Authentication**:
   - Console → Authentication → Users
   - Monitor user growth

3. **Firestore**:
   - Console → Firestore Database
   - Check document counts

4. **Errors**:
   - Browser console
   - Firebase Console → Analytics (if enabled)

## Custom Domain (Optional)

### For GitHub Pages:

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. Add CNAME file to repository:
   ```bash
   echo "yourdomain.com" > CNAME
   git add CNAME
   git commit -m "Add custom domain"
   git push
   ```
3. Configure DNS at your domain registrar
4. Add domain to Firebase Authorized Domains

### For Firebase Hosting:

1. Firebase Console → Hosting → Add custom domain
2. Follow Firebase's DNS configuration steps
3. Domain automatically added to authorized domains

---

**Questions or issues?** Check Firebase Console logs and browser console for error messages.
