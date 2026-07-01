#!/usr/bin/env bash
# ============================================================================
# Test transcripts for Prakriti/Vikriti assessment
# ============================================================================
# Sends various consultation transcripts to the API and saves results.
# Share the output JSON files with a practitioner for accuracy review.
#
# Usage:
#   chmod +x test_transcripts.sh
#   ./test_transcripts.sh
#
# Output: ./assessment_results/*.json
# ============================================================================

set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:8000}"
OUT_DIR="assessment_results"
mkdir -p "$OUT_DIR"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Prakriti Assessment Test Suite"
echo "  Base URL: $BASE_URL"
echo "  Results:  $OUT_DIR/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CURL="curl -s -w '\n%{http_code}' -X POST $BASE_URL/api/assessment/prakriti"
HEADERS=(-H "Content-Type: application/json")

run_test() {
    local label="$1"
    local file="$2"
    echo ""
    echo "── $label ──"
    local tmp=$(mktemp)
    $CURL "${HEADERS[@]}" -d @"$file" > "$tmp" 2>/dev/null
    local body=$(head -n -1 "$tmp")
    local code=$(tail -n 1 "$tmp")
    echo "  HTTP $code"
    echo "$body" > "$OUT_DIR/${label}.json"
    echo "  → $OUT_DIR/${label}.json"
    rm -f "$tmp"
}

# ── Case 1: Classic Vata ─────────────────────────────────────────────────────
# Dry skin, insomnia, bloating, anxiety, irregular digestion, joint cracking
cat > /tmp/vata_transcript.json << 'EOF'
{
  "patient_id": "test-vata-001",
  "session_id": "test-vata-001-session",
  "language": "english",
  "transcript": "D: What brings you in today?\nP: I've been having very dry skin and I can't sleep well at night. My stomach is always bloated and I feel anxious all the time.\nD: How long has this been going on?\nP: About 3 months now, since I changed jobs. I travel a lot for work.\nD: How is your digestion?\nP: Very irregular. Sometimes I'm not hungry at all, other times I eat too much.\nD: Any joint pain or cracking sounds?\nP: Yes, my knees crack when I sit down. My hands and feet are always cold.\nD: What does your diet look like?\nP: Mostly cold food, salads, lots of raw vegetables. I skip breakfast often.\nD: How is your sleep?\nP: I wake up between 2 and 4 AM and my mind won't stop racing.\nD: Do you forget things easily?\nP: Yes, very forgetful lately. I walk into a room and forget why.\nD: Any constipation?\nP: Severe. I go every 3-4 days and it's very hard.\nD: How about your weight?\nP: I've lost about 5 kg without trying."
}
EOF

# ── Case 2: Classic Pitta ────────────────────────────────────────────────────
# Acidity, heartburn, anger, inflammation, burning sensation, loose stools
cat > /tmp/pitta_transcript.json << 'EOF'
{
  "patient_id": "test-pitta-001",
  "session_id": "test-pitta-001-session",
  "language": "english",
  "transcript": "D: What seems to be the problem?\nP: I have terrible heartburn after every meal and my stomach burns constantly.\nD: How long have you had this?\nP: About 2 months. It started getting worse after I began working night shifts.\nD: How is your appetite?\nP: Very strong. I get extremely hungry, almost hangry, if I skip a meal.\nD: Any skin issues?\nP: Yes, I keep getting red rashes and my face is always flushed. I break out easily.\nD: How is your temper?\nP: I've been very irritable and short-tempered. Small things set me off.\nD: Bowel movements?\nP: Loose stools, sometimes urgent. I go 3-4 times a day.\nD: Do you feel hot most of the time?\nP: Yes, I sweat a lot and my feet burn at night. I always want cold drinks.\nD: Any inflammation?\nP: My gums bleed when I brush and my eyes are often red and burning.\nD: What foods do you prefer?\nP: Spicy food, fried food, coffee — I love all of it.\nD: Do you judge yourself or others harshly?\nP: Yes, I'm very critical of myself and others."
}
EOF

