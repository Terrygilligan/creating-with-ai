# Firebase Authentication Setup Guide

## The Error You're Seeing

"Firebase: Error (auth/operation-not-allowed)" means the authentication providers need to be enabled in Firebase Console.

## Step-by-Step Setup

### 1. Enable Authentication Providers

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `sample-firebase-ai-app-51a56`
3. Click **Authentication** in the left sidebar
4. Click **Get started** (if you haven't set up Authentication yet)
5. Go to the **Sign-in method** tab

### 2. Enable Each Provider

Enable these providers one by one:

#### Email/Password
1. Click on **Email/Password**
2. Toggle **Enable** to ON
3. Click **Save**

#### Google
1. Click on **Google**
2. Toggle **Enable** to ON
3. Click **Save** (no additional config needed for Google)

#### GitHub
1. Click on **GitHub**
2. Toggle **Enable** to ON
3. You'll need:
   - **Client ID**: Get from GitHub → Settings → Developer settings → OAuth Apps
   - **Client Secret**: Get from the same place
4. Click **Save**

#### Facebook
1. Click on **Facebook**
2. Toggle **Enable** to ON
3. Enter:
   - **App ID**: `1381514090145197`
   - **App Secret**: (your App Secret from Facebook)
4. Copy the **OAuth redirect URI** shown
5. Add that URI to Facebook App → Settings → Basic → App domains (if not already there)
6. Click **Save**

### 3. Firestore Security Rules (Already Created)

We already created `firestore.rules`. Deploy them:

```bash
firebase deploy --only firestore:rules
```

### 4. Storage Security Rules (Already Created)

We already created `storage.rules`. Deploy them:

```bash
firebase deploy --only storage
```

Or deploy both at once:

```bash
firebase deploy --only firestore:rules,storage
```

## Quick Checklist

- [ ] Enable Email/Password in Firebase Console
- [ ] Enable Google in Firebase Console
- [ ] Enable GitHub in Firebase Console (need GitHub OAuth app)
- [ ] Enable Facebook in Firebase Console (with your App ID/Secret)
- [ ] Deploy Firestore security rules
- [ ] Deploy Storage security rules

## After Setup

Once all providers are enabled, try logging in again. The error should be gone!

