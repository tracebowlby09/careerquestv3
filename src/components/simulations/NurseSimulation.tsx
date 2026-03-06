"use client";

import { useState, useEffect, useCallback } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import ScreenWrapper from "@/components/ScreenWrapper";

interface NurseSimulationProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

interface Patient {
  id: string;
  name: string;
  avatar: string;
  symptoms: string;
  vitalSigns: {
    heartRate: string;
    bloodPressure: string;
    temperature: string;
    oxygenSat: string;
  };
  correctTriage: "critical" | "urgent" | "stable";
}

interface TriageTask {
  id: string;
  title: string;
  description: string;
  patients: Patient[];
  timeLimit: number;
  points: number;
}

const triageTasks: Record<Difficulty, TriageTask[]> = {
  easy: [
    {
      id: "nurse-e1",
      title: "Basic Triage",
      description: "Triage these 3 patients by dragging them to the correct category.",
      patients: [
        { id: "p1", name: "Mr. Johnson", avatar: "👴", symptoms: "Chest pain, sweating", vitalSigns: { heartRate: "120", bloodPressure: "90/60", temperature: "98.6", oxygenSat: "95" }, correctTriage: "critical" },
        { id: "p2", name: "Sarah", avatar: "👩", symptoms: "Minor cut on arm", vitalSigns: { heartRate: "72", bloodPressure: "120/80", temperature: "98.6", oxygenSat: "98" }, correctTriage: "stable" },
        { id: "p3", name: "Emma", avatar: "👧", symptoms: "Sprained ankle", vitalSigns: { heartRate: "80", bloodPressure: "110/70", temperature: "98.4", oxygenSat: "97" }, correctTriage: "stable" },
      ],
      timeLimit: 45,
      points: 100,
    },
    {
      id: "nurse-e2",
      title: "Clinic Patients",
      description: "Triage patients arriving at the walk-in clinic.",
      patients: [
        { id: "p1", name: "Baby Lily", avatar: "👶", symptoms: "High fever 103°F", vitalSigns: { heartRate: "140", bloodPressure: "90/60", temperature: "103.0", oxygenSat: "96" }, correctTriage: "urgent" },
        { id: "p2", name: "Mike", avatar: "👨", symptoms: "Needs prescription refill", vitalSigns: { heartRate: "72", bloodPressure: "118/75", temperature: "98.6", oxygenSat: "99" }, correctTriage: "stable" },
        { id: "p3", name: "Grandma Rose", avatar: "👵", symptoms: "Stubbed toe", vitalSigns: { heartRate: "68", bloodPressure: "120/80", temperature: "98.2", oxygenSat: "97" }, correctTriage: "stable" },
      ],
      timeLimit: 40,
      points: 100,
    },
  ],
  medium: [
    {
      id: "nurse-m1",
      title: "ER Triage",
      description: "Triage these 5 patients. Consider vital signs and symptoms carefully.",
      patients: [
        { id: "p1", name: "Mr. Chen", avatar: "👨", symptoms: "Shortness of breath", vitalSigns: { heartRate: "110", bloodPressure: "140/90", temperature: "99.1", oxygenSat: "88" }, correctTriage: "critical" },
        { id: "p2", name: "Maria", avatar: "👩", symptoms: "High fever, cough", vitalSigns: { heartRate: "95", bloodPressure: "100/70", temperature: "102.3", oxygenSat: "94" }, correctTriage: "urgent" },
        { id: "p3", name: "Jake", avatar: "👦", symptoms: "Broken arm", vitalSigns: { heartRate: "88", bloodPressure: "118/75", temperature: "98.6", oxygenSat: "99" }, correctTriage: "stable" },
        { id: "p4", name: "Linda", avatar: "👵", symptoms: "Dizziness, headache", vitalSigns: { heartRate: "75", bloodPressure: "130/85", temperature: "98.2", oxygenSat: "96" }, correctTriage: "urgent" },
        { id: "p5", name: "Tom", avatar: "👨", symptoms: "Nausea", vitalSigns: { heartRate: "70", bloodPressure: "115/75", temperature: "98.8", oxygenSat: "98" }, correctTriage: "stable" },
      ],
      timeLimit: 60,
      points: 150,
    },
    {
      id: "nurse-m2",
      title: "Emergency Room Rush",
      description: "5 patients just arrived. Triage them quickly!",
      patients: [
        { id: "p1", name: "Paul", avatar: "👨", symptoms: "Chest pressure, left arm numbness", vitalSigns: { heartRate: "105", bloodPressure: "150/95", temperature: "98.8", oxygenSat: "95" }, correctTriage: "critical" },
        { id: "p2", name: "Amy", avatar: "👩", symptoms: "Asthma attack", vitalSigns: { heartRate: "115", bloodPressure: "100/65", temperature: "99.0", oxygenSat: "86" }, correctTriage: "critical" },
        { id: "p3", name: "John", avatar: "👦", symptoms: "Ear pain", vitalSigns: { heartRate: "80", bloodPressure: "110/70", temperature: "100.2", oxygenSat: "98" }, correctTriage: "stable" },
        { id: "p4", name: "Susan", avatar: "👩", symptoms: "Cut finger, bleeding controlled", vitalSigns: { heartRate: "75", bloodPressure: "115/75", temperature: "98.4", oxygenSat: "98" }, correctTriage: "stable" },
        { id: "p5", name: "Bob", avatar: "👴", symptoms: "Confused, history of diabetes", vitalSigns: { heartRate: "90", bloodPressure: "140/80", temperature: "101.0", oxygenSat: "94" }, correctTriage: "urgent" },
      ],
      timeLimit: 55,
      points: 150,
    },
  ],
  hard: [
    {
      id: "nurse-h1",
      title: "Mass Casualty Triage",
      description: "7 patients from an accident scene. Prioritize quickly - lives depend on it!",
      patients: [
        { id: "p1", name: "Unknown Male", avatar: "👤", symptoms: "Not breathing", vitalSigns: { heartRate: "0", bloodPressure: "0/0", temperature: "cold", oxygenSat: "0" }, correctTriage: "critical" },
        { id: "p2", name: "Anna", avatar: "👩", symptoms: "Heavy bleeding", vitalSigns: { heartRate: "130", bloodPressure: "85/55", temperature: "98.0", oxygenSat: "90" }, correctTriage: "critical" },
        { id: "p3", name: "Bob", avatar: "👨", symptoms: "Leg pain", vitalSigns: { heartRate: "90", bloodPressure: "120/80", temperature: "98.6", oxygenSat: "97" }, correctTriage: "stable" },
        { id: "p4", name: "Carol", avatar: "👩", symptoms: "Difficulty breathing", vitalSigns: { heartRate: "105", bloodPressure: "100/65", temperature: "99.0", oxygenSat: "85" }, correctTriage: "critical" },
        { id: "p5", name: "David", avatar: "👦", symptoms: "Headache", vitalSigns: { heartRate: "75", bloodPressure: "118/78", temperature: "98.4", oxygenSat: "98" }, correctTriage: "stable" },
        { id: "p6", name: "Eve", avatar: "👧", symptoms: "Abdominal pain", vitalSigns: { heartRate: "100", bloodPressure: "95/60", temperature: "100.5", oxygenSat: "96" }, correctTriage: "urgent" },
        { id: "p7", name: "Frank", avatar: "👴", symptoms: "Chest discomfort", vitalSigns: { heartRate: "95", bloodPressure: "135/88", temperature: "98.8", oxygenSat: "94" }, correctTriage: "urgent" },
      ],
      timeLimit: 90,
      points: 200,
    },
    {
      id: "nurse-h2",
      title: "ICU Overflow",
      description: "ICU is full! Triage 7 patients and decide who gets the last bed.",
      patients: [
        { id: "p1", name: "Robert", avatar: "👨", symptoms: "Post-surgery, vital signs unstable", vitalSigns: { heartRate: "140", bloodPressure: "80/50", temperature: "97.0", oxygenSat: "88" }, correctTriage: "critical" },
        { id: "p2", name: "Jennifer", avatar: "👩", symptoms: "Recovering well from surgery", vitalSigns: { heartRate: "72", bloodPressure: "118/75", temperature: "98.6", oxygenSat: "98" }, correctTriage: "stable" },
        { id: "p3", name: "William", avatar: "👴", symptoms: "Heart attack survivor", vitalSigns: { heartRate: "85", bloodPressure: "110/70", temperature: "98.2", oxygenSat: "95" }, correctTriage: "urgent" },
        { id: "p4", name: "Elizabeth", avatar: "👵", symptoms: "Stable after stroke", vitalSigns: { heartRate: "68", bloodPressure: "125/80", temperature: "98.4", oxygenSat: "97" }, correctTriage: "stable" },
        { id: "p5", name: "Michael", avatar: "👨", symptoms: "Sepsis, high fever", vitalSigns: { heartRate: "120", bloodPressure: "90/55", temperature: "104.0", oxygenSat: "91" }, correctTriage: "critical" },
        { id: "p6", name: "Sarah", avatar: "👩", symptoms: "Monitoring overnight", vitalSigns: { heartRate: "70", bloodPressure: "115/75", temperature: "98.0", oxygenSat: "99" }, correctTriage: "stable" },
        { id: "p7", name: "James", avatar: "👦", symptoms: "Post-op, blood pressure dropping", vitalSigns: { heartRate: "110", bloodPressure: "85/60", temperature: "98.8", oxygenSat: "93" }, correctTriage: "urgent" },
      ],
      timeLimit: 80,
      points: 200,
    },
  ],
};

