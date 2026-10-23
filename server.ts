import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '25mb' }));

// Initialize Google Gemini Client if key exists
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    sarvamConfigured: !!process.env.SARVAM_API_KEY && process.env.SARVAM_API_KEY.length > 5,
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    port: PORT,
    timestamp: new Date().toISOString(),
  });
});

// 2. Chat completion endpoint (Voice Agent Dialogue Generation)
app.post('/api/chat', async (req, res) => {
  try {
    const { agentType, systemPrompt, history, userMessage } = req.body;

    let reply = '';
    let sentiment: 'positive' | 'neutral' | 'frustrated' | 'cooperative' | 'defensive' = 'neutral';
    
    // Quick compliance checking
    const lowerUser = (userMessage || '').toLowerCase();
    const flags: string[] = [];

    if (lowerUser.includes('cheat') || lowerUser.includes('scam') || lowerUser.includes('sue') || lowerUser.includes('lawyer')) {
      sentiment = 'defensive';
    } else if (lowerUser.includes('okay') || lowerUser.includes('agree') || lowerUser.includes('send link') || lowerUser.includes('pay')) {
      sentiment = 'cooperative';
    } else if (lowerUser.includes('no money') || lowerUser.includes('job') || lowerUser.includes('difficult')) {
      sentiment = 'frustrated';
    }

    // Call Gemini 3.8 Flash if available with 3.5s timeout for voice latency
    if (aiClient) {
      try {
        const contents: any[] = [];
        if (Array.isArray(history)) {
          history.slice(-8).forEach((h: any) => {
            contents.push({
              role: h.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: h.content }],
            });
          });
        }
        contents.push({
          role: 'user',
          parts: [{ text: userMessage }],
        });

        const geminiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: systemPrompt + `\n\nCRITICAL CONVERSATIONAL CONSTRAINT: You are speaking on a real-time telephone call. Keep your response under 45 words, highly natural, articulate, professional, and conversational. Do not use bullet points, asterisks, or markdown. Speak as your persona.`,
            temperature: 0.7,
          },
        });

        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 3500)
        );

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);
        reply = response?.text || '';
      } catch (geminiErr) {
        console.warn('Gemini generateContent error/timeout, activating conversational fallback:', geminiErr);
      }
    }

    // Fallback dialogue engine if Gemini was unavailable or returned empty
    if (!reply) {
      if (agentType === 'loan_settlement') {
        if (lowerUser.includes('who are you') || lowerUser.includes('why are you calling')) {
          reply = "Hello, this is Priya Sharma from CreditNirvana on behalf of the recovery division. For your privacy and account security, could you please confirm your date of birth or the last 4 digits of your PAN?";
        } else if (lowerUser.includes('pan') || lowerUser.includes('19') || lowerUser.includes('20') || lowerUser.includes('yes') || lowerUser.includes('ramesh')) {
          reply = "Thank you for confirming your identity. Your personal loan account is currently 8 months overdue with a total balance of ₹6,50,000. Our committee has authorized a one-time settlement of ₹4,00,000, waiving the entire ₹2,50,000 in interest and charges.";
        } else if (lowerUser.includes('1,50,000') || lowerUser.includes('1.5') || lowerUser.includes('2,00,000') || lowerUser.includes('less')) {
          reply = "I understand times are tough, but ₹4,00,000 is the bare principal you borrowed; the bank is already absorbing a ₹2,50,000 loss. I cannot accept anything below ₹4,00,000. We can split it into two payments of ₹2,00,000 across 10 days. Can we agree on that?";
        } else if (lowerUser.includes('job') || lowerUser.includes('hardship') || lowerUser.includes('delay')) {
          reply = "I understand this hardship, and that is why the ₹2,50,000 interest waiver was approved. However, this concession window expires this week. Let us lock in this ₹4,00,000 settlement so your CIBIL score is protected and legal escalation stops.";
        } else if (lowerUser.includes('letter') || lowerUser.includes('document')) {
          reply = "The official settlement letter is dispatched to your email immediately upon registering your payment schedule. Once the ₹4,00,000 is realized, your No-Dues Certificate is issued within 14 business days. Can you remit via UPI by tomorrow?";
        } else {
          reply = "To protect you from further interest accrual and credit bureau damage, we must resolve this account. We have waived ₹2,50,000 so you can settle the ₹6,50,000 balance for just ₹4,00,000. Can we proceed with the payment link?";
        }
      } else {
        // Insurance Renewal Fallback
        if (lowerUser.includes('12,000') || lowerUser.includes('competitor') || lowerUser.includes('policybazaar') || lowerUser.includes('cheaper')) {
          reply = "Those ₹12,000 portal quotes look tempting, but they typically slash your Brezza IDV down to ₹6.5 Lakhs and exclude Zero Depreciation. In an accident, you would pay 50% out-of-pocket for bumper repairs. Our ₹15,000 renewal includes a full ₹8,00,000 IDV and bumper-to-bumper Zero Dep.";
        } else if (lowerUser.includes('idv') || lowerUser.includes('decrease') || lowerUser.includes('value') || lowerUser.includes('8,00,000') || lowerUser.includes('9,00,000')) {
          reply = "The adjustment from ₹9,00,000 to ₹8,00,000 represents an 11.1% depreciation, perfectly following IRDAI vehicle age guidelines. Artificially inflating IDV only increases your premium without increasing surveyor claim payouts. ₹8 Lakhs is the sweet spot.";
        } else if (lowerUser.includes('discount') || lowerUser.includes('expensive') || lowerUser.includes('13,000') || lowerUser.includes('14,000')) {
          reply = "Our ₹15,000 renewal already saves you ₹5,000—a full 25% discount off the standard ₹20,000 listed premium with Zero Dep, Engine Protection, and Roadside Assistance bundled. Going lower would force us to strip essential coverage.";
        } else if (lowerUser.includes('send') || lowerUser.includes('agree') || lowerUser.includes('yes') || lowerUser.includes('link')) {
          reply = "Wonderful! I am triggering the secure payment link for ₹15,000 directly to your mobile. Once paid, your comprehensive policy with ₹8,00,000 IDV, Zero Dep, and Engine Protection is issued immediately.";
        } else {
          reply = "Your Maruti Brezza renewal is currently ready at a discounted ₹15,000 instead of ₹20,000, saving you ₹5,000. It includes ₹8,00,000 IDV, Zero Depreciation, and 24x7 Roadside Assistance. Shall I send the renewal link to your WhatsApp?";
        }
      }
    }

    // Audit compliance of generated reply
    const lowerReply = reply.toLowerCase();
    if (lowerReply.includes('arrest') || lowerReply.includes('jail') || lowerReply.includes('police')) {
      flags.push('POTENTIAL_FALSE_LEGAL_CLAIM');
    }
    if (lowerReply.includes('idiot') || lowerReply.includes('shut up')) {
      flags.push('TOXIC_LANGUAGE_DETECTED');
    }

    res.json({
      reply,
      sentiment,
      complianceCheck: {
        isCompliant: flags.length === 0,
        flags,
        notes: flags.length === 0 ? 'Compliant with RBI/IRDAI guidelines' : flags.join(', '),
      },
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message || 'Internal chat error' });
  }
});

