"use client";

import { Career, Difficulty, IncorrectAnswer, calculateXPForNextLevel } from "@/types/game";
import ScreenWrapper from "./ScreenWrapper";
import { GameButton, AnimatedIcon, GradientCard, AnimatedContainer } from "./ui/UIComponents";

interface OutcomeScreenProps {
  career: Career;
  difficulty: Difficulty;
  success: boolean;
  score: number;
  total: number;
  xpGained?: number;
  newXP?: number;
  onPlayAgain: () => void;
  onNewCareer: () => void;
  onChangeDifficulty: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  onBackToSelection?: () => void;
  incorrectAnswers?: IncorrectAnswer[];
  oldLevel?: number;
  newLevel?: number;
}

const careerData = {
  programmer: {
    icon: "💻",
    title: "Software Programmer",
    successSkill: "Debugging & Logical Thinking",
    successMessage: "You demonstrated strong debugging skills! Programmers need logical thinking to trace through code execution and spot where things go wrong.",
    failureSkill: "Root Cause Analysis",
    failureMessage: "Keep practicing! Programmers must identify root causes, not just mask symptoms. Review the questions and try again.",
    keySkills: [
      "Problem-solving and logical reasoning",
      "Attention to detail",
      "Understanding of data structures",
      "Systematic debugging approach",
    ],
  },
  nurse: {
    icon: "🏥",
    title: "Registered Nurse",
    successSkill: "Clinical Prioritization & Triage",
    successMessage: "Excellent triage skills! You correctly prioritized patients based on severity. Nurses must make life-or-death decisions under pressure.",
    failureSkill: "Critical Assessment",
    failureMessage: "Triage is challenging! Remember to prioritize life-threatening conditions first, then urgent cases, then stable patients.",
    keySkills: [
      "Rapid assessment of patient conditions",
      "Prioritization under pressure",
      "Medical knowledge and critical thinking",
      "Empathy combined with decisiveness",
    ],
  },
  engineer: {
    icon: "🏗️",
    title: "Civil Engineer",
    successSkill: "Constraint Optimization",
    successMessage: "Perfect engineering decisions! You balanced cost, strength, and timeline effectively. Engineers must find solutions that meet ALL requirements.",
    failureSkill: "Requirements Analysis",
    failureMessage: "Engineering requires balancing multiple constraints. Review which designs met all requirements and try again.",
    keySkills: [
      "Balancing multiple constraints",
      "Mathematical and analytical thinking",
      "Understanding trade-offs",
      "Safety-first mindset",
    ],
  },
  teacher: {
    icon: "👩‍🏫",
    title: "Teacher",
    successSkill: "Classroom Management & Professional Judgment",
    successMessage: "Excellent teaching decisions! You demonstrated the professional judgment needed to manage classrooms and support student learning effectively.",
    failureSkill: "Educational Decision-Making",
    failureMessage: "Teaching requires balancing student needs, classroom management, and professional ethics. Review the scenarios and try again.",
    keySkills: [
      "Classroom management and leadership",
      "Understanding diverse learning needs",
      "Professional ethics and responsibility",
      "Communication and patience",
    ],
  },
  chef: {
    icon: "👨‍🍳",
    title: "Professional Chef",
    successSkill: "Culinary Expertise & Kitchen Management",
    successMessage: "Outstanding culinary decisions! You showed the expertise needed to manage a professional kitchen, from food safety to quality control.",
    failureSkill: "Kitchen Operations",
    failureMessage: "Professional cooking requires timing, quality control, and food safety knowledge. Review the challenges and try again.",
    keySkills: [
      "Time management and multitasking",
      "Food safety and quality control",
      "Creativity and adaptability",
      "Leadership under pressure",
    ],
  },
  architect: {
    icon: "🏛️",
    title: "Architect",
    successSkill: "Design Integration & Professional Practice",
    successMessage: "Excellent architectural thinking! You balanced aesthetics, function, safety, and codes—the hallmarks of great architecture.",
    failureSkill: "Design Problem-Solving",
    failureMessage: "Architecture requires balancing many factors: client needs, codes, sustainability, and aesthetics. Review the principles and try again.",
    keySkills: [
      "Spatial and creative thinking",
      "Building codes and safety",
      "Sustainable design principles",
      "Client communication and ethics",
    ],
  },
  lawyer: {
    icon: "⚖️",
    title: "Lawyer",
    successSkill: "Legal Analysis & Reasoning",
    successMessage: "Excellent legal reasoning! You correctly applied legal principles to complex scenarios. Lawyers must analyze facts and identify relevant laws.",
    failureSkill: "Case Analysis",
    failureMessage: "Legal practice requires careful analysis of facts and relevant precedents. Review the scenarios and try again.",
    keySkills: [
      "Critical thinking and analysis",
      "Legal research and writing",
      "Ethical judgment and advocacy",
      "Attention to detail",
    ],
  },
  retail: {
    icon: "🛍️",
    title: "Retail Worker",
    successSkill: "Customer Service & Problem Solving",
    successMessage: "Great customer service skills! You handled challenging retail scenarios with professionalism and empathy.",
    failureSkill: "Service Excellence",
    failureMessage: "Retail work requires balancing customer satisfaction with store policies. Review the situations and try again.",
    keySkills: [
      "Customer service and communication",
      "Problem-solving under pressure",
      "Product knowledge and sales",
      "Teamwork and reliability",
    ],
  },
  electrician: {
    icon: "⚡",
    title: "Electrician",
    successSkill: "Electrical Knowledge & Safety",
    successMessage: "Excellent electrical work! You demonstrated proper knowledge of wiring, codes, and safety procedures.",
    failureSkill: "Technical Competence",
    failureMessage: "Electrical work requires understanding codes, safety, and proper procedures. Review the standards and try again.",
    keySkills: [
      "Electrical code knowledge",
      "Safety protocols and procedures",
      "Troubleshooting and problem-solving",
      "Attention to detail",
    ],
  },
};

