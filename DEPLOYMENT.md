# BudgetMind AI Deployment Guide

## Vercel Frontend

1. Import the GitHub repository.
2. Set the framework to Vite.
3. Use these settings:
   - Install command: `npm install`
   - Build command: `npm --prefix apps/frontend run build`
   - Output directory: `apps/frontend/dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-render-api.onrender.com/api`

## Render Backend

Create a Web Service from `apps/backend`.

- Build command: `npm install --omit=dev`
- Start command: `npm start`
- Health check path: `/health`

Environment variables:

- `MONGODB_URI`
- `JWT_SECRET`
- `ENCRYPTION_KEY`
- `CLIENT_ORIGIN`
- `AI_SERVICE_URL`

The backend is deploy-safe even when MongoDB is temporarily unavailable during boot; it logs a warning instead of crashing.

## Render or Railway AI Service

Create a Python Web Service from `services/ai-service`.

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/health`

## Recommended Branch

Deploy from `main` after pushing the latest `develop` changes into it. This repository keeps `main`, `develop`, `frontend`, `backend`, and `ai-service` aligned for showcase deployment.
