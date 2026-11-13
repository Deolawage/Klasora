# Klasora

<img src="public/klasora-logo.png" alt="Klasora — Your clique, your circle, your campus" width="320">

> **Your clique. Your circle. Your campus.**

Klasora is a real-time student social and study app built for university students. Chat with friends, organize private course spaces, track assignments, focus with Pomodoro, and get AI-powered study help in one place.

---

## Features

### Chats
- Private one-to-one conversations and group chats called Cliques
- Public clique discovery and direct joining, plus private-clique invite links and admin-approved join requests
- Clique member lists and admin-managed pinned messages
- Real-time messages, typing indicators, and sent/delivered/read receipts
- Search messages across conversations you can access
- Emoji reactions and message deletion
- Image and file attachments, plus recorded voice notes
- Peer-to-peer voice and video calls
- 24-hour Status updates

### Courses and study tools
- Private course spaces with invitations for existing Klasora users
- Course chat, notes, file folders, and private file storage
- Homework tracker with subject, due date, priority, and notes
- AI homework breakdowns with concise action steps
- Pomodoro Focus timer with 25/5/15-minute modes and session statistics
- First-visit walkthrough and persistent bottom navigation for Chats, Courses, Focus, and Settings

### Klasora AI
- Groq-powered study assistant, including course-note-aware questions
- Generates flashcards and multiple-choice quizzes from saved course notes
- Interactive quizzes with answer feedback and scoring
- Uploaded PDFs are securely stored, but their contents are not yet extracted for AI summaries or study materials

### Account and preferences
- Email/password registration and sign-in, email verification, and password reset
- Optional Google sign-in when configured in Supabase
- Profile name and bio editing
- Dark and light themes, notification preference controls, and sign-out
- Responsive mobile and desktop layouts

## Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Node.js + Express.js |
| **Real-time** | Socket.io |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | Supabase Auth + application JWT |
| **File Uploads** | Multer + private Supabase Storage |
| **Voice/Video Calls** | WebRTC (peer-to-peer) |
| **Push Notifications** | Web Push (VAPID) |
| **AI Assistant** | Groq API |
| **Frontend** | Vanilla HTML, CSS, JavaScript |
| **Hosting** | Railway |

---

## Getting started