const trophyGradients = {
  easy: "from-green-400 to-emerald-500",
  medium: "from-amber-400 to-orange-500",
  hard: "from-red-500 to-pink-600",
};

const trophyIcons = {
  easy: "🥉",
  medium: "🥈",
  hard: "🥇",
};

export default function OutcomeScreen({
  career,
  difficulty,
  success,
  score,
  total,
  xpGained,
  newXP,
  onPlayAgain,
  onNewCareer,
  onChangeDifficulty,
  onOpenSettings,
  onExit,
  isQuickRecall,
  isCertification,
  onBackToSelection,
  incorrectAnswers = [],
  oldLevel,
  newLevel,
}: OutcomeScreenProps) {
  const data = careerData[career];
  const percentage = Math.round((score / total) * 100);
  const passingScore = isCertification ? 80 : 60;
  const isSuccess = percentage >= passingScore;

  const cardGradient = isQuickRecall 
    ? "from-indigo-900/90 via-purple-900/90 to-violet-900/90" 
    : isCertification 
      ? "from-purple-900/90 via-pink-900/90 to-fuchsia-900/90" 
      : "from-white/10 to-white/5 backdrop-blur-xl";

  const xpProgress = newXP !== undefined ? calculateXPForNextLevel(newXP) : undefined;

  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit} dark>
      <div className="max-w-3xl w-full mx-auto">
        <GradientCard className="p-8 md:p-12" gradient={cardGradient}>
          <div className="text-center mb-8">
            <AnimatedIcon animate="bounce" className="text-7xl mb-4 inline-block">
              {data.icon}
            </AnimatedIcon>
            
            {success && (
              <div className="mb-6">
                <div className={`inline-block bg-gradient-to-r ${trophyGradients[difficulty]} text-white px-8 py-3 rounded-full text-3xl font-bold shadow-xl`}>
                  {isQuickRecall ? "🏆 Mastery Achieved!" : isCertification ? "🏆 Certification Complete! ✓" : `${trophyIcons[difficulty]} Trophy Earned!`}
                </div>
              </div>
            )}

            <h2 className={`text-4xl font-extrabold mb-2 ${
              success 
                ? (isQuickRecall ? "text-amber-300" : isCertification ? "text-purple-300" : "text-green-600") 
                : (isQuickRecall ? "text-purple-300" : isCertification ? "text-pink-400" : "text-orange-600")
            }`}>
              {success 
                ? (isQuickRecall ? "Mastery Complete! ✓" : isCertification ? "Certification Complete! ✓" : "Success! ✓") 
                : (isQuickRecall ? "Keep Practicing!" : isCertification ? "Not Certified Yet" : "Keep Trying!")}
            </h2>
            
            <h3 className={`text-2xl font-bold mb-2 ${isQuickRecall ? "text-white" : isCertification ? "text-purple-300" : "text-white"}`}>
              {data.title}
            </h3>
            
            {isCertification && (
              <div className="text-center mb-4">
                <div className="inline-block bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-lg px-4 py-2">
                  <span className="flex items-center justify-center gap-1 text-purple-300 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Certification Exam (80% passing threshold)
                  </span>
                </div>
              </div>
            )}
            
            <p className={`text-lg ${isQuickRecall ? "text-purple-200" : isCertification ? "text-purple-300" : "text-white/80"}`}>
              {isQuickRecall ? "Quick Recall Mode" : isCertification ? "Certification Mode" : `Difficulty: ${difficulty}`}
            </p>
          </div>

          <div className={`rounded-xl p-6 mb-8 ${isQuickRecall ? "bg-indigo-800/50" : "bg-white/10 backdrop-blur-sm"}`}>
            <div className="text-center mb-4">
              <div className={`text-5xl font-extrabold mb-2 ${isQuickRecall ? "text-white" : isCertification ? "text-purple-300" : "text-white"}`}>
                {score} / {total}
              </div>
              <div className={`text-xl ${isQuickRecall ? "text-purple-200" : isCertification ? "text-purple-300" : "text-white/80"}`}>
                {percentage}% Correct
              </div>
            </div>

            <div className="bg-gray-700/50 rounded-full h-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-700 rounded-full ${
                  percentage >= passingScore ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>

            <div className="text-center mt-3 text-sm text-white/60">
              {isQuickRecall 
                ? (percentage >= 60 ? "Great job! You passed!" : "Keep practicing to improve!")
                : isCertification
                ? (percentage >= 80 ? "Certification Earned! ✓" : `Need ${passingScore}% to certify`)
                : (percentage >= 60 ? "Passed! (60% required)" : "Need 60% to pass")}
            </div>
          </div>

          {xpGained !== undefined && xpGained > 0 && (
            <div className="rounded-xl p-6 mb-8 bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-500/30">
              <div className="text-center mb-4">
                <p className="text-white font-bold mb-2 flex items-center justify-center gap-2">
                  <span className="text-3xl">⚡</span>
                  <span>XP Earned!</span>
                </p>
                <p className="text-5xl font-extrabold text-yellow-400 mb-2">+{xpGained} XP</p>
                {xpProgress && xpProgress.needed > 0 && (
                  <>
                    <div className="bg-white/10 rounded-full h-3 overflow-hidden mt-4 max-w-xs mx-auto">
                      <div 
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(xpProgress.current / xpProgress.needed) * 100}%` }}
                      />
                    </div>
                    <p className="text-white/70 text-sm mt-1">
                      {xpProgress.current} / {xpProgress.needed} XP to Level {(newLevel ?? 0) + 1}
                    </p>
                  </>
                )}
                {newLevel !== undefined && oldLevel !== undefined && newLevel > oldLevel && (
                  <div className="mt-3 inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 px-6 py-2 rounded-full">
                    <span className="text-white font-extrabold">🌟 LEVEL UP!</span>
                    <span className="text-white/90">Level {oldLevel} → Level {newLevel}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className={`border-l-4 p-5 mb-5 rounded-r-lg ${isQuickRecall ? "bg-amber-900/50 border-amber-400" : "bg-blue-50/20 border-blue-400"}`}>
              <p className={`font-bold mb-2 text-lg ${isQuickRecall ? "text-amber-200" : "text-blue-300"}`}>
                Key Skill: {success ? data.successSkill : data.failureSkill}
              </p>
              <p className={isQuickRecall ? "text-amber-100" : "text-white/80"}>
                {success ? data.successMessage : data.failureMessage}
              </p>
            </div>

            <div className={`rounded-xl p-6 ${isQuickRecall ? "bg-indigo-900/50" : "bg-white/10 backdrop-blur-sm"}`}>
              <h4 className={`font-bold mb-4 text-lg ${isQuickRecall ? "text-white" : "text-white"}`}>
                What {data.title}s Need:
              </h4>
              <ul className="space-y-2">
                {data.keySkills.map((skill, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-amber-400 mr-2 text-lg">✓</span>
                    <span className={isQuickRecall ? "text-purple-200" : "text-white/90"}>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {incorrectAnswers.length > 0 && (
            <div className="mb-8">
              <div className={`rounded-xl p-6 border ${isQuickRecall ? "bg-red-900/30 border-red-500/30" : "bg-red-50/20 border-red-500/30"}`}>
                <h4 className={`font-bold mb-4 flex items-center gap-2 text-lg ${isQuickRecall ? "text-red-300" : "text-red-300"}`}>
                  📚 Review: Questions to Improve
                </h4>
                <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                  {incorrectAnswers.map((item, idx) => (
                    <AnimatedContainer key={idx} delay={idx * 50}>
                      <div className={`border-l-4 p-4 rounded-r-lg ${isQuickRecall ? "bg-red-800/50 border-red-400" : "bg-white/10 border-red-400"}`}>
                        <p className={`font-semibold mb-2 ${isQuickRecall ? "text-red-200" : "text-red-300"}`}>
                          {item.question}
                        </p>
                        <div className={`text-sm space-y-1 ${isQuickRecall ? "text-purple-200" : "text-white/70"}`}>
                          <p><span className="font-medium">Your answer:</span> {item.selectedAnswer}</p>
                          <p><span className="font-medium">Correct answer:</span> {item.correctAnswer}</p>
                          <p className="mt-2"><span className="font-medium">Explanation:</span> {item.explanation}</p>
                        </div>
                      </div>
                    </AnimatedContainer>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <GameButton onClick={onPlayAgain} className="w-full text-lg">
              {isQuickRecall ? "Try Again" : "Try Same Difficulty Again"}
            </GameButton>
            
            {isQuickRecall || isCertification ? (
              <GameButton 
                onClick={onBackToSelection} 
                className="w-full text-lg bg-gradient-to-r from-purple-500 to-violet-500"
              >
                {isCertification ? "Choose Different Certification" : "← Back to Selection"}
              </GameButton>
            ) : (
              <GameButton 
                onClick={onChangeDifficulty} 
                className="w-full text-lg bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Change Difficulty Level
              </GameButton>
            )}
            
            <GameButton 
              onClick={onBackToSelection || onNewCareer} 
              className="w-full text-lg bg-gradient-to-r from-gray-700 to-gray-800"
            >
              {isCertification ? "Try Another Certification" : "Explore Another Career"}
            </GameButton>
          </div>

          <div className={`mt-6 text-center text-sm ${isQuickRecall ? "text-purple-300" : "text-white/60"}`}>
            {success
              ? (isQuickRecall ? `Great job! You showed mastery in ${data.title}!` : `Great job! You earned the ${difficulty} trophy for ${data.title}!`)
              : (isQuickRecall ? "Practice makes perfect! Keep trying!" : "Learning from mistakes is part of every career. Keep practicing!")}
          </div>
        </GradientCard>
      </div>
    </ScreenWrapper>
  );
}