# BudgetMind Agent Handoff

Use this as the project memory for the next coding agent. The app is a monorepo called BudgetMind built mostly with Codex.

## User Goal

The user wants BudgetMind to become a real working personal finance app, not a static demo. The most important expectation is:

- Desktop layout should remain stable.
- Mobile should be responsive, with profile/avatar dropdown navigation instead of the broken narrow sidebar.
- Admin and user screens should fetch real backend data everywhere possible.
- Static placeholders, fake users, fake transactions, demo text, and mock inserts should be removed or replaced with real API-backed empty states.

The user speaks Hinglish and prefers direct implementation, not long theory.

## Tech Stack

- Root workspace: `C:\Users\rites\OneDrive\Documents\BudgetMind`
- Frontend: React + Vite + Tailwind + Recharts + lucide-react
- Backend: Express + Mongoose + JWT auth
- AI service: FastAPI in `services/ai-service`
- Package manager: npm workspaces

Useful commands:

```powershell
npm run build --workspace apps/frontend
npm run lint --workspace apps/backend
npm run lint --workspace apps/frontend
npm run dev
npm run seed
```

Known issue: frontend lint currently fails because ESLint v9 expects `eslint.config.js`, and the repo does not have one. This is a repo config issue, not necessarily a code error.

## Current Git State

There are many modified files. Do not revert them unless the user explicitly asks. Some of these were already dirty before the latest work.

New backend files added:

- `apps/backend/src/controllers/adminController.js`
- `apps/backend/src/middleware/admin.js`
- `apps/backend/src/routes/adminRoutes.js`

Untracked folder currently present:

- `outputs/`

Before making broad changes, inspect `git status --short` and avoid overwriting user work.

## What Has Been Done

### 1. Mobile navigation fix

Files:

- `apps/frontend/src/components/layout/Sidebar.jsx`
- `apps/frontend/src/components/layout/Topbar.jsx`
- `apps/frontend/src/components/layout/AppLayout.jsx`
- `apps/frontend/src/styles/mobile.css`

Implemented:

- `Sidebar.jsx` now exports `navItems`.
- `Topbar.jsx` receives `activePage`, imports `navItems`, and renders a mobile-only profile/avatar dropdown.
- Dropdown shows the same nav options as desktop sidebar: Dashboard, Expenses, Budgets, Goals, AI, Payments, Scanner, Subscriptions, Activity, Admin when role is admin, Settings, Logout.
- Mobile CSS hides the sidebar below 720px and keeps content full width.
- Desktop behavior should stay the same.

### 2. Dashboard moved toward real data

Files:

- `apps/backend/src/controllers/dashboardController.js`
- `apps/backend/src/services/dashboardService.js`
- `apps/frontend/src/pages/Dashboard.jsx`
- `apps/frontend/src/components/dashboard/SpendingChart.jsx`
- `apps/frontend/src/components/dashboard/CategoryDonut.jsx`
- `apps/frontend/src/components/dashboard/RecentTransactions.jsx`
- `apps/frontend/src/components/dashboard/InsightPanel.jsx`
- `apps/frontend/src/services/api.js`

Implemented:

- Backend dashboard now returns:
  - `monthlySpend`
  - `budgetRisk`
  - `goalProgress`
  - `savingsRate`
  - `financialScore`
  - `monthlyTrend`
  - `categories`
  - `recentTransactions`
  - `insights`
  - `subscriptions`
- Frontend dashboard now fetches `fetchDashboard()` and passes data into charts, donut, recent transactions, and recommendations.
- Dashboard no longer imports `mockData.js` in active dashboard components.
- Empty states show when no real data exists.

Remaining caveat:

- `savingsRate` is still hardcoded to `31` in `dashboardService.js`. It should be calculated from user income/budget/expenses later.
- `FinancialScore`, `PredictionChart`, `SpendingHeatmap`, and `OnboardingChecklist` may still contain static wording or visualization patterns. Inspect and convert if user asks for every last static element.

### 3. Admin overview real API

Files:

- `apps/backend/src/controllers/adminController.js`
- `apps/backend/src/middleware/admin.js`
- `apps/backend/src/routes/adminRoutes.js`
- `apps/backend/src/routes/index.js`
- `apps/frontend/src/pages/Admin.jsx`
- `apps/frontend/src/services/api.js`

