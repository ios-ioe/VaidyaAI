# VaidyaAI API Reference

Base URL (local): `http://localhost:8000`
Base URL (production): `https://your-org-vaidya-api.hf.space`

Interactive docs: `{BASE_URL}/docs` (Swagger UI)

All endpoints require `Authorization: Bearer <token>` unless marked public.

---

## Authentication

### POST `/api/auth/login`
```json
Request:  { "email": "dr@clinic.com", "password": "..." }
Response: { "access_token": "...", "token_type": "bearer" }
```

### POST `/api/auth/register`
```json
Request:  { "name": "Dr. Sharma", "email": "...", "password": "...", "clinic_name": "..." }
Response: { "id": "uuid", "email": "...", "name": "..." }
```

---

## Scribe (AI Consultation Notes)

### POST `/api/scribe/transcribe`
Upload audio file → returns transcription.

```
Content-Type: multipart/form-data
Body: audio_file (mp3/wav/m4a, max 25MB)
      language: "hi" | "ne" | "en" (optional, auto-detected)
```

```json
Response:
{
  "transcript": "Patient is complaining of disturbed sleep...",
  "language_detected": "en",
  "duration_seconds": 180
}
```

### POST `/api/scribe/generate-notes`
Convert transcript → structured Ayurvedic case note.

```json
Request:
{
  "transcript": "...",
  "patient_id": "uuid",
  "session_id": "uuid"
}

Response:
{
  "chief_complaint": "...",
  "rogi_pariksha": {
    "nadi": "Vata-Pitta",
    "jihva": "...",
    "mala": "...",
    "mutra": "..."
  },
  "presenting_symptoms": ["disturbed sleep", "bloating"],
  "duration": "3 months",
  "aggravating_factors": ["...", "..."],
  "clinical_impression": "...",
  "raw_notes": "Full structured markdown notes..."
}
```

---

## Assessment (Prakriti / Vikriti)

### POST `/api/assessment/prakriti`
Generate Prakriti & Vikriti assessment from consultation transcript.

```json
Request:
{
  "transcript": "...",
  "patient_id": "uuid",
  "prior_prakriti": null  // or existing assessment
}

Response:
{
  "prakriti": {
    "vata": 45,
    "pitta": 35,
    "kapha": 20,
    "dominant": "Vata",
    "secondary": "Pitta",
    "type": "Vata-Pitta"
  },
  "vikriti": {
    "vata": 60,
    "pitta": 30,
    "kapha": 10,
    "imbalance": "Vata aggravation"
  },
  "confidence": 0.82,
  "reasoning": "Patient exhibits classic Vata disturbance: disturbed sleep, bloating, anxiety..."
}
```

---

## Treatment (Recommendations)

### POST `/api/treatment/recommend`
Generate treatment plan with herb suggestions, Panchakarma, diet & lifestyle.

```json
Request:
{
  "prakriti": { "vata": 45, "pitta": 35, "kapha": 20 },
  "vikriti": { "vata": 60, "pitta": 30, "kapha": 10 },
  "chief_complaint": "disturbed sleep, bloating",
  "patient_id": "uuid"
}

Response:
{
  "herbs": [
    {
      "name": "Ashwagandha",
      "sanskrit": "Withania somnifera",
      "dose": "500mg twice daily",
      "form": "churna with warm milk",
      "rationale": "Adaptogen, reduces Vata, promotes sleep",
      "contraindications": ["pregnancy"],
      "source_reference": "Charaka Samhita, Sutrasthana 25.40"
    }
  ],
  "panchakarma": ["Abhyanga", "Shirodhara"],
  "diet": {
    "favor": ["warm foods", "ghee", "sesame"],
    "avoid": ["raw salads", "cold drinks", "excess travel"]
  },
  "lifestyle": ["sleep by 10pm", "oil massage daily", "gentle yoga"],
  "follow_up_weeks": 4
}
```

### GET `/api/treatment/herbs/search?q={query}`
Search herb/formulation database.

```json
Response:
{
  "results": [
    { "name": "Ashwagandha", "actions": [...], "contraindications": [...] }
  ]
}
```

---

## Patients

### POST `/api/patients`
Create new patient.

```json
Request:
{
  "name": "Ramesh Kumar",
  "age": 42,
  "gender": "male",
  "phone": "+977...",
  "address": "Kathmandu"
}
```

### GET `/api/patients/{id}`
Get patient profile including Prakriti history.

### GET `/api/patients/{id}/consultations`
List all consultations for a patient.

---

## Reports

### POST `/api/reports/generate`
Generate patient-facing PDF report.

```json
Request:
{
  "patient_id": "uuid",
  "consultation_id": "uuid",
  "include_sections": ["prakriti", "treatment", "diet", "lifestyle"]
}

Response:
{
  "report_url": "https://storage.../report-uuid.pdf",
  "expires_at": "2024-12-31T00:00:00Z"
}
```

---

## Risk Flagging

### POST `/api/risk/evaluate`
Evaluate transcript for red-flag symptoms.

```json
Request: { "transcript": "...", "patient_id": "uuid" }

Response:
{
  "risk_level": "low" | "medium" | "high",
  "flags": [
    {
      "symptom": "chest pain with exertion",
      "concern": "Possible cardiac origin",
      "action": "Refer to cardiologist immediately"
    }
  ],
  "referral_recommended": false
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Patient not found",
  "status_code": 404
}
```

| Code | Meaning |
|---|---|
| 400 | Bad request / validation error |
| 401 | Unauthorized — invalid or missing token |
| 403 | Forbidden — insufficient permissions |
| 404 | Resource not found |
| 422 | Unprocessable entity |
| 500 | Internal server error |
