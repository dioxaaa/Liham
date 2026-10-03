/**
 * Firestore access for letters — the only module that talks to the database.
 *
 * Document shape (collection "letters"):
 *   to, from, message, email, timezone, date, time,
 *   scheduledAt (Timestamp), status ("scheduled" | "sent"),
 *   isPublic (boolean), createdAt (serverTimestamp), deliveredAt (Timestamp)
 *
 * The Firebase SDK is imported lazily so it never blocks the first paint.
 */

import { firebaseConfig, isFirebaseConfigured } from "./firebase.js";

const LETTERS = "letters";

export class LettersUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = "LettersUnavailableError";
  }
}

/** Memoized Firebase client. The SDK and the app instance load at most once. */
let clientPromise = null;

function getClient() {
  if (!isFirebaseConfigured) {
    return Promise.reject(
      new LettersUnavailableError(
        "Firestore is not configured. Add VITE_FIREBASE_API_KEY to your .env file.",
      ),
    );
  }

  clientPromise ??= (async () => {
    const [{ initializeApp }, firestore] = await Promise.all([
      import("firebase/app"),
      import("firebase/firestore"),
    ]);
    return { db: firestore.getFirestore(initializeApp(firebaseConfig)), firestore };
  })();

  return clientPromise;
}

/** Letters their writers chose to leave open, newest delivery first. */
export async function fetchPublicLetters({ max = 60 } = {}) {
  const { db, firestore } = await getClient();

  const snapshot = await firestore.getDocs(
    firestore.query(
      firestore.collection(db, LETTERS),
      firestore.where("isPublic", "==", true),
      firestore.where("status", "==", "sent"),
      firestore.orderBy("deliveredAt", "desc"),
      firestore.limit(max),
    ),
  );

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      message: data.message ?? "",
      deliveredAt: data.deliveredAt?.toDate?.() ?? null,
    };
  });
}

/** Seal a letter and hand it to the scheduler. */
export async function scheduleLetter(letter) {
  const { db, firestore } = await getClient();

  await firestore.addDoc(firestore.collection(db, LETTERS), {
    to: letter.to,
    from: letter.from,
    message: letter.message,
    email: letter.email,
    timezone: letter.timezone,
    date: letter.date,
    time: letter.time,
    scheduledAt: firestore.Timestamp.fromDate(letter.scheduledAt),
    isPublic: letter.isPublic,
    status: "scheduled",
    createdAt: firestore.serverTimestamp(),
  });
}