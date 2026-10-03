import { useId, useRef } from "react";

import { Modal } from "./ui/Modal.jsx";
import { IconArrow } from "./ui/Icons.jsx";
import styles from "./LetterSheet.module.css";

const MESSAGE_LIMIT = 4000;

export function LetterSheet({ open, draft, onChange, onClose, onSchedule, scheduleError }) {
  const messageRef = useRef(null);
  const ids = useId();

  const setField = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    onChange({ ...draft, [field]: value });
  };

  const remaining = MESSAGE_LIMIT - draft.message.length;

  const submit = (event) => {
    event.preventDefault();
    if (!draft.message.trim()) {
      messageRef.current?.focus();
      return;
    }
    onSchedule();
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy={`${ids}-title`} variant="stage">
      <p className={styles.sheetLabel} id={`${ids}-title`}>
        <span>Sheet one</span>
        <span className={styles.rule} aria-hidden="true" />
      </p>

      <form className={styles.paper} onSubmit={submit}>
        <div className={styles.fieldRow}>
          <label className={styles.label} htmlFor={`${ids}-to`}>
            To
          </label>
          <input
            id={`${ids}-to`}
            data-autofocus
            className={styles.input}
            type="text"
            value={draft.to}
            maxLength={80}
            placeholder="my future self"
            onChange={setField("to")}
          />
        </div>

        <label className={`${styles.label} ${styles.labelBlock}`} htmlFor={`${ids}-message`}>
          Message
        </label>
        <textarea
          id={`${ids}-message`}
          ref={messageRef}
          className={styles.message}
          value={draft.message}
          maxLength={MESSAGE_LIMIT}
          rows={8}
          placeholder="Dear future me, today I…"
          onChange={setField("message")}
        />
        <p className={styles.counter} aria-live="polite">
          {remaining <= 400 ? `${remaining} characters left` : `${draft.message.length} / ${MESSAGE_LIMIT}`}
        </p>

        <div className={styles.fieldRow}>
          <label className={styles.label} htmlFor={`${ids}-from`}>
            From
          </label>
          <input
            id={`${ids}-from`}
            className={styles.input}
            type="text"
            value={draft.from}
            maxLength={80}
            placeholder="your name, or no one at all"
            onChange={setField("from")}
          />
        </div>
      </form>

      <div className={styles.actions}>
        <label className={styles.share}>
          <input
            type="checkbox"
            className={styles.shareInput}
            checked={draft.isPublic}
            onChange={setField("isPublic")}
          />
          <span className={styles.shareTrack} aria-hidden="true">
            <span className={styles.shareThumb} />
          </span>
          <span className={styles.shareCopy}>
            Open this one to strangers
            <small>Your name is removed before anyone reads it.</small>
          </span>
        </label>

        <button type="button" className="btn btn--primary" onClick={onSchedule}>
          Seal &amp; choose a date
          <IconArrow className={styles.arrow} />
        </button>

        {scheduleError && (
          <p className={styles.error} role="alert">
            {scheduleError}
          </p>
        )}
      </div>
    </Modal>
  );
}