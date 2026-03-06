"use client";

import { useState, useMemo, useEffect } from "react";
import { Difficulty } from "@/types/game";
import { getBackgroundStyle } from "@/lib/backgrounds";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface TeacherWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
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
      scenario: "Two students are talking during your lesson.",
      question: "What's the best approach?",
      options: [
        { id: "a", text: "Pause and make eye contact, then continue", correct: true, explanation: "Non-verbal cues are effective and don't disrupt the whole class." },
        { id: "b", text: "Yell at them to be quiet", correct: false, explanation: "This creates a negative environment and may escalate the situation." },
        { id: "c", text: "Ignore it completely", correct: false, explanation: "Ignoring disruptions can lead to more issues and loss of control." },
      ],
    },
    {
      id: "e2",
      scenario: "A student doesn't understand the material.",
      question: "How do you help them?",
      options: [
        { id: "a", text: "Explain it again using a different approach", correct: true, explanation: "Different learning styles require different teaching methods." },
        { id: "b", text: "Tell them to pay better attention", correct: false, explanation: "This doesn't address the learning need and may discourage the student." },
        { id: "c", text: "Move on to keep the schedule", correct: false, explanation: "Leaving students behind creates gaps in understanding." },
      ],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "A student is consistently late to class.",
      question: "What's the best long-term solution?",
      options: [
        { id: "a", text: "Have a private conversation to understand why", correct: true, explanation: "Understanding root causes allows you to address the real issue." },
        { id: "b", text: "Give detention immediately", correct: false, explanation: "Punishment without understanding may not solve the underlying problem." },
        { id: "c", text: "Ignore it if they're a good student", correct: false, explanation: "Inconsistent rules undermine classroom management." },
      ],
    },
    {
      id: "m2",
      scenario: "Half the class failed the test.",
      question: "What should you do?",
      options: [
        { id: "a", text: "Review your teaching methods and reteach", correct: true, explanation: "Widespread failure indicates a teaching issue, not just student issues." },
        { id: "b", text: "Blame students for not studying", correct: false, explanation: "This doesn't address the systemic problem." },
        { id: "c", text: "Curve the grades and move on", correct: false, explanation: "This masks the problem without ensuring learning." },
      ],
    },
    {
      id: "m3",
      scenario: "A student with special needs is struggling.",
      question: "What's your responsibility?",
      options: [
        { id: "a", text: "Implement accommodations and differentiate instruction", correct: true, explanation: "Teachers must provide equitable access to learning for all students." },
        { id: "b", text: "Treat them exactly like everyone else", correct: false, explanation: "Equity means meeting individual needs, not treating everyone identically." },
        { id: "c", text: "Refer them to special education only", correct: false, explanation: "General education teachers share responsibility for all students." },
      ],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "You suspect a student is being abused at home.",
      question: "What is your legal and ethical obligation?",
      options: [
        { id: "a", text: "Report to administration/authorities immediately", correct: true, explanation: "Teachers are mandated reporters and must report suspected abuse." },
        { id: "b", text: "Talk to the student first to confirm", correct: false, explanation: "Mandated reporters must report suspicions, not investigate." },
        { id: "c", text: "Wait to see if more signs appear", correct: false, explanation: "Delaying could put the child at further risk." },
      ],
    },
    {
      id: "h2",
      scenario: "A parent demands you change their child's grade.",
      question: "How do you handle this professionally?",
      options: [
        { id: "a", text: "Explain grading criteria and show evidence, involve admin if needed", correct: true, explanation: "Professional boundaries and documentation protect academic integrity." },
        { id: "b", text: "Change the grade to avoid conflict", correct: false, explanation: "This compromises academic integrity and sets a bad precedent." },
        { id: "c", text: "Refuse without explanation", correct: false, explanation: "Parents deserve transparency about grading decisions." },
      ],
    },
    {
      id: "h3",
      scenario: "Two students are fighting in your classroom.",
      question: "What's the immediate priority?",
      options: [
        { id: "a", text: "Ensure safety, separate students, call for help", correct: true, explanation: "Safety is always the first priority in crisis situations." },
        { id: "b", text: "Try to break up the fight yourself", correct: false, explanation: "This could result in injury to you or escalate the situation." },
        { id: "c", text: "Send other students to get help while you watch", correct: false, explanation: "You should call for help immediately, not send students." },
      ],
    },
    {
      id: "h4",
      scenario: "You discover a student cheating on a major exam.",
      question: "What's the appropriate response?",
      options: [
        { id: "a", text: "Follow school policy, document, and address academic integrity", correct: true, explanation: "Consistent policy enforcement and teaching integrity are essential." },
        { id: "b", text: "Give them a zero and don't tell anyone", correct: false, explanation: "This doesn't address the behavior or follow proper procedures." },
        { id: "c", text: "Give them a warning this time", correct: false, explanation: "Inconsistent consequences undermine academic integrity." },
      ],
    },
  ],
};

