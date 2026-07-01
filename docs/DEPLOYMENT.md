# Deployment Guide

VaidyaAI uses a split deployment:
- **Frontend** → Vercel (Next.js)
- **Backend API** → HuggingFace Spaces (FastAPI + Docker)

---

## Backend → HuggingFace Spaces

### 1. Create a HuggingFace Space

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **Create new Space**
3. Settings:
   - **SDK:** Docker
   - **Visibility:** Public (or Private for production)
   - **Hardware:** CPU Basic (free) for MVP

### 2. Configure the Dockerfile

The `apps/api/Dockerfile` is already set up:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 7860

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

> ⚠️ HuggingFace Spaces uses **port 7860** by default — do not change this.

### 3. Add Secrets

In your Space → **Settings → Variables and Secrets**, add:

```
MISTRAL_API_KEY
MISTRAL_MODEL
OPENAI_API_KEY
PINECONE_API_KEY
PINECONE_INDEX_NAME
DATABASE_URL
SUPABASE_URL
SUPABASE_SERVICE_KEY
```

> Use **Secrets** (not Variables) for API keys — they are encrypted and not exposed in logs.

### 4. Push the API Code

```bash
# From the repo root
cd apps/api

# Init a separate git repo for the Space
git init
git add .
git commit -m "Initial deploy"

# Add your HuggingFace Space as remote
git remote add space https://huggingface.co/spaces/YOUR_ORG/vaidya-api

# Push (you'll be prompted for HF credentials)
git push space main --force
```

### 5. Verify

Your API will be live at:
`https://your-org-vaidya-api.hf.space`

Swagger docs: `https://your-org-vaidya-api.hf.space/docs`

---

## Frontend → Vercel

### 1. Connect to Vercel

```bash
npm i -g vercel
cd apps/web
vercel
```

Or connect via [vercel.com/new](https://vercel.com/new) → Import GitHub repo.

Set the **Root Directory** to `apps/web`.

### 2. Add Environment Variables

In Vercel dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-org-vaidya-api.hf.space
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://your-app.vercel.app
```

### 3. Deploy

Vercel auto-deploys on every push to `main`. For manual deploy:

```bash
vercel --prod
```

---

## Database → Supabase

### 1. Create Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Note your **Project URL** and **anon/service keys**

### 2. Run Migrations

```bash
cd apps/api
python -m alembic upgrade head
```

Or run the SQL in `apps/api/db/migrations/` manually in the Supabase SQL editor.

---

## Knowledge Base → Pinecone

### 1. Create Index

1. Go to [pinecone.io](https://pinecone.io) → Create Index
2. Settings:
   - **Dimensions:** 1024 (for Mistral Embed)
   - **Metric:** cosine
   - **Name:** `vaidya-knowledge`

### 2. Ingest Texts

```bash
cd packages/knowledge-base
pip install -r requirements.txt
python scripts/ingest.py
```

This will chunk all texts in `texts/` and upsert them into Pinecone.

---

## CI/CD (GitHub Actions)

The `.github/workflows/` folder contains:

- **`ci.yml`** — runs on every PR: linting + tests
- **`deploy.yml`** — runs on merge to `main`: deploys to HuggingFace + triggers Vercel deploy

To activate deploy workflow, add these GitHub Secrets:

```
HF_TOKEN          # HuggingFace write token
VERCEL_TOKEN      # Vercel deploy token
VERCEL_ORG_ID     # From Vercel project settings
VERCEL_PROJECT_ID # From Vercel project settings
```

---

## Environment Summary

| Environment | Frontend URL | Backend URL |
|---|---|---|
| Local | localhost:3000 | localhost:8000 |
| Staging | your-app-git-dev.vercel.app | your-org-vaidya-api-dev.hf.space |
| Production | your-app.vercel.app | your-org-vaidya-api.hf.space |