# ── Case 3: Classic Kapha ────────────────────────────────────────────────────
# Weight gain, lethargy, congestion, mucus, slow digestion, oversleeping
cat > /tmp/kapha_transcript.json << 'EOF'
{
  "patient_id": "test-kapha-001",
  "session_id": "test-kapha-001-session",
  "language": "english",
  "transcript": "D: What brings you here today?\nP: I feel heavy and sluggish all the time. I've gained about 8 kg in the last few months.\nD: How is your digestion?\nP: Very slow. I feel full after eating just a little. Food sits heavy in my stomach.\nD: How is your sleep?\nP: I sleep 9-10 hours but still wake up tired. I struggle to get out of bed.\nD: Do you have any congestion?\nP: Yes, I always have mucus in my throat, especially in the morning. My nose is stuffy.\nD: Any respiratory issues?\nP: I get colds easily and they last a long time. Lots of phlegm.\nD: How about your skin?\nP: Oily and pale. My hair is very oily too.\nD: Are you active?\nP: Not really. I feel too heavy to exercise. I just want to stay home.\nD: How is your mood?\nP: Low energy, low mood. I feel lethargic and unmotivated.\nD: What foods do you crave?\nP: Sweet things, dairy, bread. Comfort food.\nD: Any water retention?\nP: Yes, my ankles swell by the evening."
}
EOF

# ── Case 4: Vata-Pitta mixed ──────────────────────────────────────────────────
# Dryness + burning, anxiety + irritability, constipation + acidity
cat > /tmp/vata_pitta_transcript.json << 'EOF'
{
  "patient_id": "test-vata-pitta-001",
  "session_id": "test-vata-pitta-001-session",
  "language": "english",
  "transcript": "D: What's bothering you?\nP: I have both constipation and acidity at the same time. It's very confusing.\nD: Tell me more.\nP: I feel burning in my chest but also bloated and gassy. My stomach makes loud noises.\nD: Sleep?\nP: I can't fall asleep because my mind races, but when I do sleep I get night sweats.\nD: Skin?\nP: Dry in some places, but I also get red rashes and pimples. Paradoxical.\nD: Energy levels?\nP: Fluctuating wildly. Some days I'm wired but tired, other days I crash completely.\nD: How is your appetite?\nP: Sometimes ravenous, sometimes no appetite at all.\nD: Emotional state?\nP: Anxious and angry. I worry a lot and then get frustrated easily.\nD: Any burning sensations?\nP: Yes, burning in my stomach and my feet feel like they're on fire at night.\nD: Thirst?\nP: Very thirsty all the time, but cold drinks make my bloating worse.\nD: What makes it worse?\nP: Stress. When I'm under pressure, everything flares up."
}
EOF

# ── Case 5: Kapha-Vata mixed (slow + irregular) ──────────────────────────────
# Weight gain + bloating, lethargy + anxiety, slow digestion + constipation
cat > /tmp/kapha_vata_transcript.json << 'EOF'
{
  "patient_id": "test-kapha-vata-001",
  "session_id": "test-kapha-vata-001-session",
  "language": "english",
  "transcript": "D: What brings you in?\nP: I feel heavy and bloated but also anxious and restless at the same time.\nD: How does that manifest?\nP: In the morning I can barely get out of bed — I feel so heavy. But by evening my mind is racing.\nD: Digestion?\nP: Very slow and irregular. I get constipated for days, then suddenly loose.\nD: Weight?\nP: I've gained weight around my belly but I also feel thin in my arms and legs.\nD: Respiratory issues?\nP: I have a chronic cough with phlegm. My chest always feels congested.\nD: Sleep?\nP: I sleep deeply but then wake up at 3 AM and can't go back to sleep.\nD: Joints?\nP: My knees hurt and feel stiff. They crack when I stand up.\nD: Mood?\nP: I feel low and unmotivated, but also scared and worried underneath.\nD: Food preferences?\nP: I love warm, oily food but I also eat a lot of bread and sweets.\nD: What season is worse?\nP: Winter is terrible — I feel completely stuck."
}
EOF

