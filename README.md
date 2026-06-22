# 🌿 VaidyaAI — Ayurvedic Clinical Intelligence Platform

> An AI-powered clinical reasoning OS for Ayurvedic practitioners — ambient scribing, Prakriti assessment, treatment recommendations, and patient reporting in one platform.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-teal.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg)](https://nextjs.org)
[![HuggingFace Spaces](https://img.shields.io/badge/API-HuggingFace%20Spaces-yellow.svg)](https://huggingface.co/spaces)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [Team](#team)

---

## Overview

VaidyaAI is a Mendalia-inspired platform built specifically for Ayurvedic doctors. It uses LLMs grounded in Ayurvedic classical texts (Charaka Samhita, Sushruta Samhita, Ashtanga Hridayam) to:

- 🎙️ **AI Scribe** — Record consultations, auto-generate structured Ayurvedic case notes
- 🧬 **Prakriti Engine** — Assess patient constitution (Dosha/Prakriti/Vikriti) from conversation
- 💊 **Treatment Advisor** — Suggest herbs, Panchakarma, diet, and lifestyle — with cited reasoning
- ⚠️ **Risk Flagging** — Detect red-flag symptoms requiring allopathic referral
- 📄 **Patient Reports** — Generate beautiful PDF reports for patients

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Next.js Frontend                   │
│         (Vercel — apps/web)                         │
└──────────────────────┬──────────────────────────────┘
                       │ HTTPS REST / WebSocket
┌──────────────────────▼──────────────────────────────┐
│              FastAPI Backend                         │
│         (HuggingFace Spaces — apps/api)             │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │ AI Scribe   │  │ Prakriti     │  │ Treatment  │ │
│  │ (Whisper)   │  │ Engine (LLM) │  │ Advisor    │ │
│  └─────────────┘  └──────────────┘  └────────────┘ │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │        RAG Pipeline (LangChain)              │   │
│  │   Pinecone Vector DB ← Ayurvedic Texts      │   │
│  └──────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│              PostgreSQL (Supabase)                   │
│         Patients · Cases · Practitioners             │
└─────────────────────────────────────────────────────┘
```

---

## Project Structure

```
vaidya-ai/
│
├── apps/
│   ├── web/                          # Next.js 14 frontend
│   │   ├── public/
│   │   └── src/
│   │       ├── app/
│   │       │   ├── (auth)/           # Login, register
│   │       │   ├── dashboard/        # Main practitioner dashboard
│   │       │   ├── patients/         # Patient profiles & history
│   │       │   │   └── [id]/
│   │       │   ├── consultation/     # Live consultation workspace
│   │       │   │   └── [sessionId]/
│   │       │   │       ├── scribe/   # AI scribe view
│   │       │   │       ├── assessment/ # Prakriti assessment
│   │       │   │       └── treatment/  # Treatment plan
│   │       │   └── reports/          # Generated reports
│   │       ├── components/
│   │       │   ├── ui/               # Base components (shadcn)
│   │       │   ├── scribe/           # Audio + transcript components
│   │       │   ├── assessment/       # Dosha charts, Prakriti cards
│   │       │   ├── treatment/        # Herb & treatment components
│   │       │   └── reports/          # PDF report components
│   │       ├── hooks/                # Custom React hooks
│   │       ├── lib/                  # API client, utilities
│   │       └── types/                # TypeScript interfaces
│   │
│   └── api/                          # FastAPI backend (→ HuggingFace)
│       ├── app/
│       │   ├── main.py               # FastAPI entry point
│       │   ├── config.py             # Settings & env vars
│       │   ├── routers/
│       │   │   ├── auth.py
│       │   │   ├── patients.py
│       │   │   ├── consultations.py
│       │   │   ├── scribe.py         # Transcription endpoints
│       │   │   ├── assessment.py     # Prakriti endpoints
│       │   │   ├── treatment.py      # Recommendation endpoints
│       │   │   └── reports.py        # PDF generation endpoints
│       │   ├── services/
│       │   │   ├── whisper_service.py
│       │   │   ├── llm_service.py    # Anthropic Claude calls
│       │   │   ├── rag_service.py    # RAG pipeline
│       │   │   ├── prakriti_service.py
│       │   │   └── report_service.py
│       │   ├── models/               # Pydantic schemas
│       │   │   ├── patient.py
│       │   │   ├── consultation.py
│       │   │   └── dosha.py
│       │   ├── db/
│       │   │   ├── database.py       # SQLAlchemy setup
│       │   │   └── models.py         # ORM models
│       │   └── prompts/              # LLM prompt templates
│       │       ├── scribe.py
│       │       ├── prakriti.py
│       │       ├── treatment.py
│       │       └── risk_flag.py
│       ├── requirements.txt
│       └── Dockerfile                # For HuggingFace Spaces
│
├── packages/
│   └── knowledge-base/               # Ayurvedic texts & data
│       ├── texts/
│       │   ├── charaka-samhita/      # Chunked text files
│       │   ├── sushruta-samhita/
│       │   └── ashtanga-hridayam/
│       ├── herbs/
│       │   └── formulations.json     # Herb & formulation DB
│       ├── dosha/
│       │   └── assessment-rules.json # Dosha assessment logic
│       └── scripts/
│           └── ingest.py             # Embed texts → Pinecone
│
├── docs/                             # Extended documentation
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── DEPLOYMENT.md
│   └── AYURVEDA_ONTOLOGY.md         # Domain knowledge guide
│
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                   # Run tests on PR
│   │   └── deploy.yml               # Auto-deploy on merge to main
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── pull_request_template.md
│
├── .env.example                      # ← copy to .env.local
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **Frontend** | Next.js 14, TailwindCSS, shadcn/ui | Fast, SEO-ready, great DX |
| **Backend** | FastAPI (Python 3.11) | Async, fast, ideal for ML/AI services |
| **Database** | PostgreSQL via Supabase | Managed, scalable, auth built-in |
| **Vector DB** | Pinecone | Fast similarity search for RAG |
| **LLM** | MIstral API | Best reasoning for clinical context |
| **Transcription** | OpenAI Whisper API | Multilingual, accurate |
| **RAG** | LangChain + Pinecone | Grounded Ayurvedic knowledge retrieval |
| **PDF Reports** | WeasyPrint (Python) | HTML → PDF for patient reports |
| **Auth** | Supabase Auth | JWT-based, easy to integrate |
| **Frontend Deploy** | Vercel | Zero-config Next.js deployment |
| **Backend Deploy** | HuggingFace Spaces | Free GPU/CPU hosting for ML APIs |
| **CI/CD** | GitHub Actions | Automated test + deploy pipeline |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- Git
- A Pinecone account (free tier works)
- An Anthropic API key
- A Supabase project

### 1. Fork & Clone

```bash
# Fork the repo on GitHub first, then:
git clone https://github.com/YOUR_USERNAME/vaidya-ai.git
cd vaidya-ai
```

### 2. Setup Frontend

```bash
cd apps/web
npm install
cp ../../.env.example .env.local
# Fill in your environment variables (see below)
```

### 3. Setup Backend

```bash
cd apps/api
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp ../../.env.example .env
# Fill in your environment variables
```

### 4. Ingest Knowledge Base

```bash
cd packages/knowledge-base
python scripts/ingest.py
# This chunks Ayurvedic texts and loads them into Pinecone
```

---

## Environment Variables

Copy `.env.example` to `.env.local` (frontend) and `.env` (backend).

```env
# === LLM ===
MISTRAL_API_KEY=sk-mis-...

# === Transcription ===
#OPENAI_API_KEY=sk-...

# === Vector DB ===
PINECONE_API_KEY=...
PINECONE_INDEX_NAME=vaidya-knowledge

# === Database ===
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_KEY=...
DATABASE_URL=postgresql://...

# === Auth ===
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# === API ===
NEXT_PUBLIC_API_URL=http://localhost:8000   # or HuggingFace URL in prod
```

---

## Running Locally

### Start Backend (FastAPI)

```bash
cd apps/api
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

API docs available at: `http://localhost:8000/docs`

### Start Frontend (Next.js)

```bash
cd apps/web
npm run dev
```

Frontend available at: `http://localhost:3000`

---

## Deployment

### Backend → HuggingFace Spaces

The `apps/api` folder is structured as a HuggingFace Space.

```bash
# 1. Create a new Space on huggingface.co (Docker SDK)
# 2. Add your secrets in Space Settings → Variables and Secrets
# 3. Push the api folder:

cd apps/api
git init
git remote add space https://huggingface.co/spaces/ios-ioe/vaidya-api
git push space main
```

The `Dockerfile` in `apps/api` handles the build automatically.

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

cd apps/web
vercel
# Follow prompts, add env vars in Vercel dashboard
```

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for detailed step-by-step instructions.

---

## API Reference

See [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) for full endpoint docs.

**Quick overview:**

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/scribe/transcribe` | Upload audio → get transcription |
| `POST` | `/api/scribe/generate-notes` | Transcript → structured case notes |
| `POST` | `/api/assessment/prakriti` | Generate Prakriti assessment |
| `POST` | `/api/treatment/recommend` | Get treatment recommendations |
| `GET` | `/api/patients/{id}` | Get patient profile |
| `POST` | `/api/reports/generate` | Generate patient PDF report |

Interactive API docs (Swagger UI): `https://your-space.hf.space/docs`

---

## Contributing

We welcome contributions! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) before submitting a PR.

**Quick links:**
- 🐛 [Report a bug](.github/ISSUE_TEMPLATE/bug_report.md)
- ✨ [Request a feature](.github/ISSUE_TEMPLATE/feature_request.md)
- 📋 [Open issues](../../issues)

---

## License

MIT © VaidyaAI Team
