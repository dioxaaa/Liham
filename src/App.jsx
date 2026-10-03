import { useCallback, useState } from "react";

import { ConfigNotice } from "./components/ConfigNotice.jsx";
import { DeliveryDialog } from "./components/DeliveryDialog.jsx";
import { Hero } from "./components/Hero.jsx";
import { LetterSheet } from "./components/LetterSheet.jsx";
import { PublicWall } from "./components/PublicWall.jsx";
import { ReaderDialog } from "./components/ReaderDialog.jsx";
import { SealedDialog } from "./components/SealedDialog.jsx";
import { SiteFooter } from "./components/SiteFooter.jsx";
import { SiteHeader } from "./components/SiteHeader.jsx";
import { useRevealOnScroll } from "./hooks/useRevealOnScroll.js";
import { zonedTimeToDate } from "./lib/datetime.js";
import { isFirebaseConfigured } from "./lib/firebase.js";
import { scheduleLetter } from "./lib/letters.js";

const EMPTY_DRAFT = { to: "", message: "", from: "", isPublic: false };

export default function App() {
  useRevealOnScroll();

  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [writing, setWriting] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [sealed, setSealed] = useState(null);
  const [reading, setReading] = useState(null);
  const [scheduleError, setScheduleError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const openSheet = useCallback(() => {
    setScheduleError("");
    setWriting(true);
  }, []);

  const closeSheet = useCallback(() => {
    setWriting(false);
    setScheduleError("");
  }, []);

  const openDelivery = useCallback(() => {
    if (!draft.message.trim()) {
      setScheduleError("There is nothing to seal yet — write a line first.");
      return;
    }
    setScheduleError("");
    setChoosing(true);
  }, [draft.message]);

  const seal = useCallback(
    async ({ email, date, time, timezone, ...letter }) => {
      const scheduledAt = zonedTimeToDate(date, time, timezone);
      if (scheduledAt.getTime() <= Date.now()) {
        throw new Error("That moment has already passed. Choose a date still ahead of you.");
      }

      await scheduleLetter({ ...letter, email, date, time, timezone, scheduledAt });

      const wasPublic = letter.isPublic;
      setChoosing(false);
      setWriting(false);
      setDraft(EMPTY_DRAFT);
      setSealed({ email, date, time, timezone, isPublic: wasPublic });
      if (wasPublic) setRefreshKey((key) => key + 1);
    },
    [],
  );

  const finish = useCallback(() => setSealed(null), []);

  return (
    <>
      {!isFirebaseConfigured && <ConfigNotice />}
      <SiteHeader onWrite={openSheet} />

      <main>
        <Hero onWrite={openSheet} />
        <PublicWall refreshKey={refreshKey} onOpenLetter={setReading} onWrite={openSheet} />
      </main>

      <SiteFooter onWrite={openSheet} />

      <LetterSheet
        open={writing}
        draft={draft}
        onSchedule={openDelivery}
        onChange={setDraft}
        onClose={closeSheet}
        scheduleError={scheduleError}
      />

      <DeliveryDialog open={choosing} draft={draft} onSubmit={seal} onClose={() => setChoosing(false)} />

      <SealedDialog open={Boolean(sealed)} letter={sealed} onClose={finish} />

      <ReaderDialog open={Boolean(reading)} letter={reading} onClose={() => setReading(null)} />
    </>
  );
}