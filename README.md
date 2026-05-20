# BudgetMind

BudgetMind is a resume-ready AI finance SaaS that helps users track spending, scan receipts, parse UPI messages, monitor cards, detect subscriptions, and export financial health reports.

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
