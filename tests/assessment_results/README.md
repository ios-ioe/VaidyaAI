# Prakriti Assessment — Test Results

*Generated for practitioner validation — review alongside your clinical judgment.*

## Test Cases

| # | File | Scenario | Expected Dominant |
|---|------|----------|-------------------|
| 01 | `01-vata.json` | Dry skin, insomnia, bloating, anxiety, irregular digestion, joint cracking, cold extremities, constipation, weight loss | **Vata** |
| 02 | `02-pitta.json` | Heartburn, strong appetite, rashes, irritability, loose stools, sweating, burning feet, red eyes | **Pitta** |
| 03 | `03-kapha.json` | Weight gain, lethargy, congestion, mucus, slow digestion, oversleeping, oily skin, water retention | **Kapha** |
| 04 | `04-vata-pitta.json` | Mixed constipation + acidity, anxiety + irritability, fluctuating energy, paradoxical dry+burning skin | **Vata-Pitta** |
| 05 | `05-kapha-vata.json` | Heavy + bloated + anxious, slow + irregular digestion, weight gain + thin limbs, congested + restless | **Kapha-Vata** |
| 06 | `06-pitta-kapha.json` | Heartburn + sinus congestion, anger + lethargy, inflammation + weight gain, psoriasis | **Pitta-Kapha** |
| 07 | `07-balanced.json` | No complaints, good sleep, regular digestion, stable weight, exercises, manages stress | **Balanced** (minimal imbalance) |
| 08 | `08-postpartum-vata.json` | Post-C-section exhaustion, sleep deprivation, low appetite, back pain, anxiety, low milk supply | **Vata** (post-partum) |
| 09 | `09-metabolic-pitta.json` | Elevated LFTs/cholesterol, fatty diet + alcohol, heartburn, right-side pain, red palms, night sweats | **Pitta** (metabolic) |
| 10 | `10-seasonal-kapha.json` | Spring allergies, congestion, phlegm, weight gain, oversleeping, stiffness, grogginess | **Kapha** (seasonal) |

## What to Check

For each result, review:

1. **Prakriti** (constitution) — should match the expected dominant dosha
2. **Vikriti** (imbalance) — the imbalance description and whether the scores reflect severity
3. **Confidence** — how certain was the model (0–1)
4. **Reasoning** — does the clinical reasoning make sense?
5. **Citations** — are the referenced classical texts appropriate?

## Running

```bash
# Ensure the API is running, then:
./test_transcripts.sh
```
