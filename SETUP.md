# Setup Guide for Together with AI

## ✅ What's Been Built

The complete app structure has been created with:

- ✅ Next.js 15 with App Router
- ✅ TypeScript configuration
- ✅ Tailwind CSS + shadcn/ui components
- ✅ Firebase client and admin configuration
- ✅ Authentication pages (login, signup, forgot-password) with show/hide password
- ✅ Main app layout with bottom navigation
- ✅ Feed, Explore, Post detail pages
- ✅ Upload and Remix functionality
- ✅ Profile pages
- ✅ Notifications system
- ✅ Admin panel (protected by role-based access)
- ✅ Report modal for moderation
- ✅ Security rules (Firestore & Storage)
- ✅ Cloud Functions structure
- ✅ PWA manifest
- ✅ SEO (sitemap, robots.txt)
- ✅ Admin setup script

## 🚀 Next Steps

### 1. Firebase Setup

Run Firebase initialization:

```bash
firebase login
firebase init
```

When prompted, select:
- ✅ Firestore
- ✅ Storage
- ✅ Functions
- ✅ Hosting
- ✅ Authentication (enable Email/Password, Google, GitHub)

### 2. Environment Variables

Create `.env.local` file:

```bash
cp .env.local.example .env.local
```

Then add your Firebase configuration values from the Firebase Console.

### 3. PWA Icons

Generate and add PWA icons to `public/icons/`:
- `192.png` (192x192)
- `512.png` (512x512)

You can use:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

### 4. Deploy Security Rules

```bash
firebase deploy --only firestore:rules,storage
```

### 5. Set Up Admin User

After creating your first user account, set them as admin:

```bash
npm run set-admin <user-uid> [admin|superAdmin]
```

### 6. Install Cloud Functions Dependencies

```bash
cd functions
npm install
cd ..
```

### 7. Deploy Cloud Functions

```bash
firebase deploy --only functions
```

### 8. Run Development Server

```bash
npm run dev
```

## 📁 Project Structure

```
togetherwithAI/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── forgot-password/
│   ├── (main)/              # Main app (protected)
│   │   ├── feed/
│   │   ├── explore/
│   │   ├── upload/
│   │   ├── notifications/
│   │   ├── profile/[username]/
│   │   ├── post/[id]/
│   │   ├── remix/[postId]/
│   │   └── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   ├── not-found.tsx
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── reveal-card.tsx
│   └── report-modal.tsx
├── lib/
│   ├── firebase.ts          # Firebase client config
│   ├── firebase-admin.ts    # Firebase admin config
│   ├── firestore.ts         # Firestore utilities
│   └── utils.ts
├── hooks/
│   └── use-auth.ts          # Authentication hook
├── types/
│   └── index.ts             # TypeScript types
├── functions/               # Cloud Functions
│   └── src/
│       └── index.ts
├── public/
│   ├── icons/               # PWA icons (add 192.png, 512.png)
│   ├── manifest.json
│   └── sw.js                # Service worker
├── scripts/
│   └── set-admin.ts         # Admin setup script
├── firestore.rules
├── storage.rules
├── firestore.indexes.json
└── firebase.json
```

## 🔐 Security

- Admin routes are protected by middleware
- Firestore security rules are configured
- Storage rules limit file uploads to 10MB images
- Admin panel only accessible to users with `isAdmin` or `superAdmin` custom claims

## 📱 Features

- **Authentication**: Email/password, Google, GitHub
- **Social Feed**: Infinite scroll with real-time updates
- **Upload**: Image upload with prompt metadata
- **Remix**: Create variations of existing posts
- **Notifications**: Real-time notifications with unread count
- **Moderation**: Report system with admin dashboard
- **PWA**: Installable app with offline support

## 🐛 Troubleshooting

### Firebase Admin SDK Error
Make sure `FIREBASE_ADMIN_SDK_KEY` in `.env.local` is a base64-encoded JSON of your service account key.

### Icons Not Showing
Add the actual icon files (192.png, 512.png) to `public/icons/` directory.

### Cloud Functions Not Deploying
Make sure you've installed dependencies in the `functions/` directory:
```bash
cd functions && npm install
```

## 📝 Notes

- The app uses Firebase custom claims for admin access
- Notifications are stored in a denormalized structure for performance
- Posts support image, video, and audio types (currently only image upload is implemented)
- The reveal card component allows users to view AI prompt details

