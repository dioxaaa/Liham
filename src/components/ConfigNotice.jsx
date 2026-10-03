import styles from "./ConfigNotice.module.css";

/** Shown only when VITE_FIREBASE_API_KEY is missing, so the UI stays explorable. */
export function ConfigNotice() {
  return (
    <aside className={styles.notice} role="status">
      <strong>Demo mode.</strong> No Firebase API key found, so letters cannot be sealed or read from
      the wall. Copy <code>.env.example</code> to <code>.env</code>, add{" "}
      <code>VITE_FIREBASE_API_KEY</code>, then restart the dev server.
    </aside>
  );
}