Implemented:

- New route: `GET /api/admin/overview`
- Protected by `requireAuth` and `requireAdmin`.
- Aggregates real:
  - users
  - current-month expense spend by user
  - budget risk
  - notifications
  - audit logs
  - health summary
- Frontend Admin page now calls `fetchAdminOverview()`.
- Removed fake admin users like Ritesh/Ananya/Mohit/Neha from active Admin page.
- Admin table now shows real user name, email, role, verification status, monthly budget, monthly spend, and computed risk.

Remaining caveats:

- Admin buttons like `Export`, `Review alerts`, `Manage roles`, `Force OTP recheck`, `Freeze risky account`, `Download audit report`, `Open security review` are still UI-only controls. They need real endpoints or should be disabled/hidden until implemented.
- Admin verified count currently uses the first 100 loaded users, while `totalUsers` uses `countDocuments()`. If there are more than 100 users, metrics can be slightly inconsistent. Fix by using DB counts/aggregates.

### 4. Budgets page real data

Files:

- `apps/frontend/src/pages/Budgets.jsx`
- `apps/frontend/src/components/budgets/BudgetPlanner.jsx`
- `apps/frontend/src/components/budgets/BudgetProgress.jsx`
- `apps/frontend/src/services/api.js`

Implemented:

- Budgets page fetches `GET /api/budgets` through `fetchBudgets()`.
- Removed hardcoded Food/Travel/Shopping/Bills budget array.
- Planner now computes monthly limit, remaining, and highest-risk category from fetched budgets.
- Empty state appears when there are no budgets.

Remaining:

- There is no budget creation/edit UI on the Budgets page yet. Backend has `POST /api/budgets`, but frontend needs forms/actions if the app should be fully usable.

### 5. Activity page real notifications/audit

Files:

- `apps/frontend/src/pages/Activity.jsx`
- `apps/frontend/src/services/api.js`

Implemented:

- Activity page fetches:
  - `GET /api/notifications`
  - `GET /api/audit`
- Removed hardcoded activity strings.
- Shows empty states when no notifications/logs exist.

Remaining:

- Notification read state is supported by backend `PATCH /api/notifications/:id/read`, but frontend does not yet expose mark-as-read.

### 6. Scanner/Bills real list and upload

Files:

- `apps/backend/src/controllers/billController.js`
- `apps/backend/src/routes/billRoutes.js`
- `apps/frontend/src/pages/Scanner.jsx`
- `apps/frontend/src/components/scanner/ReceiptUploader.jsx`
- `apps/frontend/src/components/scanner/BillPreview.jsx`
- `apps/frontend/src/services/api.js`

Implemented:

- New backend route: `GET /api/bills`
- Scanner page fetches existing bills.
- Upload uses `POST /api/bills/upload` with multipart form data.
- Bill preview shows actual backend bill fields.
- Removed initial fake BigBasket/Reliance bill preview from active Scanner page.

Remaining caveat:

- Backend OCR service `apps/backend/src/services/ocrService.js` still returns a static extraction result. This means the UI is API-backed, but actual OCR intelligence is still placeholder. This is a high-priority remaining task.

### 7. Subscriptions page real detection from expenses

Files:

- `apps/frontend/src/pages/Subscriptions.jsx`
- `apps/frontend/src/components/subscriptions/SubscriptionDetector.jsx`
- `apps/backend/src/services/dashboardService.js`

Implemented:

- Dashboard service derives `subscriptions` from real expenses using recurring categories/merchant matching.
- Subscriptions page fetches dashboard and displays detected recurring spend.
- Removed active static Netflix/Notion/Spotify subscription list.

Remaining:

- Detection is heuristic. A proper subscription model/detector would be better.

### 8. Payments page real data

Files:

- `apps/backend/src/controllers/cardController.js`
- `apps/backend/src/controllers/upiController.js`
- `apps/frontend/src/pages/Payments.jsx`
- `apps/frontend/src/components/payments/BankConnector.jsx`
- `apps/frontend/src/components/payments/CardAnalytics.jsx`
- `apps/frontend/src/components/payments/CardTracker.jsx`
- `apps/frontend/src/components/payments/UpiConnector.jsx`
- `apps/frontend/src/services/api.js`

