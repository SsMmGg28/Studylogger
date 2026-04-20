# Codebase Index
> Auto-generated complete reference of all files, features, functions, and their locations.
> Last generated: 2026-04-20

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
**Purpose**: Firestore security rules for users, usernames, study logs, friendships, goals, and notification tokens.
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
**Purpose**: Root app layout that sets metadata, fonts, dark theme shell, toaster placement, and service worker registration.
**Depends on**: src/components/ui/sonner.tsx, src/app/globals.css

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L18 | `metadata` | const | Next.js metadata object for app title, description, manifest, and Apple web app settings. |
| L29 | `viewport` | const | Next.js viewport config defining the browser theme color. |
| L33 | `RootLayout` | component | Root layout component receiving `children: React.ReactNode` and rendering the global shell. |

### `src/app/page.tsx`
**Purpose**: Dashboard page showing weekly and monthly study summaries, charts, goals, recent logs, streaks, and revision suggestions.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/LogCard.tsx, src/components/SubjectChart.tsx, src/components/WeeklyCalendar.tsx, src/components/WeeklyBarChart.tsx, src/components/ExamCountdown.tsx, src/components/StreakBadge.tsx, src/components/GoalCard.tsx, src/components/RevisionSuggestions.tsx, src/components/ui/card.tsx, src/components/ui/button.tsx, src/components/ui/tabs.tsx, src/hooks/useAuth.ts, src/hooks/useStudyLogs.ts, src/hooks/useGoals.ts, src/lib/db.ts, src/lib/notifications.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L54 | `DashboardPage` | component | Protected dashboard component that aggregates logs and goals into overview cards and visualizations. |

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

### `src/app/stats/page.tsx`
**Purpose**: Protected analytics page for topic breakdowns, efficiency charts, and summary totals.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/components/TopicBreakdownChart.tsx, src/components/EfficiencyCard.tsx, src/hooks/useAuth.ts, src/hooks/useStudyLogs.ts, src/components/ui/card.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L12 | `StatsPage` | component | Protected statistics page that renders topic-level and weekly efficiency analysis for current logs. |

### `src/app/settings/page.tsx`
**Purpose**: Protected settings page for profile display name updates, privacy toggles, and notification permission setup.
**Depends on**: src/components/AuthGuard.tsx, src/components/Navbar.tsx, src/hooks/useAuth.ts, src/lib/db.ts, src/components/ui/card.tsx, src/components/ui/input.tsx, src/components/ui/label.tsx, src/components/ui/button.tsx, src/components/ui/badge.tsx, src/components/ui/switch.tsx, src/lib/notifications.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L40 | `SettingsPage` | component | Protected settings screen that updates `displayName`, privacy flags, and notification permission state. |

### `src/components/AuthGuard.tsx`
**Purpose**: Route guard wrapper that blocks unauthenticated access and redirects incomplete Google signups to username setup.
**Depends on**: src/hooks/useAuth.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L7 | `AuthGuard` | component | Guard component receiving `children` and redirecting based on auth/profile readiness. |

### `src/components/Navbar.tsx`
**Purpose**: Sticky navigation bar with primary route links and a user dropdown menu.
**Depends on**: src/lib/utils.ts, src/hooks/useAuth.ts, src/lib/auth.ts, src/components/ui/button.tsx, src/components/ui/avatar.tsx, src/components/ui/dropdown-menu.tsx

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L28 | `Navbar` | component | Navigation component with route highlighting and logout/settings actions. |

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

### `src/hooks/useStudyLogs.ts`
**Purpose**: Encapsulates study-log retrieval, mutations, demo mode, and offline queue synchronization.
**Depends on**: src/lib/db.ts, src/lib/demo-data.ts, src/lib/offlineQueue.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L18 | `useStudyLogs` | hook | Returns logs, loading state, refresh, add, update, and remove actions with demo/offline handling. |

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
**Purpose**: Core Firestore data-access layer defining the project’s shared domain models and CRUD/aggregation helpers.
**Depends on**: src/lib/firebase.ts

