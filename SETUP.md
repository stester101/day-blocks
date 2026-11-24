# Day Blocks PWA: setup

The app works as it is: plans save on the phone, and the tour, install steps and backups all work.
Two optional switches go in `config.js`: **feedback** (a Google Sheet) and **accounts** (Firebase sign-in and sync).

## 1. Feedback to a Google Sheet (about 5 minutes)
1. Create a new Google Sheet, for example "Day Blocks feedback".
2. Go to Extensions, then Apps Script. Delete the sample code and paste in `backend/feedback-apps-script.gs`.
   Optional: put your email in `NOTIFY_EMAIL` to get an email for each new note.
3. Click Deploy, then New deployment, then Web app. Set Execute as: **Me**, Who has access: **Anyone**. Click Deploy and allow access.
4. Copy the web app URL (it ends in `/exec`) into `feedbackUrl` in `config.js`.

Each note becomes a row with type, message, name, reply-to, app version, platform, screen size and whether the app is installed.
It never sends tasks. Notes written offline are saved and sent when the phone is back online.
Until `feedbackUrl` is set, the Send button opens the phone's share sheet instead.

## 2. Accounts and sync with Firebase (about 15 minutes, free plan)
1. Go to https://console.firebase.google.com, choose Add project (Analytics not needed).
2. **Build, then Authentication, then Get started.** Turn on **Google** and **Email/Password**.
3. **Authentication, then Settings, then Authorized domains:** add `stester101.github.io` (or wherever it is hosted).
4. **Build, then Firestore Database, then Create database** (production mode, location `europe-west2` London).
   Open the Rules tab, paste in `backend/firestore.rules` and publish.
5. **Project settings, then Your apps, then Web (`</>`)**, register "Day Blocks", and copy the `firebaseConfig` object into `firebase:` in `config.js`.

The Firebase web config is not a secret; the rules make sure each person can only read and write their own plans.
Each user's plans are one document, `users/{uid}`, and the app merges changes from two devices item by item.

## 3. Host on GitHub Pages
1. Create a public repo, for example `day-blocks`, and push this folder (without `.artifact-original.html`, which `.gitignore` skips).
2. In the repo, go to Settings, then Pages, then Deploy from branch `main` / root.
3. The link will be `https://stester101.github.io/day-blocks/`. Send that link.

## Releasing an update
Bump `VERSION` in `sw.js` and `APP_VER` in `index.html`, then push. Open copies show "A new version is ready, Update".

## Files
- `index.html`: the app (from the Day Blocks artifact; the Task/Event kind and the "Light day" template preset are removed)
- `config.js`: feedback URL and Firebase config
- `sw.js`: offline cache and update flow
- `manifest.webmanifest`, `icons/`: install name, colours and icons
- `backend/`: the Apps Script for the feedback sheet, and the Firestore rules
- `.artifact-original.html`: backup of the artifact version this came from
