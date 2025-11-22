# Debugging Authentication Issues

## Current Status
You're seeing the login/register page, which is **expected** if you're not logged in.

## Steps to Test Locally

### 1. Check if Dev Server is Running
```bash
npm run dev
```
Should show: `Ready on http://localhost:3000`

### 2. Try Signing Up
1. Go to `http://localhost:3000/signup`
2. Create an account with:
   - Username (3-20 chars, letters/numbers/underscores)
   - Email
   - Password (min 6 chars)
3. Click "Create Account"

### 3. Check Browser Console
Open browser DevTools (F12) and check:
- **Console tab**: Look for any red errors
- **Network tab**: Check if Firebase requests are failing

### 4. Common Issues

**Issue: "Firebase: Error (auth/operation-not-allowed)"**
- **Fix**: Enable Email/Password in Firebase Console → Authentication → Sign-in method

**Issue: "Firebase: Error (auth/invalid-api-key)"**
- **Fix**: Check `.env.local` has correct Firebase config values

**Issue: Redirects back to login after signup**
- **Fix**: Check if user document is being created in Firestore

**Issue: Stuck on loading screen**
- **Fix**: Check browser console for errors, verify Firebase connection

### 5. Verify Firebase Connection
Check if Firebase is initialized:
1. Open browser console (F12)
2. Type: `window.firebase` or check Network tab for Firebase requests
3. Should see Firebase SDK loading

### 6. Test with Google Login
If email/password doesn't work, try Google login (should work since you tested it before).

## Quick Test Checklist
- [ ] Dev server running on localhost:3000
- [ ] Can see login/signup page
- [ ] Can create account (or use Google login)
- [ ] After login, redirects to /feed
- [ ] Can see bottom navigation
- [ ] Can see feed page

## If Still Stuck
Share:
1. Any error messages from browser console
2. What happens when you try to sign up/login
3. Network tab errors (if any)