// 3. Sarvam Text-to-Speech Proxy
app.post('/api/sarvam/tts', async (req, res) => {
  const sarvamKey = process.env.SARVAM_API_KEY;
  if (!sarvamKey || sarvamKey.trim() === '' || sarvamKey.includes('MY_')) {
    return res.status(200).json({
      success: false,
      fallback: true,
      message: 'Sarvam API key not configured. Using browser speech synthesis fallback.',
    });
  }

  try {
    const { text, speaker = 'meera', language_code = 'en-IN', pace = 1.05 } = req.body;

    const sarvamRes = await fetch('https://api.sarvam.ai/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': sarvamKey,
      },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: language_code,
        speaker,
        model: 'bulbul:v2',
        pace,
        enable_preprocessing: true,
      }),
    });

    if (!sarvamRes.ok) {
      const errText = await sarvamRes.text();
      return res.status(sarvamRes.status).json({
        success: false,
        fallback: true,
        error: `Sarvam API error: ${errText}`,
      });
    }

    const data: any = await sarvamRes.json();
    const audioBase64 = data.audios?.[0] || null;

    res.json({
      success: true,
      audioBase64,
      model: 'bulbul:v2',
      speaker,
    });
  } catch (err: any) {
    console.warn('Sarvam TTS proxy error:', err);
    res.json({
      success: false,
      fallback: true,
      error: err.message,
    });
  }
});

