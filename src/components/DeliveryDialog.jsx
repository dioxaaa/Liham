import { useId, useState } from "react";

import { timeZoneOptions, todayISOIn } from "../lib/datetime.js";
import { Modal } from "./ui/Modal.jsx";
import { SealMark } from "./ui/Icons.jsx";
import styles from "./DeliveryDialog.module.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TIMEZONES = timeZoneOptions();

export function DeliveryDialog({ open, onClose, onSubmit, draft }) {
  const ids = useId();
  const [values, setValues] = useState(() => ({
    date: "",
    time: "09:00",
    email: "",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  }));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");

  const update = (field) => (event) => {
    setValues((previous) => ({ ...previous, [field]: event.target.value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
    setFailure("");
  };

  const submit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!EMAIL_RE.test(values.email.trim())) nextErrors.email = "We need a real address to deliver to.";
    if (!values.date || !values.time) nextErrors.date = "Pick a date and a time.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setFailure("");
    try {
      await onSubmit({ ...draft, ...values, email: values.email.trim() });
    } catch (error) {
      setFailure(error.message || "The letter would not seal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy={`${ids}-title`} dismissible={!submitting}>
      <div className={styles.head}>
        <SealMark className="seal" />
        <h2 className={styles.title} id={`${ids}-title`}>
          When should it arrive?
        </h2>
        <p className={styles.sub}>
          One delivery, to one inbox, at the hour you name. Times are read in the timezone you pick.
        </p>
      </div>

      <form className={styles.form} onSubmit={submit} noValidate>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${ids}-date`}>
              Date
            </label>
            <input
              id={`${ids}-date`}
              data-autofocus
              className={`${styles.input} ${errors.date ? styles.invalid : ""}`}
              type="date"
              min={todayISOIn(values.timezone)}
              value={values.date}
              onChange={update("date")}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor={`${ids}-time`}>
              Time
            </label>
            <input
              id={`${ids}-time`}
              className={`${styles.input} ${errors.date ? styles.invalid : ""}`}
              type="time"
              value={values.time}
              onChange={update("time")}
            />
          </div>
        </div>
        {errors.date && <p className={styles.error}>{errors.date}</p>}

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${ids}-email`}>
            Deliver to
          </label>
          <input
            id={`${ids}-email`}
            className={`${styles.input} ${errors.email ? styles.invalid : ""}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={update("email")}
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor={`${ids}-timezone`}>
            Timezone
          </label>
          <select
            id={`${ids}-timezone`}
            className={styles.input}
            value={values.timezone}
            onChange={update("timezone")}
          >
            {TIMEZONES.map((zone) => (
              <option key={zone.value} value={zone.value}>
                {zone.label}
              </option>
            ))}
          </select>
        </div>

        {failure && (
          <p className={styles.error} role="alert">
            {failure}
          </p>
        )}

        <div className={styles.actions}>
          <button type="button" className="btn btn--quiet" onClick={onClose} disabled={submitting}>
            Back
          </button>
          <button type="submit" className="btn btn--wax" disabled={submitting}>
            {submitting ? "Sealing…" : "Seal the letter"}
          </button>
        </div>
      </form>
    </Modal>
  );
}