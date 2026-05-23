// src/config/firebase.js
// ─────────────────────────────────────────────────────────────────────────────
// Firebase App Configuration
//
// 🔥 ACTION REQUIRED:
//    Replace each placeholder below with your actual Firebase project values.
//    You can find these in the Firebase Console:
//    → Go to https://console.firebase.google.com
//    → Open your project → Project Settings → Your Apps → Web App → SDK setup
//
// ─────────────────────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app  = initializeApp(firebaseConfig);

// Auth — used by Login.jsx
export const auth = getAuth(app);

// Google Auth provider — for "Sign in with Google" button
export const googleProvider = new GoogleAuthProvider();
// Restrict to college domains — uncomment and set your domain once you have the project
// googleProvider.setCustomParameters({ hd: 'yourcollege.edu' });

// Firestore — for real-time rides data
export const db = getFirestore(app);

export default app;
