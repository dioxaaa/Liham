import { describeDelivery } from "../lib/datetime.js";
import { Modal } from "./ui/Modal.jsx";
import { SealMark } from "./ui/Icons.jsx";
import styles from "./SealedDialog.module.css";

export function SealedDialog({ open, letter, onClose }) {
  if (!letter) return null;

  return (
    <Modal open={open} onClose={onClose} labelledBy="sealed-title" variant="sealed" dismissible={false}>
      <div className={styles.stamp} aria-hidden="true">
        <SealMark className={`seal ${styles.seal}`} />
      </div>

      <h2 className={styles.title} id="sealed-title">
        Your letter is sealed.
      </h2>
      <p className={styles.detail}>
        It will arrive at <strong>{letter.email}</strong> on {describeDelivery(letter)}.
      </p>
      <p className={styles.note}>
        {letter.isPublic
          ? "A copy joins the wall once it has been delivered, with your name removed."
          : "It stays between you and the date you chose."}
      </p>

      <button type="button" className="btn btn--primary btn--block" onClick={onClose} data-autofocus>
        Write another
      </button>
    </Modal>
  );
}