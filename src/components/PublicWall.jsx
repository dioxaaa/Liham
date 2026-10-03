import { usePublicLetters } from "../hooks/usePublicLetters.js";
import { excerpt, formatOpenedOn } from "../lib/datetime.js";
import { SealMark } from "./ui/Icons.jsx";
import styles from "./PublicWall.module.css";

function LetterCard({ letter, index, onOpen }) {
  return (
    <li className={`reveal ${styles.item}`} data-visible="false">
      <button type="button" className={styles.card} onClick={() => onOpen(letter)}>
        <span className={styles.cardTop}>
          <SealMark className={`seal ${styles.cardSeal}`} />
          <span className={styles.cardIndex}>letter {String(index + 1).padStart(2, "0")}</span>
        </span>

        <span className={styles.cardBody}>{excerpt(letter.message)}</span>

        <span className={styles.cardFoot}>
          <span>{formatOpenedOn(letter.deliveredAt) || "recently opened"}</span>
          <span className={styles.read}>Unroll →</span>
        </span>
      </button>
    </li>
  );
}

function Skeleton() {
  return (
    <li className={`${styles.item} ${styles.skeleton}`} aria-hidden="true">
      <span className={styles.skLine} />
      <span className={styles.skLine} />
      <span className={styles.skLineShort} />
    </li>
  );
}

export function PublicWall({ onOpenLetter, onWrite }) {
  const { letters, status, reload } = usePublicLetters();

  return (
    <section className={`section ${styles.wall}`} id="wall">
      <div className="shell">
        <header className={`reveal ${styles.head}`}>
          <p className="eyebrow eyebrow--center">The wall</p>
          <h2 className={styles.title}>Letters left open for anyone</h2>
          <p className={styles.sub}>
            Notes their writers chose to share once they had been delivered. Names are stripped; the
            words are not.
          </p>
        </header>

        {status === "loading" && (
          <ul className={styles.grid} aria-busy="true">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </ul>
        )}

        {status === "unavailable" && (
          <div className={`reveal ${styles.notice}`}>
            <p>The wall is out of reach right now.</p>
            <p className={styles.noticeSub}>
              It is a nice-to-have, not the way in — you can still write and seal your own letter.
            </p>
            <button type="button" className="btn btn--quiet btn--sm" onClick={reload}>
              Try again
            </button>
          </div>
        )}

        {status === "ready" && letters.length === 0 && (
          <div className={`reveal ${styles.notice}`}>
            <p>No one has left a letter here yet.</p>
            <p className={styles.noticeSub}>Yours could be the first one a stranger unrolls.</p>
            <button type="button" className="btn btn--primary btn--sm" onClick={onWrite}>
              Write the first one
            </button>
          </div>
        )}

        {status === "ready" && letters.length > 0 && (
          <ul className={styles.grid}>
            {letters.map((letter, index) => (
              <LetterCard key={letter.id} letter={letter} index={index} onOpen={onOpenLetter} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}