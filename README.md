# CreditNirvana Voice Labs
> Enterprise Voice AI testing and evaluation platform for CreditNirvana's Personal Loan Settlement and Car Insurance Renewal agents. Built for the **Prompt Engineer Intern (Voice AI & Agentic AI)** hiring assignment.

---

## 1. Executive Overview

CreditNirvana Voice Labs is a production-grade Voice AI platform containing two distinct, human-like voice agents:
1. **Personal Loan Settlement Agent (Priya Sharma)**: Negotiates One-Time Settlement (OTS) for an 8-month delinquent loan (₹6,50,000 total balance settled at ₹4,00,000 with ₹2,50,000 interest/charges waiver). Enforces RBI Fair Practices Code, pre-disclosure KYC verification, and commercial negotiation bounds.
2. **Car Insurance Renewal Agent (Rajesh Nair)**: Manages comprehensive renewal for a Maruti Suzuki Brezza (Renewal IDV ₹8,00,000, 25% discounted premium of ₹15,000 saving ₹5,000). Handles ₹12,000 aggregator quotes, justifies 11.1% IDV depreciation, and cross-sells Zero Dep, Engine Protection, and RSA.

---

## 2. Core Mathematical Verifications (100% Invariant Compliant)
- **Loan Total:** Principal (₹4,00,000) + Interest (₹2,00,000) + Charges (₹50,000) = **₹6,50,000**
- **Settlement Offer:** **₹4,00,000** with **₹2,50,000** waiver (100% interest & penal charges waiver)
- **Insurance Premium Saving:** Listed Premium (₹20,000) - Discounted Premium (₹15,000) = **₹5,000**
- **Discount Percentage:** (₹5,000 / ₹20,000) * 100 = **25.0%**
- **Maruti Brezza IDV Reduction:** Previous IDV (₹9,00,000) - Renewal IDV (₹8,00,000) = **₹1,00,000**
- **IDV Percentage Reduction:** (₹1,00,000 / ₹9,00,000) * 100 = **11.11% (~11.1%)**

---

## 3. Technology Stack & Audio Pipeline
- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion.
- **Backend:** Node.js, Express, TSX, `@google/genai` (Gemini 3.8 Flash).
- **Speech Processing:**
  - **Speech-to-Text (STT):** Sarvam AI `saarika:v2` API / Web Speech API.
  - **Text-to-Speech (TTS):** Sarvam AI `bulbul:v2` API ('meera' & 'arvind' voices) / Browser SpeechSynthesis fallback.
  - **Dual-Channel Recording:** Web Audio API (`AudioContext`, `MediaStreamAudioDestinationNode`, `MediaRecorder`) mixing customer microphone input and agent synthetic voice into downloadable `.webm` / `.wav` audio.
  - **Barge-in / Interruption:** Real-time cancellation of agent speech upon customer voice onset detection.

---

## 4. Quick Start & Setup

### Prerequisites
- Node.js 18+ (tested on v22)
- npm 9+

### Run Dev Server
```bash
# Start the full-stack server (runs on port 3000)
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 5. Recruiter Deliverables

All deliverables are available directly inside the application under the **"Recruiter Submission"** tab and in the repository under `/docs`:
- **Combined System Prompts Document:** `/docs/COMBINED_SYSTEM_PROMPTS.md`
- **Architectural Design Note:** `/docs/DESIGN_NOTE.md`
- **Test Execution Report:** `/docs/TEST_REPORT.md`
- **Recruiter Email Draft:** `/docs/RECRUITER_EMAIL_DRAFT.md`
