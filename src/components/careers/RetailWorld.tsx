"use client";

import { useState, useMemo, useEffect } from "react";
import { Difficulty, IncorrectAnswer } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import TutorialScreen from "@/components/TutorialScreen";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface RetailWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Question {
  id: string;
  scenario: string;
  question: string;
  options: { id: string; text: string; correct: boolean; explanation: string }[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Customer brings back a shirt with tag still on, no receipt, within return period.",
      question: "What's the best policy?",
      options: [
        { id: "a", text: "Offer store credit at lowest recent sale price", correct: true, explanation: "This follows standard return policy for no-receipt returns." },
        { id: "b", text: "Refuse the return since there's no receipt", correct: false, explanation: "This loses customer goodwill unnecessarily." },
        { id: "c", text: "Give cash back at full price", correct: false, explanation: "This exceeds policy and invites fraud." },
      ],
    },
    {
      id: "e2",
      scenario: "Customer is looking for a specific size that's out of stock.",
      question: "How do you help?",
      options: [
        { id: "a", text: "Check other locations and offer to order it", correct: true, explanation: "This provides excellent customer service." },
        { id: "b", text: "Tell them to check back next week", correct: false, explanation: "This misses an opportunity to help the customer." },
        { id: "c", text: "Suggest a completely different product", correct: false, explanation: "This ignores what they actually want." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Customer is upset about a long checkout line.",
      question: "What's the best approach?",
      options: [
        { id: "a", text: "Acknowledge their frustration and open another register", correct: true, explanation: "Empathy plus action solves the problem." },
        { id: "b", text: "Explain it's not your fault and they should wait", correct: false, explanation: "This escalates the situation." },
        { id: "c", text: "Ignore them and hope they calm down", correct: false, explanation: "This loses customer trust." },
      ],
    },
    {
      id: "m2",
      scenario: "Customer tries to use expired coupon for a sale item.",
      question: "What do you do?",
      options: [
        { id: "a", text: "Honor the expired coupon as a customer service gesture", correct: true, explanation: "Building goodwill is worth the small discount." },
        { id: "b", text: "Refuse because the coupon is expired", correct: false, explanation: "This creates unnecessary conflict." },
        { id: "c", text: "Make them pay full price plus the coupon value", correct: false, explanation: "This is dishonest and illegal." },
      ],
    },
    {
      id: "m3",
      scenario: "You notice a coworker pocketing merchandise.",
      question: "What should you do?",
      options: [
        { id: "a", text: "Report to management discreetly", correct: true, explanation: "This protects the store and is the right thing to do." },
        { id: "b", text: "Confront the coworker directly", correct: false, explanation: "This could create workplace tension or safety issues." },
        { id: "c", text: "Don't say anything to avoid drama", correct: false, explanation: "This enables theft and could implicate you." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Black Friday crowd surge at the door, customers pushing.",
      question: "What's the safety priority?",
      options: [
        { id: "a", text: "Ensure customer and staff safety first, control the flow", correct: true, explanation: "Safety trumps sales in dangerous situations." },
        { id: "b", text: "Let them in quickly to maximize sales", correct: false, explanation: "This creates liability and safety hazards." },
        { id: "c", text: "Lock the doors and close early", correct: false, explanation: "This abandons customers and loses legitimate sales." },
      ],
    },
    {
      id: "h2",
      scenario: "Customer has a service dog but no visible disability.",
      question: "What's the legal requirement?",
      options: [
        { id: "a", text: "Allow the dog - ADA doesn't require visible disability", correct: true, explanation: "Service animals are protected regardless of visibility of disability." },
        { id: "b", text: "Ask for documentation proving the disability", correct: false, explanation: "This violates ADA regulations." },
        { id: "c", text: "Offer to hold the dog at customer service", correct: false, explanation: "This treats the service animal as a pet." },
      ],
    },
    {
      id: "h3",
      scenario: "Customer receives counterfeit bill as change.",
      question: "What's the correct response?",
      options: [
        { id: "a", text: "Accept responsibility, replace the bill, and review cash handling procedures", correct: true, explanation: "Integrity and customer satisfaction come first." },
        { id: "b", text: "Blame the customer for not checking", correct: false, explanation: "This deflects responsibility inappropriately." },
        { id: "c", text: "Refuse to replace it claiming it's their fault", correct: false, explanation: "This violates consumer protection laws." },
      ],
    },
    {
      id: "h4",
      scenario: "System outage during busy shopping period.",
      question: "How do you handle transactions?",
      options: [
        { id: "a", text: "Process manually with manager approval and follow up", correct: true, explanation: "This maintains service while ensuring accuracy." },
        { id: "b", text: "Close the store until systems are restored", correct: false, explanation: "This unnecessarily loses sales and inconveniences customers." },
        { id: "c", text: "Guess prices based on memory", correct: false, explanation: "This creates pricing errors and potential legal issues." },
      ],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Customer asks for a price check on an item with no tag.",
    question: "What's the fastest way to help?",
    options: [
      { id: "a", text: "Scan similar items to find the price point", correct: true, explanation: "This uses available system data efficiently." },
      { id: "b", text: "Guess a reasonable price", correct: false, explanation: "This can lead to pricing errors." },
      { id: "c", text: "Tell them to come back later", correct: false, explanation: "This loses the sale." },
    ],
  },
  {
    id: "qr2",
    scenario: "Customer wants to use two coupons on one item.",
    question: "What's the policy?",
    options: [
      { id: "a", text: "One coupon per item unless stated otherwise", correct: true, explanation: "This follows standard retail coupon policy." },
      { id: "b", text: "Let them use as many as they have", correct: false, explanation: "This violates coupon terms and profits." },
      { id: "c", text: "Refuse both coupons", correct: false, explanation: "This loses the sale unnecessarily." },
    ],
  },
  {
    id: "qr3",
    scenario: "Customer's card is declined at checkout.",
    question: "What's the professional response?",
    options: [
      { id: "a", text: "Quietly suggest they check with their bank and offer other payment options", correct: true, explanation: "This preserves dignity while solving the problem." },
      { id: "b", text: "Announce loudly that their card was declined", correct: false, explanation: "This embarrasses the customer." },
      { id: "c", text: "Refuse to let them try another card", correct: false, explanation: "This ends the transaction unnecessarily." },
    ],
  },
  {
    id: "qr4",
    scenario: "A customer returns a damaged product without a receipt.",
    question: "What's the best course of action?",
    options: [
      { id: "a", text: "Offer store credit or exchange based on item condition", correct: true, explanation: "Flexible return policies build customer loyalty." },
      { id: "b", text: "Refuse the return without a receipt", correct: false, explanation: "This may lose a customer unnecessarily." },
      { id: "c", text: "Give a full cash refund immediately", correct: false, explanation: "This exceeds standard policy and may invite fraud." },
    ],
  },
  {
    id: "qr5",
    scenario: "Customer complains about a long wait time.",
    question: "How should you respond?",
    options: [
      { id: "a", text: "Acknowledge the wait, apologize, and provide an update", correct: true, explanation: "Empathy and transparency help manage customer frustration." },
      { id: "b", text: "Tell them it's not your fault", correct: false, explanation: "Blaming others escalates frustration." },
      { id: "c", text: "Ignore the complaint and continue working", correct: false, explanation: "Ignoring complaints worsens customer experience." },
    ],
  },
  {
    id: "qr6",
    scenario: "You see a shoplifter conceal an item.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Alert security or management and observe from a distance", correct: true, explanation: "Direct confrontation can be dangerous; let trained personnel handle it." },
      { id: "b", text: "Chase them out of the store", correct: false, explanation: "This is dangerous and could lead to injury or liability." },
      { id: "c", text: "Confront them directly and demand they stop", correct: false, explanation: "Unnecessary escalation puts everyone at risk." },
    ],
  },
  {
    id: "qr7",
    scenario: "Customer asks for a product you don't carry.",
    question: "What's the best response?",
    options: [
      { id: "a", text: "Suggest a comparable alternative or offer to order it", correct: true, explanation: "Offering alternatives shows helpfulness and product knowledge." },
      { id: "b", text: "Tell them we don't have it and walk away", correct: false, explanation: "This is unhelpful and loses a sale." },
      { id: "c", text: "Tell them to try a competitor", correct: false, explanation: "Directing customers away loses business and trust." },
    ],
  },
  {
    id: "qr8",
    scenario: "A customer is unhappy with a recently purchased item.",
    question: "How do you handle the situation?",
    options: [
      { id: "a", text: "Listen, empathize, and offer a solution within policy", correct: true, explanation: "Active listening and problem-solving retain customers." },
      { id: "b", text: "Tell them it's too late to return", correct: false, explanation: "This may violate return policy and lose a customer." },
      { id: "c", text: "Blame the manufacturer", correct: false, explanation: "Deflecting responsibility frustrates customers." },
    ],
  },
  {
    id: "qr9",
    scenario: "You need to upsell a product to meet your sales target.",
    question: "What's the most ethical approach?",
    options: [
      { id: "a", text: "Recommend genuinely useful products that meet their needs", correct: true, explanation: "Honest recommendations build trust and long-term sales." },
      { id: "b", text: "Push the most expensive item regardless of need", correct: false, explanation: "This erodes trust and may lead to returns." },
      { id: "c", text: "Hide cheaper alternatives to increase profit", correct: false, explanation: "This is deceptive and violates ethical standards." },
    ],
  },
  {
    id: "qr10",
    scenario: "Customer brings back an item that's been worn.",
    question: "What should you check before processing the return?",
    options: [
      { id: "a", text: "Verify condition, check receipt, and confirm return window", correct: true, explanation: "Standard procedure ensures policy compliance." },
      { id: "b", text: "Refuse it immediately because it's been used", correct: false, explanation: "Some stores accept lightly worn items depending on policy." },
      { id: "c", text: "Accept it without question to avoid conflict", correct: false, explanation: "This may lead to policy violations and losses." },
    ],
  },
  {
    id: "qr11",
    scenario: "A VIP customer demands a discount beyond store policy.",
    question: "How do you respond?",
    options: [
      { id: "a", text: "Politely explain the policy and offer what you can within limits", correct: true, explanation: "Maintaining policy while showing respect preserves integrity." },
      { id: "b", text: "Give them whatever discount they want", correct: false, explanation: "This undermines pricing policy and creates unfairness." },
      { id: "c", text: "Refuse and let them leave", correct: false, explanation: "Losing VIP customers damages long-term revenue." },
    ],
  },
  {
    id: "qr12",
    scenario: "The register system crashes during a sale.",
    question: "What's your immediate priority?",
    options: [
      { id: "a", text: "Process transactions manually and inform IT support", correct: true, explanation: "Minimizing disruption while maintaining accuracy is key." },
      { id: "b", text: "Tell customers to wait until it's fixed", correct: false, explanation: "This leads to customer dissatisfaction and lost sales." },
      { id: "c", text: "Send everyone home", correct: false, explanation: "This is an overreaction and causes unnecessary disruption." },
    ],
  },
  {
    id: "qr13",
    scenario: "Customer asks if you price match competitors.",
    question: "What do you tell them?",
    options: [
      { id: "a", text: "Explain the price match policy if your store has one", correct: true, explanation: "Transparency about policies helps retain customers." },
      { id: "b", text: "Say we always have the lowest prices", correct: false, explanation: "This may be false and damage credibility." },
      { id: "c", text: "Refuse and say we don't compete on price", correct: false, explanation: "This loses the sale to a competitor." },
    ],
  },
  {
    id: "qr14",
    scenario: "You notice a coworker giving unauthorized discounts to friends.",
    question: "What's the appropriate action?",
    options: [
      { id: "a", text: "Report it to management confidentially", correct: true, explanation: "Following proper channels protects the business and yourself." },
      { id: "b", text: "Confront them in front of customers", correct: false, explanation: "Public confrontation creates a hostile work environment." },
      { id: "c", text: "Ignore it since they're your friend too", correct: false, explanation: "Ignoring policy violations makes you complicit." },
    ],
  },
  {
    id: "qr15",
    scenario: "A delivery arrived with damaged goods.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Document the damage, notify the supplier, and request replacement or credit", correct: true, explanation: "Proper documentation is essential for claims." },
      { id: "b", text: "Accept it and hope the customer doesn't notice", correct: false, explanation: "This risks customer complaints and returns." },
      { id: "c", text: "Throw it away and order new stock", correct: false, explanation: "You need to file a claim for reimbursement." },
    ],
  },
  {
    id: "qr16",
    scenario: "Customer wants to use an expired promotional coupon.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Honor it as a goodwill gesture within reason", correct: true, explanation: "Exceptional customer service earns long-term loyalty." },
      { id: "b", text: "Demand they pay full price", correct: false, explanation: "While technically valid, it damages customer relations." },
      { id: "c", text: "Call a manager for every expired coupon situation", correct: false, explanation: "This delays service and isn't necessary for minor cases." },
    ],
  },
  {
    id: "qr17",
    scenario: "Busy sales floor with long customer queues.",
    question: "How do you manage the situation?",
    options: [
      { id: "a", text: "Call for additional staff and open more registers", correct: true, explanation: "Proactive management reduces wait times and improves experience." },
      { id: "b", text: "Rush through transactions as fast as possible", correct: false, explanation: "Speed without accuracy causes errors and dissatisfaction." },
      { id: "c", text: "Let customers sort themselves out", correct: false, explanation: "Lack of organization leads to chaos and complaints." },
    ],
  },
  {
    id: "qr18",
    scenario: "Customer wants to return an item that's final sale.",
    question: "What do you tell them?",
    options: [
      { id: "a", text: "Politely explain the final sale policy and offer alternatives", correct: true, explanation: "Clear communication prevents misunderstandings." },
      { id: "b", text: "Accept the return anyway to avoid conflict", correct: false, explanation: "This violates store policy and creates inconsistency." },
      { id: "c", text: "Tell them to leave the store", correct: false, explanation: "This is unprofessional and may cause a scene." },
    ],
  },
  {
    id: "qr19",
    scenario: "Inventory count shows a significant discrepancy.",
    question: "What's your next step?",
    options: [
      { id: "a", text: "Recount and report the discrepancy to management", correct: true, explanation: "Double-checking and proper reporting maintains accuracy." },
      { id: "b", text: "Adjust the numbers to match expectations", correct: false, explanation: "Falsifying records is dishonest and potentially illegal." },
      { id: "c", text: "Ignore it since it'll sort itself out", correct: false, explanation: "Ignoring discrepancies allows problems to grow." },
    ],
  },
  {
    id: "qr20",
    scenario: "Customer has a complaint about product quality.",
    question: "How do you handle it?",
    options: [
      { id: "a", text: "Apologize, document the issue, and offer a replacement or refund", correct: true, explanation: "Taking responsibility maintains brand trust." },
      { id: "b", text: "Tell them it's not your department", correct: false, explanation: "Passing blame frustrates customers." },
      { id: "c", text: "Argue that the product is fine", correct: false, explanation: "Arguing escalates conflict and damages relationships." },
    ],
  },
  {
    id: "qr21",
    scenario: "New employee needs training on the register system.",
    question: "What's your responsibility as a trainer?",
    options: [
      { id: "a", text: "Walk them through each function patiently and supervise their first transactions", correct: true, explanation: "Proper training prevents costly mistakes." },
      { id: "b", text: "Let them figure it out on their own", correct: false, explanation: "This leads to errors and customer dissatisfaction." },
      { id: "c", text: "Only show them the basics and leave them alone", correct: false, explanation: "Incomplete training creates more problems later." },
    ],
  },
  {
    id: "qr22",
    scenario: "Customer asks about a product feature you're not sure about.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Look up the information or find a knowledgeable colleague", correct: true, explanation: "Providing accurate information builds trust." },
      { id: "b", text: "Make something up to sound knowledgeable", correct: false, explanation: "Misinformation can lead to returns and complaints." },
      { id: "c", text: "Tell them you don't know and walk away", correct: false, explanation: "This is unhelpful and unprofessional." },
    ],
  },
  {
    id: "qr23",
    scenario: "A customer is causing a disturbance in the store.",
    question: "How do you respond?",
    options: [
      { id: "a", text: "Remain calm, ask them to step aside, and involve management if needed", correct: true, explanation: "De-escalation protects everyone's safety." },
      { id: "b", text: "Yell at them to leave immediately", correct: false, explanation: "Aggression escalates the situation and may have legal consequences." },
      { id: "c", text: "Ignore the behavior and hope it stops", correct: false, explanation: "Ignoring disturbances can endanger other customers." },
    ],
  },
  {
    id: "qr24",
    scenario: "You need to restock shelves during a busy period.",
    question: "What's the best approach?",
    options: [
      { id: "a", text: "Restock efficiently while maintaining customer service", correct: true, explanation: "Balancing tasks ensures smooth operations." },
      { id: "b", text: "Ignore customers and focus only on restocking", correct: false, explanation: "Neglecting customers during restocking hurts service." },
      { id: "c", text: "Wait until after hours to restock", correct: false, explanation: "Shelves may remain empty during peak hours." },
    ],
  },
  {
    id: "qr25",
    scenario: "Customer returns an item claiming it was defective.",
    question: "What do you check first?",
    options: [
      { id: "a", text: "Inspect the item, verify purchase details, and check warranty terms", correct: true, explanation: "Thorough inspection ensures accurate defect determination." },
      { id: "b", text: "Immediately issue a refund without inspection", correct: false, explanation: "This may result in losses from fraudulent returns." },
      { id: "c", text: "Tell the customer it's their fault", correct: false, explanation: "Accusations damage customer relationships." },
    ],
  },
  {
    id: "qr26",
    scenario: "Your shift is ending but the next employee hasn't arrived.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Stay until relieved or contact management for coverage", correct: true, explanation: "Ensuring coverage prevents gaps in service." },
      { id: "b", text: "Leave immediately when your shift ends", correct: false, explanation: "Leaving without coverage can result in disciplinary action." },
      { id: "c", text: "Ask a customer to watch the register", correct: false, explanation: "This is unprofessional and a security risk." },
    ],
  },
  {
    id: "qr27",
    scenario: "Customer wants to return a gift they received.",
    question: "How do you process it?",
    options: [
      { id: "a", text: "Follow gift return policy - may need original receipt or gift receipt", correct: true, explanation: "Gift policies protect both the store and the buyer." },
      { id: "b", text: "Always allow gift returns with no questions asked", correct: false, explanation: "This can be exploited for fraudulent returns." },
      { id: "c", text: "Refuse all gift returns", correct: false, explanation: "This is too restrictive and may anger customers." },
    ],
  },
  {
    id: "qr28",
    scenario: "A promotion sign shows the wrong price.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Correct the sign immediately and notify management", correct: true, explanation: "Accurate pricing prevents customer disputes and legal issues." },
      { id: "b", text: "Honor the wrong price to avoid complaints", correct: false, explanation: "This may cause financial loss and set bad precedent." },
      { id: "c", text: "Leave it for the next shift to handle", correct: false, explanation: "Delaying correction causes more customer conflicts." },
    ],
  },
  {
    id: "qr29",
    scenario: "Customer with a food allergy asks about product ingredients.",
    question: "What's your responsibility?",
    options: [
      { id: "a", text: "Provide accurate ingredient information and flag potential allergens", correct: true, explanation: "Allergen awareness is critical for customer safety." },
      { id: "b", text: "Tell them to check the label themselves", correct: false, explanation: "Customers may not have access to full ingredient lists." },
      { id: "c", text: "Say you're not sure and move on", correct: false, explanation: "Uncertainty about allergens can have serious health consequences." },
    ],
  },
  {
    id: "qr30",
    scenario: "End-of-day cash count is off by a significant amount.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Recount, document the discrepancy, and report to management", correct: true, explanation: "Proper procedures protect against loss and ensure accountability." },
      { id: "b", text: "Make up the difference from your own pocket", correct: false, explanation: "This may mask systemic issues and isn't your responsibility." },
      { id: "c", text: "Ignore it and let the next shift deal with it", correct: false, explanation: "Delaying reporting can lead to larger discrepancies." },
    ],
  },
];