Implemented:

- Payments page fetches:
  - `GET /api/cards`
  - `GET /api/cards/transactions`
  - `GET /api/upi/transactions`
- Removed hardcoded card list and fake bank list from active UI.
- Card analytics now computes connected cards, utilization, and tracked card spend from real data.
- UPI parser no longer has a prefilled demo message; user pastes a real bank alert.
- Backend card/UPI transaction list controllers no longer auto-insert mock transactions when empty.

Remaining:

- There is no frontend card add/connect form in the Payments page yet.
- UPI parser parses message but does not save parsed transaction as an Expense/Transaction yet.

## Important Backend Endpoints

Existing or added:

- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/verify-signup-otp`
- `GET /api/users/me`
- `PATCH /api/users/me`
- `GET /api/dashboard`
- `GET /api/expenses`
- `POST /api/expenses`
- `GET /api/budgets`
- `POST /api/budgets`
- `GET /api/goals`
- `GET /api/cards`
- `POST /api/cards`
- `GET /api/cards/transactions`
- `GET /api/upi/transactions`
- `POST /api/upi/parse`
- `GET /api/bills`
- `POST /api/bills/upload`
- `POST /api/bills/:id/expense`
- `GET /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/audit`
- `GET /api/admin/overview`

## Known Placeholder/Static Areas Still Worth Inspecting

Search with:

```powershell
rg -n "mock|demo|placeholder|static|TODO|defaultValue|hardcoded|Rs\\.|₹" apps/frontend/src apps/backend/src
```

Known remaining or likely areas:

- `apps/backend/src/services/ocrService.js`: static OCR response.
- `apps/backend/src/services/mockTransactionService.js`: still exists but no longer used by active card/UPI controllers.
- `apps/frontend/src/data/mockData.js`: still exists but active dashboard components no longer import it.
- `apps/frontend/src/components/dashboard/FinancialScore.jsx`: likely static text.
- `apps/frontend/src/components/dashboard/PredictionChart.jsx`: likely static visualization.
- `apps/frontend/src/components/dashboard/SpendingHeatmap.jsx`: likely static visualization.
- `apps/frontend/src/components/onboarding/OnboardingChecklist.jsx`: likely static checklist.
- Admin controls/buttons are not wired to real backend actions.
- Report export may need checking for real data.

## Verification Already Done

These passed after the latest real-data wiring:

```powershell
npm run build --workspace apps/frontend
npm run lint --workspace apps/backend
node --check apps/backend/src/controllers/adminController.js
node --check apps/backend/src/routes/adminRoutes.js
node --check apps/backend/src/middleware/admin.js
node --check apps/backend/src/services/dashboardService.js
node --check apps/backend/src/controllers/cardController.js
node --check apps/backend/src/controllers/upiController.js
node --check apps/backend/src/controllers/billController.js
node --check apps/backend/src/routes/index.js
```

Frontend lint failed because repo lacks ESLint v9 config:

```text
ESLint couldn't find an eslint.config.(js|mjs|cjs) file.
```

## Suggested Next Work Order

1. Commit or preserve current changes first so they are not lost.
2. Add frontend ESLint v9 config or downgrade/adjust lint command.
3. Replace `ocrService.js` fake extraction with real OCR or at least connect the AI service if intended.
4. Finish Dashboard static components: `FinancialScore`, `PredictionChart`, `SpendingHeatmap`, `OnboardingChecklist`.
5. Add create/edit UI for budgets.
6. Add card connect/create UI in Payments.
7. Make UPI parse save a transaction/expense after user confirms.
8. Wire Admin action buttons to real endpoints or disable them with clear labels.
9. Add proper loading skeletons and error/empty states across all pages.
10. Run mobile browser QA again after each layout change.

## Notes For Future Agent

- Do not reintroduce fake users or fake transaction inserts.
- Prefer empty states over fake sample rows.
- Keep desktop layout unchanged unless the user explicitly asks.
- For mobile, verify at around 390px width.
- User expects practical fixes, not only plans.
- Speak Hinglish if replying directly to the user.
