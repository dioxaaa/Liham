/**
 * Firebase configuration and capability flag.
 *
 * The Firebase SDK itself is intentionally *not* imported here — `lib/letters.js`
 * pulls it in on first use, which keeps the SDK in its own chunk so the page can
 * paint before the network round-trip.
 */

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "liham-9acd7.firebaseapp.com",
  projectId: "liham-9acd7",
  storageBucket: "liham-9acd7.firebasestorage.app",
  messagingSenderId: "938022461087",
  appId: "1:938022461087:web:8a444e92f10e9fdf628caa",
  measurementId: "G-E6NQMRNE8Q",
};

/** False until VITE_FIREBASE_API_KEY is provided — the UI then explains itself instead of failing silently. */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey);