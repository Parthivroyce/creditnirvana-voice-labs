# CreditNirvana Voice Labs — Comprehensive Design Note
**Author:** Candidate (Prompt Engineer Intern Candidate)  
**Role:** Prompt Engineer Intern (Voice AI & Agentic AI)  
**Evaluation Company:** CreditNirvana  
**Target Recruiter:** Ambuj Pratap Jain  
**Date:** October 2026  

---

## 1. WHY EACH AGENT HAS ITS PARTICULAR PERSONA

### Agent 1: Priya Sharma — Senior Loan Settlement Specialist
- **Persona Archetype:** Firm, direct, commercially assertive, empathetic yet unwavering.
- **Psychological Rationale:** In recovery and debt settlement for 8-month delinquent accounts (240+ DPD), customers have typically avoided previous automated reminders and possess high inertia or defensive hostility. A passive or overly deferential bot is easily dismissed, while an aggressive bot breaches RBI guidelines and damages brand reputation. 
- **Linguistic Design:** Priya speaks with clear conviction, using declarative statements rather than timid questions ("The bank has authorized a full waiver of ₹2,50,000" rather than "Would you like a discount?"). She acknowledges genuine distress without conceding financial ground, redirecting emotional stalling toward structured financial resolution (e.g. 2 tranches of ₹2,00,000).
- **Spoken Cadence:** 30–45 words per turn. Fast, crisp sentences optimized for telephonic turn-taking to prevent caller barge-in or disengagement.

### Agent 2: Rajesh Nair — Senior Motor Insurance Advisor
- **Persona Archetype:** Consultative, trusted expert, transparent, energetic, and value-oriented.
- **Psychological Rationale:** Car insurance renewals in India suffer from rapid commoditization due to digital aggregators (PolicyBazaar, Acko). Customers view insurance as a grudge purchase and focus solely on the bottom-line price. Rajesh's persona shifts the conversation from "price competition" to "risk mitigation".
- **Linguistic Design:** Rather than defending the ₹15,000 price point defensively, Rajesh acts as an insider who audits competitor policies, revealing how low-cost quotes achieve their numbers by stripping Zero Dep and lowering IDV.
- **Spoken Cadence:** Conversational and energetic with educational storytelling around Brezza engine risks during waterlogging.

---

## 2. HOW OBJECTION HANDLING WORKS

### Personal Loan Settlement Matrix
| Customer Objection | Psychological Trigger | Agent Strategy | Concrete Verbiage |
|---|---|---|---|
| **Severe Financial Hardship** | Overwhelmed, helplessness, evasion | Empathetic validation + Re-anchor on the ₹2.5L loss absorbed by bank | "I hear you, and that is exactly why the committee authorized waiving ₹2,50,000. Let us clear the bare principal of ₹4,00,000 so this liability stops compounding." |
| **₹1.5L / ₹2L Lowball Offer** | Anchoring bias, testing bot flexibility | Hard boundary rejection + Structured installment counteroffer | "₹4,00,000 is the exact principal borrowed; the bank cannot waive borrowed capital. We can, however, split the ₹4,00,000 into two installments of ₹2,00,000 across 10 days." |
| **Legal Threat / Hostility** | Aggressive defense, intimidation | De-escalation + Accurate civil recovery & credit disclosure | "You have every right to legal counsel. However, our proposed settlement completely dismisses all interest and penal charges, sparing you protracted litigation and bureau default." |
| **Stalling ("Call next month")** | Avoidance, status-quo bias | Concession expiry + Loss aversion | "This special settlement quota is tied to the current recovery month. Delaying risks revocation of the ₹2,50,000 waiver, returning liability to ₹6,50,000." |

### Car Insurance Renewal Matrix
| Customer Objection | Competitor Trick Uncovered | Agent Counter-Strategy |
|---|---|---|
| **"Competitor quote is ₹12,000"** | Online aggregators silently lower Brezza IDV from ₹8L to ₹6.5L and drop Zero Depreciation (50% out-of-pocket parts liability). | Factual policy audit: Contrast ₹3,000 saving with ₹40,000 out-of-pocket repair bills on plastic/fiber bumper replacement. |
| **"Why decrease IDV to ₹8,00,000?"** | Misunderstanding vehicle depreciation vs claim payout mechanics. | Explain IRDAI statutory depreciation: Inflating IDV only inflates premium without surveyor claim payout. ₹8L is the sweet spot. |
| **"Skip Zero Dep / Engine Cover"** | Customer underestimates monsoon repair costs on sub-4m SUVs. | Highlight Brezza water ingression risk: Engine hydrostatic lock repair costs ₹80,000; covered completely by our ₹15,000 package. |

---

## 3. HOW CONVERSION IS OPTIMIZED

1. **Anchoring & Framing:**
   - In Loan Settlement, the agent introduces the gross liability (₹6,50,000) first, framing the ₹4,00,000 settlement as an immediate ₹2,50,000 gain.
   - In Insurance, the agent frames ₹15,000 as a 25% discount off the ₹20,000 listed benchmark.
2. **Commitment Escalation (Foot-in-the-Door):**
   - Step 1: Verbal acknowledgment of the numbers.
   - Step 2: Agreement on payment channel (UPI vs NetBanking).
   - Step 3: Exact deadline confirmation (e.g. "by 5:00 PM tomorrow").
3. **Frictionless Handoff:**
   - Real-time generation of secure SMS/WhatsApp payment link during the call.

---

## 4. HOW COMPLIANCE IS ENFORCED

1. **Pre-Disclosure KYC Gate:**
   - Under RBI Fair Practices Code for Recovery, debt details cannot be disclosed to third parties. Priya Sharma verifies the customer via Date of Birth or the last 4 digits of PAN before uttering ₹6,50,000.
2. **Zero Abuse & Anti-Harassment:**
   - Real-time toxicity filtering. Never use threats of police arrest, non-bailable warrants, or physical home visits.
3. **Truthful Legal Disclosures:**
   - Distinguishes between civil recovery suits (Section 138 NI Act for bounced cheques / summary suits) and criminal proceedings.
4. **IRDAI Solicitation Code:**
   - Prohibits promising fictitious garage partnerships or claiming a policy is active prior to premium clearance.

---

## 5. HOW VOICE PROCESSING WORKS (PIPELINE ARCHITECTURE)

```
[Customer Spoken Input]
        │
        ▼
[Microphone Audio Stream (16kHz PCM)]
        │
        ├──────────────────────────────────────┐
        ▼                                      ▼
[Sarvam Saari:v2 STT / Web Speech API]  [Web Audio Dual-Channel Mixer]
        │                                      │ (Mixed with Agent Audio)
        ▼                                      ▼
[Text Transcript + Confidence]          [Downloadable WAV/WebM Call Recording]
        │
        ▼
[CreditNirvana LLM Engine / Gemini 3.8]
  (System Prompt + Dialogue History)
        │
        ▼
[Synthesized Response (Low-Latency)]
        │
        ▼
[Sarvam Bulbul:v2 TTS / Indian Voices (Meera / Arvind)]
        │
        ▼
[Audio Output Playback (24kHz WAV)] ───┘
```

- **Speech-to-Text (STT):** Configured for Sarvam Saari:v2 with Indian accent recognition (en-IN / hi-IN). High robustness against Indian names, currency figures (Lakhs, Crores), and automotive terminology.
- **Text-to-Speech (TTS):** Sarvam Bulbul:v2 with voices 'Meera' (warm yet assertive professional female) and 'Arvind' (consultative, articulate male).
- **Latency Optimization:** Responses are capped at 40 words per chunk to enable fast first-byte streaming (~400ms time-to-first-audio).
- **Barge-in / Interruption Handling:** Speech synthesizer aborts on user voice onset detection, clearing the output buffer instantly.

---

## 6. HOW DIFFICULT-CUSTOMER TESTS ARE EVALUATED

Conversation turns are evaluated across 5 weighted dimensions (0–10 each, normalized to 100):
1. **Identity & Privacy (20%):** Verified caller before debt disclosure.
2. **Negotiation Boundary (20%):** Preserved ₹4L floor (Loan) and ₹15k floor (Insurance).
3. **Factual & Mathematical Accuracy (20%):** Accurate balances, waivers, and discounts.
4. **Regulatory & Tone Compliance (20%):** Zero threats, zero abuse, fair disclosures.
5. **Closing Effectiveness (20%):** Definite date, amount, and payment mode obtained.

---

## 7. WHAT WAS ACTUALLY IMPLEMENTED AND TESTED

- **Full-Stack Application:** Express + Vite + React 19 + TypeScript with server-side proxy routes for Sarvam AI and Gemini.
- **Dual-Channel Audio Mixer:** Authentic browser Web Audio API graph capturing both user microphone input and synthetic agent speech into a single downloadable .webm / .wav file with waveform visualizer.
- **Live Automated Test Suite:** 12 automated test cases verifying mathematical invariants, negotiation bounds, and compliance rules.
- **Interactive Difficult-Customer Simulator:** Ready-to-run scenarios testing both agents against tough objections.
- **Submission Deliverables Hub:** Downloadable system prompts, design note, test reports, and recruiter email.
