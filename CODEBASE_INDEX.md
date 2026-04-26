# Codebase Index
> Auto-generated complete reference of all files, features, functions, and their locations.
> Last generated: 2026-04-25

## Table of Contents
- [Features Overview](#features-overview)
- [File-by-File Reference](#file-by-file-reference)
- [Function/Symbol Index](#functionsymbol-index)

## Features Overview
| Feature | Key Files | Description |
|---------|-----------|-------------|
| Authentication | src/lib/auth.ts, src/hooks/useAuth.ts, src/components/AuthGuard.tsx, src/app/auth/login/page.tsx, src/app/auth/register/page.tsx, src/app/auth/setup-username/page.tsx | Email/password auth, Google sign-in, demo mode, profile bootstrap, and route protection. |
| Dashboard | src/app/page.tsx, src/components/SubjectChart.tsx, src/components/WeeklyCalendar.tsx, src/components/WeeklyBarChart.tsx, src/components/GoalCard.tsx | Main student dashboard with progress summaries, charts, streaks, goals, and revision prompts. |
| Study Logging | src/app/log/page.tsx, src/components/StudyLogForm.tsx, src/hooks/useStudyLogs.ts, src/lib/db.ts | Study session CRUD for subject, topic, duration, questions, notes, tags, and dates. |
| Exam Logging | src/app/log/page.tsx, src/components/ExamLogForm.tsx, src/lib/db.ts | TYT/AYT full and branch exam entry with per-subject nets and duration. |
| History and Export | src/app/history/page.tsx, src/components/LogCard.tsx, src/lib/export.ts | Filterable history view with edit/delete flows and CSV/PDF export. |
| Goals | src/app/goals/page.tsx, src/hooks/useGoals.ts, src/components/GoalCard.tsx, src/lib/db.ts | Weekly/monthly goal management for minutes or question counts. |
| Statistics | src/app/stats/page.tsx, src/components/TopicBreakdownChart.tsx, src/components/EfficiencyCard.tsx | Topic-level breakdowns and twelve-week efficiency trend reporting. |
| Friends and Leaderboard | src/app/friends/page.tsx, src/hooks/useFriends.ts, src/components/Leaderboard.tsx, src/lib/db.ts | Friend requests, accepted friendships, privacy-aware comparisons, and leaderboards. |
| Focus Timer | src/components/FocusTimer.tsx, src/app/timer/page.tsx, src/lib/db.ts | Pomodoro-style stopwatch with YKS branch timings, animated phase orbs (focus/warning/danger), server-persisted timer sessions via Firestore, and post-session exam log-saving dialog. |
| Exam Trend Charts | src/components/ExamTrendChart.tsx, src/app/stats/page.tsx | Recharts line chart for TYT/AYT total net score progression across full exam records. |
| Desktop Companion API | src/app/api/desktop/log/route.ts, src/app/api/desktop/stats/route.ts, src/app/api/auth/token/route.ts | Bearer-auth REST endpoints used by the desktop app to post study sessions, retrieve today's stats, and generate temporary custom auth tokens. |
| Weekly Schedule | src/app/program/page.tsx, src/hooks/useSchedule.ts, src/lib/db.ts | Weekly task planner with a 7-day grid, add/complete/delete tasks per subject-topic or branch exam, completion dialogs, and weekly progress bar. |
| Topic Progress Tracking | src/app/topics/page.tsx, src/components/TopicTree.tsx, src/hooks/useTopicProgress.ts, src/lib/db.ts | Curriculum progress tracker with TYT/AYT subject grids, per-topic completion marking, per-topic study stats from logs, schedule task overlays, and quick-add task dialogs. |
| Notifications and Streaks | src/lib/notifications.ts, src/components/ExamCountdown.tsx, src/components/StreakBadge.tsx | Local reminder heuristics, notification permission handling, countdowns, and streak status. |
| Offline and PWA | src/lib/offlineQueue.ts, public/sw.js, public/manifest.json, src/app/layout.tsx | IndexedDB queueing, service worker caching, and installable PWA metadata. |
| Demo Mode | src/lib/demo-data.ts, src/hooks/useAuth.ts, src/hooks/useStudyLogs.ts, src/hooks/useFriends.ts | Local demo profile, logs, and friend comparisons without Firebase runtime setup. |
| UI System | src/components/ui/*, src/app/globals.css, components.json | shadcn/radix-based primitive set, theme tokens, animations, and Tailwind-driven styling. |

## File-by-File Reference

### `AGENTS.md`
**Purpose**: Repository-specific agent instructions that require reading architecture documentation first and treating this Next.js version as non-standard.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | instructions | Agent guidance only; no exported symbols. |

### `ARCHITECTURE.md`
**Purpose**: High-level architecture reference describing technology choices, directory responsibilities, data models, dependencies, and common change scenarios.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | document | Project architecture reference; no exported symbols. |

### `CLAUDE.md`
**Purpose**: Lightweight indirection file that points other agents back to the repository instruction source.
**Depends on**: AGENTS.md

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | document | Agent alias file; no exported symbols. |

### `README.md`
**Purpose**: Default create-next-app README with local run and deployment guidance.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | document | Project readme only; no exported symbols. |

### `package.json`
**Purpose**: Declares the Next.js app package metadata, scripts, and dependency set.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | config | Package manifest; no exported symbols. |

### `components.json`
**Purpose**: Configures shadcn/ui generation aliases, styling mode, and CSS entrypoint.
**Depends on**: src/app/globals.css

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | config | shadcn generator config; no exported symbols. |

### `eslint.config.mjs`
**Purpose**: Configures ESLint with Next.js core-web-vitals and TypeScript presets while overriding default ignore lists.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L5 | `eslintConfig` | const | ESLint configuration array passed to `defineConfig`; exported as default. |

### `firebase.json`
**Purpose**: Maps Firebase hosting/tooling to the Firestore rules file.
**Depends on**: firestore.rules

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | config | Firebase CLI config; no exported symbols. |

### `firestore.rules`
**Purpose**: Firestore security rules for users, usernames, study logs, friendships, goals, notification tokens, topic progress, weekly schedule items, and timer sessions.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | rules | Firestore access-control rules; no exported symbols. |

### `next-env.d.ts`
**Purpose**: Next.js-generated ambient type references for the app and route types.
**Depends on**: .next generated route types

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | types | Ambient type references only; no exported symbols. |

### `next.config.ts`
**Purpose**: Adds a global Cross-Origin-Opener-Policy header needed for Firebase Auth popup flows.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L3 | `nextConfig` | const | Next.js runtime config exposing async `headers()` for all routes. |

### `postcss.config.mjs`
**Purpose**: Enables the Tailwind CSS v4 PostCSS plugin.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L1 | `config` | const | PostCSS plugin map enabling `@tailwindcss/postcss`; exported as default. |

### `tsconfig.json`
**Purpose**: Sets strict TypeScript compiler options, bundler module resolution, and the `@/*` path alias.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | config | TypeScript compiler config; no exported symbols. |

### `public/manifest.json`
**Purpose**: PWA manifest for standalone installation, theme colors, and app icons.
**Depends on**: public icon assets

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | config | Web app manifest; no exported symbols. |

### `public/sw.js`
**Purpose**: Service worker implementing cache prefill, cache cleanup, and stale-while-revalidate behavior with network-first Firebase requests.
**Depends on**: public/manifest.json

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | service-worker | Registers install/activate/fetch handlers; no exported symbols. |

### `src/app/globals.css`
**Purpose**: Defines Tailwind theme variables, dark palette, typography defaults, animations, and utility classes used across the app.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| — | — | styles | Global stylesheet with theme tokens and animations; no exported symbols. |

### `src/app/layout.tsx`
**Purpose**: Root app layout that sets metadata, fonts, dark theme shell with a global blue ambient background (6 animated glow orbs), toaster placement, and service worker registration.
**Depends on**: src/components/ui/sonner.tsx, src/app/globals.css

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L18 | `metadata` | const | Next.js metadata object for app title, description, manifest, and Apple web app settings. |
| L37 | `viewport` | const | Next.js viewport config defining the browser theme color. |
| L41 | `RootLayout` | component | Root layout component receiving `children: React.ReactNode` and rendering the global shell. |

### `src/app/page.tsx`
**Purpose**: Dashboard page showing weekly and monthly study + exam summaries, charts, goals, recent logs, streaks, and revision suggestions.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/LogCard.tsx, src/components/SubjectChart.tsx, src/components/WeeklyCalendar.tsx, src/components/WeeklyBarChart.tsx, src/components/ExamCountdown.tsx, src/components/StreakBadge.tsx, src/components/GoalCard.tsx, src/components/RevisionSuggestions.tsx, src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/tabs.tsx, src/hooks/useAuth.ts, src/hooks/useStudyLogs.ts, src/hooks/useGoals.ts, src/lib/db.ts, src/lib/demo-data.ts, src/lib/notifications.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L28 | `StatCard` | component | Inner stat card component for icon + label + value summaries. |
| L55 | `DashboardPage` | component | Protected dashboard that aggregates study and exam logs into overview cards, charts, goals, and revision prompts. |

### `src/app/auth/login/page.tsx`
**Purpose**: Login page for email/password, Google OAuth, and demo-mode entry.
**Depends on**: src/lib/auth.ts, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L13 | `LoginPage` | component | Client login form that calls `login`, `loginWithGoogle`, or `loginDemo` and redirects on success. |

### `src/app/auth/register/page.tsx`
**Purpose**: Registration page for creating an email/password account with display name and username validation.
**Depends on**: src/lib/auth.ts, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/card.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L14 | `RegisterPage` | component | Registration form that validates password and username constraints before calling `register`. |

### `src/app/auth/setup-username/page.tsx`
**Purpose**: Completes profile creation for new Google-authenticated users by reserving a username.
**Depends on**: src/lib/auth.ts, src/lib/firebase.ts, src/lib/db.ts, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L15 | `SetupUsernamePage` | component | Username bootstrap page that checks auth state, ensures no profile exists yet, and calls `completeGoogleProfile`. |

### `src/app/log/page.tsx`
**Purpose**: Protected data-entry page that switches between study-log and exam-log forms.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/StudyLogForm.tsx, src/components/ExamLogForm.tsx, src/hooks/useAuth.ts, src/hooks/useStudyLogs.ts, src/lib/db.ts, src/components/ui/card.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L16 | `LogPage` | component | Protected entry page that saves standard study logs through the hook and exam logs directly through `addExamLog`. |

### `src/app/history/page.tsx`
**Purpose**: Protected history page with subject/tag/date filtering, edit/delete flows, and export actions.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/LogCard.tsx, src/components/StudyLogForm.tsx, src/hooks/useAuth.ts, src/hooks/useStudyLogs.ts, src/components/ui/card.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx, src/components/ui/select.tsx, src/components/ui/dialog.tsx, src/lib/subjects.ts, src/lib/export.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L32 | `HistoryPage` | component | Protected page that filters log history, opens an edit dialog, and exports filtered logs to CSV or PDF. |

### `src/app/friends/page.tsx`
**Purpose**: Protected social page for finding users by username, handling requests, comparing totals, and showing privacy-aware charts.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/Leaderboard.tsx, src/components/SubjectChart.tsx, src/hooks/useAuth.ts, src/hooks/useStudyLogs.ts, src/hooks/useFriends.ts, src/lib/db.ts, src/components/ui/card.tsx, src/components/ui/input.tsx, src/components/ui/button.tsx, src/components/ui/badge.tsx, src/components/ui/tabs.tsx, src/components/ui/avatar.tsx, src/lib/subjects.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L23 | `FriendsPage` | component | Protected page that manages friend requests and renders leaderboard and subject comparison views. |

### `src/app/goals/page.tsx`
**Purpose**: Protected goals page for creating, tracking, and deleting weekly or monthly targets.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/GoalCard.tsx, src/hooks/useAuth.ts, src/hooks/useGoals.ts, src/hooks/useStudyLogs.ts, src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/select.tsx, src/components/ui/dialog.tsx, src/lib/subjects.ts, src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L33 | `GoalsPage` | component | Protected page that computes current progress from logs and persists new goals through `useGoals`. |

### `src/middleware.ts`
**Purpose**: Next.js Edge middleware that guards protected routes by checking `session`, `client-session`, and `demo-mode` cookies and redirects unauthenticated users to `/landing`.
**Depends on**: None (Next.js request only)

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L5 | `middleware` | function | Checks auth cookies; redirects unauthenticated to `/landing`; redirects authenticated away from public paths (`/landing`, `/auth/login`, `/auth/register`). |
| L42 | `config` | const | Matcher config — applies to all routes except `_next/static`, `_next/image`, `favicon.ico`, `sw.js`, `manifest.json`. |

### `src/app/api/auth/session/route.ts`
**Purpose**: API route that creates (POST) and deletes (DELETE) Firebase session cookies using Firebase Admin SDK.
**Depends on**: src/lib/firebase-admin.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L4 | `POST` | function | Verifies Firebase `idToken`, creates 14-day `session` HttpOnly cookie via `adminAuth.createSessionCookie`. |
| L37 | `DELETE` | function | Deletes `session` and `client-session` cookies. |

### `src/app/api/auth/token/route.ts`
**Purpose**: API route that generates a Firebase Custom Token for the currently authenticated session user, used by the desktop companion app.
**Depends on**: src/lib/firebase-admin.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L5 | `POST` | function | Reads session cookie, verifies it via `adminAuth`, and returns a short-lived Firebase custom token for desktop app authentication. |

### `src/app/api/cron/reminders/route.ts`
**Purpose**: Cron endpoint for push notification reminders — currently disabled, returns `{ status: "disabled" }`.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L3 | `GET` | function | Returns disabled status; originally intended for scheduled reminder notifications. |

### `src/app/api/desktop/log/route.ts`
**Purpose**: Desktop companion API — POST endpoint to add a study log from the desktop app, authenticated with `DESKTOP_API_SECRET` bearer token.
**Depends on**: src/lib/firebase-admin.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L6 | `POST` | function | Validates `Bearer` token, writes study log to Firestore `studyLogs` collection with `source: "desktop_app"`. |

### `src/app/api/desktop/stats/route.ts`
**Purpose**: Desktop companion API — GET endpoint returning today's study minutes/questions for a given UID.
**Depends on**: src/lib/firebase-admin.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L7 | `GET` | function | Validates `Bearer` token, queries today's `studyLogs` by UID, returns `{ todayMinutes, todayQuestions, displayName }`. |

### `src/app/timer/page.tsx`
**Purpose**: Timer page — thin wrapper that renders `FocusTimer` inside `AuthGuard` + `Navbar`.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/FocusTimer.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L6 | `TimerPage` | component | Renders `<AuthGuard><Navbar /><FocusTimer /></AuthGuard>`. |

### `src/app/stats/page.tsx`
**Purpose**: Protected analytics page for topic breakdowns, efficiency charts, exam trend charts, and summary totals.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/TopicBreakdownChart.tsx, src/components/EfficiencyCard.tsx, src/components/ExamTrendChart.tsx, src/hooks/useAuth.ts, src/hooks/useStudyLogs.ts, src/lib/db.ts, src/components/ui/card.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L19 | `StatsPage` | component | Protected two-tab statistics page: study stats (topic breakdown, efficiency trend, summary) and exam stats (tam & branch exam analysis with `ExamTrendChart`). |

### `src/app/program/page.tsx`
**Purpose**: Protected weekly schedule page with a 7-day task grid for adding, completing, and deleting subject/topic study tasks and branch exam entries per day.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/hooks/useAuth.ts, src/hooks/useSchedule.ts, src/lib/db.ts, src/lib/subjects.ts, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/select.tsx, src/components/ui/dialog.tsx, src/components/ui/badge.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L560 | `ProgramPage` | component | Protected weekly planner page with week-navigation controls, progress bar, responsive 7-day desktop grid and mobile day-tabs, plus add/complete/delete task dialogs. |

### `src/app/topics/page.tsx`
**Purpose**: Protected page that embeds the full TopicTree component for curriculum progress tracking.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/TopicTree.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L7 | `TopicsPage` | component | Minimal page wrapper rendering `<AuthGuard><Navbar /><TopicTree /></AuthGuard>`. |

### `src/app/settings/page.tsx`
**Purpose**: Protected settings page for profile display name updates, privacy toggles, notification permission setup, and desktop companion token generation.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/hooks/useAuth.ts, src/lib/db.ts, src/components/ui/card.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/button.tsx, src/components/ui/badge.tsx, src/components/ui/switch.tsx, src/lib/notifications.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L18 | `PrivacyToggle` | component | Inner reusable toggle row for privacy setting switches. |
| L40 | `SettingsPage` | component | Protected settings screen that updates `displayName`, privacy flags, notification permissions, and generates desktop companion tokens via `/api/auth/token`. |

### `src/components/AuthGuard.tsx`
**Purpose**: Route guard wrapper that blocks unauthenticated access and redirects incomplete Google signups to username setup.
**Depends on**: src/hooks/useAuth.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L7 | `AuthGuard` | component | Guard component receiving `children` and redirecting based on auth/profile readiness. |

### `src/components/Navbar.tsx`
**Purpose**: Sticky top navigation bar with primary route links (Dashboard, Log, Timer, Program, History, Goals, Stats, Friends, Kazanımlar) and a user dropdown menu; also renders a mobile bottom tab bar.
**Depends on**: src/lib/utils.ts, src/hooks/useAuth.ts, src/lib/auth.ts, src/components/ui/button.tsx, src/components/ui/avatar.tsx, src/components/ui/dropdown-menu.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L19 | `navItems` | const | Array of 9 nav route configs (`href`, `label`, `mobileLabel`, `icon`). |
| L31 | `Navbar` | component | Navigation component with route highlighting, mobile bottom tab bar, and logout/settings actions. |

### `src/components/StudyLogForm.tsx`
**Purpose**: Form component for creating or editing normal study-session logs with subject/topic selection and optional tags.
**Depends on**: src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/textarea.tsx, src/components/ui/select.tsx, src/lib/subjects.ts, src/lib/db.ts, src/components/ui/badge.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L28 | `StudyLogForm` | component | Form component that submits `Omit<StudyLog, "id" | "uid" | "createdAt">` through an async callback. |

### `src/components/ExamLogForm.tsx`
**Purpose**: Form component for entering TYT/AYT full exams or branch exams with per-subject net support.
**Depends on**: src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/textarea.tsx, src/components/ui/select.tsx, src/lib/subjects.ts, src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L48 | `ExamLogForm` | component | Form component that submits `Omit<ExamLog, "id" | "uid" | "createdAt">` for full or branch exam entries. |

### `src/components/LogCard.tsx`
**Purpose**: Displays a study log summary with tags, expandable notes, and optional edit/delete actions.
**Depends on**: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/button.tsx, src/lib/subjects.ts, src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L19 | `LogCard` | component | Card component rendering a single `StudyLog` and optional action callbacks. |

### `src/components/SubjectChart.tsx`
**Purpose**: Donut chart for minutes or questions aggregated by subject.
**Depends on**: src/lib/subjects.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L68 | `SubjectChart` | component | Recharts-based pie chart receiving aggregated subject totals and an optional metric selector. |

### `src/components/WeeklyBarChart.tsx`
**Purpose**: Seven-day bar chart showing study minutes and question totals for the current week.
**Depends on**: src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L63 | `WeeklyBarChart` | component | Recharts bar chart receiving `logs: StudyLog[]` and aggregating them into Monday-Sunday totals. |

### `src/components/WeeklyCalendar.tsx`
**Purpose**: GitHub-style heatmap showing study intensity across recent weeks.
**Depends on**: src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L39 | `WeeklyCalendar` | component | Heatmap component that groups study minutes into colored daily intensity cells over configurable weeks. |

### `src/components/TopicBreakdownChart.tsx`
**Purpose**: Horizontal bar chart for per-topic minutes or questions within a selected subject.
**Depends on**: src/components/ui/select.tsx, src/lib/subjects.ts, src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L19 | `TopicBreakdownChart` | component | Chart component that derives topic totals from `logs` for one selected subject and metric. |

### `src/components/EfficiencyCard.tsx`
**Purpose**: Shows a twelve-week questions-per-minute trend line and latest trend delta.
**Depends on**: src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L14 | `EfficiencyCard` | component | Chart card that computes weekly efficiency from study logs and renders it as a line chart. |

### `src/components/Leaderboard.tsx`
**Purpose**: Privacy-aware ranking list comparing the current user against accepted friends.
**Depends on**: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/avatar.tsx, src/lib/subjects.ts, src/hooks/useFriends.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L28 | `Leaderboard` | component | Ranking component that sorts current user plus friends by minutes or questions and shows top subject dots. |

### `src/components/GoalCard.tsx`
**Purpose**: Presents a single goal’s current progress with a colored progress bar and optional delete action.
**Depends on**: src/components/ui/card.tsx, src/components/ui/button.tsx, src/lib/subjects.ts, src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L15 | `GoalCard` | component | Goal progress card receiving a `StudyGoal`, current value, and optional delete callback. |

### `src/components/RevisionSuggestions.tsx`
**Purpose**: Suggests topics that have not been studied recently using day-gap heuristics.
**Depends on**: src/components/ui/card.tsx, src/components/ui/badge.tsx, src/components/ui/button.tsx, src/lib/subjects.ts, src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L18 | `RevisionSuggestions` | component | Card component that uses `getLastStudiedByTopic` to highlight topics idle for three or more days. |

### `src/components/ExamCountdown.tsx`
**Purpose**: Live countdown card for the TYT and AYT exam dates.
**Depends on**: src/components/ui/card.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L40 | `ExamCountdown` | component | Countdown component that updates every second and shows remaining days, hours, minutes, and seconds. |

### `src/components/StreakBadge.tsx`
**Purpose**: Displays the current and longest study streak based on unique study dates.
**Depends on**: src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L12 | `StreakBadge` | component | Badge component that derives current and longest streak lengths from `logs: StudyLog[]`. |
| L58 | `calcLongest` | function | Iterates sorted date set, counts max consecutive days (1-day diff). |

### `src/components/ExamTrendChart.tsx`
**Purpose**: Recharts LineChart showing total net score progression over time for TYT or AYT full exams.
**Depends on**: src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L11 | `ExamTrendChartProps` | interface | `{ exams: ExamLog[], type: "tyt" \| "ayt" }` |
| L15 | `ExamTrendChart` | component | Memoized; filters to `examCategory === "tam"` for given type; Y-axis max 120 (TYT) or 80 (AYT). |

### `src/components/FocusTimer.tsx`
**Purpose**: Full-featured focus timer with YKS branch timings (TYT/AYT subjects), three-phase system (focus/warning/danger), animated glow orbs, persistent server-synced timer sessions via Firestore, and post-session exam log-saving dialog.
**Depends on**: src/hooks/useAuth.ts, src/lib/db.ts, src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L41 | `BranchTiming` | interface | `{ label, idealSeconds, warningSeconds }` — timing config per YKS branch. |
| L47 | `BRANCH_TIMINGS` | const | 11-entry map of branch keys → `BranchTiming` (e.g. `tyt_matematik: { idealSeconds: 75*60, warningSeconds: 55*60 }`). |
| L61 | `Phase` | type | `"focus" \| "warning" \| "danger"` — timer phase enum. |
| L63 | `DANGER_THRESHOLD_RATIO` | const | `1.15` — danger starts at 115% of ideal time. |
| L65 | `getDangerSeconds` | function | `timing.idealSeconds * DANGER_THRESHOLD_RATIO`. |
| L69 | `getPhase` | function | Returns `Phase` based on elapsed vs. warning/danger thresholds. |
| L75 | `getPhaseProgress` | function | Returns 0–1 progress fraction within current phase. |
| L86 | `PHASE_COLORS` | const | Phase → `{ hue, chroma, name }` in oklch color space (cyan/yellow/orange). |
| L92 | `formatTime` | function | Formats seconds as `MM:SS` or `HH:MM:SS`. |
| L101 | `computeElapsed` | function | Computes current elapsed seconds from a `TimerSession`’s `startedAt` timestamp and accumulated total. |
| L116 | `GlowOrb` | component | Animated background orb with phase-based oklch color and size randomization. |
| L269 | `FocusTimer` | component | Full timer component; subscribes to server-synced `TimerSession` via Firestore real-time listener; saves branch exam log via `addExamLog`. |

### `src/components/TopicTree.tsx`
**Purpose**: Full curriculum progress tracker with TYT/AYT subject grids, per-topic completion state, per-topic study-log stats, schedule task overlays, and quick-add task dialogs.
**Depends on**: src/hooks/useTopicProgress.ts, src/hooks/useStudyLogs.ts, src/hooks/useAuth.ts, src/lib/db.ts, src/lib/subjects.ts, src/components/ui/button.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/dialog.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L43 | `hexToHue` | function | Converts a CSS hex color string to an approximate oklch hue angle for glassmorphic glows. |
| L81 | `SubjectCard` | component | Grid tile showing subject progress bar, completion count, and branch exam count; opens the detail panel on click. |
| L155 | `SubjectPanel` | component | Slide-in right panel showing topic list with completion toggles, per-topic time/question stats, task info badges, and quick-add buttons. |
| L404 | `SummaryBanner` | component | Banner displaying total/completed topic count and an overall progress bar. |
| L448 | `QuickAddTaskDialog` | component | Modal dialog for quickly adding a schedule task for a specific topic with optional target questions/minutes and date. |
| L553 | `TopicTree` | component | Main export; manages TYT/AYT tab, open subject panel, schedule items, exam logs, and topic stats aggregation. |

### `src/components/ui/avatar.tsx`
**Purpose**: Avatar primitive wrappers and grouped avatar helpers built on Radix UI.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L8 | `Avatar` | component | Root avatar wrapper with `size` variants and shared slot metadata. |
| L28 | `AvatarImage` | component | Avatar image wrapper around `AvatarPrimitive.Image`. |
| L44 | `AvatarFallback` | component | Fallback text/avatar content wrapper for missing images. |
| L60 | `AvatarBadge` | component | Small positioned badge helper for status or icon overlays. |
| L76 | `AvatarGroup` | component | Container for overlapping grouped avatars. |
| L89 | `AvatarGroupCount` | component | Counter bubble used with grouped avatars. |

### `src/components/ui/badge.tsx`
**Purpose**: Small badge primitive with multiple visual variants.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L7 | `badgeVariants` | const | CVA variant map controlling badge styles such as default, secondary, destructive, and outline. |
| L30 | `Badge` | component | Badge wrapper supporting variant selection and optional slot rendering. |

### `src/components/ui/button.tsx`
**Purpose**: Button primitive with size and variant system for buttons and as-child links.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L7 | `buttonVariants` | const | CVA variant map defining button visual styles and sizes. |
| L44 | `Button` | component | Button wrapper supporting variants, sizes, and slot-based composition. |

### `src/components/ui/card.tsx`
**Purpose**: Card layout primitives used throughout the dashboard, forms, and summaries.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L5 | `Card` | component | Root card container with size variants and shared padding conventions. |
| L23 | `CardHeader` | component | Header wrapper for card title and action layouts. |
| L36 | `CardTitle` | component | Typography wrapper for card titles. |
| L49 | `CardDescription` | component | Muted descriptive text wrapper for cards. |
| L59 | `CardAction` | component | Action-area wrapper aligned to the card header edge. |
| L72 | `CardContent` | component | Main content wrapper for card bodies. |
| L82 | `CardFooter` | component | Footer wrapper with top border and muted background. |

### `src/components/ui/dialog.tsx`
**Purpose**: Dialog primitive wrappers for modal overlays, content, and header/footer composition.
**Depends on**: src/lib/utils.ts, src/components/ui/button.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L10 | `Dialog` | component | Root Radix dialog wrapper. |
| L16 | `DialogTrigger` | component | Trigger wrapper for opening dialogs. |
| L22 | `DialogPortal` | component | Portal wrapper for rendering dialog content outside normal flow. |
| L28 | `DialogClose` | component | Close primitive wrapper. |
| L34 | `DialogOverlay` | component | Full-screen overlay with blur and enter/exit animation classes. |
| L50 | `DialogContent` | component | Main modal panel wrapper with optional close button. |
| L88 | `DialogHeader` | component | Header wrapper for dialog title/description stacks. |
| L98 | `DialogFooter` | component | Footer wrapper for action rows and optional close button. |
| L125 | `DialogTitle` | component | Title wrapper around `DialogPrimitive.Title`. |
| L141 | `DialogDescription` | component | Description wrapper around `DialogPrimitive.Description`. |

### `src/components/ui/dropdown-menu.tsx`
**Purpose**: Dropdown-menu primitives for menus, groups, labels, items, submenus, and selection controls.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L9 | `DropdownMenu` | component | Root dropdown-menu wrapper. |
| L15 | `DropdownMenuPortal` | component | Portal wrapper for dropdown content. |
| L23 | `DropdownMenuTrigger` | component | Trigger wrapper for opening dropdown menus. |
| L34 | `DropdownMenuContent` | component | Dropdown content panel with side/align handling and animations. |
| L53 | `DropdownMenuGroup` | component | Group wrapper for related menu items. |
| L61 | `DropdownMenuItem` | component | Standard menu item wrapper with destructive and inset support. |
| L84 | `DropdownMenuCheckboxItem` | component | Checkbox item wrapper with built-in check indicator. |
| L118 | `DropdownMenuRadioGroup` | component | Radio-group container for mutually exclusive menu items. |
| L129 | `DropdownMenuRadioItem` | component | Radio item wrapper with indicator support. |
| L161 | `DropdownMenuLabel` | component | Label wrapper for menu sections. |
| L181 | `DropdownMenuSeparator` | component | Separator line between menu groups. |
| L194 | `DropdownMenuShortcut` | component | Right-aligned shortcut label span for menu items. |
| L210 | `DropdownMenuSub` | component | Root wrapper for nested dropdown submenus. |
| L216 | `DropdownMenuSubTrigger` | component | Trigger item for opening submenu content. |
| L240 | `DropdownMenuSubContent` | component | Nested submenu content panel. |

### `src/components/ui/input.tsx`
**Purpose**: Shared input primitive with app-wide border, focus, and disabled styling.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L5 | `Input` | component | Styled text input wrapper that forwards native input props. |

### `src/components/ui/label.tsx`
**Purpose**: Shared label primitive for form controls.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L8 | `Label` | component | Styled form label wrapper around Radix `LabelPrimitive.Root`. |

### `src/components/ui/select.tsx`
**Purpose**: Select-menu primitive wrappers for triggers, content, items, labels, and scroll buttons.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L9 | `Select` | component | Root select wrapper around Radix select state. |
| L15 | `SelectGroup` | component | Group wrapper for select option sections. |
| L28 | `SelectValue` | component | Value display wrapper for the current selection. |
| L34 | `SelectTrigger` | component | Trigger button for opening the select menu. |
| L60 | `SelectContent` | component | Select popover wrapper with viewport sizing and animations. |
| L93 | `SelectLabel` | component | Label wrapper for grouped select sections. |
| L106 | `SelectItem` | component | Single selectable option row with check indicator. |
| L130 | `SelectSeparator` | component | Visual separator between option groups. |
| L143 | `SelectScrollUpButton` | component | Scroll control for overflowing select menus. |
| L162 | `SelectScrollDownButton` | component | Downward scroll control for overflowing select menus. |

### `src/components/ui/sonner.tsx`
**Purpose**: Themed toast provider wrapper with custom lucide icons.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L7 | `Toaster` | component | Sonner wrapper that binds theme values and default toast iconography. |

### `src/components/ui/switch.tsx`
**Purpose**: Shared boolean toggle primitive with size variants.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L8 | `Switch` | component | Styled switch wrapper around Radix `SwitchPrimitive.Root`. |

### `src/components/ui/tabs.tsx`
**Purpose**: Tabs primitive wrappers with default and line variants.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L9 | `Tabs` | component | Root tabs wrapper that handles orientation styling. |
| L27 | `tabsListVariants` | const | CVA variant map for tabs list presentation. |
| L42 | `TabsList` | component | Tabs list wrapper supporting visual variant selection. |
| L58 | `TabsTrigger` | component | Individual tab trigger wrapper with active-state styling. |
| L77 | `TabsContent` | component | Content panel wrapper for tab bodies. |

### `src/components/ui/textarea.tsx`
**Purpose**: Shared textarea primitive with app-wide styling.
**Depends on**: src/lib/utils.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L5 | `Textarea` | component | Styled textarea wrapper that forwards native textarea props. |

### `src/hooks/useAuth.ts`
**Purpose**: Central auth-state hook that supports Firebase auth and local demo mode.
**Depends on**: src/lib/firebase.ts, src/lib/db.ts, src/lib/demo-data.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L15 | `useAuth` | hook | Returns `{ user, profile, loading }` by listening to Firebase auth state or demo-mode local storage. |

### `src/hooks/useFriends.ts`
**Purpose**: Fetches accepted friendships and incoming requests, then enriches each friend with profile, logs, and aggregated stats.
**Depends on**: src/lib/db.ts, src/lib/demo-data.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L18 | `FriendData` | interface | Shape for enriched friend records including profile, friendship metadata, logs, and aggregate stats. |
| L40 | `useFriends` | hook | Returns friends, pending requests, loading state, and friend-request mutation helpers for a given `uid`. |

### `src/hooks/useGoals.ts`
**Purpose**: Encapsulates goal retrieval and mutations for one user.
**Depends on**: src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L14 | `useGoals` | hook | Returns goals, loading state, refresh, add, and remove actions for a user ID. |

### `src/hooks/useSchedule.ts`
**Purpose**: Hook for managing weekly schedule items: fetching, adding, completing, and removing tasks for one user and week.
**Depends on**: src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L12 | `useSchedule` | hook | Returns `{ items, loading, add, complete, remove, reload }` for a given `uid` and `weekStart` date string. |

### `src/hooks/useStudyLogs.ts`
**Purpose**: Encapsulates study-log retrieval, mutations, demo mode, and offline queue synchronization.
**Depends on**: src/lib/db.ts, src/lib/demo-data.ts, src/lib/offlineQueue.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L18 | `useStudyLogs` | hook | Returns logs, loading state, refresh, add, update, and remove actions with demo/offline handling. |

### `src/hooks/useTopicProgress.ts`
**Purpose**: Hook for reading and toggling topic completion state, and computing per-subject and overall curriculum progress.
**Depends on**: src/lib/db.ts, src/lib/demo-data.ts, src/hooks/useAuth.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L8 | `useTopicProgress` | hook | Returns `{ progress, loading, toggleTopic, isCompleted, getSubjectCompletedCount, getTotalStats }` for the signed-in user. |

### `src/lib/firebase.ts`
**Purpose**: Initializes Firebase app, auth, and Firestore only in the browser and tolerates missing env config.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L31 | `auth` | const | Browser-initialized Firebase Auth instance. |
| L33 | `db` | const | Browser-initialized Firestore instance. |
| L34 | `app` | const | Default-exported Firebase app instance, or `undefined` if initialization is skipped. |

### `src/lib/auth.ts`
**Purpose**: Authentication service functions for registration, login, logout, Google OAuth, and profile completion.
**Depends on**: src/lib/firebase.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L13 | `register` | function | Creates an email/password user, validates username uniqueness, writes user and username documents, and returns `Promise<User>`. |
| L49 | `login` | function | Signs in with email/password and returns the authenticated `User`. |
| L54 | `loginDemo` | function | Enables demo mode in local storage without hitting Firebase. |
| L60 | `logout` | function | Clears demo mode and signs the Firebase session out when auth exists. |
| L70 | `loginWithGoogle` | function | Starts Google popup auth and returns `{ user, isNew }` based on profile existence. |
| L83 | `completeGoogleProfile` | function | Reserves a username and creates the missing user profile for a Google-authenticated user. |

### `src/lib/db.ts`
**Purpose**: Central Firestore data-access layer; exports all type interfaces and CRUD helpers.
**Depends on**: src/lib/firebase.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L22 | `stripUndefined` | function | Recursively removes undefined values from an object before Firestore writes. |
| L28 | `StudyLog` | interface | Core study-log model with subject, topic, minutes, date, optional notes and net-new fields. |
| L41 | `StudyGoal` | interface | Weekly minute target per subject with progress tracking fields. |
| L49 | `UserProfile` | interface | User profile model including username, FCM token, exam date, branch, and privacy flag. |
| L65 | `Friendship` | interface | Friend-request model with sender/receiver UIDs and accepted status. |
| L75 | `addStudyLog` | function | Adds a new study log to a user's `studyLogs` subcollection; queues offline if no connection. |
| L87 | `updateStudyLog` | function | Overwrites an existing study log document (merges fields). |
| L94 | `deleteStudyLog` | function | Deletes one study log document by ID. |
| L98 | `getUserStudyLogs` | function | Fetches all study logs for a given user, ordered by date descending. |
| L114 | `getFriendStudyLogs` | function | Fetches study logs for a list of friend UIDs in a date range. |
| L126 | `getUserProfile` | function | Fetches the profile document for a given UID. |
| L131 | `updateUserProfile` | function | Merges new fields into a user's profile document. |
| L138 | `getUserByUsername` | function | Queries Firestore for a user with matching username (case-insensitive). |
| L152 | `sendFriendRequest` | function | Creates a pending Friendship document between two users. |
| L162 | `acceptFriendRequest` | function | Sets the `accepted` flag on an existing Friendship document to true. |
| L167 | `removeFriend` | function | Deletes a Friendship document by ID. |
| L172 | `getFriendships` | function | Fetches all Friendship documents where the given user is sender or receiver. |
| L187 | `ExamLog` | interface | Exam/mock-test log model with subject, branch, correct/wrong/empty counts, and duration. |
| L204 | `addExamLog` | function | Adds an exam log document to a user's `examLogs` subcollection. |
| L216 | `deleteExamLog` | function | Deletes one exam log document by ID. |
| L220 | `getUserExamLogs` | function | Fetches all exam logs for a given user, ordered by date descending. |
| L229 | `aggregateBySubject` | function | Aggregates study logs by subject, summing total minutes per subject. |
| L239 | `aggregateByTopic` | function | Aggregates study logs by topic within a subject, summing minutes per topic. |
| L250 | `getLastStudiedByTopic` | function | Returns the latest study date for every topic studied by the user. |
| L264 | `calculateSM2Intervals` | function | Implements SM-2 spaced-repetition algorithm; returns next review date and updated e-factor. |
| L314 | `getGoals` | function | Fetches all weekly goal documents for a user. |
| L320 | `setGoal` | function | Creates or merges a weekly goal for a subject. |
| L328 | `deleteGoal` | function | Deletes one goal document from a user's goals subcollection. |
| L334 | `TopicProgress` | interface | `{ completed: string[] }` - per-subject completed topic list. |
| L339 | `getTopicProgress` | function | Fetches completed topic lists for all subjects keyed by subject ID. |
| L349 | `setTopicCompleted` | function | Atomically marks or unmarks a topic as completed using `arrayUnion`/`arrayRemove`. |
| L365 | `ScheduleItem` | interface | Weekly schedule task model with subject, topic/branch, date, week start, targets, status, and actuals. |
| L381 | `getScheduleItems` | function | Fetches schedule items for one user filtered by `weekStart`. |
| L391 | `getAllScheduleItems` | function | Fetches all schedule items across all weeks for one user. |
| L397 | `addScheduleItem` | function | Adds a new schedule task and returns the document ID. |
| L408 | `completeScheduleItem` | function | Marks a schedule item as done and records actual questions/minutes. |
| L420 | `deleteScheduleItem` | function | Deletes a schedule item document. |
| L428 | `TimerSession` | interface | Real-time timer session model tracking branch key, running/paused status, start timestamp, and accumulated seconds. |
| L440 | `subscribeTimerSession` | function | Subscribes to the user's active `TimerSession` document in real time via `onSnapshot`. |
| L452 | `startTimer` | function | Creates or overwrites a `timerSessions/{uid}` document to start/resume a timer run. |
| L469 | `pauseTimer` | function | Updates the timer session to paused state, persisting current elapsed seconds. |
| L480 | `resetTimer` | function | Deletes the timer session document (after save or reset). |

### `src/lib/demo-data.ts`
**Purpose**: Provides demo-only profile, study-log, and friend datasets for local exploration without Firebase.
**Depends on**: src/lib/db.ts, src/hooks/useFriends.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L6 | `DEMO_UID` | const | Stable user ID used to activate demo mode across hooks. |
| L8 | `DEMO_PROFILE` | const | Demo user profile returned by `useAuth` in demo mode. |
| L53 | `DEMO_LOGS` | const | Seeded study-log dataset spanning recent days and subjects. |
| L229 | `DEMO_FRIENDS` | const | Seeded enriched friend dataset sorted by total study minutes. |

### `src/lib/export.ts`
**Purpose**: Handles CSV and PDF export for study-log history.
**Depends on**: src/lib/db.ts, src/lib/subjects.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L4 | `logsToCSV` | function | Serializes study logs into a UTF-8 BOM CSV and triggers download in the browser. |
| L18 | `logsToPDF` | function | Dynamically loads jsPDF libraries, renders a landscape report table, and downloads the PDF. |

### `src/lib/notifications.ts`
**Purpose**: Browser notification helpers and reminder heuristics.
**Depends on**: src/lib/firebase.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L4 | `requestNotificationPermission` | function | Requests Web Notification permission and resolves whether it was granted. |
| L11 | `sendLocalNotification` | function | Displays a browser notification when permission is granted. |
| L23 | `saveFCMToken` | function | Stores a notification token under `users/{uid}/tokens/{token}`. |
| L35 | `checkStudyReminder` | function | Returns `true` when the last study date is missing or more than roughly 20 hours old. |
| L46 | `checkStreakWarning` | function | Returns `true` when the user studied yesterday but not today, indicating streak risk. |

### `src/lib/offlineQueue.ts`
**Purpose**: IndexedDB-backed offline queue for pending study logs and later synchronization.
**Depends on**: src/lib/db.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L17 | `PendingLog` | interface | Shape of queued offline log entries containing `uid` and log payload data. |
| L31 | `queueOfflineLog` | function | Adds a pending log entry to the IndexedDB queue. |
| L41 | `syncOfflineLogs` | function | Replays queued logs through `addStudyLog` until one fails and returns the synced count. |
| L71 | `getPendingCount` | function | Counts queued offline log entries in IndexedDB. |

### `src/lib/subjects.ts`
**Purpose**: Canonical subject catalog for TYT and AYT with labels, colors, and topic lists.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L1 | `Subject` | interface | Describes subject metadata with ID, label, color, exam type, and topic list. |
| L9 | `SUBJECTS` | const | Master array of TYT and AYT subjects with topic catalogs. |
| L324 | `SUBJECT_MAP` | const | Object map from subject ID to `Subject`. |
| L325 | `SUBJECT_COLORS` | const | Object map from subject ID to its display color. |

### `src/lib/utils.ts`
**Purpose**: Shared utility helpers.
**Depends on**: None

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L4 | `cn` | function | Merges conditional class values with Tailwind-aware conflict resolution. |

## Function/Symbol Index
Alphabetical cross-reference of every symbol with its file location.

| Symbol | Type | File | Line |
|--------|------|------|------|
| `acceptFriendRequest` | function | `src/lib/db.ts` | L162 |
| `addExamLog` | function | `src/lib/db.ts` | L204 |
| `addScheduleItem` | function | `src/lib/db.ts` | L397 |
| `addStudyLog` | function | `src/lib/db.ts` | L75 |
| `adminAuth` | const | `src/lib/firebase-admin.ts` | L25 |
| `adminDb` | const | `src/lib/firebase-admin.ts` | L24 |
| `adminMessaging` | const | `src/lib/firebase-admin.ts` | L26 |
| `aggregateBySubject` | function | `src/lib/db.ts` | L229 |
| `aggregateByTopic` | function | `src/lib/db.ts` | L239 |
| `app` | const | `src/lib/firebase.ts` | L34 |
| `auth` | const | `src/lib/firebase.ts` | L31 |
| `AuthGuard` | component | `src/components/AuthGuard.tsx` | L7 |
| `Avatar` | component | `src/components/ui/avatar.tsx` | L8 |
| `AvatarBadge` | component | `src/components/ui/avatar.tsx` | L60 |
| `AvatarFallback` | component | `src/components/ui/avatar.tsx` | L44 |
| `AvatarGroup` | component | `src/components/ui/avatar.tsx` | L76 |
| `AvatarGroupCount` | component | `src/components/ui/avatar.tsx` | L89 |
| `AvatarImage` | component | `src/components/ui/avatar.tsx` | L28 |
| `Badge` | component | `src/components/ui/badge.tsx` | L30 |
| `badgeVariants` | const | `src/components/ui/badge.tsx` | L7 |
| `BRANCH_TIMINGS` | const | `src/components/FocusTimer.tsx` | L47 |
| `BranchTiming` | interface | `src/components/FocusTimer.tsx` | L41 |
| `Button` | component | `src/components/ui/button.tsx` | L44 |
| `buttonVariants` | const | `src/components/ui/button.tsx` | L7 |
| `calcLongest` | function | `src/components/StreakBadge.tsx` | L58 |
| `calculateSM2Intervals` | function | `src/lib/db.ts` | L264 |
| `Card` | component | `src/components/ui/card.tsx` | L5 |
| `CardAction` | component | `src/components/ui/card.tsx` | L59 |
| `CardContent` | component | `src/components/ui/card.tsx` | L72 |
| `CardDescription` | component | `src/components/ui/card.tsx` | L49 |
| `CardFooter` | component | `src/components/ui/card.tsx` | L82 |
| `CardHeader` | component | `src/components/ui/card.tsx` | L23 |
| `CardTitle` | component | `src/components/ui/card.tsx` | L36 |
| `checkStudyReminder` | function | `src/lib/notifications.ts` | L35 |
| `checkStreakWarning` | function | `src/lib/notifications.ts` | L46 |
| `cn` | function | `src/lib/utils.ts` | L4 |
| `completeGoogleProfile` | function | `src/lib/auth.ts` | L83 |
| `completeScheduleItem` | function | `src/lib/db.ts` | L408 |
| `computeElapsed` | function | `src/components/FocusTimer.tsx` | L101 |
| `DANGER_THRESHOLD_RATIO` | const | `src/components/FocusTimer.tsx` | L63 |
| `DashboardPage` | component | `src/app/page.tsx` | L55 |
| `db` | const | `src/lib/firebase.ts` | L33 |
| `deleteExamLog` | function | `src/lib/db.ts` | L216 |
| `deleteGoal` | function | `src/lib/db.ts` | L328 |
| `deleteScheduleItem` | function | `src/lib/db.ts` | L420 |
| `deleteStudyLog` | function | `src/lib/db.ts` | L94 |
| `DEMO_FRIENDS` | const | `src/lib/demo-data.ts` | L229 |
| `DEMO_LOGS` | const | `src/lib/demo-data.ts` | L53 |
| `DEMO_PROFILE` | const | `src/lib/demo-data.ts` | L8 |
| `DEMO_UID` | const | `src/lib/demo-data.ts` | L6 |
| `Dialog` | component | `src/components/ui/dialog.tsx` | L10 |
| `DialogClose` | component | `src/components/ui/dialog.tsx` | L28 |
| `DialogContent` | component | `src/components/ui/dialog.tsx` | L50 |
| `DialogDescription` | component | `src/components/ui/dialog.tsx` | L141 |
| `DialogFooter` | component | `src/components/ui/dialog.tsx` | L98 |
| `DialogHeader` | component | `src/components/ui/dialog.tsx` | L88 |
| `DialogOverlay` | component | `src/components/ui/dialog.tsx` | L34 |
| `DialogPortal` | component | `src/components/ui/dialog.tsx` | L22 |
| `DialogTitle` | component | `src/components/ui/dialog.tsx` | L125 |
| `DialogTrigger` | component | `src/components/ui/dialog.tsx` | L16 |
| `DropdownMenu` | component | `src/components/ui/dropdown-menu.tsx` | L9 |
| `DropdownMenuCheckboxItem` | component | `src/components/ui/dropdown-menu.tsx` | L84 |
| `DropdownMenuContent` | component | `src/components/ui/dropdown-menu.tsx` | L34 |
| `DropdownMenuGroup` | component | `src/components/ui/dropdown-menu.tsx` | L53 |
| `DropdownMenuItem` | component | `src/components/ui/dropdown-menu.tsx` | L61 |
| `DropdownMenuLabel` | component | `src/components/ui/dropdown-menu.tsx` | L161 |
| `DropdownMenuPortal` | component | `src/components/ui/dropdown-menu.tsx` | L15 |
| `DropdownMenuRadioGroup` | component | `src/components/ui/dropdown-menu.tsx` | L118 |
| `DropdownMenuRadioItem` | component | `src/components/ui/dropdown-menu.tsx` | L129 |
| `DropdownMenuSeparator` | component | `src/components/ui/dropdown-menu.tsx` | L181 |
| `DropdownMenuShortcut` | component | `src/components/ui/dropdown-menu.tsx` | L194 |
| `DropdownMenuSub` | component | `src/components/ui/dropdown-menu.tsx` | L210 |
| `DropdownMenuSubContent` | component | `src/components/ui/dropdown-menu.tsx` | L240 |
| `DropdownMenuSubTrigger` | component | `src/components/ui/dropdown-menu.tsx` | L216 |
| `DropdownMenuTrigger` | component | `src/components/ui/dropdown-menu.tsx` | L23 |
| `EfficiencyCard` | component | `src/components/EfficiencyCard.tsx` | L14 |
| `eslintConfig` | const | `eslint.config.mjs` | L5 |
| `ExamCountdown` | component | `src/components/ExamCountdown.tsx` | L40 |
| `ExamLog` | interface | `src/lib/db.ts` | L187 |
| `ExamLogForm` | component | `src/components/ExamLogForm.tsx` | L48 |
| `ExamTrendChart` | component | `src/components/ExamTrendChart.tsx` | L15 |
| `ExamTrendChartProps` | interface | `src/components/ExamTrendChart.tsx` | L11 |
| `FocusTimer` | component | `src/components/FocusTimer.tsx` | L269 |
| `formatTime` | function | `src/components/FocusTimer.tsx` | L92 |
| `FriendData` | interface | `src/hooks/useFriends.ts` | L18 |
| `Friendship` | interface | `src/lib/db.ts` | L65 |
| `FriendsPage` | component | `src/app/friends/page.tsx` | L23 |
| `getAllScheduleItems` | function | `src/lib/db.ts` | L391 |
| `getDangerSeconds` | function | `src/components/FocusTimer.tsx` | L65 |
| `getFriendships` | function | `src/lib/db.ts` | L172 |
| `getFriendStudyLogs` | function | `src/lib/db.ts` | L114 |
| `getGoals` | function | `src/lib/db.ts` | L314 |
| `getLastStudiedByTopic` | function | `src/lib/db.ts` | L250 |
| `getPendingCount` | function | `src/lib/offlineQueue.ts` | L71 |
| `getPhase` | function | `src/components/FocusTimer.tsx` | L69 |
| `getPhaseProgress` | function | `src/components/FocusTimer.tsx` | L75 |
| `getScheduleItems` | function | `src/lib/db.ts` | L381 |
| `getTopicProgress` | function | `src/lib/db.ts` | L339 |
| `getUserByUsername` | function | `src/lib/db.ts` | L138 |
| `getUserExamLogs` | function | `src/lib/db.ts` | L220 |
| `getUserProfile` | function | `src/lib/db.ts` | L126 |
| `getUserStudyLogs` | function | `src/lib/db.ts` | L98 |
| `GlowOrb` | component | `src/components/FocusTimer.tsx` | L116 |
| `GoalCard` | component | `src/components/GoalCard.tsx` | L15 |
| `GoalsPage` | component | `src/app/goals/page.tsx` | L33 |
| `hexToHue` | function | `src/components/TopicTree.tsx` | L43 |
| `HistoryPage` | component | `src/app/history/page.tsx` | L32 |
| `Input` | component | `src/components/ui/input.tsx` | L5 |
| `isFirebaseAdminConfigured` | const | `src/lib/firebase-admin.ts` | L6 |
| `Label` | component | `src/components/ui/label.tsx` | L8 |
| `Leaderboard` | component | `src/components/Leaderboard.tsx` | L28 |
| `login` | function | `src/lib/auth.ts` | L49 |
| `LoginPage` | component | `src/app/auth/login/page.tsx` | L13 |
| `loginDemo` | function | `src/lib/auth.ts` | L54 |
| `loginWithGoogle` | function | `src/lib/auth.ts` | L70 |
| `LogCard` | component | `src/components/LogCard.tsx` | L19 |
| `logsToCSV` | function | `src/lib/export.ts` | L4 |
| `logsToPDF` | function | `src/lib/export.ts` | L18 |
| `logout` | function | `src/lib/auth.ts` | L60 |
| `LogPage` | component | `src/app/log/page.tsx` | L16 |
| `metadata` | const | `src/app/layout.tsx` | L18 |
| `middleware` | function | `src/middleware.ts` | L5 |
| `Navbar` | component | `src/components/Navbar.tsx` | L31 |
| `navItems` | const | `src/components/Navbar.tsx` | L19 |
| `nextConfig` | const | `next.config.ts` | L3 |
| `pauseTimer` | function | `src/lib/db.ts` | L469 |
| `PendingLog` | interface | `src/lib/offlineQueue.ts` | L17 |
| `PHASE_COLORS` | const | `src/components/FocusTimer.tsx` | L86 |
| `Phase` | type | `src/components/FocusTimer.tsx` | L61 |
| `POST` | function | `src/app/api/auth/token/route.ts` | L5 |
| `PrivacyToggle` | component | `src/app/settings/page.tsx` | L18 |
| `ProgramPage` | component | `src/app/program/page.tsx` | L560 |
| `QuickAddTaskDialog` | component | `src/components/TopicTree.tsx` | L448 |
| `queueOfflineLog` | function | `src/lib/offlineQueue.ts` | L31 |
| `register` | function | `src/lib/auth.ts` | L13 |
| `RegisterPage` | component | `src/app/auth/register/page.tsx` | L14 |
| `removeFriend` | function | `src/lib/db.ts` | L167 |
| `requestNotificationPermission` | function | `src/lib/notifications.ts` | L4 |
| `resetTimer` | function | `src/lib/db.ts` | L480 |
| `RevisionSuggestions` | component | `src/components/RevisionSuggestions.tsx` | L18 |
| `RootLayout` | component | `src/app/layout.tsx` | L41 |
| `saveFCMToken` | function | `src/lib/notifications.ts` | L23 |
| `ScheduleItem` | interface | `src/lib/db.ts` | L365 |
| `Select` | component | `src/components/ui/select.tsx` | L9 |
| `SelectContent` | component | `src/components/ui/select.tsx` | L60 |
| `SelectGroup` | component | `src/components/ui/select.tsx` | L15 |
| `SelectItem` | component | `src/components/ui/select.tsx` | L106 |
| `SelectLabel` | component | `src/components/ui/select.tsx` | L93 |
| `SelectScrollDownButton` | component | `src/components/ui/select.tsx` | L162 |
| `SelectScrollUpButton` | component | `src/components/ui/select.tsx` | L143 |
| `SelectSeparator` | component | `src/components/ui/select.tsx` | L130 |
| `SelectTrigger` | component | `src/components/ui/select.tsx` | L34 |
| `SelectValue` | component | `src/components/ui/select.tsx` | L28 |
| `sendFriendRequest` | function | `src/lib/db.ts` | L152 |
| `sendLocalNotification` | function | `src/lib/notifications.ts` | L11 |
| `setGoal` | function | `src/lib/db.ts` | L320 |
| `setTopicCompleted` | function | `src/lib/db.ts` | L349 |
| `SettingsPage` | component | `src/app/settings/page.tsx` | L40 |
| `SetupUsernamePage` | component | `src/app/auth/setup-username/page.tsx` | L15 |
| `startTimer` | function | `src/lib/db.ts` | L452 |
| `StatCard` | component | `src/app/page.tsx` | L28 |
| `StatsPage` | component | `src/app/stats/page.tsx` | L19 |
| `StreakBadge` | component | `src/components/StreakBadge.tsx` | L12 |
| `stripUndefined` | function | `src/lib/db.ts` | L22 |
| `StudyGoal` | interface | `src/lib/db.ts` | L41 |
| `StudyLog` | interface | `src/lib/db.ts` | L28 |
| `StudyLogForm` | component | `src/components/StudyLogForm.tsx` | L28 |
| `Subject` | interface | `src/lib/subjects.ts` | L1 |
| `SubjectCard` | component | `src/components/TopicTree.tsx` | L81 |
| `SubjectChart` | component | `src/components/SubjectChart.tsx` | L68 |
| `SubjectPanel` | component | `src/components/TopicTree.tsx` | L155 |
| `SUBJECT_COLORS` | const | `src/lib/subjects.ts` | L325 |
| `SUBJECT_MAP` | const | `src/lib/subjects.ts` | L324 |
| `SUBJECTS` | const | `src/lib/subjects.ts` | L9 |
| `subscribeTimerSession` | function | `src/lib/db.ts` | L440 |
| `SummaryBanner` | component | `src/components/TopicTree.tsx` | L404 |
| `Switch` | component | `src/components/ui/switch.tsx` | L8 |
| `syncOfflineLogs` | function | `src/lib/offlineQueue.ts` | L41 |
| `Tabs` | component | `src/components/ui/tabs.tsx` | L9 |
| `TabsContent` | component | `src/components/ui/tabs.tsx` | L77 |
| `TabsList` | component | `src/components/ui/tabs.tsx` | L42 |
| `TabsTrigger` | component | `src/components/ui/tabs.tsx` | L58 |
| `tabsListVariants` | const | `src/components/ui/tabs.tsx` | L27 |
| `Textarea` | component | `src/components/ui/textarea.tsx` | L5 |
| `TimerPage` | component | `src/app/timer/page.tsx` | L6 |
| `TimerSession` | interface | `src/lib/db.ts` | L428 |
| `Toaster` | component | `src/components/ui/sonner.tsx` | L7 |
| `TopicBreakdownChart` | component | `src/components/TopicBreakdownChart.tsx` | L19 |
| `TopicProgress` | interface | `src/lib/db.ts` | L334 |
| `TopicTree` | component | `src/components/TopicTree.tsx` | L553 |
| `TopicsPage` | component | `src/app/topics/page.tsx` | L7 |
| `updateStudyLog` | function | `src/lib/db.ts` | L87 |
| `updateUserProfile` | function | `src/lib/db.ts` | L131 |
| `useAuth` | hook | `src/hooks/useAuth.ts` | L15 |
| `useFriends` | hook | `src/hooks/useFriends.ts` | L40 |
| `useGoals` | hook | `src/hooks/useGoals.ts` | L14 |
| `useSchedule` | hook | `src/hooks/useSchedule.ts` | L12 |
| `useStudyLogs` | hook | `src/hooks/useStudyLogs.ts` | L18 |
| `useTopicProgress` | hook | `src/hooks/useTopicProgress.ts` | L8 |
| `UserProfile` | interface | `src/lib/db.ts` | L49 |
| `viewport` | const | `src/app/layout.tsx` | L37 |
| `WeeklyBarChart` | component | `src/components/WeeklyBarChart.tsx` | L63 |
| `WeeklyCalendar` | component | `src/components/WeeklyCalendar.tsx` | L39 |
