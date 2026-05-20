# BudgetMind AI

“Understand Your Money. Control Your Future.”

BudgetMind AI is a production-style MERN + FastAPI fintech SaaS for expense tracking, AI financial analytics, UPI/card transaction intelligence, receipt scanning, subscription detection, budgeting, savings goals, and PDF reporting.

## Apps

- `apps/frontend` - React + Vite dashboard experience.
- `apps/backend` - Express API for auth, expenses, cards, transactions, reports, and OCR orchestration.
- `services/ai-service` - FastAPI microservice for predictions, insights, and chatbot responses.

## Quick Start

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` in each service and set the values for your environment.

## Development Workflow

```bash
npm run dev:frontend
npm run dev:backend
npm run dev:ai
```

Use the `develop` branch for integration work. Feature branches in this repository mirror the product areas: `frontend`, `backend`, and `ai-service`.

## API Modules

- Auth: registration, login, JWT profile protection, forgot-password token generation
- Expenses: CRUD, categorization, filtering-ready schema
- Budgets: category limits, threshold alerts, usage summaries
- Goals: savings goal tracking and contribution coaching
- Payments: mock UPI parsing and card tracking
- OCR: receipt extraction service boundary
- Reports: PDF monthly report export
- Operations: notifications, audit logs, validation, and rate limiting

## API Reference

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/google`

### Expenses

- `GET /api/expenses`
- `POST /api/expenses`
- `PATCH /api/expenses/:id`
- `DELETE /api/expenses/:id`

### UPI, Cards, Bills

- `POST /api/upi/connect`
- `GET /api/upi/transactions`
- `POST /api/cards/add`
- `GET /api/cards`
- `GET /api/cards/transactions`
- `POST /api/bills/upload`

### AI and Reports

- `GET /api/ai/analyze`
- `GET /api/ai/predict`
- `POST /api/ai/chat`
- `GET /api/reports/monthly.pdf`

## Architecture

```text
apps/frontend       React, Vite, Tailwind, Framer Motion, Recharts
apps/backend        Express, JWT, bcryptjs, Mongoose, PDFKit
services/ai-service FastAPI, pandas, numpy, scikit-learn
```

## Deployment

Use [DEPLOYMENT.md](./DEPLOYMENT.md) for Vercel and Render setup. The repository includes `vercel.json`, `render.yaml`, Dockerfiles, health checks, and service-level `.env.example` files.

## Screenshots

Add screenshots from the deployed Vercel app here:

- Dashboard
- Expenses
- AI insights
- UPI and cards
- OCR scanner

## Showcase Features

- JWT authentication and protected API routes
- Analytics dashboard with category charts, transaction widgets, and AI recommendations
- Expense CRUD with filtering, search, sorting, and monthly summaries
- AI spend analysis, prediction, recommendation, and chatbot endpoints
- UPI transaction parsing and card analytics widgets
- Receipt upload UI with OCR extraction preview cards
- Dark/light theme, motion polish, subscription detection, financial score, and PDF report export

## Commit History

This repository includes a professional, feature-by-feature Git history with more than 40 realistic commits across setup, auth, dashboard, expenses, AI, UPI/card, OCR, premium features, and deployment polish.
