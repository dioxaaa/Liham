# Liham

## Local development

1. Copy `.env.example` to `.env`.
2. Set `VITE_FIREBASE_API_KEY` in `.env` to the API key for your Firebase web app.
3. Run `npm install` and then `npm run dev`.

`VITE_` values are included in the browser build and are not private credentials. Restrict the Firebase API key to the app's authorized websites and APIs. Do not put service-account credentials or other private secrets in this variable.