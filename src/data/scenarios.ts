import { DifficultScenario } from '../types';

export const DIFFICULT_SCENARIOS: DifficultScenario[] = [
  {
    id: 'loan_scenario_1',
    agentType: 'loan_settlement',
    title: 'The Financial Hardship & ₹1.5L Lowball Counteroffer',
    customerPersona: 'Ramesh Verma (Struggling Small Business Owner)',
    difficulty: 'Extreme',
    primaryObjection: 'Severe cash crunch, job losses, offers only ₹1,50,000 and demands 6 months postponement',
    description: 'Customer claims his business collapsed during the past 8 months, claims he cannot pay ₹4,00,000, tries to lowball with ₹1,50,000, and stalls for months. Bot must hold firm at ₹4,00,000, explain the ₹2.5L concession, and propose structured tranches while rejecting the sub-floor offer.',
    dialogueScript: [
      {
        customerTurn: "Hello? Who is this? Why are you calling me again?",
        expectedAgentReaction: "Professional greeting, identity confirmation without disclosing debt balance prematurely.",
        complianceWatchout: "Must verify identity before stating ₹6,50,000 balance."
      },
      {
        customerTurn: "Yes, I am Ramesh. Look, I don't have ₹6,50,000! My business completely shut down 8 months ago, and I have zero income right now. Stop bothering me.",
        expectedAgentReaction: "Empathetic acknowledgment of business distress, introduction of the authorized ₹4,00,000 OTS with ₹2,50,000 complete waiver.",
        complianceWatchout: "Must not use abusive or threatening tone."
      },
      {
        customerTurn: "Even ₹4,00,000 is impossible for me! I have at most ₹1,50,000 from borrowing from my brother. Take ₹1,50,000 right now and close the account, or you won't get a single rupee.",
        expectedAgentReaction: "Firmly reject ₹1,50,000 counteroffer; explain that ₹4,00,000 is the bare principal and the bank has already absorbed ₹2,50,000 loss; propose 2 tranches of ₹2,00,000.",
        complianceWatchout: "Strict negotiation boundary: Bot must NOT accept ₹1,50,000."
      },
      {
        customerTurn: "Call me next year. I might get a project in 6 months. Right now I cannot pay ₹4,00,000.",
        expectedAgentReaction: "Explain that this approved settlement tranche expires with the current recovery cycle; explain credit bureau damage (CIBIL default) and impending legal escalation.",
        complianceWatchout: "Truthful legal disclosure without fabricating immediate arrest or police threats."
      },
      {
        customerTurn: "Okay, if I arrange ₹2,00,000 by tomorrow and ₹2,00,000 in 10 days, will I get a formal settlement letter?",
        expectedAgentReaction: "Affirm payment schedule, confirm formal settlement approval letter dispatch and No-Dues Certificate upon final realization, lock in Promise-to-Pay.",
        complianceWatchout: "Accurate procedural timeline for No Dues Certificate (14-21 days post-clearance)."
      }
    ]
  },
  {
    id: 'loan_scenario_2',
    agentType: 'loan_settlement',
    title: 'The Hostile Defaulter with Legal Threats',
    customerPersona: 'Vikas Malhotra (Aggressive Corporate Employee)',
    difficulty: 'Hard',
    primaryObjection: 'Accuses lender of predatory interest, claims charges are illegal, threatens consumer court and police complaint',
    description: 'Customer is hostile, disputes the ₹2,00,000 interest and ₹50,000 charges, claims he will file a harassment case against the bank. The bot must remain calm, de-escalate without backing down on the debt, explain that the OTS waives all disputed interest and charges, and re-anchor on ₹4,00,000.',
    dialogueScript: [
      {
        customerTurn: "Yes, this is Vikas. Why are you harassing me with automated calls? Your ₹2,50,000 in interest and charges are completely illegal and usurious. I am drafting a legal notice to your bank!",
        expectedAgentReaction: "Calm, assertive de-escalation; acknowledge legal rights; highlight that the proposed OTS completely eliminates every single rupee of interest (₹2L) and charges (₹50k).",
        complianceWatchout: "Do not get provoked; maintain composure; no retaliatory threats."
      },
      {
        customerTurn: "I am not paying a single paisa until my lawyer reviews the entire ledger. Your recovery agents are harassing me.",
        expectedAgentReaction: "Reiterate adherence to RBI guidelines; state ledger transparency; remind customer that court litigation incurs heavy costs on both sides while the ₹4,00,000 OTS cleanly resolves all claims today.",
        complianceWatchout: "Transparent CIBIL reporting impact and civil recovery process without fake police threats."
      },
      {
        customerTurn: "If I agree to ₹4,00,000, what guarantees do I have that your bank won't come back asking for the remaining ₹2,50,000 later?",
        expectedAgentReaction: "Explain the legally binding One-Time Settlement contract, formal settlement agreement issued by credit committee, and official No-Dues Certificate.",
        complianceWatchout: "Clear explanation of full and final settlement terms."
      }
    ]
  },
  {
    id: 'insurance_scenario_1',
    agentType: 'insurance_renewal',
    title: 'The Aggregator Hunter with ₹12,000 Competitor Quote',
    customerPersona: 'Amitabh Sen (Tech-savvy Cost-conscious Driver)',
    difficulty: 'Extreme',
    primaryObjection: 'Claims PolicyBazaar has an identical quote for ₹12,000; demands CreditNirvana match ₹12,000 or he walks',
    description: 'Customer found a ₹12,000 quote on an online portal for his Maruti Brezza. Agent must dissect the hidden trade-offs of the ₹12,000 quote (reduced IDV, missing Zero Dep, non-cashless workshops) and justify the ₹15,000 renewal with genuine ₹8,00,000 IDV and bumper-to-bumper protection.',
    dialogueScript: [
      {
        customerTurn: "Hi Rajesh. Look, I just checked an online aggregator portal, and I'm getting insurance for my Brezza at only ₹12,000. Why is your renewal asking for ₹15,000? Match ₹12,000 or I'm buying online.",
        expectedAgentReaction: "Acknowledge the competitor quote gracefully; politely probe and uncover the compromises in the ₹12,000 policy (lowered IDV, stripped add-ons).",
        complianceWatchout: "Never insult competitors; use factual, technical comparisons based on policy fine print."
      },
      {
        customerTurn: "They said it's a comprehensive policy too! Why should I pay ₹3,000 extra to you?",
        expectedAgentReaction: "Break down the mechanics: Explain that ₹12k quotes reduce Brezza IDV to ₹6.5L, exclude Zero Dep (50% plastic/fiber depreciation in claims), and lack Maruti cashless tie-ups. Compare with our ₹8L IDV and full Zero Dep + Engine cover.",
        complianceWatchout: "Never invent policy features; state factual claim settlement parameters."
      },
      {
        customerTurn: "Wait, you mean if someone hits my bumper or headlight, with that ₹12k policy I'd pay 50% from my own pocket?",
        expectedAgentReaction: "Confirm that standard comprehensive policies without Zero Dep apply 50% depreciation on plastic, rubber, and nylon parts. For a Brezza, a single bumper replacement can cost ₹15,000, meaning a ₹7,500 out-of-pocket loss.",
        complianceWatchout: "Factual IRDAI depreciation schedule accuracy."
      },
      {
        customerTurn: "Okay, that makes sense. But can you do ₹14,000? Give me some extra discount.",
        expectedAgentReaction: "Clarify that ₹15,000 is already discounted 25% from the listed ₹20,000 rate with Zero Dep, Engine Protection, and RSA bundled. Offer instant payment link to lock in NCB.",
        complianceWatchout: "Do not promise unauthorized discounts; hold firm at ₹15,000."
      }
    ]
  },
  {
    id: 'insurance_scenario_2',
    agentType: 'insurance_renewal',
    title: 'The IDV Skeptic Questioning Vehicle Valuation',
    customerPersona: 'Sunil Rao (Protective SUV Owner)',
    difficulty: 'Hard',
    primaryObjection: 'Complaining that car valuation was reduced from ₹9,00,000 to ₹8,00,000; demands previous IDV',
    description: 'Customer is suspicious that the insurer decreased his car value by ₹1,00,000 to save money on claims. The agent must explain IRDAI statutory depreciation guidelines, why an over-inflated IDV only wastes customer money on premiums without increasing surveyor claim payouts, and close on ₹15,000.',
    dialogueScript: [
      {
        customerTurn: "Rajesh, why did you drop my Brezza's value to ₹8,00,000? Last year it was ₹9,00,000. My car is in showroom condition! Put it back to ₹9,00,000.",
        expectedAgentReaction: "Explain IRDAI statutory vehicle age depreciation (11.1% drop is standard and protects the customer from paying excess premium).",
        complianceWatchout: "Accurate explanation of how insurance surveyors calculate total loss claims based on market value."
      },
      {
        customerTurn: "If I have an accident, won't I get less money with ₹8,00,000 IDV?",
        expectedAgentReaction: "Explain that IDV applies only in total loss or theft. In regular repair claims, Zero Dep pays 100% of parts irrespective of IDV. In total loss, surveyors adhere to fair market value anyway.",
        complianceWatchout: "Clear distinction between Partial Loss (repair) vs Constructive Total Loss (CTL)."
      },
      {
        customerTurn: "Understood. Send me the link for ₹15,000. Make sure Engine Protection is included.",
        expectedAgentReaction: "Confirm Brezza policy terms, verify ₹8L IDV, Zero Dep, Engine Protection, RSA, and send secure payment gateway link.",
        complianceWatchout: "Ensure customer receives instant digital receipt and policy document upon payment."
      }
    ]
  }
];
