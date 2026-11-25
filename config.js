/* Day Blocks settings. Fill these in once; see SETUP.md. Both are safe to publish:
   a Firebase web config is not a secret (the database rules protect the data), and the
   feedback URL only accepts new rows. */
window.DAYBLOCKS_CONFIG = {
  // Google Apps Script web app URL that appends feedback to your Google Sheet (ends in /exec).
  feedbackUrl: '',

  // Firebase web app config (Project settings > Your apps > Web app > SDK setup > Config).
  // Leave as null to run without accounts: plans then stay on each device.
  firebase: {
    apiKey: 'AIzaSyDvWUlOKZUvI9lZVws8XiazkV9PvyOWft0',
    authDomain: 'day-blocks-e52c7.firebaseapp.com',
    projectId: 'day-blocks-e52c7',
    storageBucket: 'day-blocks-e52c7.firebasestorage.app',
    messagingSenderId: '517404356019',
    appId: '1:517404356019:web:50e258493f7360d5812fc6'
  }
};