| Line | Symbol | Type | Description |
|------|--------|------|-------------|
| L20 | `StudyLog` | interface | Main study-log model containing subject, topic, duration, question count, notes, tags, date, and timestamp metadata. |
| L33 | `StudyGoal` | interface | Goal model containing subject, metric, period, and numeric target. |
| L41 | `UserProfile` | interface | User profile model with display name, username, email, and privacy settings. |
| L52 | `Friendship` | interface | Friendship model containing both users, initiator, and pending/accepted status. |
| L62 | `addStudyLog` | function | Adds a study log for `uid` and returns the created document ID. |
| L74 | `updateStudyLog` | function | Partially updates an existing study-log document by ID. |
| L81 | `deleteStudyLog` | function | Deletes a study-log document by ID. |
| L85 | `getUserStudyLogs` | function | Fetches and date-sorts all study logs for one user. |
| L101 | `getFriendStudyLogs` | function | Fetches and date-sorts up to 200 recent study logs for one friend. |
| L113 | `getUserProfile` | function | Reads one user profile document and returns `UserProfile | null`. |
| L118 | `updateUserProfile` | function | Partially updates a user profile document by user ID. |
| L125 | `getUserByUsername` | function | Resolves a lowercase username to `{ uid, profile }` if it exists. |
| L139 | `sendFriendRequest` | function | Creates or overwrites a friendship document in `pending` state for two user IDs. |
| L149 | `acceptFriendRequest` | function | Marks an existing friendship document as `accepted`. |
| L154 | `removeFriend` | function | Deletes the friendship document for two users. |
| L159 | `getFriendships` | function | Fetches all friendship documents where the given user appears in either slot. |
| L174 | `ExamLog` | interface | Exam-log model supporting full exams and branch exams with nets, notes, and duration. |
| L191 | `addExamLog` | function | Adds an exam log for `uid` and returns the created document ID. |
| L203 | `deleteExamLog` | function | Deletes an exam-log document by ID. |
| L207 | `getUserExamLogs` | function | Fetches and reverse-date-sorts exam logs for one user. |
| L216 | `aggregateBySubject` | function | Reduces study logs into `{ minutes, questions }` totals keyed by subject. |
| L226 | `aggregateByTopic` | function | Reduces study logs into `{ minutes, questions }` totals keyed by `subject:topic`. |
| L237 | `getLastStudiedByTopic` | function | Returns the latest study date for each `subject:topic` key. |
| L250 | `getGoals` | function | Reads all goal documents from `users/{uid}/goals`. |
| L256 | `setGoal` | function | Creates a goal document for a user and returns the document ID. |
| L264 | `deleteGoal` | function | Deletes one goal document from a user’s goals subcollection. |

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
| `acceptFriendRequest` | function | `src/lib/db.ts` | L149 |
| `addExamLog` | function | `src/lib/db.ts` | L191 |
| `addStudyLog` | function | `src/lib/db.ts` | L62 |
| `aggregateBySubject` | function | `src/lib/db.ts` | L216 |
| `aggregateByTopic` | function | `src/lib/db.ts` | L226 |
| `app` | const | `src/lib/firebase.ts` | L34 |
| `AuthGuard` | component | `src/components/AuthGuard.tsx` | L7 |
| `auth` | const | `src/lib/firebase.ts` | L31 |
| `Avatar` | component | `src/components/ui/avatar.tsx` | L8 |
| `AvatarBadge` | component | `src/components/ui/avatar.tsx` | L60 |
| `AvatarFallback` | component | `src/components/ui/avatar.tsx` | L44 |
| `AvatarGroup` | component | `src/components/ui/avatar.tsx` | L76 |
| `AvatarGroupCount` | component | `src/components/ui/avatar.tsx` | L89 |
| `AvatarImage` | component | `src/components/ui/avatar.tsx` | L28 |
| `Badge` | component | `src/components/ui/badge.tsx` | L30 |
| `badgeVariants` | const | `src/components/ui/badge.tsx` | L7 |
| `Button` | component | `src/components/ui/button.tsx` | L44 |
| `buttonVariants` | const | `src/components/ui/button.tsx` | L7 |
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
| `DashboardPage` | component | `src/app/page.tsx` | L54 |
| `db` | const | `src/lib/firebase.ts` | L33 |
| `DEMO_FRIENDS` | const | `src/lib/demo-data.ts` | L229 |
| `DEMO_LOGS` | const | `src/lib/demo-data.ts` | L53 |
| `DEMO_PROFILE` | const | `src/lib/demo-data.ts` | L8 |
| `DEMO_UID` | const | `src/lib/demo-data.ts` | L6 |
| `deleteExamLog` | function | `src/lib/db.ts` | L203 |
| `deleteGoal` | function | `src/lib/db.ts` | L264 |
| `deleteStudyLog` | function | `src/lib/db.ts` | L81 |
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
| `ExamLog` | interface | `src/lib/db.ts` | L174 |
| `ExamLogForm` | component | `src/components/ExamLogForm.tsx` | L48 |
| `FriendData` | interface | `src/hooks/useFriends.ts` | L18 |
| `Friendship` | interface | `src/lib/db.ts` | L52 |
| `FriendsPage` | component | `src/app/friends/page.tsx` | L23 |
| `getFriendships` | function | `src/lib/db.ts` | L159 |
| `getFriendStudyLogs` | function | `src/lib/db.ts` | L101 |
| `getGoals` | function | `src/lib/db.ts` | L250 |
| `getLastStudiedByTopic` | function | `src/lib/db.ts` | L237 |
| `getPendingCount` | function | `src/lib/offlineQueue.ts` | L71 |
| `getUserByUsername` | function | `src/lib/db.ts` | L125 |
| `getUserExamLogs` | function | `src/lib/db.ts` | L207 |
| `getUserProfile` | function | `src/lib/db.ts` | L113 |
| `getUserStudyLogs` | function | `src/lib/db.ts` | L85 |
| `GoalCard` | component | `src/components/GoalCard.tsx` | L15 |
| `GoalsPage` | component | `src/app/goals/page.tsx` | L33 |
| `HistoryPage` | component | `src/app/history/page.tsx` | L32 |
| `Input` | component | `src/components/ui/input.tsx` | L5 |
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
| `Navbar` | component | `src/components/Navbar.tsx` | L28 |
| `nextConfig` | const | `next.config.ts` | L3 |
| `PendingLog` | interface | `src/lib/offlineQueue.ts` | L17 |
| `queueOfflineLog` | function | `src/lib/offlineQueue.ts` | L31 |
| `register` | function | `src/lib/auth.ts` | L13 |
| `RegisterPage` | component | `src/app/auth/register/page.tsx` | L14 |
| `removeFriend` | function | `src/lib/db.ts` | L154 |
| `requestNotificationPermission` | function | `src/lib/notifications.ts` | L4 |
| `RevisionSuggestions` | component | `src/components/RevisionSuggestions.tsx` | L18 |
| `RootLayout` | component | `src/app/layout.tsx` | L33 |
| `saveFCMToken` | function | `src/lib/notifications.ts` | L23 |
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
| `sendFriendRequest` | function | `src/lib/db.ts` | L139 |
| `sendLocalNotification` | function | `src/lib/notifications.ts` | L11 |
| `setGoal` | function | `src/lib/db.ts` | L256 |
| `SettingsPage` | component | `src/app/settings/page.tsx` | L40 |
| `SetupUsernamePage` | component | `src/app/auth/setup-username/page.tsx` | L15 |
| `StatsPage` | component | `src/app/stats/page.tsx` | L12 |
| `StreakBadge` | component | `src/components/StreakBadge.tsx` | L12 |
| `StudyGoal` | interface | `src/lib/db.ts` | L33 |
| `StudyLog` | interface | `src/lib/db.ts` | L20 |
| `StudyLogForm` | component | `src/components/StudyLogForm.tsx` | L28 |
| `Subject` | interface | `src/lib/subjects.ts` | L1 |
| `SubjectChart` | component | `src/components/SubjectChart.tsx` | L68 |
| `SUBJECT_COLORS` | const | `src/lib/subjects.ts` | L325 |
| `SUBJECT_MAP` | const | `src/lib/subjects.ts` | L324 |
| `SUBJECTS` | const | `src/lib/subjects.ts` | L9 |
| `Switch` | component | `src/components/ui/switch.tsx` | L8 |
| `syncOfflineLogs` | function | `src/lib/offlineQueue.ts` | L41 |
| `Tabs` | component | `src/components/ui/tabs.tsx` | L9 |
| `TabsContent` | component | `src/components/ui/tabs.tsx` | L77 |
| `TabsList` | component | `src/components/ui/tabs.tsx` | L42 |
| `TabsTrigger` | component | `src/components/ui/tabs.tsx` | L58 |
| `tabsListVariants` | const | `src/components/ui/tabs.tsx` | L27 |
| `Textarea` | component | `src/components/ui/textarea.tsx` | L5 |
| `Toaster` | component | `src/components/ui/sonner.tsx` | L7 |
| `TopicBreakdownChart` | component | `src/components/TopicBreakdownChart.tsx` | L19 |
| `updateStudyLog` | function | `src/lib/db.ts` | L74 |
| `updateUserProfile` | function | `src/lib/db.ts` | L118 |
| `useAuth` | hook | `src/hooks/useAuth.ts` | L15 |
| `useFriends` | hook | `src/hooks/useFriends.ts` | L40 |
| `useGoals` | hook | `src/hooks/useGoals.ts` | L14 |
| `useStudyLogs` | hook | `src/hooks/useStudyLogs.ts` | L18 |
| `UserProfile` | interface | `src/lib/db.ts` | L41 |
| `viewport` | const | `src/app/layout.tsx` | L29 |
| `WeeklyBarChart` | component | `src/components/WeeklyBarChart.tsx` | L63 |
| `WeeklyCalendar` | component | `src/components/WeeklyCalendar.tsx` | L39 |