// Quick Recall mode - example questions for practice
const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "A student hands in homework that is clearly not their own work.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Confront the student privately and discuss academic integrity", correct: true, explanation: "Private conversation allows student to admit mistake and learn from it." },
      { id: "b", text: "Publicly shame the student in front of class", correct: false, explanation: "This damages trust and doesn't teach appropriate lessons." },
      { id: "c", text: "Ignore it since it's not your problem", correct: false, explanation: "As a teacher, you must address academic dishonesty." },
    ],
  },
  {
    id: "qr2",
    scenario: "A parent complains about their child's grade, insisting you change it.",
    question: "What's the best response?",
    options: [
      { id: "a", text: "Explain the grading criteria and show their child's work", correct: true, explanation: "Transparency and evidence-based discussion builds trust." },
      { id: "b", text: "Change the grade to avoid conflict", correct: false, explanation: "This undermines academic integrity and sets bad precedent." },
      { id: "c", text: "Tell them to take it up with the principal", correct: false, explanation: "Avoiding the conversation damages the teacher-parent relationship." },
    ],
  },
  {
    id: "qr3",
    scenario: "A highly disruptive student is affecting the entire class's learning.",
    question: "What's your first step?",
    options: [
      { id: "a", text: "Speak with the student one-on-one to understand underlying issues", correct: true, explanation: "Understanding root causes is more effective than just punishment." },
      { id: "b", text: "Send the student out of the classroom immediately", correct: false, explanation: "This may escalate the situation and doesn't address the cause." },
      { id: "c", text: "Give the whole class extra homework as punishment", correct: false, explanation: "Punishing the group for one student's behavior is unfair." },
    ],
  },
  {
    id: "qr4",
    scenario: "You notice a student who is usually outgoing becoming withdrawn and sad.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Check in privately with the student and refer to counseling if needed", correct: true, explanation: "Early intervention for mental health concerns is crucial." },
      { id: "b", text: "Wait and see if they come to you", correct: false, explanation: "Students in distress may not seek help on their own." },
      { id: "c", text: "Ask the student what's wrong in front of their friends", correct: false, explanation: "This violates privacy and may embarrass the student." },
    ],
  },
  {
    id: "qr5",
    scenario: "A colleague asks you to cover their class, but you have prep work to do.",
    question: "What's the professional response?",
    options: [
      { id: "a", text: "Agree to help while expressing your workload concerns", correct: true, explanation: "Professionalism means supporting colleagues while communicating boundaries." },
      { id: "b", text: "Refuse because it's not your responsibility", correct: false, explanation: "Team collaboration is essential in schools." },
      { id: "c", text: "Agree but then complain about it to other teachers", correct: false, explanation: "This creates negative workplace culture." },
    ],
  },
  {
    id: "qr6",
    scenario: "A student complains that a lesson is boring and asks when they'll use this in real life.",
    question: "How should you respond?",
    options: [
      { id: "a", text: "Explain real-world applications and connect to their interests", correct: true, explanation: "Making content relevant increases engagement and retention." },
      { id: "b", text: "Tell them to just memorize it for the test", correct: false, explanation: "This kills motivation and doesn't address their concern." },
      { id: "c", text: "Ignore the comment and continue with the lesson", correct: false, explanation: "Addressing student concerns is important for engagement." },
    ],
  },
  {
    id: "qr7",
    scenario: "You discover two students are dating and one is in your class.",
    question: "What's the appropriate action?",
    options: [
      { id: "a", text: "Monitor for appropriate behavior in class but otherwise ignore", correct: true, explanation: "As long as it's not affecting learning, it's a personal matter." },
      { id: "b", text: "Publicly announce that dating is not allowed at school", correct: false, explanation: "This violates privacy and could be embarrassing." },
      { id: "c", text: "Separate them in your class immediately", correct: false, explanation: "This should only be done if it's causing disruption." },
    ],
  },
  {
    id: "qr8",
    scenario: "A student arrives late to class for the third time this week.",
    question: "What's the best approach?",
    options: [
      { id: "a", text: "Speak with the student privately about patterns of tardiness", correct: true, explanation: "Understanding underlying issues is more effective than punishment." },
      { id: "b", text: "Give them detention on the spot", correct: false, explanation: "Repeated issues may have root causes that need addressing." },
      { id: "c", text: "Make the whole class wait until they arrive", correct: false, explanation: "Punishing the group for one student's behavior is unfair." },
    ],
  },
  {
    id: "qr9",
    scenario: "A parent asks you to give their child extra credit work to improve their grade.",
    question: "What should you say?",
    options: [
      { id: "a", text: "Explain that grades reflect mastery and offer office hours for extra help", correct: true, explanation: "This maintains grading integrity while offering support." },
      { id: "b", text: "Agree and create easier assignments", correct: false, explanation: "This undermines grading standards and fairness." },
      { id: "c", text: "Refuse categorically without explanation", correct: false, explanation: "Professional communication is important." },
    ],
  },
  {
    id: "qr10",
    scenario: "You notice a student cheating during an exam.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Collect the evidence quietly and address it after class", correct: true, explanation: "This maintains exam integrity while handling it professionally." },
      { id: "b", text: "Loudly announce that someone is cheating", correct: false, explanation: "This disrupts the exam and could embarrass the student unfairly." },
      { id: "c", text: "Ignore it this one time", correct: false, explanation: "Cheating must be addressed to maintain academic integrity." },
    ],
  },
  {
    id: "qr11",
    scenario: "A student with IEP (Individualized Education Program) is falling behind in your class.",
    question: "What's your first action?",
    options: [
      { id: "a", text: "Review the IEP accommodations and implement them consistently", correct: true, explanation: "IEPs are legal documents that must be followed." },
      { id: "b", text: "Expect the same work as other students", correct: false, explanation: "IEPs exist to provide necessary supports." },
      { id: "c", text: "Lower your expectations significantly", correct: false, explanation: "The goal is appropriate challenge with support." },
    ],
  },
  {
    id: "qr12",
    scenario: "Your classroom has a student with severe peanut allergy.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Create an allergy-aware classroom policy and communicate with parents", correct: true, explanation: "Safety is paramount and communication is key." },
      { id: "b", text: "Ban all food from your classroom", correct: false, explanation: "This may be excessive; balance is needed." },
      { id: "c", text: "Let students eat what they want, it's not your responsibility", correct: false, explanation: "You have a duty of care for all students." },
    ],
  },
  {
    id: "qr13",
    scenario: "A gifted student complains that the work is too easy.",
    question: "How do you respond?",
    options: [
      { id: "a", text: "Provide enrichment activities and challenging extensions", correct: true, explanation: "Differentiation helps all learners grow." },
      { id: "b", text: "Tell them to help other students instead", correct: false, explanation: "This is not fair to the gifted student." },
      { id: "c", text: "Say that's just how it is", correct: false, explanation: "All students deserve appropriate challenge." },
    ],
  },
  {
    id: "qr14",
    scenario: "You receive an email from a student at 11pm asking about homework due tomorrow.",
    question: "What's the best response?",
    options: [
      { id: "a", text: "Reply during work hours that you'll discuss in class", correct: true, explanation: "Boundaries are important for teacher wellness." },
      { id: "b", text: "Reply immediately to show you care", correct: false, explanation: "Setting boundaries models healthy work-life balance." },
      { id: "c", text: "Ignore the email completely", correct: false, explanation: "Some response is usually appropriate." },
    ],
  },
  {
    id: "qr15",
    scenario: "A group project has one student doing all the work while others contribute nothing.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Observe and then address individual contributions in grading", correct: true, explanation: "Fair assessment should reflect actual work done." },
      { id: "b", text: "Give them all the same grade", correct: false, explanation: "This penalizes hard workers and rewards slackers." },
      { id: "c", text: "Reassign groups so the lazy students are together", correct: false, explanation: "This doesn't address the learning outcome." },
    ],
  },
  {
    id: "qr16",
    scenario: "A parent wants to observe your classroom unannounced.",
    question: "What's appropriate?",
    options: [
      { id: "a", text: "Check school policy and arrange a mutually convenient time", correct: true, explanation: "Following procedures while accommodating is professional." },
      { id: "b", text: "Always allow parents to come whenever they want", correct: false, explanation: "Classroom needs to run smoothly during instruction." },
      { id: "c", text: "Refuse all parent observations", correct: false, explanation: "Parents often have rights to observe." },
    ],
  },
  {
    id: "qr17",
    scenario: "You make a grading error and a student's grade is wrong.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Correct the error promptly and apologize", correct: true, explanation: "Integrity means owning mistakes and fixing them." },
      { id: "b", text: "Keep the error to avoid extra work", correct: false, explanation: "This is unethical and harms the student." },
      { id: "c", text: "Blame the error on the school system", correct: false, explanation: "Taking responsibility is important." },
    ],
  },
  {
    id: "qr18",
    scenario: "A student uses their phone in class despite repeated warnings.",
    question: "What's the best consequence?",
    options: [
      { id: "a", text: "Apply consistent consequences per your classroom policy", correct: true, explanation: "Consistency builds trust and expectations." },
      { id: "b", text: "Confiscate it for the entire semester", correct: false, explanation: "Proportionate consequences are more effective." },
      { id: "c", text: "Ignore it since it's not worth the confrontation", correct: false, explanation: "Consistency in enforcement matters." },
    ],
  },
  {
    id: "qr19",
    scenario: "You're asked to teach a subject outside your certification area.",
    question: "What's the best response?",
    options: [
      { id: "a", text: "Express concerns and request support or training", correct: true, explanation: "Professional development helps ensure quality instruction." },
      { id: "b", text: "Just agree to do it without concerns", correct: false, explanation: "Students deserve qualified teachers." },
      { id: "c", text: "Refuse outright without discussion", correct: false, explanation: "Collaboration can find solutions." },
    ],
  },
  {
    id: "qr20",
    scenario: "A student refuses to participate in a group activity for religious reasons.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Respect their beliefs and offer an alternative assignment", correct: true, explanation: "Religious accommodations are legally required." },
      { id: "b", text: "Make them participate anyway", correct: false, explanation: "This violates religious freedom." },
      { id: "c", text: "Grade them zero for not participating", correct: false, explanation: "Accommodations should be made when possible." },
    ],
  },
  {
    id: "qr21",
    scenario: "Your teaching partner is consistently late to class, leaving you alone.",
    question: "What's the best approach?",
    options: [
      { id: "a", text: "Discuss the issue privately first, then involve administration if needed", correct: true, explanation: "Professional resolution starts with direct communication." },
      { id: "b", text: "Complain to other teachers about them", correct: false, explanation: "This is unprofessional and doesn't solve the problem." },
      { id: "c", text: "Be late too to get back at them", correct: false, explanation: "This harms students, not the colleague." },
    ],
  },
  {
    id: "qr22",
    scenario: "A student turns in a creative project that doesn't meet requirements but shows effort.",
    question: "How should you grade it?",
    options: [
      { id: "a", text: "Grade based on requirements met and provide feedback for improvement", correct: true, explanation: "Fair assessment balances encouragement with standards." },
      { id: "b", text: "Give full credit for effort alone", correct: false, explanation: "This sets unrealistic expectations." },
      { id: "c", text: "Fail them for not following directions", correct: false, explanation: "Learning opportunity matters." },
    ],
  },
  {
    id: "qr23",
    scenario: "You suspect a student is being bullied online.",
    question: "What should you do?",
    options: [
      { id: "a", text: "Report to administration and counseling immediately", correct: true, explanation: "Bullying requires professional intervention." },
      { id: "b", text: "Ignore it since it's outside school hours", correct: false, explanation: "Cyberbullying that affects school performance is relevant." },
      { id: "c", text: "Tell the student to just ignore it", correct: false, explanation: "Victims need support, not dismissal." },
    ],
  },
  {
    id: "qr24",
    scenario: "Your students are struggling with a concept despite your best teaching.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Try different teaching strategies and seek colleague input", correct: true, explanation: "Collaboration and adaptation improve instruction." },
      { id: "b", text: "Move on since you've taught it", correct: false, explanation: "Student understanding is the goal." },
      { id: "c", text: "Blame the students for not paying attention", correct: false, explanation: "Responsibility for learning lies with the teacher too." },
    ],
  },
  {
    id: "qr25",
    scenario: "A student asks you to write a college recommendation letter but you don't know them well.",
    question: "What's appropriate?",
    options: [
      { id: "a", text: "Politely explain you need more time to get to know them, or decline", correct: true, explanation: "Honest limits are better than weak recommendations." },
      { id: "b", text: "Write a generic positive letter", correct: false, explanation: "A weak recommendation can hurt more than help." },
      { id: "c", text: "Refuse because it's extra work", correct: false, explanation: "Professional courtesy matters." },
    ],
  },
  {
    id: "qr26",
    scenario: "You notice a student hiding something in their backpack during class.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Continue teaching but keep an eye and address if needed", correct: true, explanation: "Observation without confrontation is often best." },
      { id: "b", text: "Immediately search their backpack", correct: false, explanation: "This requires appropriate authority and cause." },
      { id: "c", text: "Pretend you didn't see anything", correct: false, explanation: "Safety concerns should be addressed." },
    ],
  },
  {
    id: "qr27",
    scenario: "A parent threatens to go to the media about a classroom issue.",
    question: "What's your best response?",
    options: [
      { id: "a", text: "Stay calm, listen to concerns, and involve administration", correct: true, explanation: "De-escalation and following protocol is essential." },
      { id: "b", text: "Argue back and defend yourself", correct: false, explanation: "This often escalates conflict." },
      { id: "c", text: "Immediately apologize for everything", correct: false, explanation: "Professional boundaries matter." },
    ],
  },
  {
    id: "qr28",
    scenario: "Your classroom has limited resources but you need to run a hands-on activity.",
    question: "What do you do?",
    options: [
      { id: "a", text: "Get creative with available materials and apply for grants", correct: true, explanation: "Resourcefulness is a valuable teaching skill." },
      { id: "b", text: "Skip the activity entirely", correct: false, explanation: "Students miss out on learning." },
      { id: "c", text: "Ask students to bring materials from home", correct: false, explanation: "This may create equity issues." },
    ],
  },
  {
    id: "qr29",
    scenario: "A student claims they turned in an assignment but you can't find it.",
    question: "How do you handle this?",
    options: [
      { id: "a", text: "Give them benefit of the doubt and allow resubmission with proof", correct: true, explanation: "Technology can fail; being fair matters." },
      { id: "b", text: "Grade them as if they never turned it in", correct: false, explanation: "This builds resentment and distrust." },
      { id: "c", text: "Accuse them of lying", correct: false, explanation: "This damages the student-teacher relationship." },
    ],
  },
  {
    id: "qr30",
    scenario: "You're offered a promotion to administration but you love teaching.",
    question: "What's the best consideration?",
    options: [
      { id: "a", text: "Reflect on your career goals and what fulfills you", correct: true, explanation: "Job satisfaction matters for long-term success." },
      { id: "b", text: "Always take the promotion for more money", correct: false, explanation: "Money doesn't equal fulfillment." },
      { id: "c", text: "Never consider leaving the classroom", correct: false, explanation: "Growth opportunities can be valuable." },
    ],
  },
];

