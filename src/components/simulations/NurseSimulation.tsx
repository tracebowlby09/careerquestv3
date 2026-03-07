"use client";

import { useState, useEffect, useCallback } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

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
  age: number;
  symptoms: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    oxygenSat: number;
    painLevel: number;
  };
  triageLevel: "critical" | "urgent" | "stable" | null;
  treatmentsGiven: string[];
  status: "waiting" | "triage" | "treating" | "stable" | "released";
}

interface ERTask {
  id: string;
  title: string;
  description: string;
  patients: Patient[];
  points: number;
}

const erTasks: Record<Difficulty, ERTask[]> = {
  easy: [
    {
      id: "er-e1",
      title: "Morning Rush",
      description: "3 patients arrived at the ER. Triage and treat them!",
      patients: [
        { id: "p1", name: "Mr. Johnson", avatar: "👴", age: 68, symptoms: "Chest pain, sweating, shortness of breath", vitals: { heartRate: 120, bloodPressure: "90/60", temperature: 98.6, oxygenSat: 92, painLevel: 8 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p2", name: "Sarah", avatar: "👩", age: 32, symptoms: "Cut on arm from cooking, bleeding controlled", vitals: { heartRate: 72, bloodPressure: "120/80", temperature: 98.6, oxygenSat: 99, painLevel: 2 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p3", name: "Emma", avatar: "👧", age: 8, symptoms: "Sprained ankle from playground", vitals: { heartRate: 80, bloodPressure: "110/70", temperature: 98.4, oxygenSat: 99, painLevel: 4 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
      ],
      points: 100,
    },
  ],
  medium: [
    {
      id: "er-m1",
      title: "Afternoon Emergency",
      description: "5 patients need attention. Prioritize wisely!",
      patients: [
        { id: "p1", name: "Mr. Chen", avatar: "👨", age: 55, symptoms: "Severe chest pain radiating to left arm", vitals: { heartRate: 110, bloodPressure: "140/90", temperature: 99.1, oxygenSat: 88, painLevel: 9 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p2", name: "Maria", avatar: "👩", age: 28, symptoms: "High fever 102°F, productive cough", vitals: { heartRate: 95, bloodPressure: "100/70", temperature: 102.3, oxygenSat: 94, painLevel: 5 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p3", name: "Jake", avatar: "👦", age: 15, symptoms: "Broken arm from sports", vitals: { heartRate: 88, bloodPressure: "118/75", temperature: 98.6, oxygenSat: 99, painLevel: 6 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p4", name: "Linda", avatar: "👵", age: 72, symptoms: "Dizziness, headache, confusion", vitals: { heartRate: 75, bloodPressure: "130/85", temperature: 98.2, oxygenSat: 96, painLevel: 3 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p5", name: "Tom", avatar: "👨", age: 45, symptoms: "Nausea and mild stomach pain", vitals: { heartRate: 70, bloodPressure: "115/75", temperature: 98.8, oxygenSat: 98, painLevel: 2 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
      ],
      points: 150,
    },
  ],
  hard: [
    {
      id: "er-h1",
      title: "Mass Casualty Event",
      description: "7 patients from an accident! Multiple critical cases - act fast!",
      patients: [
        { id: "p1", name: "Unknown Male", avatar: "👤", age: 35, symptoms: "Not breathing, no pulse", vitals: { heartRate: 0, bloodPressure: "0/0", temperature: 96.0, oxygenSat: 0, painLevel: 10 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p2", name: "Anna", avatar: "👩", age: 28, symptoms: "Heavy bleeding from leg wound", vitals: { heartRate: 130, bloodPressure: "85/55", temperature: 98.0, oxygenSat: 90, painLevel: 8 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p3", name: "Bob", avatar: "👨", age: 42, symptoms: "Leg pain, possible fracture", vitals: { heartRate: 90, bloodPressure: "120/80", temperature: 98.6, oxygenSat: 97, painLevel: 5 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p4", name: "Carol", avatar: "👩", age: 50, symptoms: "Difficulty breathing, chest tightness", vitals: { heartRate: 105, bloodPressure: "100/65", temperature: 99.0, oxygenSat: 85, painLevel: 7 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p5", name: "David", avatar: "👦", age: 12, symptoms: "Headache, scrapes from fall", vitals: { heartRate: 75, bloodPressure: "118/78", temperature: 98.4, oxygenSat: 98, painLevel: 2 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p6", name: "Eve", avatar: "👧", age: 22, symptoms: "Abdominal pain, nausea", vitals: { heartRate: 100, bloodPressure: "95/60", temperature: 100.5, oxygenSat: 96, painLevel: 6 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
        { id: "p7", name: "Frank", avatar: "👴", age: 65, symptoms: "Chest discomfort, history of heart disease", vitals: { heartRate: 95, bloodPressure: "135/88", temperature: 98.8, oxygenSat: 94, painLevel: 5 }, triageLevel: null, treatmentsGiven: [], status: "waiting" },
      ],
      points: 200,
    },
  ],
};

const treatmentActions = [
  { id: "vitals", name: "Check Vitals", icon: "❤️", time: 5, points: 10 },
  { id: "oxygen", name: "Give Oxygen", icon: "💨", time: 10, points: 20, requiredTriage: ["critical", "urgent"] },
  { id: "medication", name: "Administer Meds", icon: "💊", time: 15, points: 25 },
  { id: "callDoctor", name: "Call Doctor", icon: "👨‍⚕️", time: 10, points: 30, requiredTriage: ["critical"] },
  { id: "wound", name: "Treat Wound", icon: "🩹", time: 20, points: 20 },
  { id: "ice", name: "Apply Ice", icon: "🧊", time: 5, points: 10 },
  { id: "observe", name: "Monitor", icon: "👁️", time: 10, points: 15 },
  { id: "release", name: "Release Patient", icon: "✅", time: 5, points: 10, requiresStable: true },
];

export default function NurseSimulation({ difficulty, onComplete, onOpenSettings, onExit }: NurseSimulationProps) {
  const tasks = erTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showVitals, setShowVitals] = useState(false);

  const currentTask = tasks[currentTaskIndex];

  // Initialize patients
  useEffect(() => {
    if (currentTask) {
      setPatients(JSON.parse(JSON.stringify(currentTask.patients)));
      setActionLog([`Shift started: ${currentTask.title}`]);
    }
  }, [currentTask]);

  const getTriageLevel = (patient: Patient): "critical" | "urgent" | "stable" => {
    const vitals = patient.vitals;
    
    // Critical: not breathing, very low O2, severe vitals
    if (vitals.oxygenSat < 85 || vitals.heartRate > 120 || vitals.heartRate < 50 || 
    vitals.bloodPressure.split('/')[0] === "0" || vitals.painLevel >= 9) {
      return "critical";
    }
    
    // Urgent: elevated vitals, moderate pain, concerning symptoms
    if (vitals.oxygenSat < 95 || vitals.heartRate > 100 || vitals.temperature > 101 ||
        vitals.bloodPressure.split('/')[0] !== "0" && parseInt(vitals.bloodPressure.split('/')[0]) > 130 ||
        vitals.painLevel >= 5) {
      return "urgent";
    }
    
    return "stable";
  };

  const assignTriage = (patientId: string, level: "critical" | "urgent" | "stable") => {
    setPatients((prev) => prev.map((p) => {
      if (p.id === patientId) {
        const newLog = [...actionLog, `Triaged ${p.name} as ${level.toUpperCase()}`];
        setActionLog(newLog);
        return { ...p, triageLevel: level, status: "triage" };
      }
      return p;
    }));
  };

  const performAction = (actionId: string) => {
    if (!selectedPatient) return;
    
    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const action = treatmentActions.find(a => a.id === actionId);
    if (!action) return;

    // Check if action requires specific triage level
    if (action.requiredTriage && patient.triageLevel && 
        !action.requiredTriage.includes(patient.triageLevel)) {
      return;
    }

    // Check if can release
    if (actionId === "release" && patient.triageLevel !== "stable") {
      return;
    }

    const newTreatments = [...patient.treatmentsGiven, action.name];
    const newStatus = actionId === "release" ? "released" : "treating";
    
    const pointsEarned = action.points;
    setTotalScore(prev => prev + pointsEarned);

    const newLog = [...actionLog, `${action.icon} ${action.name} on ${patient.name}`];
    setActionLog(newLog);

    setPatients((prev) => prev.map((p) => {
      if (p.id === selectedPatient) {
        return { ...p, treatmentsGiven: newTreatments, status: newStatus };
      }
      return p;
    }));

    if (actionId === "release") {
      audioSystem.playSuccessSound();
      setSelectedPatient(null);
    }
  };

  const checkAllTreated = () => {
    const allStable = patients.every(p => p.triageLevel !== null);
    const allReleased = patients.every(p => p.status === "released");
    return allStable && allReleased;
  };

  const handleFinish = useCallback(() => {
    const treatedCount = patients.filter(p => p.status === "released").length;
    const success = treatedCount >= patients.length * 0.6;
    const maxScore = currentTask.points + (patients.length * 100);
    onComplete(success, totalScore, maxScore);
  }, [patients, totalScore, currentTask, onComplete]);

  // Auto-check completion
  useEffect(() => {
    if (patients.length > 0 && checkAllTreated()) {
      setTimeout(() => setShowSuccess(true), 1000);
    }
  }, [patients]);

  const getPatientStatus = (patient: Patient) => {
    if (patient.status === "released") return "✅ Released";
    if (patient.treatmentsGiven.length > 0) return `💊 ${patient.treatmentsGiven.length} treatment(s)`;
    if (patient.triageLevel) return `🏷️ ${patient.triageLevel.toUpperCase()}`;
    return "⏳ Waiting";
  };

  if (showSuccess) {
    const releasedCount = patients.filter(p => p.status === "released").length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-600 via-red-500 to-orange-500 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shift Complete!</h2>
          <p className="text-gray-600 mb-4">
            You treated {releasedCount} of {patients.length} patients!
          </p>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {releasedCount === patients.length ? "🌟 Perfect shift! Great team work!" :
             releasedCount >= patients.length * 0.8 ? "👍 Excellent patient care!" :
             "⚠️ Next shift will be better!"}
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
            <h1 className="text-2xl font-bold text-white">🏥 Emergency Room Shift</h1>
            <p className="text-red-200">{currentTask.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-white">{totalScore} pts</div>
            <button
              onClick={onExit}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-colors border border-red-500/30"
            >
              🚪 Exit
            </button>
          </div>
        </div>

        {/* Task Description */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-4">
          <p className="text-red-100">{currentTask.description}</p>
          <p className="text-red-200 text-sm mt-2">
            1. Select a patient → 2. Assign triage level → 3. Give treatments → 4. Release when stable
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-3">📋 Patients ({patients.length})</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {patients.map((patient) => {
                const isSelected = selectedPatient === patient.id;
                const triageColor = patient.triageLevel === "critical" ? "bg-red-600" :
                                   patient.triageLevel === "urgent" ? "bg-orange-500" :
                                   patient.triageLevel === "stable" ? "bg-green-500" : "bg-gray-600";
                
                return (
                  <button
                    key={patient.id}
                    onClick={() => { setSelectedPatient(patient.id); setShowVitals(true); }}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      isSelected ? "ring-2 ring-white" : ""
                    } ${patient.status === "released" ? "bg-green-600/50" : "bg-white/90"}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{patient.avatar}</span>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 text-sm">{patient.name}</div>
                        <div className="text-xs text-gray-600 truncate">{patient.symptoms}</div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${triageColor}`} />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{getPatientStatus(patient)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Area */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <>
                {/* Patient Details */}
                {(() => {
                  const patient = patients.find(p => p.id === selectedPatient);
                  if (!patient) return null;
                  
                  return (
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-4xl">{patient.avatar}</span>
                        <div>
                          <div className="font-bold text-gray-900 text-lg">{patient.name}</div>
                          <div className="text-gray-500 text-sm">Age: {patient.age}</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-100 rounded-lg p-3 mb-3">
                        <div className="font-bold text-gray-700 text-sm mb-1">📝 Symptoms:</div>
                        <div className="text-gray-600 text-sm">{patient.symptoms}</div>
                      </div>

                      {/* Vitals Display */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                        <div className="bg-red-50 rounded-lg p-2 text-center">
                          <div className="text-lg">❤️</div>
                          <div className="text-xs text-gray-600">HR</div>
                          <div className={`font-bold ${patient.vitals.heartRate > 100 || patient.vitals.heartRate < 60 ? "text-red-600" : "text-green-600"}`}>
                            {patient.vitals.heartRate}
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center">
                          <div className="text-lg">🩸</div>
                          <div className="text-xs text-gray-600">BP</div>
                          <div className={`font-bold ${parseInt(patient.vitals.bloodPressure.split('/')[0]) > 130 || parseInt(patient.vitals.bloodPressure.split('/')[0]) < 90 ? "text-red-600" : "text-green-600"}`}>
                            {patient.vitals.bloodPressure}
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center">
                          <div className="text-lg">🌡️</div>
                          <div className="text-xs text-gray-600">Temp</div>
                          <div className={`font-bold ${patient.vitals.temperature > 101 ? "text-red-600" : "text-green-600"}`}>
                            {patient.vitals.temperature}°F
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center">
                          <div className="text-lg">💨</div>
                          <div className="text-xs text-gray-600">O2</div>
                          <div className={`font-bold ${patient.vitals.oxygenSat < 95 ? "text-red-600" : "text-green-600"}`}>
                            {patient.vitals.oxygenSat}%
                          </div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center">
                          <div className="text-lg">� Pain</div>
                          <div className="text-xs text-gray-600">Level</div>
                          <div className={`font-bold ${patient.vitals.painLevel >= 7 ? "text-red-600" : patient.vitals.painLevel >= 4 ? "text-yellow-600" : "text-green-600"}`}>
                            {patient.vitals.painLevel}/10
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Triage Assignment */}
                {(() => {
                  const patient = patients.find(p => p.id === selectedPatient);
                  if (!patient || patient.triageLevel) return null;
                  
                  return (
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <h3 className="font-bold text-gray-800 mb-3">🏷️ Assign Triage Level</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => assignTriage(selectedPatient, "critical")}
                          className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold"
                        >
                          🔴 CRITICAL
                        </button>
                        <button
                          onClick={() => assignTriage(selectedPatient, "urgent")}
                          className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold"
                        >
                          🟠 URGENT
                        </button>
                        <button
                          onClick={() => assignTriage(selectedPatient, "stable")}
                          className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold"
                        >
                          🟢 STABLE
                        </button>
                      </div>
                    </div>
                  );
                })()}

                {/* Treatment Actions */}
                {(() => {
                  const patient = patients.find(p => p.id === selectedPatient);
                  if (!patient || !patient.triageLevel || patient.status === "released") return null;
                  
                  return (
                    <div className="bg-white rounded-xl p-4">
                      <h3 className="font-bold text-gray-800 mb-3">💊 Treatment Actions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {treatmentActions.map((action) => {
                          // Check if action is available
                          const isAvailable = !action.requiredTriage || 
                            (patient.triageLevel && action.requiredTriage.includes(patient.triageLevel));
                          const canRelease = action.requiresStable ? patient.triageLevel === "stable" : true;
                          
                          return (
                            <button
                              key={action.id}
                              onClick={() => performAction(action.id)}
                              disabled={!isAvailable || !canRelease}
                              className={`p-2 rounded-lg text-center transition-all ${
                                isAvailable && canRelease
                                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              }`}
                            >
                              <div className="text-xl mb-1">{action.icon}</div>
                              <div className="text-xs font-bold">{action.name}</div>
                              <div className="text-xs opacity-75">+{action.points} pts</div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Current Treatments */}
                      {patient.treatmentsGiven.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600">Treatments given:</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {patient.treatmentsGiven.map((t, i) => (
                              <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="bg-white/50 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">👆</div>
                <p className="text-white font-bold">Select a patient to begin triage</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Log */}
        <div className="mt-4 bg-gray-900/50 rounded-xl p-3">
          <div className="text-white font-bold text-sm mb-2">📜 Action Log</div>
          <div className="text-white/70 text-xs max-h-20 overflow-y-auto">
            {actionLog.slice(-5).map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
