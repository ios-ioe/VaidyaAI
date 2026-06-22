# Contributing to VaidyaAI 🌿

Thank you for contributing! This guide will get you from zero to submitting your first PR.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Branch Strategy](#branch-strategy)
- [Commit Convention](#commit-convention)
- [Pull Request Process](#pull-request-process)
- [Development Guidelines](#development-guidelines)
- [Module Ownership](#module-ownership)

---

## Code of Conduct

Be respectful, be constructive, be kind. We're building something meaningful together.

---

## How to Contribute

### 1. Fork the Repository

Click **Fork** on GitHub. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/vaidya-ai.git
cd vaidya-ai
```

### 2. Add Upstream Remote

```bash
git remote add upstream https://github.com/ORG_NAME/vaidya-ai.git
```

### 3. Always Work from a Fresh Branch

```bash
# Sync with upstream first
git fetch upstream
git checkout main
git merge upstream/main

# Create your feature branch
git checkout -b feat/your-feature-name
```

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Never commit directly. |
| `dev` | Integration branch. All features merge here first. |
| `feat/*` | New features (e.g. `feat/prakriti-engine`) |
| `fix/*` | Bug fixes (e.g. `fix/audio-upload-crash`) |
| `docs/*` | Documentation only |
| `chore/*` | Config, deps, tooling |

**Rule:** PRs always target `dev`, not `main`. `main` is updated via release PRs from `dev`.

---

## Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): short description

[optional body]
[optional footer]
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, no logic change |
| `refactor` | Code restructure, no feature/fix |
| `test` | Adding or fixing tests |
| `chore` | Build, deps, config |

### Examples

```bash
git commit -m "feat(scribe): add real-time transcript streaming"
git commit -m "fix(assessment): correct Vata calculation edge case"
git commit -m "docs(api): add treatment endpoint examples"
git commit -m "chore(deps): upgrade langchain to 0.2.0"
```

---

## Pull Request Process

1. **Push your branch** to your fork:
   ```bash
   git push origin feat/your-feature-name
   ```

2. **Open a PR** on GitHub targeting the `dev` branch of the upstream repo.

3. **Fill in the PR template** — describe what you changed and why.

4. **Ensure all checks pass:**
   - ✅ Linting (ESLint / Ruff)
   - ✅ Tests (pytest / Jest)
   - ✅ No merge conflicts

5. **Request a review** from at least one team member.

6. Once approved, a maintainer will **squash & merge**.

### PR Title Format

Follow the same convention as commits:
```
feat(treatment): add herb contraindication warnings
fix(scribe): handle silent audio segments
```

---

## Development Guidelines

### Frontend (Next.js)

- Use TypeScript strictly — no `any` types
- Components go in `src/components/`, pages in `src/app/`
- Use `shadcn/ui` for base UI components
- All API calls go through `src/lib/api.ts` — never fetch directly in components
- Use React Query (`@tanstack/react-query`) for server state
- Name components in PascalCase, hooks with `use` prefix

```tsx
// ✅ Good
const { data: patient } = usePatient(patientId);

// ❌ Bad
const [patient, setPatient] = useState(null);
useEffect(() => { fetch('/api/patients/...') }, []);
```

### Backend (FastAPI)

- Use Pydantic v2 models for all request/response schemas
- All business logic lives in `services/`, not in routers
- Use `async def` for all route handlers and service methods
- Handle errors with proper HTTP exceptions:

```python
# ✅ Good
from fastapi import HTTPException

async def get_patient(patient_id: str):
    patient = await db.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient
```

- Add docstrings to all service methods
- Every new endpoint needs a corresponding test in `tests/`

### AI / Prompts

- All prompts live in `apps/api/app/prompts/`
- Never hardcode prompts inside service files
- Prompts should always include:
  - System context (Ayurvedic domain grounding)
  - Output format specification (JSON schema)
  - Example input/output in the docstring

```python
# apps/api/app/prompts/prakriti.py

PRAKRITI_SYSTEM_PROMPT = """
You are an expert Ayurvedic physician...
[full prompt here]
"""
```

### Knowledge Base Changes

- New herb data goes in `packages/knowledge-base/herbs/formulations.json`
- New text chunks go in the appropriate folder under `packages/knowledge-base/texts/`
- After adding new texts, re-run `python scripts/ingest.py` and note the updated vector count in your PR

---

## Module Ownership

| Module | Owner | Description |
|---|---|---|
| AI Scribe | TBD | Audio recording, Whisper integration, note generation |
| Prakriti Engine | TBD | Dosha assessment, constitution scoring |
| Treatment Advisor | TBD | RAG pipeline, herb & treatment recommendations |
| Risk Flagging | TBD | Red flag detection, referral alerts |
| Patient Reports | TBD | PDF generation, report templates |
| Knowledge Base | TBD | Ayurvedic text ingestion, vector DB |
| Frontend Shell | TBD | Auth, dashboard, routing, shared components |

*Tag the module owner in your PR if your changes touch their area.*

---

## Questions?

Open a [GitHub Discussion](../../discussions) or ping the team on your communication channel.