# ── Case 6: Pitta-Kapha mixed (inflammatory + heavy) ─────────────────────────
# Acidity + congestion, anger + lethargy, inflammation + weight gain
cat > /tmp/pitta_kapha_transcript.json << 'EOF'
{
  "patient_id": "test-pitta-kapha-001",
  "session_id": "test-pitta-kapha-001-session",
  "language": "english",
  "transcript": "D: What's your main complaint?\nP: I have constant heartburn and my sinuses are always blocked. Two problems at once.\nD: How long?\nP: Years. It gets worse after eating.\nD: Describe your digestion.\nP: I get burning pain but also feel heavy and slow. Food just sits there.\nD: Weight?\nP: I'm overweight, especially around the belly. I can't lose weight no matter what.\nD: Skin?\nP: Oily with acne, but also red and inflamed patches.\nD: Energy?\nP: I feel both irritable and sluggish. It's a strange combination.\nD: Do you get hot or cold?\nP: I feel hot most of the time but I also have heavy sweating and sticky sweat.\nD: Appetite?\nP: Strong appetite but I feel dull after eating large meals.\nD: Emotional state?\nP: I get angry and frustrated, then feel guilty and withdraw.\nD: Any other symptoms?\nP: My joints are both swollen and stiff. I have psoriasis on my elbows.\nD: Diet?\nP: I love fried and spicy food. Also a lot of dairy and sweets."
}
EOF

# ── Case 7: Healthy / balanced ───────────────────────────────────────────────
# Minimal symptoms — should show mild/no imbalance
cat > /tmp/balanced_transcript.json << 'EOF'
{
  "patient_id": "test-balanced-001",
  "session_id": "test-balanced-001-session",
  "language": "english",
  "transcript": "D: What brings you in? Any health concerns?\nP: Nothing specific. I just came for a general checkup.\nD: How have you been feeling overall?\nP: Pretty good. I feel energetic, sleep well, and have regular digestion.\nD: Sleep?\nP: I sleep 7-8 hours and wake up feeling refreshed.\nD: Digestion?\nP: Regular bowel movements once or twice a day. No bloating or discomfort.\nD: Appetite?\nP: Normal appetite. I eat three balanced meals a day.\nD: Skin and hair?\nP: Healthy, no major issues.\nD: Energy levels?\nP: Consistent throughout the day. I exercise regularly.\nD: Stress?\nP: Normal work stress but I manage it well with meditation and walks.\nD: Weight?\nP: Stable for years.\nD: Any recurrent illnesses?\nP: No, I rarely get sick.\nD: Any other concerns?\nP: None. Just want to make sure everything is fine."
}
EOF

# ── Case 8: Post-partum Vata (common clinical scenario) ──────────────────────
cat > /tmp/postpartum_vata.json << 'EOF'
{
  "patient_id": "test-postpartum-001",
  "session_id": "test-postpartum-001-session",
  "language": "english",
  "transcript": "D: How are you feeling after the delivery?\nP: Exhausted. I had a C-section 6 weeks ago and I feel completely drained.\nD: How is your sleep?\nP: The baby wakes up frequently and I can't fall back asleep. I'm sleep deprived.\nD: Digestion?\nP: Very weak. I have no appetite and feel bloated after eating anything.\nD: Any body pains?\nP: My lower back hurts constantly. My joints feel loose and crackly.\nD: Mood?\nP: Very anxious. I worry constantly about the baby. I feel overwhelmed.\nD: Breastfeeding?\nP: Low milk supply. The lactation consultant said I'm not producing enough.\nD: Any other symptoms?\nP: Hair is falling out a lot. My skin is very dry. Hands and feet are always cold.\nD: Thirst?\nP: Not very thirsty. I forget to drink water.\nD: Bowel movements?\nP: Constipated. I'm afraid to strain because of the C-section stitches.\nD: What do you crave?\nP: Warm soups and comfort food. Cold things don't appeal to me."
}
EOF