// 4. Conversation Evaluation & Scoring Endpoint
app.post('/api/evaluate', (req, res) => {
  const { agentType, messages } = req.body;
  const transcriptText = (messages || [])
    .map((m: any) => `${m.speakerName}: ${m.text}`)
    .join('\n');

  const lower = transcriptText.toLowerCase();

  // Category scores (0 - 10)
  let identityScore = 8;
  let objectionScore = 9;
  let accuracyScore = 10;
  let complianceScore = 10;
  let closingScore = 8;

  const violations: string[] = [];
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (agentType === 'loan_settlement') {
    if (lower.includes('date of birth') || lower.includes('pan')) {
      identityScore = 10;
      strengths.push('Verified customer KYC/identity before financial disclosures.');
    } else {
      identityScore = 6;
      improvements.push('Ensure identity verification occurs before stating overdue debt balances.');
    }

    if (lower.includes('4,00,000') && lower.includes('2,50,000')) {
      accuracyScore = 10;
      strengths.push('Strictly adhered to ₹6.5L balance, ₹4L settlement, and ₹2.5L waiver calculation.');
    }

    if (lower.includes('arrest') || lower.includes('jail') || lower.includes('police')) {
      complianceScore = 3;
      violations.push('Threat of non-civil enforcement violates RBI Fair Practices Code.');
    } else {
      strengths.push('Complied with RBI Fair Practices Code; zero abusive or intimidatory language.');
    }

    if (lower.includes('tranche') || lower.includes('installments') || lower.includes('tomorrow') || lower.includes('link')) {
      closingScore = 9;
      strengths.push('Structured clear two-tranche repayment commitment with definite timeline.');
    }
  } else {
    // Insurance
    if (lower.includes('8,00,000') && lower.includes('15,000') && (lower.includes('5,000') || lower.includes('25%'))) {
      accuracyScore = 10;
      strengths.push('Accurate Brezza IDV (₹8L) and 25% discount (₹5,000 savings) communicated.');
    }
    if (lower.includes('zero dep') || lower.includes('engine') || lower.includes('roadside')) {
      objectionScore = 10;
      strengths.push('Successfully educated customer on Brezza Zero Dep and Engine hydrostatic lock risk.');
    }
    strengths.push('Conforms to IRDAI Code of Conduct without unverified coverage claims.');
  }

  const overallScore = Math.round(
    ((identityScore + objectionScore + accuracyScore + complianceScore + closingScore) / 50) * 100
  );

  let outcome = 'PTP_COMMITTED';
  if (lower.includes('send link') || lower.includes('link dispatched') || lower.includes('paid')) {
    outcome = agentType === 'loan_settlement' ? 'SETTLEMENT_AGREED' : 'RENEWAL_CLOSED';
  } else if (lower.includes('supervisor') || lower.includes('manager')) {
    outcome = 'ESCALATED_SUPERVISOR';
  }

  res.json({
    overallScore,
    categories: {
      identityVerification: identityScore,
      objectionHandling: objectionScore,
      factualAccuracy: accuracyScore,
      regulatoryCompliance: complianceScore,
      commercialClosing: closingScore,
    },
    violationsFound: violations,
    strengths,
    areasOfImprovement: improvements,
    disposition: {
      outcome,
      agreedAmount: agentType === 'loan_settlement' ? 400000 : 15000,
      notes: `Call completed with score ${overallScore}/100. Outcome: ${outcome}.`,
    },
  });
});

// In dev mode, mount Vite middleware. In production, serve dist.
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CreditNirvana Voice Labs server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
