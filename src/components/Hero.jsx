import { IconQuill, SealMark } from "./ui/Icons.jsx";
import styles from "./Hero.module.css";

const PROMISES = [
  { title: "No account", copy: "Nothing to sign up for, nothing to remember." },
  { title: "Any date", copy: "Tomorrow, next year, or the day you finally need it." },
  { title: "Anonymous wall", copy: "Leave one open for a stranger to unroll." },
];

export function Hero({ onWrite }) {
  return (
    <section className={styles.hero} id="top">
      <p className={`eyebrow eyebrow--center reveal ${styles.eyebrow}`}>A digital time capsule</p>

      <h1 className={`reveal ${styles.title}`}>
        A letter to your
        <em> future self.</em>
      </h1>

      <p className={`reveal ${styles.lede}`}>
        Write something today that you would be glad to receive later. Liham keeps it sealed until the
        date you choose, then sends it to your inbox — one quiet delivery, exactly when you asked for it.
      </p>

      <div className={`reveal ${styles.actions}`}>
        <button type="button" className="btn btn--primary" onClick={onWrite}>
          <IconQuill className={styles.quill} />
          Begin your letter
        </button>
        <a className="btn btn--quiet" href="#wall">
          Read the wall
        </a>
      </div>

      <ul className={`reveal ${styles.promises}`}>
        {PROMISES.map((promise) => (
          <li key={promise.title} className={styles.promise}>
            <h2 className={styles.promiseTitle}>{promise.title}</h2>
            <p className={styles.promiseCopy}>{promise.copy}</p>
          </li>
        ))}
      </ul>

      <SealMark className={`seal ${styles.bloodySeal}`} />
    </section>
  );
}