### Prerequisites
- [Node.js](https://nodejs.org) v18 or higher
- A [Supabase](https://supabase.com) account with a new project
- A [Railway](https://railway.app) account (for deployment)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/meno-app.git
cd meno-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create your Supabase database
1. Create a new Supabase project.
2. Open the SQL editor and run the migration in `supabase/schema.sql`.
3. Copy your project URL and anon/service keys from the Supabase dashboard.

The schema creates private `course-files`, `chat-files`, and `profile-images` Storage buckets. Course documents, chat attachments, voice notes, and compressed profile pictures are uploaded through the authenticated server and are not stored on the application filesystem.
For an existing project, rerun `supabase/schema.sql` to add clique visibility, join-request, and pinned-message storage. Existing cliques default to private so they are not exposed by public discovery. Clique creators are the admins for approvals and pins; the server also checks clique membership before allowing room access and message actions.
4. In Supabase **Authentication → URL Configuration**, set the Site URL to your
   production URL, `https://klasora.vercel.app`. Add `https://klasora.vercel.app/**`
   and `http://localhost:3000/**` to Redirect URLs. For Vercel previews, add an exact
   preview URL or a team-scoped pattern such as
   `https://*-YOUR_TEAM_SLUG.vercel.app/**`; avoid a wildcard covering every Vercel
   project. Keep the local URL only for local development.
5. To enable Google sign-in:
   - In Google Cloud Console, create an OAuth Web application.
   - Add `https://klasora.vercel.app` under Authorized JavaScript origins, and
     `http://localhost:3000` only for local development.
   - Add `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback` under Authorized redirect URIs.
   - In Supabase **Authentication → Providers → Google**, enable Google and paste the
     Google client ID and client secret.
   - Restart Klasora and use **Continue with Google**. Supabase returns the provider session
     to the trusted app origin, where Klasora exchanges it for its protected application session.
6. For registration verification and password reset emails, configure Supabase
   **Authentication → SMTP Settings** for production. Keep the default Supabase email
   service for local testing only, then verify the email templates use Supabase's
   confirmation URL (for example `{{ .ConfirmationURL }}`) rather than a hard-coded
   localhost URL, and test both flows from the login screen.

### 4. Set up environment variables
On Windows PowerShell, copy the template with:
```powershell
Copy-Item .env.example .env
```
On macOS or Linux, use `cp .env.example .env`.

Open `.env` and replace the example values with credentials from your Supabase project's
**Project Settings → API**. Keep the service-role key private and never commit `.env`.
Generate a new JWT secret locally with Node.js:
```powershell
node -p "require('node:crypto').randomBytes(48).toString('base64url')"
```
Copy the printed value into `JWT_SECRET` in `.env`. Generate your own value; it must
contain at least 32 characters. The placeholder in `.env.example` is not a usable secret.

The application requires `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY` for sign-in and database-backed features. Replace all three
Supabase placeholders before starting the app; the service-role key must remain server-side.

The following variables are required:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
APP_URL=http://localhost:3000
JWT_SECRET=replace_with_your_generated_secret
PORT=3000
```

Optional integrations such as Groq AI and push notifications are listed in `.env.example`.
Push notifications need a matching `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` pair.
To generate one with the installed `web-push` dependency, run this command in the project
directory and copy its output directly into your local `.env`:
```powershell
node -e "console.log(JSON.stringify(require('web-push').generateVAPIDKeys()))"
```
Keep the private key secret; do not paste it into chat or commit it. If you do not need
push notifications locally, leave both VAPID key values empty. Do not leave placeholder
or partial values: the server validates a provided pair when it starts.

### 5. Run locally
```bash
npm run dev
```

Open your browser and go to **http://localhost:3000**.

## Deploy to Railway

1. Push your code to **GitHub**
2. Go to **[railway.app](https://railway.app)** and sign in with GitHub
3. Click **New Project**, then **Deploy from GitHub repo**
4. Select your **meno-app** repository
5. Click the app card, then open the **Variables** tab
6. Add your environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`
   - `APP_URL`
   - `JWT_SECRET`
7. Go to **Settings**, then **Domains**, then **Generate Domain**
8. Your app is live.

For a Vercel frontend with live chat, deploy this same repository as a Railway backend
and use its HTTPS domain as `PUBLIC_BACKEND_URL` in Vercel. Set `APP_URL` on Railway
to the Vercel frontend origin. Leave `PUBLIC_BACKEND_URL` empty on Railway.

## Deploy to Vercel

Vercel detects the Express app exported from the root `server.js` and serves it as a
Function; no `vercel.json` rewrite is needed. Files in `public/` are served by Vercel's
static asset CDN. In the Vercel project, keep the repository root as the **Root
Directory** and use the **Express** framework preset (or automatic detection). For a
single-host deployment, add the required server-side variables under
**Settings → Environment Variables** for each environment you deploy:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`
- `JWT_SECRET` — a private random value of at least 32 characters
- `APP_URL` — the production site URL, such as `https://klasora.vercel.app`
- `PUBLIC_BACKEND_URL` — set this to the Railway backend's HTTPS origin when using
  Railway for the API and Socket.IO; leave empty for a single-host deployment
- `PUBLIC_APP_URL` (optional) — explicitly trusted public app origin; takes precedence
  over `APP_URL`. `SITE_URL` and `SUPABASE_SITE_URL` are also accepted as fallbacks.

`JWT_SECRET` is required at startup; without it, the function fails before serving any
request. Do not set `PORT` on Vercel. Add `GROQ_API_KEY` only if AI features are needed.
Push notifications are optional; if enabled, configure a matching
`VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` pair and optional `VAPID_EMAIL`. Never put secret
values in source control or support messages. Redeploy after changing environment
variables.

In Vercel, set `APP_URL=https://klasora.vercel.app` for Production and Preview
environments (or set `PUBLIC_APP_URL` to the intended public origin). These variables
provide an explicit redirect URL to Supabase; Supabase's Dashboard Site URL is not
retrieved by the server at runtime. The server uses a request Origin only when it exactly
matches a configured app origin or Vercel deployment URL. If Origin is absent, it accepts
a Host only when its hostname matches one of those configured origins; it never trusts
arbitrary Host or forwarded-host headers. Otherwise it falls back to the configured URL.
In production, auth-link generation fails rather than falling back to localhost when no
public URL is configured.

For the split Vercel/Railway deployment below, configure `JWT_SECRET` and
`PUBLIC_BACKEND_URL` on Vercel; keep the Supabase keys and `APP_URL` on Railway.

### Keep the Vercel frontend and host chat on Railway

Vercel Functions cannot keep the Socket.IO connection alive. To use Vercel for the
frontend while keeping chat, presence, calls, and API requests available:

1. Deploy the repository to Railway and generate a public HTTPS domain.
2. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `JWT_SECRET`,
   and `APP_URL=https://klasora.vercel.app` on Railway. Use the same `JWT_SECRET` on
   both hosts.
3. Set `PUBLIC_BACKEND_URL` on Vercel to the Railway origin only, for example
   `https://klasora-production.up.railway.app` (no path). Also set `JWT_SECRET` on
   Vercel because the Express function needs it to start and serve the frontend
   configuration.
4. Keep Supabase service-role credentials on Railway; the Vercel frontend reads the
   public backend origin from `/api/config` and sends authenticated API and Socket.IO
   traffic to Railway. Redeploy both services after configuration changes.
5. In Supabase **Authentication → URL Configuration**, keep the Vercel URL as the Site
   URL and allow it in Redirect URLs. Confirm the email templates use
   `{{ .ConfirmationURL }}` and verify registration and password reset from the deployed
   frontend.

In the Supabase Dashboard, set Authentication → URL Configuration → Site URL to
`https://klasora.vercel.app`. Add `https://klasora.vercel.app/**` and, for local
development, `http://localhost:3000/**` to Redirect URLs. Add an exact Vercel preview
URL or a team-scoped pattern such as `https://*-YOUR_TEAM_SLUG.vercel.app/**` only if
preview auth is needed. Ensure confirmation and password-reset email templates link
through Supabase's `{{ .ConfirmationURL }}` instead of hard-coding localhost.
Vercel Functions do not provide persistent WebSocket connections, so Socket.IO live
chat/presence/call features require a separate WebSocket-capable host.

## Project structure

```
meno-app/
├── server.js          ← Node.js backend (API + Socket.io)
├── package.json       ← Dependencies
├── .env.example       ← Environment variables template
├── supabase/
│   └── schema.sql     ← Supabase database schema
├── .gitignore
└── public/
    ├── index.html     ← Full frontend (HTML + CSS + JS)
    └── sw.js          ← Service worker for push notifications
```

Course spaces are private by default. A course owner creates the space and can invite
existing Klasora users by email from the course management flow.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side key for database access |
| `SUPABASE_ANON_KEY` | Yes | Public anon key for browser/client access |
| `APP_URL` | Production | Public application URL used for verification, OAuth, and password reset links; local default is `http://localhost:3000` |
| `PUBLIC_BACKEND_URL` | No | Optional HTTPS origin for a separate API and Socket.IO backend; set on Vercel for a Railway backend |
| `PUBLIC_APP_URL` | No | Optional explicitly trusted public origin; takes precedence over `APP_URL` |
| `SITE_URL`, `SUPABASE_SITE_URL` | No | Optional public-origin fallback values |
| `JWT_SECRET` | Yes | Private cryptographically random secret, at least 32 characters |
| `PORT` | No | Server port (default: 3000) |
| `GROQ_API_KEY` | No | Groq API key for AI assistant |
| `GROQ_MODEL` | No | Optional Groq model name |
| `VAPID_PUBLIC_KEY` | No | For push notifications |
| `VAPID_PRIVATE_KEY` | No | For push notifications |
| `VAPID_EMAIL` | No | For push notifications |

## Responsive design
Klasora works on all screen sizes:
- **Mobile**: Bottom navigation, full-screen chat, and slide-in sidebar
- **Tablet / Desktop**: Full sidebar layout with chat panel

## Campus workspace
The responsive campus workspace adds a community feed, clique overview and study-room preview, study capsule and focus challenge, weekly timetable, academic profile, and assignment detail screens. Existing sign-in, password recovery, chat, course, assignment, and focus-stat APIs remain in use.

Community posts and comments, timetable entries, and the study-room timer are local browser experiences because the current backend does not provide services for those features. Academic profile fields are stored on the signed-in user's account; profile pictures are compressed in the browser and stored in the private `profile-images` bucket. Profile details are retrieved through the authenticated self-profile endpoint and are not added to public user/chat responses. Assignments, clique creation, and completed focus sessions use the existing authenticated APIs. Live study presence and shared community posts are not currently synchronized.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

---