# ── Case 9: Metabolic Pitta (NAFLD / metabolic syndrome pattern) ──────────────
cat > /tmp/metabolic_pitta.json << 'EOF'
{
  "patient_id": "test-metabolic-001",
  "session_id": "test-metabolic-001-session",
  "language": "english",
  "transcript": "D: Your recent blood work shows elevated liver enzymes and cholesterol. How do you feel?\nP: I've been feeling tired but wired. I can't sleep properly.\nD: Diet?\nP: I eat a lot of fried food, red meat, and drink 3-4 cups of coffee a day.\nD: Alcohol?\nP: 2-3 beers most nights. Sometimes more on weekends.\nD: Digestion?\nP: I get heartburn after eating. My stools are yellowish and loose.\nD: Any pain?\nP: Dull pain on my right side under the ribs. It's there most of the time.\nD: Skin?\nP: My face is red and I have small red spots on my chest. My palms are red too.\nD: Urine?\nP: Dark yellow, sometimes brownish in the morning.\nD: Weight?\nP: Gained about 10 kg in the last year, mostly around the belly.\nD: Sweating?\nP: Excessive sweating, especially at night. My sweat smells strong.\nD: Emotional state?\nP: Irritable and impatient. I feel angry a lot of the time."
}
EOF

# ── Case 10: Seasonal Kapha (spring allergy pattern) ──────────────────────────
cat > /tmp/seasonal_kapha.json << 'EOF'
{
  "patient_id": "test-seasonal-001",
  "session_id": "test-seasonal-001-session",
  "language": "english",
  "transcript": "D: What brings you in today?\nP: It's spring and every year at this time I get terrible allergies.\nD: Symptoms?\nP: Runny nose, watery eyes, sneezing fits, and I feel heavy and tired.\nD: Congestion?\nP: Yes, my chest feels full of mucus. I cough up white phlegm in the morning.\nD: Energy?\nP: Very low. I feel like I need to hibernate. It's hard to get out of bed.\nD: Weight?\nP: I gain weight every spring, about 3-4 kg, even though I eat the same.\nD: Digestion?\nP: Slow. Food feels heavy and I get bloated easily.\nD: Skin?\nP: Pale and puffy. My face looks swollen in the morning.\nD: Sleep?\nP: I oversleep — 10 hours but still wake up groggy.\nD: Appetite?\nP: Not hungry but I still eat out of habit. I crave sweets and bread.\nD: Joints?\nP: Stiff in the morning, especially my hands and knees. Better after moving around.\nD: What helps?\nP: Warmth and dry weather. Exercise helps but it's hard to start."
}
EOF

# ── Run all tests ─────────────────────────────────────────────────────────────
run_test "01-vata"             /tmp/vata_transcript.json
run_test "02-pitta"            /tmp/pitta_transcript.json
run_test "03-kapha"            /tmp/kapha_transcript.json
run_test "04-vata-pitta"       /tmp/vata_pitta_transcript.json
run_test "05-kapha-vata"       /tmp/kapha_vata_transcript.json
run_test "06-pitta-kapha"      /tmp/pitta_kapha_transcript.json
run_test "07-balanced"         /tmp/balanced_transcript.json
run_test "08-postpartum-vata"  /tmp/postpartum_vata.json
run_test "09-metabolic-pitta"  /tmp/metabolic_pitta.json
run_test "10-seasonal-kapha"   /tmp/seasonal_kapha.json

# ── Cleanup temp files ────────────────────────────────────────────────────────
rm -f /tmp/vata_transcript.json \
      /tmp/pitta_transcript.json \
      /tmp/kapha_transcript.json \
      /tmp/vata_pitta_transcript.json \
      /tmp/kapha_vata_transcript.json \
      /tmp/pitta_kapha_transcript.json \
      /tmp/balanced_transcript.json \
      /tmp/postpartum_vata.json \
      /tmp/metabolic_pitta.json \
      /tmp/seasonal_kapha.json

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  All done. ${OUT_DIR}/ has the results."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