export default function RetailWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: RetailWorldProps) {
  const [stage, setStage] = useState<"intro" | "tutorial" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showHeartLost, setShowHeartLost] = useState(false);
  const [heartLostMessage, setHeartLostMessage] = useState("");
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleLoseHeart("Time's up!");
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuickRecall, stage, currentQuestionIndex, hearts]);

    const handleLoseHeart = (message: string) => {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      setShowHeartLost(true);
      setHeartLostMessage(message);

      // Track incorrect answer when losing heart
      const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
      const correctOption = currentQuestion.options.find((opt) => opt.correct);
      let updatedIncorrect = [...incorrectAnswers];
      if (selected && correctOption) {
        updatedIncorrect = [...updatedIncorrect, {
          question: currentQuestion.question,
          selectedAnswer: selected.text,
          correctAnswer: correctOption.text,
          explanation: correctOption.explanation,
        }];
        setIncorrectAnswers(updatedIncorrect);
      }

      setTimeout(() => {
        setShowHeartLost(false);
        if (newHearts <= 0) {
          onComplete(false, score, totalQuestions, updatedIncorrect);
        } else if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setTimeLeft(20);
          setQuestionStartTime(Date.now());
        } else {
          onComplete(true, score + 1, totalQuestions, updatedIncorrect);
        }
      }, 1500);
    };

   const currentQuestions = isQuickRecall
     ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
     : questions[difficulty];
   const currentQuestion = currentQuestions[currentQuestionIndex];
   const totalQuestions = currentQuestions.length;

   useEffect(() => {
     if (alwaysCorrect && currentQuestion) {
       const correctOpt = currentQuestion.options.find(opt => opt.correct);
       if (correctOpt) setSelectedAnswer(correctOpt.id);
     }
   }, [alwaysCorrect, currentQuestionIndex]);

   const shuffledOptions = useMemo(() => {
     return shuffleArray(currentQuestion.options);
   }, [currentQuestionIndex]);

   const handleSubmit = () => {
     const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
     if (!selected) return;

     const isCorrect = selected.correct;
     const timeMs = Date.now() - questionStartTime;

     if (onAnswerResult) {
       onAnswerResult(isCorrect, timeMs);
     }

     if (isQuickRecall) {
       if (isCorrect) {
         const newScore = score + 1;
         setScore(newScore);
         setAnsweredQuestions([...answeredQuestions, true]);
         const newStreak = streak + 1;
         setStreak(newStreak);
         if (newStreak > bestStreak) setBestStreak(newStreak);

         if (currentQuestionIndex < totalQuestions - 1) {
           setCurrentQuestionIndex(currentQuestionIndex + 1);
           setSelectedAnswer(null);
           setTimeLeft(20);
           setQuestionStartTime(Date.now());
         } else {
           onComplete(true, newScore, totalQuestions);
         }
       } else {
         handleLoseHeart("Wrong answer!");
         setStreak(0);
       }
       return;
     }

      const newScore = isCorrect ? score + 1 : score;
      setScore(newScore);
      setAnsweredQuestions([...answeredQuestions, isCorrect]);
      if (isCorrect) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) setBestStreak(newStreak);
      } else {
        setStreak(0);
      }

      // Track incorrect answers
      let updatedIncorrect = [...incorrectAnswers];
      if (!isCorrect) {
        const correctOption = currentQuestion.options.find((opt) => opt.correct);
        if (correctOption) {
          updatedIncorrect = [...updatedIncorrect, {
            question: currentQuestion.question,
            selectedAnswer: selected.text,
            correctAnswer: correctOption.text,
            explanation: correctOption.explanation,
          }];
          setIncorrectAnswers(updatedIncorrect);
        }
      }

      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setQuestionStartTime(Date.now());
      } else {
        const passRatio = isCertification ? 0.8 : 0.6;
        const passThreshold = Math.ceil(totalQuestions * passRatio)
        onComplete(newScore >= passThreshold, newScore, totalQuestions, updatedIncorrect);
      }
   };

   // Handle Enter key to submit answer
   useEffect(() => {
     const handleKeyDown = (e: KeyboardEvent) => {
       if (e.key === 'Enter' && selectedAnswer && stage === "challenge") {
         e.preventDefault();
         handleSubmit();
       }
     };

     window.addEventListener('keydown', handleKeyDown);
     return () => window.removeEventListener('keydown', handleKeyDown);
   }, [selectedAnswer, stage, handleSubmit]);

   if (stage === "intro") {
     return (
       <TutorialScreen
         careerName="Retail Worker"
         careerIcon="🛍️"
         steps={[
           {
             title: "Understand the Customer",
             content: "Each question presents a retail scenario. Read carefully to understand what's needed.",
             icon: "📖",
           },
           {
             title: "Apply Store Policy",
             content: "Think about return policies, customer service standards, and legal requirements.",
             icon: "📋",
           },
           {
             title: "Choose the Best Solution",
             content: "Select the option that provides great customer service while following policy.",
             icon: "👆",
           },
           {
             title: isCertification ? "Pass the Certification" : "Pass the Challenge",
             content: `You need ${Math.ceil(questions[difficulty].length * (isCertification ? 0.8 : 0.6))} out of ${questions[difficulty].length} correct to pass. Good luck!`,
             icon: isCertification ? "📜" : "🏆",
           },
         ]}
         onStart={() => setStage("challenge")}
         onBack={() => {
           if (onTutorialBack) {
             audioSystem.playClickSound();
             onTutorialBack();
           } else if (onExit) {
             audioSystem.playClickSound();
             onExit();
           }
         }}
       />
     );
   }

   return (
     <div className="p-4 md:p-8">
       <div className="max-w-4xl mx-auto">
         {showHeartLost && (
           <div className="fixed inset-0 bg-red-500/50 flex items-center justify-center z-50">
             <div className="bg-white rounded-2xl p-8 text-center animate-pulse">
               <div className="text-6xl mb-4">💔</div>
               <p className="text-2xl font-bold text-red-600">{heartLostMessage}</p>
               <p className="text-lg text-gray-600 mt-2">Hearts remaining: {hearts}</p>
             </div>
           </div>
         )}

         <div className="bg-white rounded-2xl shadow-2xl p-8">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-2xl font-bold text-gray-900">
               🛍️ Scenario {currentQuestionIndex + 1} of {totalQuestions}
             </h3>
             <div className="flex items-center gap-4">
               {isQuickRecall && (
                 <div className="flex items-center gap-2">
                   <span className="text-lg">❤️</span>
                   <span className={`text-2xl font-bold ${hearts === 1 ? 'text-red-600' : hearts === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                     {hearts}
                   </span>
                 </div>
               )}
               {isQuickRecall && (
                 <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 animate-pulse' : 'bg-pink-100'}`}>
                   <span className="text-lg">⏱️</span>
                   <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-pink-600'}`}>
                     {timeLeft}s
                   </span>
                 </div>
               )}
               <div className="text-right">
                 <div className="text-sm text-gray-600">Score</div>
                 <div className="text-2xl font-bold text-pink-600">{score}/{currentQuestionIndex}</div>
               </div>
               <div className="text-right">
                 <div className="text-sm text-gray-600">🔥 Streak</div>
                 <div className={`text-2xl font-bold ${streak >= 3 ? 'text-orange-500' : streak >= 2 ? 'text-yellow-500' : 'text-gray-600'}`}>
                   {streak}
                 </div>
                 {bestStreak > 0 && (
                   <div className="text-xs text-gray-500">Best: {bestStreak}</div>
                 )}
               </div>
             </div>
           </div>

           <div className="mb-6">
             <div className="flex gap-2">
               {currentQuestions.map((_, idx) => (
                 <div
                   key={idx}
                   className={`h-2 flex-1 rounded-full ${
                     idx < currentQuestionIndex
                       ? answeredQuestions[idx]
                         ? "bg-green-500"
                         : "bg-red-500"
                       : idx === currentQuestionIndex
                       ? "bg-pink-500"
                       : "bg-gray-300"
                   }`}
                 />
               ))}
             </div>
           </div>

           <div className="bg-pink-50 border-l-4 border-pink-500 p-4 mb-6">
             <p className="font-semibold text-pink-900 mb-2">Scenario:</p>
             <p className="text-pink-800">{currentQuestion.scenario}</p>
           </div>

           <p className="text-lg font-semibold text-gray-900 mb-4">
             {currentQuestion.question}
           </p>

           <div className="space-y-3 mb-6">
             {shuffledOptions.map((option) => (
               <label
                 key={option.id}
                 className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                   selectedAnswer === option.id
                     ? "border-pink-600 bg-pink-50"
                     : "border-gray-300 hover:border-pink-400"
                 }`}
               >
                 <input
                   type="radio"
                   name="answer"
                   value={option.id}
                   checked={selectedAnswer === option.id}
                   onChange={(e) => {
                           audioSystem.playClickSound();
                           setSelectedAnswer(e.target.value);
                         }}
                   className="mr-3"
                 />
                 <span className="text-gray-800">{option.text}</span>
               </label>
             ))}
           </div>

           <button
             onClick={handleSubmit}
             disabled={!selectedAnswer}
             className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
           >
             {currentQuestionIndex < totalQuestions - 1 ? "Next Scenario →" : "Submit Final Answer"}
           </button>
         </div>
       </div>
     </div>
   );
}