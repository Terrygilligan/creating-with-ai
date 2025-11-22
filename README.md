# Together with AI

Show the world what you created together with AI.

## Features

- 🔐 Authentication (Email, Google, GitHub)
- 📱 Social feed with AI-generated content
- 🎨 Upload and share your AI creations
- 🔄 Remix posts with custom prompts
- 🔔 Real-time notifications
- 👥 User profiles and following
- 🛡️ Admin panel for moderation
- 📲 PWA support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth, Firestore, Storage, Functions, FCM)
- **Deployment**: Firebase Hosting

## Getting Started

### Prerequisites

- Node.js 18+
- Firebase CLI
- Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/togetherwithai/app.git
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase:
```bash
firebase login
firebase init
```

4. Create `.env.local` from `.env.local.example` and add your Firebase config:
```bash
cp .env.local.example .env.local
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password, Google, GitHub)
3. Create Firestore database
4. Set up Firebase Storage
5. Deploy security rules:
```bash
firebase deploy --only firestore:rules,storage
```

## Admin Setup

To set a user as admin, use the admin script:

```bash
node scripts/set-admin.js <user-uid> [superAdmin|admin]
```

## Project Structure

```
togetherwithAI/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (main)/          # Main app pages
│   └── layout.tsx       # Root layout
├── components/          # React components
├── lib/                 # Utilities and Firebase config
├── hooks/               # Custom React hooks
├── types/               # TypeScript types
└── functions/           # Firebase Cloud Functions
```

## License

ISC

