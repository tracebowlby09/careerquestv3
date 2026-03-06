"use client";

import { useState, useMemo } from "react";
import { Difficulty } from "@/types/game";

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

// Quick Recall mode - add your own questions here
const quickRecallQuestions: Question[] = [];

export default function TeacherWorld({ difficulty, onComplete, isQuickRecall }: TeacherWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

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
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, isCorrect]);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      const passThreshold = Math.ceil(totalQuestions * 0.6);
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 md:p-8 flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              📚 Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="text-right">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold text-indigo-600">{score}/{currentQuestionIndex}</div>
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
