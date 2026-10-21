# Smart MUET Hub V3 — targeted implementation status

## Implemented in this ZIP
- `me.html`: collapsible XP/streak, guide/eBook records, and reflections; all original data containers, IDs, event scripts and export buttons remain.
- `shared/styles/learning-history.css`: responsive accordion presentation and print handling.
- `splash.html`: new branded entry screen linking to existing registration and diagnostic. Existing `index.html` remains untouched.
- Clarified that lecturer assessment differs from student self-assessment.

## Not yet enabled — external setup / verification required
- **Required registration:** `account/config.js` currently has `enabled:false`. Existing account implementation uses Supabase; secure authentication must be configured before enforcing a login gate. Do not simulate authentication with localStorage.
- **Google Apps Script + Sheets:** endpoint, spreadsheet, student ID scheme, access control and deployment have not been supplied. Do not send personal data to an unconfigured endpoint.
- **Lecturer review:** existing rubrics are preserved; an authenticated lecturer queue and server-verified marks are still needed.
- **Completion certificate:** existing nine-condition `shared/js/cert-core.js` logic is unchanged. It currently relies on local records and should not be represented as a server-verified credential. Add issuance audit and unique verification only after backend setup.
- **Individual full report:** existing print, CSV and TXT export are preserved. A server-backed, signed report with lecturer-reviewed scores remains future work.
- **Browser QA:** verify on Android Chrome, desktop Chrome and Safari, especially collapsed-panel scripts, print exports and storage retention.

## Data safety
- Do not clear localStorage or rename progress keys.
- Back up the live site before deployment.
- Test migration of old local records to a registered student ID using explicit consent and idempotent imports.
- Do not overwrite existing progress with blank cloud values.

## Deployment
1. Upload `me.html`, `shared/styles/learning-history.css`, and optionally `splash.html`.
2. Leave other existing pages untouched.
3. Test `me.html` with previously completed learning records and the print/export functions.
4. Decide whether `splash.html` should be linked from Home; do not replace Home until account authentication is configured.
