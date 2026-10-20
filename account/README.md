# Part 2 · Accounts

Open `index.html`. Keep the sibling `../shared/` directory in place.

The default is a safe visual preview: password fields are disabled, no user account is created, no login session is opened and no email is sent. All screens label this explicitly.

Ready for connection: registration, password login, email-link confirmation with PKCE, resend with countdown, forgotten-password email, new password, verified account page and sign out. See `../docs/ACCOUNT-SETUP.md`.

## Files

- `index.html`: account entry page
- `callback.html`: email-confirmation/reset return page
- `css/account.css`: cream/cobalt/coral layout, note-card illustrations and animation
- `js/account.js`: forms and screen routing
- `js/auth.js`: connection adapter using the bundled official SDK
- `config.js`: public connection settings, disabled by default
- `vendor/`: Supabase JS SDK 2.118.0 and MIT licence

No real SMTP, auth project, user registration or email transmission was performed while building this module. The adapter was tested against intercepted mock API responses; a real project/device/email trial remains necessary.

Preview email fields are editable on registration, login and recovery. No email is sent in preview. Password controls remain disabled until the account service is configured.
