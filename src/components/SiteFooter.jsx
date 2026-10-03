import styles from "./SiteFooter.module.css";

export function SiteFooter({ onWrite }) {
  return (
    <footer className={styles.footer}>
      <div className={`shell ${styles.inner}`}>
        <p className={styles.line}>Liham — written once, opened later.</p>
        <button type="button" className={`btn btn--quiet btn--sm`} onClick={onWrite}>
          Write a letter
        </button>
      </div>
      <p className={styles.fine}>Keep the address you confessed to yourself — it is the only way back in.</p>
    </footer>
  );
}