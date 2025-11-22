# Facebook Authentication Setup Guide

## Important: Facebook Login May Already Be Available

Facebook Login is often **automatically enabled** for all Meta apps and doesn't need to be added as a "use case". The use cases you're seeing are for **additional features** beyond basic authentication.

## Steps to Verify and Configure Facebook Login

### Step 1: Complete App Creation
1. You can skip adding use cases for now (or add them later)
2. Click "Next" or "Skip" to proceed with app creation
3. Complete the basic app setup

### Step 2: Check App Settings
After creating the app, go to:
- **Settings** → **Basic** in your Facebook App dashboard
- Look for "Facebook Login" section
- It should already be available

### Step 3: Configure Facebook Login
1. In your Facebook App dashboard, go to **Products** → **Facebook Login** → **Settings**
2. Add the OAuth Redirect URI:
   ```
   https://sample-firebase-ai-app-51a56.firebaseapp.com/_/auth/handler
   ```
3. For local development, also add:
   ```
   http://localhost:3000/_/auth/handler
   ```

### Step 4: Get Your Credentials
1. Go to **Settings** → **Basic**
2. Copy your **App ID**
3. Copy your **App Secret** (click "Show")

### Step 5: Add to Firebase
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable Facebook
3. Paste App ID and App Secret
4. Copy the OAuth redirect URI from Firebase
5. Add that URI to Facebook App settings (Step 3)

## Alternative: Check "Others" Category

If you still want to look for it:
1. In the "Add use cases" modal, try the **"Others (1)"** category
2. Facebook Login might be listed there

## What You Actually Need

For Firebase authentication, you need:
- ✅ A Facebook App (you're creating this)
- ✅ App ID and App Secret (from Settings → Basic)
- ✅ OAuth Redirect URI configured (in Facebook Login settings)

You **don't necessarily need** to add Facebook Login as a "use case" - it's usually available by default.

## Next Steps

1. **Complete the app creation** (you can skip use cases for now)
2. **Go to Settings → Basic** to get your App ID and Secret
3. **Configure Facebook Login** in the Products section
4. **Add credentials to Firebase Console**

The app creation process should continue even without selecting additional use cases.

