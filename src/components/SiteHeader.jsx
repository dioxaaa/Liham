import logoMark from "../../images/logo.png";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ onWrite }) {
  return (
    <header className={styles.header}>
      <div className={`shell ${styles.inner}`}>
        <a className={styles.brand} href="#top" aria-label="Liham — home">
          <img className={styles.mark} src={logoMark} alt="Liham" />
        </a>

        <nav className={styles.nav} aria-label="Primary">
          <a className={styles.link} href="#wall">
            The wall
          </a>
          <button type="button" className="btn btn--quiet btn--sm" onClick={onWrite}>
            Write a letter
          </button>
        </nav>
      </div>
    </header>
  );
}