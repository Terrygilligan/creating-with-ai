# Facebook OAuth Redirect URI Configuration

## Current Status
You've added the URIs to "App domains", but they need to be in **Facebook Login** settings.

## Correct Location for OAuth Redirect URIs

The OAuth redirect URIs should be configured in:
**Products → Facebook Login → Settings → Valid OAuth Redirect URIs**

NOT in "App domains" (which is for domain whitelisting).

## Steps to Fix

1. **Keep the App domains as they are** (they're fine for domain whitelisting)

2. **Navigate to Facebook Login Settings:**
   - In the left sidebar, look for "Products" section
   - Click on "Facebook Login" (or find it in the menu)
   - Go to "Settings" tab
   - Look for "Valid OAuth Redirect URIs" section

3. **Add the OAuth Redirect URIs there:**
   - `https://sample-firebase-ai-app-51a56.firebaseapp.com/_/auth/handler`
   - `http://localhost:3000/_/auth/handler`

4. **Save changes**

## What You Need

For Firebase Facebook authentication, you need:
- ✅ App ID: `1381514090145197` (you have this)
- ✅ App Secret: (you have this)
- ⚠️ OAuth Redirect URIs in Facebook Login settings (needs to be added there)

## Next Steps After Configuration

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Facebook
3. Add App ID and App Secret
4. Copy the OAuth redirect URI from Firebase
5. Add that URI to Facebook Login settings

