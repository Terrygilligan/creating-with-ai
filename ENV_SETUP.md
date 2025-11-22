# Environment Variables Setup

Your Firebase configuration has been added. Create a `.env.local` file in the root directory with the following content:

```env
# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDz8OH8xnYm5MLHzQcdxOI-yW9Ih6KFQ-c
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sample-firebase-ai-app-51a56.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sample-firebase-ai-app-51a56
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sample-firebase-ai-app-51a56.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=358834781423
NEXT_PUBLIC_FIREBASE_APP_ID=1:358834781423:web:facb13067556f08a35af1a

# Firebase Admin SDK (base64 encoded service account JSON)
# Get this from Firebase Console > Project Settings > Service Accounts
# Download the service account key JSON, then base64 encode it
FIREBASE_ADMIN_SDK_KEY=

# FCM Server Key (optional, for server-side notifications)
FCM_SERVER_KEY=
```

## Getting Firebase Admin SDK Key

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `sample-firebase-ai-app-51a56`
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Base64 encode it:
   ```bash
   # On Windows (PowerShell):
   [Convert]::ToBase64String([IO.File]::ReadAllBytes("path/to/serviceAccountKey.json"))
   
   # On Mac/Linux:
   base64 -i path/to/serviceAccountKey.json
   ```
7. Paste the base64 string into `FIREBASE_ADMIN_SDK_KEY` in `.env.local`

## Next Steps

1. Create `.env.local` file with the values above
2. Add your Firebase Admin SDK key (for admin functions)
3. Run `npm run dev` to start the development server

