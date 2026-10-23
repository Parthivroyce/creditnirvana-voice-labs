export type AgentType = 'loan_settlement' | 'insurance_renewal';

export interface AgentConfig {
  id: AgentType;
  name: string;
  role: string;
  persona: string;
  avatar: string;
  tagline: string;
  sarvamSpeaker: string;
  targetLanguage: string;
  accent: string;
  color: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'agent' | 'customer' | 'system';
  speakerName: string;
  text: string;
  timestamp: string;
  durationMs?: number;
  sentiment?: 'positive' | 'neutral' | 'frustrated' | 'cooperative' | 'defensive';
  complianceCheck?: {
    isCompliant: boolean;
    flags: string[];
    notes?: string;
  };
  audioUrl?: string;
  audioBlob?: Blob;
}

export interface CallSession {
  id: string;
  agentType: AgentType;
  status: 'idle' | 'calling' | 'connected' | 'paused' | 'ended';
  startedAt?: Date;
  endedAt?: Date;
  durationSeconds: number;
  messages: ChatMessage[];
  isMuted: boolean;
  isOnHold: boolean;
  isRecording: boolean;
  recordedAudioUrl?: string;
  recordedAudioBlob?: Blob;
  disposition?: CallDisposition;
  evaluation?: CallEvaluation;
}

export interface CallDisposition {
  outcome: 'PTP_COMMITTED' | 'SETTLEMENT_AGREED' | 'RENEWAL_CLOSED' | 'ESCALATED_SUPERVISOR' | 'CALLBACK_REQUESTED' | 'DISPUTE_RAISED' | 'REFUSAL_TO_PAY';
  agreedAmount?: number;
  scheduledDate?: string;
  paymentMode?: 'UPI' | 'NetBanking' | 'DebitCard' | 'Cheque';
  referenceId?: string;
  notes: string;
}

export interface CallEvaluation {
  overallScore: number; // 0 - 100
  categories: {
    identityVerification: number; // 0 - 10
    objectionHandling: number; // 0 - 10
    factualAccuracy: number; // 0 - 10
    regulatoryCompliance: number; // 0 - 10
    commercialClosing: number; // 0 - 10
  };
  violationsFound: string[];
  strengths: string[];
  areasOfImprovement: string[];
  summary: string;
}

export interface DifficultScenario {
  id: string;
  agentType: AgentType;
  title: string;
  customerPersona: string;
  difficulty: 'Medium' | 'Hard' | 'Extreme';
  primaryObjection: string;
  description: string;
  dialogueScript: {
    customerTurn: string;
    expectedAgentReaction: string;
    complianceWatchout: string;
  }[];
}

export interface TestCase {
  id: string;
  name: string;
  category: 'Math Verification' | 'Compliance' | 'Objection Handling' | 'Negotiation Boundary' | 'Escalation';
  description: string;
  expected: string;
  actual?: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'blocked';
  notes?: string;
}
