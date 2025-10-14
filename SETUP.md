# Quick Setup Guide

Follow these steps to get your X.com clone up and running.

## 1. Install Dependencies

```bash
npm install
```

## 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Copy your Firebase config

## 3. Environment Variables

1. Copy `env.example` to `.env`:
```bash
cp env.example .env
```

2. Edit `.env` and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 4. Firestore Security Rules

In Firebase Console → Firestore Database → Rules, paste the rules from `firestore.rules`

## 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## 6. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 7. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

## Troubleshooting

**Firebase errors?**
- Double-check your `.env` file
- Make sure Firebase Authentication and Firestore are enabled
- Verify security rules are published

**Port already in use?**
- Change the port in `vite.config.ts`
- Or kill the process using port 5173

**Build errors?**
- Run `npm install` again
- Delete `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`

