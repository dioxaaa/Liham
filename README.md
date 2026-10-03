# Liham

A quiet digital time capsule. Write a letter today, choose the day it should arrive, and
Liham keeps it sealed until then. Letters can stay private or be left open on the wall for a
stranger to unroll, with the writer's name removed.

## Stack

React 19 + Vite 6, Firestore (Firebase v10). No routing library, no UI framework — the
interface is plain React with CSS Modules over a small set of design tokens.

## Local development

1. Copy `.env.example` to `.env`.
2. Set `VITE_FIREBASE_API_KEY` in `.env` to the API key for your Firebase web app.
3. Run `npm install`, then `npm run dev`.

Without an API key the app still boots in **demo mode**: the interface is fully explorable,
but sealing a letter or loading the wall will report that Firestore is unavailable. This
keeps UI work possible before Firebase is wired up.

`VITE_` values are included in the browser build and are not private credentials. Restrict
the Firebase API key to the app's authorized websites and APIs. Do not put service-account
credentials or other private secrets in this variable.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output locally (`http://localhost:4173`) |

### Opening with VS Code Live Server

The project-root `index.html` is a module entry point and will not run under Live Server,
which serves files without compiling JSX or resolving imports. Build first, then point Live
Server at the generated `dist/` folder (right-click `dist/index.html` → Open with Live
Server). Serve it over `http://`, not by double-clicking the file — ES modules are blocked on
`file://`. `base: "./"` in `vite.config.js` keeps those asset URLs portable.

## Project layout

```
index.html            app shell + font and meta tags
vite.config.js        React plugin, dependency-optimizer workaround
images/               logo.png, letter-paper.png (unchanged location)
assets/
  fonts/              PalisadeRegular.* (optional, licensed — see src/styles/tokens.css)
src/
  main.jsx            React entry point
  App.jsx             owns the writing → sealing → reading flow
  components/
    SiteHeader.jsx    sticky header and brand mark
    Hero.jsx          headline, promise list, call to action
    LetterSheet.jsx   the letter paper and its fields
    DeliveryDialog.jsx where and when the letter should arrive
    SealedDialog.jsx   confirmation after sealing
    PublicWall.jsx     grid of letters shared by their writers
    ReaderDialog.jsx   reads one shared letter
    ConfigNotice.jsx   demo-mode banner when no API key is set
    ui/                Modal (focus-trapped dialog) and shared icons
  hooks/
    usePublicLetters.js    load the wall: loading | ready | unavailable
    useRevealOnScroll.js   reveal-on-scroll, reduced-motion aware
  lib/
    firebase.js       Firebase bootstrap; degrades gracefully without a key
    letters.js        all Firestore reads and writes for the "letters" collection
    datetime.js       timezone-correct delivery maths and formatting
  styles/
    tokens.css        colour, type, spacing, motion, elevation
    global.css        reset, page frame, buttons, reveal, wax seal
```

Each component keeps its styles next to it in a `*.module.css` file, so the file you need is
always the one named after the thing on screen.

## Firestore document shape

Collection `letters`:

| Field | Type | Notes |
| --- | --- | --- |
| `to`, `from` | string | Free text, either may be empty |
| `message` | string | Up to 4000 characters |
| `email` | string | Delivery address |
| `date`, `time` | string | Wall-clock delivery in the chosen `timezone` |
| `timezone` | string | IANA name, e.g. `Europe/Oslo` |
| `scheduledAt` | Timestamp | Resolved instant used for scheduling |
| `status` | string | `scheduled` until delivered, then `sent` |
| `isPublic` | boolean | Opt-in to the public wall |
| `createdAt` | Timestamp | Server time of sealing |
| `deliveredAt` | Timestamp | Set by the delivery job; drives the wall order |

The public wall only queries documents where `isPublic == true` and `status == "sent"`, so a
delivered letter is revealed without exposing scheduled ones. Delivering `scheduled` letters
and flipping `status` is the responsibility of a separate scheduled job.
