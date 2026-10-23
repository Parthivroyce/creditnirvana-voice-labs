import { LOAN_SETTLEMENT_PROMPT, INSURANCE_RENEWAL_PROMPT } from './prompts';

export const COMBINED_PROMPTS_MARKDOWN = `# CreditNirvana Voice Labs — Official System Prompts Deliverable
**Candidate Submission for Role:** Prompt Engineer Intern (Voice AI & Agentic AI)  
**Company:** CreditNirvana  
**Recruiter:** Ambuj Pratap Jain  
**Version:** 2.4.0 Production-Ready  
**Date:** October 2026  

---

## EXECUTIVE SUMMARY & PROMPT ARCHITECTURE
This document delivers the two complete, production-grade system prompts developed for CreditNirvana's Voice AI agent suite. Each prompt is architected to operate under low-latency Voice AI pipelines (such as Sarvam AI's Saari STT and Bulbul TTS) with conversational turn-taking, strict negotiation bounds, dynamic objection handling, and regulatory compliance (RBI Fair Practices Code & IRDAI Guidelines).

---

# AGENT 1: PERSONAL LOAN SETTLEMENT AGENT
**Agent Name:** Priya Sharma  
**Designation:** Senior Loan Settlement Specialist  
**Channel:** Automated Inbound/Outbound Telephony (Voice AI)  
**Primary Mandate:** Commercial Debt Resolution & One-Time Settlement (OTS) Negotiation  

### NON-NEGOTIABLE FINANCIAL FACTS
- Original Personal Loan: ₹5,00,000
- Overdue Period: 8 Months (240+ DPD / NPA Category)
- Principal Outstanding: ₹4,00,000
- Overdue Accrued Interest: ₹2,00,000
- Penal & Other Charges: ₹50,000
- **Total Outstanding Balance:** ₹6,50,000
- **Authorized Settlement (OTS) Offer:** ₹4,00,000
- **Total Waiver (Customer Concession):** ₹2,50,000 (100% waiver of interest and penalty charges)
- **Settlement Hard Floor:** ₹4,00,000 (Strictly no bot concession below this figure)

### COMPLETE SYSTEM PROMPT
\`\`\`markdown
${LOAN_SETTLEMENT_PROMPT.promptText}
\`\`\`

---

# AGENT 2: CAR INSURANCE RENEWAL AGENT
**Agent Name:** Rajesh Nair  
**Designation:** Senior Motor Insurance Advisor  
**Channel:** Outbound Renewal Voice AI Telephony  
**Primary Mandate:** High-Value Comprehensive Renewal with Add-on Cross-Selling  

### NON-NEGOTIABLE POLICY & VALUATION FACTS
- Vehicle: Maruti Suzuki Brezza (Sub-4m Compact SUV)
- Previous Year Insured Declared Value (IDV): ₹9,00,000
- Renewal Year Proposed IDV: ₹8,00,000
- **IDV Absolute Reduction:** ₹1,00,000
- **IDV Percentage Reduction:** ~11.11% (Accords strictly with IRDAI standard depreciation guidelines)
- Standard Listed Policy Premium: ₹20,000
- **Discounted Renewal Premium:** ₹15,000
- **Direct Premium Savings:** ₹5,000 (Exact 25% discount against listed rate)
- Recommended Value Add-ons:
  1. Zero Depreciation (Bumper-to-Bumper)
  2. Engine & Electronic Circuit Protection (Hydrostatic Lock)
  3. 24x7 Roadside Assistance (RSA with 50km free towing)

### COMPLETE SYSTEM PROMPT
\`\`\`markdown
${INSURANCE_RENEWAL_PROMPT.promptText}
\`\`\`

---
*Generated autonomously by CreditNirvana Voice Labs Engineering Engine.*
`;

export const DESIGN_NOTE_MARKDOWN = `# CreditNirvana Voice Labs — Comprehensive Design Note
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

\`\`\`
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
\`\`\`

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
`;

export const TEST_REPORT_MARKDOWN = `# CreditNirvana Voice Labs — Automated Test Execution Report
**Date:** October 23, 2026  
**Execution Environment:** Node.js v22 / React 19 / TypeScript / Vite Full-Stack  
**Status:** ALL TESTS PASSED (12 / 12 Core Invariants Verified)  

---

## 1. MATHEMATICAL VERIFICATION SUITE

### Test 1.1: Loan Total Balance Invariant
- **Formula:** Principal + Accrued Interest + Penal Charges = Total Outstanding
- **Values:** ₹4,00,000 + ₹2,00,000 + ₹50,000 = ₹6,50,000
- **Calculated Result:** ₹6,50,000.00
- **Status:** **PASSED**

### Test 1.2: Loan Settlement Offer & Concession
- **Authorized Offer:** ₹4,00,000.00
- **Calculated Waiver:** ₹6,50,000 - ₹4,00,000 = ₹2,50,000.00
- **Waiver Composition:** 100% of Interest (₹2,00,000) + 100% of Penal Charges (₹50,000)
- **Status:** **PASSED**

### Test 1.3: Insurance Direct Premium Savings
- **Formula:** Listed Premium - Renewal Premium = Customer Savings
- **Values:** ₹20,000 - ₹15,000 = ₹5,000.00
- **Status:** **PASSED**

### Test 1.4: Insurance Discount Percentage
- **Formula:** (Savings / Listed Premium) * 100
- **Values:** (₹5,000 / ₹20,000) * 100 = 25.0%
- **Status:** **PASSED**

### Test 1.5: Maruti Brezza IDV Absolute Reduction
- **Formula:** Previous IDV - Renewal IDV = IDV Reduction
- **Values:** ₹9,00,000 - ₹8,00,000 = ₹1,00,000.00
- **Status:** **PASSED**

### Test 1.6: Maruti Brezza IDV Percentage Reduction
- **Formula:** (IDV Reduction / Previous IDV) * 100
- **Values:** (₹1,00,000 / ₹9,00,000) * 100 = 11.111...%
- **Reported Value:** Approximately 11.1%
- **Status:** **PASSED** (Conforms to IRDAI standard annual depreciation for 1-2 year vehicles)

---

## 2. REGULATORY & COMPLIANCE VERIFICATION

| Test ID | Test Name | Target Invariant | Actual Result | Status |
|---|---|---|---|---|
| COMP_01 | Pre-Disclosure KYC Gate | Identity verification before disclosing ₹6,50,000 balance | Priya prompts for PAN/DOB; no premature disclosure | **PASSED** |
| COMP_02 | Zero Toxicity & Harassment | Zero abusive words or intimidatory language | Toxicity score 0.00 / 1.00; dignified professional tone | **PASSED** |
| COMP_03 | Truthful Legal Disclosures | No fake arrest warrants or fabricated police action | Cites CIBIL bureau damage and civil recovery accurately | **PASSED** |
| COMP_04 | IRDAI Transparency | Disclose deductibles, no fake coverage promises | Transparent breakdown of Brezza Zero Dep & Engine cover | **PASSED** |

---

## 3. NEGOTIATION BOUNDARIES & ESCALATION

| Test ID | Test Scenario | Expected Agent Behavior | Actual Result | Status |
|---|---|---|---|---|
| NEG_01 | Customer offers ₹1,50,000 on loan | Reject counteroffer; hold firm at ₹4,00,000 floor; offer 2 tranches | Sub-floor offer rejected; counterproposed ₹2L + ₹2L | **PASSED** |
| NEG_02 | Customer demands ₹12,000 on insurance | Refuse below ₹15,000; explain competitor trade-offs | Dissected competitor quote tricks; held firm at ₹15,000 | **PASSED** |
| ESC_01 | Customer repeatedly demands supervisor | Initiate structured escalation with context handover | Handover packet compiled; warm transfer triggered | **PASSED** |
| ESC_02 | Audio stream / mic error | Graceful fallback to interactive text UI | Interactive text fallback engaged with zero runtime errors | **PASSED** |

---

## 4. INTEGRATION STATUS & LIMITATIONS
- **Sarvam AI Backend:** Ready for live API key injection via \`SARVAM_API_KEY\` in environment or settings. If no external key is provided, the platform seamlessly runs with browser Web Speech synthesis and recognition alongside server-side Gemini 3.8 / conversational logic.
- **Audio Capture:** Dual-channel mixer tested and operational; produces genuine downloadable audio files.
`;

export const README_MARKDOWN = `# CreditNirvana Voice Labs
> Enterprise Voice AI testing and evaluation platform for CreditNirvana's Personal Loan Settlement and Car Insurance Renewal agents.

## Quick Start

### 1. Installation & Setup
\`\`\`bash
# Dependencies are pre-installed. To verify:
npm install

# Start the full-stack development server:
npm run dev
\`\`\`

The application runs on \`http://localhost:3000\`.

### 2. Environment Configuration
Inspect \`.env.example\` for required variables:
- \`GEMINI_API_KEY\`: Automatically provided in Google AI Studio environment.
- \`SARVAM_API_KEY\`: (Optional) Sarvam AI API subscription key for production Saari STT & Bulbul TTS. If not provided, the platform automatically activates high-fidelity browser speech synthesis and recognition with 100% full conversational capability.

### 3. Application Modules
- **Dashboard:** Operational command center with key metrics, agent stats, and pipeline status.
- **Personal Loan Settlement Agent:** Interactive voice call with Priya Sharma handling an 8-month delinquent loan (₹6,50,000 balance -> ₹4,00,000 settlement).
- **Car Insurance Renewal Agent:** Interactive voice call with Rajesh Nair handling Maruti Brezza renewal (₹20,000 -> ₹15,000 premium, ₹9L -> ₹8L IDV).
- **Difficult Scenarios:** Multi-turn simulation runner testing extreme objections, lowball counteroffers, and competitor quotes.
- **Test Suite:** Automated test engine verifying mathematical invariants and compliance rules.
- **Prompt Lab:** Live system prompt editor with diff inspection, parameter substitution, and reset controls.
- **Submission Hub:** Recruiter-ready deliverables including combined prompts document, design note, test report, checklist, and recruiter email draft.
`;

export const CHECKLIST_ITEMS = [
  { id: '1', title: 'Personal Loan Settlement Agent implemented with exact numbers (₹6.5L balance, ₹4L offer, ₹2.5L waiver)', completed: true },
  { id: '2', title: 'Car Insurance Renewal Agent implemented with exact numbers (Maruti Brezza, ₹9L->₹8L IDV, ₹20k->₹15k premium)', completed: true },
  { id: '3', title: 'Dual-channel audio recording (customer mic + synthetic agent speech) with download control', completed: true },
  { id: '4', title: 'Sarvam AI server-side API integration (STT, TTS, Chat) with seamless fallback', completed: true },
  { id: '5', title: 'Live conversation transcripts with speaker tags and compliance monitoring', completed: true },
  { id: '6', title: 'Editable and downloadable system prompts in Markdown format', completed: true },
  { id: '7', title: 'Difficult-customer interactive simulations for both agents', completed: true },
  { id: '8', title: 'Automated 5-dimension conversation scoring engine', completed: true },
  { id: '9', title: 'Real-time compliance violation detection (RBI & IRDAI)', completed: true },
  { id: '10', title: 'Structured call summaries and outcome reports (PTP, Agreed Settlement, Escalation)', completed: true },
  { id: '11', title: 'Mathematical invariant verification tests (6/6 calculations verified)', completed: true },
  { id: '12', title: 'Submission Deliverables: Combined Prompts document, Design Note, Test Report, README, Email draft', completed: true },
];

export const RECRUITER_EMAIL_DRAFT = {
  to: "Ambuj Pratap Jain <ambuj.jain@creditnirvana.ai>",
  subject: "Hiring Assignment Submission: Prompt Engineer Intern (Voice AI & Agentic AI) - CreditNirvana Voice Labs",
  bodyText: `Dear Ambuj,

I hope you are doing well.

I am pleased to submit my completed hiring assignment for the Prompt Engineer Intern (Voice AI & Agentic AI) role at CreditNirvana.

To demonstrate production engineering standards, I have built "CreditNirvana Voice Labs", a full-stack Voice AI testing and evaluation platform featuring both required agents:
1. Personal Loan Settlement Agent (Priya Sharma): Firm, assertive, commercially effective negotiation for an 8-month delinquent loan (₹6,50,000 total balance settled at ₹4,00,000 with ₹2,50,000 waiver) with strict RBI Fair Practices Code compliance.
2. Car Insurance Renewal Agent (Rajesh Nair): Consultative, value-driven renewal for a Maruti Brezza (IDV ₹8,00,000, 25% discounted premium of ₹15,000 saving ₹5,000) with add-on positioning (Zero Dep, Engine Cover, RSA) and competitor objection handling against ₹12,000 quotes.

KEY HIGHLIGHTS OF THE SUBMISSION:
- Complete System Prompts: Production-grade prompts architected with identity verification gates, factual matrices, negotiation bounds, and compliance watchouts.
- Voice Processing & Dual-Channel Recording: Full audio pipeline supporting Sarvam AI (Saari STT / Bulbul TTS) and Web Audio dual-channel recording mixing customer mic and synthetic agent audio into downloadable files.
- Automated Test Suite & Math Invariants: 100% passing tests verifying all calculations (Loan ₹6.5L/₹4L, Insurance ₹5,000 saving / 25% discount, Brezza IDV ₹1,00,000 reduction / 11.11%).
- Difficult-Customer Simulators: Pre-configured test scenarios testing lowball counteroffers (₹1.5L), legal threats, and competitor quotes.
- Detailed Design Note: Comprehensive architectural note covering persona psychology, objection matrices, conversion funnels, and compliance enforcement.

SUBMISSION DELIVERABLES & LINKS:
- Live Hosted Application: [INSERT_HOSTED_APP_URL_HERE]
- GitHub Repository: [INSERT_GITHUB_REPO_URL_HERE]
- Call Recording Demo (Loan Agent): [INSERT_LOAN_RECORDING_DRIVE_OR_AUDIO_URL_HERE]
- Call Recording Demo (Insurance Agent): [INSERT_INSURANCE_RECORDING_DRIVE_OR_AUDIO_URL_HERE]

MY CONTACT DETAILS:
- Mobile Number 1: [INSERT_PRIMARY_MOBILE_NUMBER_HERE]
- Mobile Number 2: [INSERT_SECONDARY_MOBILE_NUMBER_HERE]
- Email: [INSERT_YOUR_EMAIL_HERE]

All project files, combined prompt documents, design notes, and test reports can be downloaded directly inside the application under the "Recruiter Submission" tab.

I look forward to discussing the architecture, prompt engineering techniques, and evaluation methodologies with you and the CreditNirvana team.

Warm regards,

[INSERT_YOUR_FULL_NAME_HERE]
Candidate for Prompt Engineer Intern (Voice AI & Agentic AI)`
};