export default function TeacherWorld({ difficulty, onComplete, isQuickRecall }: TeacherWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // Quick Recall hearts system
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showHeartLost, setShowHeartLost] = useState(false);
  const [heartLostMessage, setHeartLostMessage] = useState("");

  // Timer for Quick Recall mode
  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - lose a heart
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
    
    setTimeout(() => {
      setShowHeartLost(false);
      if (newHearts <= 0) {
        // Game over - lost all hearts
        onComplete(false, score, totalQuestions);
      } else if (currentQuestionIndex < totalQuestions - 1) {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setTimeLeft(20);
      } else {
        // Last question done
        onComplete(true, score + 1, totalQuestions);
      }
    }, 1500);
  };

  // Use quick recall questions if available, otherwise fall back to easy questions
  const currentQuestions = isQuickRecall 
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  // Shuffle options for current question
  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentQuestion.options);
  }, [currentQuestionIndex]);

  const handleSubmit = () => {
    const selected = currentQuestion.options.find((opt) => opt.id === selectedAnswer);
    if (!selected) return;

    const isCorrect = selected.correct;
    
    // Quick Recall mode: hearts system
    if (isQuickRecall) {
      if (isCorrect) {
        // Correct answer - add score and move on
        const newScore = score + 1;
        setScore(newScore);
        setAnsweredQuestions([...answeredQuestions, true]);
        // Update streak
        const newStreak = streak + 1;
        setStreak(newStreak);
        if (newStreak > bestStreak) {
          setBestStreak(newStreak);
        }
        
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
          setTimeLeft(20);
        } else {
          // All questions done - WIN!
          onComplete(true, newScore, totalQuestions);
        }
      } else {
        // Wrong answer - lose a heart
        handleLoseHeart("Wrong answer!");
        setStreak(0); // Reset streak on wrong answer
      }
      return;
    }

    // Regular challenge mode
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, isCorrect]);
    // Update streak
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }
    } else {
      setStreak(0);
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      const passThreshold = Math.ceil(totalQuestions * 0.6);
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    const customStyle = getBackgroundStyle("teacher");
    return (
      <div style={customStyle} className={`min-h-screen ${customStyle.backgroundImage ? '' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'} p-4 md:p-8 flex items-center justify-center`}>
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👩‍🏫</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Teacher - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re a classroom teacher facing {totalQuestions} different 
              situations. Make the best professional decisions for your students.
            </p>
            
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4">
              <p className="font-semibold text-indigo-900">Your Task:</p>
              <p className="text-indigo-800">
                Handle {totalQuestions} classroom scenarios. You need {Math.ceil(totalQuestions * 0.6)} correct to pass!
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Difficulty: {difficulty.toUpperCase()}</strong> - 
                {difficulty === "easy" && " Basic classroom management"}
                {difficulty === "medium" && " Complex student situations"}
                {difficulty === "hard" && " Critical professional decisions"}
              </p>
            </div>

            {/* Quick Recall Mode Info */}
            {isQuickRecall && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="font-semibold text-red-900 mb-2">⚡ Quick Recall Mode:</p>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>❤️ You have 3 hearts</li>
                  <li>❌ Lose 1 heart for each wrong answer</li>
                  <li>⏱️ Lose 1 heart if time runs out (20 seconds per question)</li>
                  <li>🏆 Complete all questions to win!</li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-indigo-600 text-white font-bold py-4 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Enter Classroom →
          </button>
        </div>
      </div>
    );
  }

  const customStyle = getBackgroundStyle("teacher");

  return (
    <div style={customStyle} className={`min-h-screen ${customStyle.backgroundImage ? '' : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600'} p-4 md:p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Heart Lost Overlay */}
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
              📚 Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {/* Quick Recall: Hearts Display */}
              {isQuickRecall && (
                <div className="flex items-center gap-2">
                  <span className="text-lg">❤️</span>
                  <span className={`text-2xl font-bold ${hearts === 1 ? 'text-red-600' : hearts === 2 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {hearts}
                  </span>
                </div>
              )}
              {/* Quick Recall: Timer Display */}
              {isQuickRecall && (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${timeLeft <= 5 ? 'bg-red-100 animate-pulse' : 'bg-indigo-100'}`}>
                  <span className="text-lg">⏱️</span>
                  <span className={`text-xl font-bold ${timeLeft <= 5 ? 'text-red-600' : 'text-indigo-600'}`}>
                    {timeLeft}s
                  </span>
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-indigo-600">{score}/{currentQuestionIndex}</div>
              </div>
              {/* Streak Display */}
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
                      ? "bg-indigo-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 mb-6">
            <p className="font-semibold text-indigo-900 mb-2">Situation:</p>
            <p className="text-indigo-800">{currentQuestion.scenario}</p>
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
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option.id}
                  checked={selectedAnswer === option.id}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
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
