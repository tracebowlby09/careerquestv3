"use client";

import { Career, Difficulty } from "@/types/game";
import ScreenWrapper from "./ScreenWrapper";

interface OutcomeScreenProps {
  career: Career;
  difficulty: Difficulty;
  success: boolean;
  score: number;
  total: number;
  onPlayAgain: () => void;
  onNewCareer: () => void;
  onChangeDifficulty: () => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
  isQuickRecall?: boolean;
  onBackToSelection?: () => void;
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
};

const trophyColors = {
  easy: "from-green-400 to-emerald-500",
  medium: "from-yellow-400 to-orange-500",
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
  onPlayAgain,
  onNewCareer,
  onChangeDifficulty,
  onOpenSettings,
  onExit,
  isQuickRecall,
  onBackToSelection,
}: OutcomeScreenProps) {
  const data = careerData[career];
  const percentage = Math.round((score / total) * 100);
  const isQR = isQuickRecall;

  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit} dark>
      <div className={`max-w-3xl w-full rounded-2xl shadow-2xl p-8 mx-auto ${isQR ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900" : "bg-white"}`}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{data.icon}</div>
          
          {success && (
            <div className="mb-4">
              <div className={`inline-block bg-gradient-to-r ${isQR ? "from-amber-400 via-orange-500 to-red-500" : trophyColors[difficulty]} text-white px-6 py-3 rounded-full text-4xl font-bold shadow-lg`}>
                {isQR ? "🏆" : trophyIcons[difficulty]} {isQR ? "Mastery Achieved!" : "Trophy Earned!"}
              </div>
            </div>
          )}
          
          <div className={`text-5xl font-bold mb-4 ${
            success ? (isQR ? "text-amber-300" : "text-green-600") : (isQR ? "text-purple-300" : "text-orange-600")
          }`}>
            {success ? (isQR ? "Mastery Complete! ✓" : "Success! ✓") : (isQR ? "Keep Practicing!" : "Keep Trying!")}
          </div>
          
          <h3 className={`text-2xl font-bold mb-2 ${isQR ? "text-white" : "text-gray-900"}`}>
            {data.title}
          </h3>
          
          <div className={`text-lg ${isQR ? "text-purple-200" : "text-gray-700"}`}>
            {isQR ? "Quick Recall Mode" : `Difficulty: ${difficulty}`}
          </div>
        </div>

        <div className={`rounded-lg p-6 mb-6 ${isQR ? "bg-indigo-800/50" : "bg-gray-100"}`}>
          <div className="text-center mb-4">
            <div className={`text-5xl font-bold mb-2 ${isQR ? "text-white" : "text-gray-900"}`}>
              {score} / {total}
            </div>
            <div className={`text-xl ${isQR ? "text-purple-200" : "text-gray-700"}`}>
              {percentage}% Correct
            </div>
          </div>
          
          <div className="bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                percentage >= 60 ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          
          <div className="text-center mt-2 text-sm text-gray-400">
            {isQR 
              ? (percentage >= 60 ? "Great job! You passed!" : "Keep practicing to improve!")
              : (percentage >= 60 ? "Passed! (60% required)" : "Need 60% to pass")}
          </div>
        </div>

        <div className="mb-6">
          <div className={`border-l-4 p-4 mb-4 ${isQR ? "bg-amber-900/50 border-amber-400" : "bg-blue-50 border-blue-500"}`}>
            <p className={`font-bold mb-2 ${isQR ? "text-amber-200" : "text-blue-900"}`}>
              Key Skill: {success ? data.successSkill : data.failureSkill}
            </p>
            <p className={isQR ? "text-amber-100" : "text-blue-800"}>
              {success ? data.successMessage : data.failureMessage}
            </p>
          </div>

          <div className={`rounded-lg p-6 ${isQR ? "bg-indigo-900/50" : "bg-gray-50"}`}>
            <h4 className={`font-bold mb-3 ${isQR ? "text-white" : "text-gray-900"}`}>
              What {data.title}s Need:
            </h4>
            <ul className="space-y-2">
              {data.keySkills.map((skill, index) => (
                <li key={index} className="flex items-start">
                  <span className={isQR ? "text-amber-400 mr-2" : "text-green-600 mr-2"}>✓</span>
                  <span className={isQR ? "text-purple-200" : "text-gray-700"}>{skill}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onPlayAgain}
            className={`w-full font-bold py-4 rounded-lg transition-colors ${
              isQR 
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isQR ? "Try Again" : "Try Same Difficulty Again"}
          </button>
          
          {isQR ? (
            <button
              onClick={onBackToSelection}
              className="w-full bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold py-4 rounded-lg hover:from-purple-600 hover:to-violet-600 transition-colors"
            >
              ← Back to Selection
            </button>
          ) : (
            <button
              onClick={onChangeDifficulty}
              className="w-full bg-purple-600 text-white font-bold py-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Change Difficulty Level
            </button>
          )}
          
          <button
            onClick={onNewCareer}
            className={`w-full font-bold py-4 rounded-lg transition-colors ${
              isQR
                ? "bg-gray-700/50 text-purple-200 border border-purple-500 hover:bg-gray-600/50"
                : "bg-gray-600 text-white hover:bg-gray-700"
            }`}
          >
            Explore Another Career
          </button>
        </div>

        <div className={`mt-6 text-center text-sm ${isQR ? "text-purple-300" : "text-gray-600"}`}>
          {success
            ? (isQR ? `Great job! You showed mastery in ${data.title}!` : `Great job! You earned the ${difficulty} trophy for ${data.title}!`)
            : (isQR ? "Practice makes perfect! Keep trying!" : "Learning from mistakes is part of every career. Keep practicing!")}
        </div>
        </div>
    </ScreenWrapper>
  );
}
