export function IconClose() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

export function IconQuill({ className }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeLinejoin="round">
      <path
        d="M92 12c8 2 16 10 18 18-14 4-40 14-58 32C34 80 28 96 24 108c-2 6-8 8-14 6 10-4 8-10 8-14 4-14 12-36 30-54C66 28 78 16 92 12Z"
        strokeWidth="2.2"
      />
      <path d="M92 12C78 24 64 40 52 54M40 90c6-2 12-6 16-10" strokeWidth="1.4" />
    </svg>
  );
}

export function IconArrow({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h13M12 6l6 6-6 6" />
    </svg>
  );
}

/** Wax seal: the recurring brand mark for sealed/scheduled things. */
export function SealMark({ className, children = "L" }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 64 64" className="sealBlotch" fill="currentColor">
        <path d="M32 2c5 0 7 4 11 5s7-2 11 1 3 7 5 10 6 3 6 8-3 7-4 11 1 8-3 11-7 0-11 2-5 6-9 6-6-3-10-5-8 1-11-3-1-8-4-11-4-7-1-11 5-7 6-10 0-8 5-11 7 0 11-2S27 2 32 2Z" />
      </svg>
      <span className="sealLetter">{children}</span>
    </span>
  );
}