import { formatOpenedOn } from "../lib/datetime.js";
import { Modal } from "./ui/Modal.jsx";
import { SealMark } from "./ui/Icons.jsx";
import styles from "./ReaderDialog.module.css";

export function ReaderDialog({ open, letter, onClose }) {
  if (!letter) return null;

  return (
    <Modal open={open} onClose={onClose} labelledBy="reader-title" variant="paper">
      <header className={styles.head}>
        <SealMark className={`seal ${styles.seal}`} />
        <p className={styles.kicker} id="reader-title">
          An anonymous letter
        </p>
      </header>

      <p className={styles.message}>{letter.message}</p>

      <p className={styles.meta}>{formatOpenedOn(letter.deliveredAt) || "recently opened"}</p>
    </Modal>
  );
}