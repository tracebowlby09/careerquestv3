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

interface NurseWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  isQuickRecall?: boolean;
}

interface Patient {
  id: string;
  name: string;
  symptoms: string;
  vitals: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  patients: Patient[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Three patients arrive at the ER. Prioritize them from most to least urgent.",
      patients: [
        { id: "p1", name: "John (45)", symptoms: "Chest pain, sweating", vitals: "BP: 160/95, HR: 110", priority: 1 },
        { id: "p2", name: "Sarah (28)", symptoms: "Sprained ankle", vitals: "BP: 120/80, HR: 75", priority: 3 },
        { id: "p3", name: "Mike (65)", symptoms: "Severe headache, confusion", vitals: "BP: 180/100, HR: 95", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
    {
      id: "e2",
      scenario: "Morning shift - prioritize these patients.",
      patients: [
        { id: "p1", name: "Lisa (8)", symptoms: "High fever (104°F), lethargy", vitals: "BP: 90/60, HR: 130", priority: 1 },
        { id: "p2", name: "Tom (50)", symptoms: "Minor cut, needs stitches", vitals: "BP: 125/80, HR: 72", priority: 3 },
        { id: "p3", name: "Amy (35)", symptoms: "Broken arm, stable", vitals: "BP: 118/75, HR: 80", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Busy ER - four patients need assessment.",
      patients: [
        { id: "p1", name: "John (45)", symptoms: "Chest pain, shortness of breath", vitals: "BP: 160/95, HR: 110, O2: 92%", priority: 1 },
        { id: "p2", name: "Sarah (28)", symptoms: "Sprained ankle, moderate pain", vitals: "BP: 120/80, HR: 75, O2: 98%", priority: 4 },
        { id: "p3", name: "Emma (8)", symptoms: "High fever (103°F), difficulty breathing", vitals: "BP: 90/60, HR: 130, O2: 90%", priority: 2 },
        { id: "p4", name: "Bob (70)", symptoms: "Severe abdominal pain, vomiting", vitals: "BP: 140/85, HR: 95, O2: 95%", priority: 3 },
      ],
      correctOrder: ["p1", "p3", "p4", "p2"],
    },
    {
      id: "m2",
      scenario: "Night shift emergency - prioritize care.",
      patients: [
        { id: "p1", name: "Maria (55)", symptoms: "Stroke symptoms, facial drooping", vitals: "BP: 170/95, HR: 88", priority: 1 },
        { id: "p2", name: "Jake (22)", symptoms: "Allergic reaction, hives", vitals: "BP: 110/70, HR: 95", priority: 3 },
        { id: "p3", name: "Ruth (80)", symptoms: "Fall, hip pain, can't walk", vitals: "BP: 150/90, HR: 85", priority: 2 },
        { id: "p4", name: "Sam (30)", symptoms: "Flu symptoms, dehydration", vitals: "BP: 115/75, HR: 82", priority: 4 },
      ],
      correctOrder: ["p1", "p3", "p2", "p4"],
    },
    {
      id: "m3",
      scenario: "Multiple trauma patients - quick decisions needed.",
      patients: [
        { id: "p1", name: "Alex (25)", symptoms: "Car accident, internal bleeding suspected", vitals: "BP: 90/50, HR: 125", priority: 1 },
        { id: "p2", name: "Chris (40)", symptoms: "Motorcycle accident, broken leg", vitals: "BP: 130/80, HR: 90", priority: 3 },
        { id: "p3", name: "Dana (35)", symptoms: "Head injury, unconscious", vitals: "BP: 110/70, HR: 60", priority: 2 },
        { id: "p4", name: "Eric (50)", symptoms: "Minor cuts and bruises", vitals: "BP: 120/75, HR: 75", priority: 4 },
      ],
      correctOrder: ["p1", "p3", "p2", "p4"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Mass casualty incident - five patients, limited resources.",
      patients: [
        { id: "p1", name: "Patient A", symptoms: "Cardiac arrest, CPR in progress", vitals: "No pulse, not breathing", priority: 2 },
        { id: "p2", name: "Patient B", symptoms: "Severe bleeding, conscious", vitals: "BP: 80/40, HR: 140", priority: 1 },
        { id: "p3", name: "Patient C", symptoms: "Broken bones, stable", vitals: "BP: 125/80, HR: 85", priority: 4 },
        { id: "p4", name: "Patient D", symptoms: "Respiratory distress, cyanosis", vitals: "BP: 100/60, O2: 75%", priority: 3 },
        { id: "p5", name: "Patient E", symptoms: "Minor injuries, walking", vitals: "BP: 120/75, HR: 78", priority: 5 },
      ],
      correctOrder: ["p2", "p1", "p4", "p3", "p5"],
    },
    {
      id: "h2",
      scenario: "ICU overflow - prioritize admissions.",
      patients: [
        { id: "p1", name: "Grace (60)", symptoms: "Septic shock, multi-organ failure", vitals: "BP: 70/40, HR: 145, O2: 85%", priority: 1 },
        { id: "p2", name: "Henry (45)", symptoms: "Post-op complications, stable", vitals: "BP: 130/85, HR: 88, O2: 96%", priority: 4 },
        { id: "p3", name: "Iris (70)", symptoms: "Severe pneumonia, respiratory failure", vitals: "BP: 95/55, HR: 115, O2: 82%", priority: 2 },
        { id: "p4", name: "Jack (55)", symptoms: "Diabetic ketoacidosis", vitals: "BP: 105/65, HR: 105, O2: 94%", priority: 3 },
        { id: "p5", name: "Kate (40)", symptoms: "Monitoring after procedure", vitals: "BP: 125/80, HR: 75, O2: 98%", priority: 5 },
      ],
      correctOrder: ["p1", "p3", "p4", "p2", "p5"],
    },
    {
      id: "h3",
      scenario: "Pediatric emergency - children need immediate care.",
      patients: [
        { id: "p1", name: "Baby (6mo)", symptoms: "Not breathing, choking", vitals: "Cyanotic, no respirations", priority: 1 },
        { id: "p2", name: "Toddler (2yr)", symptoms: "Seizure, ongoing", vitals: "HR: 160, temp: 105°F", priority: 2 },
        { id: "p3", name: "Child (7yr)", symptoms: "Asthma attack, severe", vitals: "O2: 88%, wheezing", priority: 3 },
        { id: "p4", name: "Teen (15yr)", symptoms: "Broken arm, pain 8/10", vitals: "BP: 120/75, HR: 90", priority: 4 },
        { id: "p5", name: "Child (5yr)", symptoms: "Ear infection, crying", vitals: "Temp: 100°F, stable", priority: 5 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4", "p5"],
    },
    {
      id: "h4",
      scenario: "Disaster triage - chemical exposure incident.",
      patients: [
        { id: "p1", name: "Victim 1", symptoms: "Severe burns, airway compromise", vitals: "BP: 85/50, O2: 80%", priority: 1 },
        { id: "p2", name: "Victim 2", symptoms: "Chemical inhalation, respiratory distress", vitals: "BP: 100/65, O2: 86%", priority: 2 },
        { id: "p3", name: "Victim 3", symptoms: "Skin exposure, decontaminated", vitals: "BP: 120/80, O2: 95%", priority: 4 },
        { id: "p4", name: "Victim 4", symptoms: "Panic attack, hyperventilating", vitals: "BP: 140/90, O2: 98%", priority: 5 },
        { id: "p5", name: "Victim 5", symptoms: "Eye irritation, vision impaired", vitals: "BP: 115/75, O2: 96%", priority: 3 },
      ],
      correctOrder: ["p1", "p2", "p5", "p3", "p4"],
    },
  ],
};

// Quick Recall mode - add your own questions here
const quickRecallQuestions: Question[] = [];

export default function NurseWorld({ difficulty, onComplete, isQuickRecall }: NurseWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);

  // Use quick recall questions if available, otherwise fall back to easy questions
  const currentQuestions = isQuickRecall 
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  // Shuffle patients for current question
  const shuffledPatients = useMemo(() => {
    return shuffleArray(currentQuestion.patients);
  }, [currentQuestionIndex]);

  const handlePatientClick = (patientId: string) => {
    if (selectedOrder.includes(patientId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== patientId));
    } else {
      setSelectedOrder([...selectedOrder, patientId]);
    }
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(currentQuestion.correctOrder);
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);
    setAnsweredQuestions([...answeredQuestions, isCorrect]);

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOrder([]);
    } else {
      const passThreshold = Math.ceil(totalQuestions * 0.6);
      onComplete(newScore >= passThreshold, newScore, totalQuestions);
    }
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏥</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Registered Nurse - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re working in a busy emergency department. 
              You&apos;ll face {totalQuestions} triage scenarios where you must prioritize patient care.
            </p>
            
            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <p className="font-semibold text-teal-900">Your Task:</p>
              <p className="text-teal-800">
                Complete {totalQuestions} triage scenarios. You need {Math.ceil(totalQuestions * 0.6)} correct to pass!
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Difficulty: {difficulty.toUpperCase()}</strong> - 
                {difficulty === "easy" && " Basic triage scenarios"}
                {difficulty === "medium" && " Complex multi-patient situations"}
                {difficulty === "hard" && " Mass casualty and critical care"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setStage("challenge")}
            className="w-full mt-8 bg-teal-600 text-white font-bold py-4 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Begin Triage →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              🚨 Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="text-right">
              <div className="text-sm text-gray-600">Score</div>
              <div className="text-2xl font-bold text-teal-600">{score}/{currentQuestionIndex}</div>
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
                      ? "bg-teal-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 mb-6">
            <p className="font-semibold text-teal-900">{currentQuestion.scenario}</p>
          </div>

          <p className="text-gray-700 mb-6">
            Click patients in order of priority (most urgent first). Click again to deselect.
          </p>

          <div className={`grid gap-4 mb-6 ${
            currentQuestion.patients.length <= 3 ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"
          }`}>
            {shuffledPatients.map((patient) => {
              const orderIndex = selectedOrder.indexOf(patient.id);
              const isSelected = orderIndex !== -1;
              
              return (
                <button
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-teal-600 bg-teal-50"
                      : "border-gray-300 hover:border-teal-400"
                  }`}
                >
                  {isSelected && (
                    <div className="text-2xl font-bold text-teal-600 mb-2">
                      #{orderIndex + 1}
                    </div>
                  )}
                  
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {patient.name}
                  </h4>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">Symptoms:</span>
                      <p className="text-gray-700">{patient.symptoms}</p>
                    </div>
                    
                    <div>
                      <span className="font-semibold">Vitals:</span>
                      <p className="text-gray-700">{patient.vitals}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.patients.length}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.patients.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Patients (${selectedOrder.length}/${currentQuestion.patients.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
