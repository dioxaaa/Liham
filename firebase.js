import { initializeApp } from "firebase/app";
import { collection, getFirestore, addDoc, getDocs, limit, orderBy, query, serverTimestamp, Timestamp, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "liham-9acd7.firebaseapp.com",
  projectId: "liham-9acd7",
  storageBucket: "liham-9acd7.firebasestorage.app",
  messagingSenderId: "938022461087",
  appId: "1:938022461087:web:8a444e92f10e9fdf628caa",
  measurementId: "G-E6NQMRNE8Q"
};

if (!firebaseConfig.apiKey) {
  throw new Error("Set VITE_FIREBASE_API_KEY in .env before loading Liham.");
}

const db = getFirestore(initializeApp(firebaseConfig));
export { addDoc, collection, db, getDocs, limit, orderBy, query, serverTimestamp, Timestamp, where };