export default function NurseSimulation({ difficulty, onComplete, onOpenSettings, onExit }: NurseSimulationProps) {
  const tasks = triageTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [patientAssignments, setPatientAssignments] = useState<Record<string, "critical" | "urgent" | "stable" | null>>({});
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [draggedPatient, setDraggedPatient] = useState<string | null>(null);

  const currentTask = tasks[currentTaskIndex];

  // Initialize
  useEffect(() => {
    if (currentTask) {
      const initialAssignments: Record<string, "critical" | "urgent" | "stable" | null> = {};
      currentTask.patients.forEach((p) => {
        initialAssignments[p.id] = null;
      });
      setPatientAssignments(initialAssignments);
      setFeedback(null);
    }
  }, [currentTask]);

  const handleDragStart = (patientId: string) => {
    setDraggedPatient(patientId);
  };

  const handleDrop = (triageLevel: "critical" | "urgent" | "stable") => {
    if (!draggedPatient) return;
    setPatientAssignments((prev) => ({
      ...prev,
      [draggedPatient]: triageLevel,
    }));
    setDraggedPatient(null);
  };

  const handleSubmit = useCallback(() => {
    if (!currentTask) return;

    let correctCount = 0;
    let totalPatients = currentTask.patients.length;

    currentTask.patients.forEach((patient) => {
      if (patientAssignments[patient.id] === patient.correctTriage) {
        correctCount++;
      }
    });

    const allAssigned = Object.values(patientAssignments).every((a) => a !== null);
    
    if (!allAssigned) {
      setFeedback("incorrect");
      return;
    }

    const percentage = correctCount / totalPatients;
    let pointsEarned = 0;

    if (percentage === 1) {
      audioSystem.playSuccessSound();
      pointsEarned = currentTask.points;
    } else if (percentage >= 0.6) {
      audioSystem.playSuccessSound();
      pointsEarned = Math.floor(currentTask.points * 0.5);
    } else {
      audioSystem.playFailureSound();
    }

    setTotalScore((prev) => prev + pointsEarned);
    
    if (percentage >= 0.6) {
      setFeedback("correct");
      setTimeout(() => {
        if (currentTaskIndex < tasks.length - 1) {
          setCurrentTaskIndex((prev) => prev + 1);
          setCompletedTasks((prev) => prev + 1);
        } else {
          setShowSuccess(true);
        }
      }, 1500);
    } else {
      setFeedback("incorrect");
      setTimeout(() => {
        // Retry same task
        const initialAssignments: Record<string, "critical" | "urgent" | "stable" | null> = {};
        currentTask.patients.forEach((p) => {
          initialAssignments[p.id] = null;
        });
        setPatientAssignments(initialAssignments);
        setFeedback(null);
      }, 1500);
    }
  }, [currentTask, patientAssignments, currentTaskIndex, tasks.length]);

  const handleFinish = () => {
    const success = totalScore > 0;
    onComplete(success, totalScore, tasks.length * 200);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-600 via-red-500 to-orange-500 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Triage Complete!</h2>
          <p className="text-gray-600 mb-4">
            You triaged all patients successfully!
          </p>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-600 via-red-500 to-orange-500 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🏥 Nurse Triage Simulation</h1>
            <p className="text-red-200">Task {currentTaskIndex + 1} of {tasks.length}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-white">{totalScore} pts</div>
            {onExit && (
              <button
                onClick={onExit}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-bold transition-colors"
              >
                🏠 Exit
              </button>
            )}
          </div>
        </div>

        {/* Task Info */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
          <h2 className="text-xl font-bold text-white mb-2">{currentTask.title}</h2>
          <p className="text-red-100">{currentTask.description}</p>
        </div>

        {/* Unassigned Patients */}
        <div className="mb-6">
          <h3 className="text-white font-bold mb-3">📋 Waiting Patients</h3>
          <div className="flex flex-wrap gap-3">
            {currentTask.patients
              .filter((p) => !patientAssignments[p.id])
              .map((patient) => (
                <div
                  key={patient.id}
                  draggable
                  onDragStart={() => handleDragStart(patient.id)}
                  className="bg-white rounded-xl p-3 cursor-move hover:scale-105 transition-transform shadow-lg min-w-[160px]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{patient.avatar}</span>
                    <span className="font-bold text-gray-800">{patient.name}</span>
                  </div>
                  <div className="text-xs text-gray-600">{patient.symptoms}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    ❤️ {patient.vitalSigns.heartRate} | 🩸 {patient.vitalSigns.bloodPressure}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Triage Zones */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {(["critical", "urgent", "stable"] as const).map((level) => (
            <div
              key={level}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(level)}
              className={`rounded-xl p-4 min-h-[200px] transition-all ${
                level === "critical" 
                  ? "bg-red-600/80 border-2 border-red-400" 
                  : level === "urgent"
                  ? "bg-orange-500/80 border-2 border-orange-400"
                  : "bg-green-500/80 border-2 border-green-400"
              } ${draggedPatient ? "ring-4 ring-white/50" : ""}`}
            >
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                {level === "critical" && "🔴 CRITICAL"}
                {level === "urgent" && "🟠 URGENT"}
                {level === "stable" && "🟢 STABLE"}
              </h3>
              <div className="space-y-2">
                {currentTask.patients
                  .filter((p) => patientAssignments[p.id] === level)
                  .map((patient) => (
                    <div
                      key={patient.id}
                      className="bg-white/90 rounded-lg p-2 text-sm"
                    >
                      <span className="font-bold">{patient.avatar} {patient.name}</span>
                    </div>
                  ))}
                {currentTask.patients.filter((p) => patientAssignments[p.id] === level).length === 0 && (
                  <div className="text-white/50 text-sm italic">Drop patients here</div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 mb-4 text-center">
            <span className="text-green-300 font-bold text-lg">✓ Excellent triage!</span>
          </div>
        )}
        {feedback === "incorrect" && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-4 text-center">
            <span className="text-red-300 font-bold text-lg">✗ Some patients incorrectly triaged. Try again!</span>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={feedback !== null}
            className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✓ Submit Triage
          </button>
        </div>

        {/* Progress */}
        <div className="mt-6 flex gap-2">
          {tasks.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all ${
                idx < currentTaskIndex ? "bg-green-500" :
                idx === currentTaskIndex ? "bg-white" :
                "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
