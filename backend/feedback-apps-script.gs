/**
 * Day Blocks feedback -> Google Sheet.
 * Paste into Extensions > Apps Script on a new Google Sheet, then Deploy > New deployment >
 * Web app, Execute as: Me, Who has access: Anyone. Copy the /exec URL into config.js (feedbackUrl).
 */
const SHEET_NAME = 'Feedback';
const NOTIFY_EMAIL = ''; // optional: your email address to get a message for each new row
const HEAD = ['Received', 'Type', 'Message', 'Name', 'Reply to', 'App', 'Platform', 'Installed', 'Signed in', 'Screen', 'View', 'Language', 'Browser', 'Sent at', 'Status'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const d = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (!d.message) return out('empty');
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) { sh.appendRow(HEAD); sh.setFrozenRows(1); sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold'); }
    // clip every field and stop text that starts with = + - @ being read as a formula
    const c = (v, n) => { let s = String(v == null ? '' : v).slice(0, n || 500); if (/^[=+\-@]/.test(s)) s = "'" + s; return s; };
    sh.appendRow([new Date(), c(d.type, 20), c(d.message, 4000), c(d.name, 60), c(d.contact, 120), c(d.app, 20), c(d.platform, 20),
      c(d.installed, 5), c(d.signedIn, 5), c(d.screen, 30), c(d.view, 10), c(d.lang, 20), c(d.ua, 300), c(d.sentAt, 40), 'New']);
    if (NOTIFY_EMAIL) MailApp.sendEmail(NOTIFY_EMAIL, 'Day Blocks ' + c(d.type, 20) + (d.name ? ' from ' + c(d.name, 60) : ''), c(d.message, 4000));
    return out('ok');
  } catch (err) {
    return out('error');
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out('Day Blocks feedback endpoint is running.'); }
function out(s) { return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT); }
