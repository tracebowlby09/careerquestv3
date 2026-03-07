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
  const [fadeIn, setFadeIn] = useState(false);

  const currentTask = tasks[currentTaskIndex];

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    if (currentTask) {
      setPatients(JSON.parse(JSON.stringify(currentTask.patients)));
      setActionLog([`🏥 Shift started: ${currentTask.title}`]);
    }
  }, [currentTask]);

  const getTriageLevel = (patient: Patient): "critical" | "urgent" | "stable" => {
    const { vitals } = patient;
    if (vitals.oxygenSat < 85 || vitals.heartRate > 120 || vitals.heartRate < 50 || 
        vitals.bloodPressure.split('/')[0] === "0" || vitals.painLevel >= 9) {
      return "critical";
    }
    if (vitals.oxygenSat < 95 || vitals.heartRate > 100 || vitals.temperature > 101 ||
        vitals.bloodPressure.split('/')[0] !== "0" && parseInt(vitals.bloodPressure.split('/')[0]) > 130 ||
        vitals.painLevel >= 5) {
      return "urgent";
    }
    return "stable";
  };

  const getVitalStatus = (value: number, type: string) => {
    if (type === "heartRate") {
      return value > 100 || value < 60 ? "text-red-500" : "text-green-500";
    }
    if (type === "oxygenSat") {
      return value < 95 ? "text-red-500" : "text-green-500";
    }
    if (type === "temperature") {
      return value > 101 ? "text-red-500" : value > 99 ? "text-yellow-500" : "text-green-500";
    }
    if (type === "painLevel") {
      return value >= 7 ? "text-red-500" : value >= 4 ? "text-yellow-500" : "text-green-500";
    }
    return "text-gray-700";
  };

  const assignTriage = (patientId: string, level: "critical" | "urgent" | "stable") => {
    setPatients((prev) => prev.map((p) => {
      if (p.id === patientId) {
        const newLog = [...actionLog, `🏷️ Triaged ${p.name} as ${level.toUpperCase()}`];
        setActionLog(newLog);
        return { ...p, triageLevel: level, status: "triage" };
      }
      return p;
    }));
    audioSystem.playClickSound();
  };

  const performAction = (actionId: string) => {
    if (!selectedPatient) return;
    
    const patient = patients.find(p => p.id === selectedPatient);
    if (!patient) return;

    const action = treatmentActions.find(a => a.id === actionId);
    if (!action) return;

    if (action.requiredTriage && patient.triageLevel && 
        !action.requiredTriage.includes(patient.triageLevel)) {
      return;
    }

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
    } else {
      audioSystem.playClickSound();
    }
  };

  const handleFinish = useCallback(() => {
    const treatedCount = patients.filter(p => p.status === "released").length;
    const success = treatedCount >= patients.length * 0.6;
    const maxScore = currentTask.points + (patients.length * 100);
    onComplete(success, totalScore, maxScore);
  }, [patients, totalScore, currentTask, onComplete]);

  useEffect(() => {
    if (patients.length > 0) {
      const allStable = patients.every(p => p.triageLevel !== null);
      const allReleased = patients.every(p => p.status === "released");
      if (allStable && allReleased) {
        setTimeout(() => setShowSuccess(true), 1000);
      }
    }
  }, [patients]);

  const getPatientStatus = (patient: Patient) => {
    if (patient.status === "released") return { text: "✅ Released", color: "bg-green-600" };
    if (patient.treatmentsGiven.length > 0) return { text: `💊 ${patient.treatmentsGiven.length} treatment(s)`, color: "bg-blue-600" };
    if (patient.triageLevel) return { text: `🏷️ ${patient.triageLevel.toUpperCase()}`, color: patient.triageLevel === "critical" ? "bg-red-600" : patient.triageLevel === "urgent" ? "bg-orange-600" : "bg-green-600" };
    return { text: "⏳ Waiting", color: "bg-gray-600" };
  };

  if (showSuccess) {
    const releasedCount = patients.filter(p => p.status === "released").length;
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-600 via-red-500 to-orange-500 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform scale-100 animate-bounce">
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
            className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-rose-600 via-red-500 to-orange-500 p-4 md:p-8 transition-all duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
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
          <div className="flex gap-4 mt-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              <span className="text-red-200">1. Select patient</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></span>
              <span className="text-red-200">2. Assign triage</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-red-200">3. Treat & release</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Patient List */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              📋 Patients ({patients.length})
              <span className="text-xs font-normal text-red-200">Tap to select</span>
            </h3>
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2">
              {patients.map((patient) => {
                const isSelected = selectedPatient === patient.id;
                const statusInfo = getPatientStatus(patient);
                const triageColor = patient.triageLevel === "critical" ? "bg-red-600" :
                                   patient.triageLevel === "urgent" ? "bg-orange-500" :
                                   patient.triageLevel === "stable" ? "bg-green-500" : "bg-gray-600";
                
                return (
                  <button
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02] ${
                      isSelected ? "ring-2 ring-white shadow-lg" : ""
                    } ${patient.status === "released" ? "bg-green-600/50 opacity-60" : "bg-white/90 hover:bg-white"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="text-3xl">{patient.avatar}</span>
                        {patient.triageLevel && (
                          <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${triageColor} border-2 border-white`}></span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-800 text-sm">{patient.name}</div>
                        <div className="text-xs text-gray-500 truncate">{patient.symptoms}</div>
                      </div>
                    </div>
                    <div className={`mt-2 px-2 py-1 rounded text-xs text-white font-bold text-center ${statusInfo.color}`}>
                      {statusInfo.text}
                    </div>
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
                    <div className="bg-white rounded-xl p-4 mb-4 shadow-lg">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-5xl">{patient.avatar}</span>
                        <div>
                          <div className="font-bold text-gray-900 text-xl">{patient.name}</div>
                          <div className="text-gray-500">Age: {patient.age} years</div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="font-bold text-gray-700 text-sm mb-1">📝 Symptoms:</div>
                        <div className="text-gray-600 text-sm">{patient.symptoms}</div>
                      </div>

                      {/* Vitals Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                        <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                          <div className="text-xl">❤️</div>
                          <div className="text-xs text-gray-500">Heart Rate</div>
                          <div className={`font-bold text-lg ${getVitalStatus(patient.vitals.heartRate, "heartRate")}`}>
                            {patient.vitals.heartRate}
                          </div>
                          <div className="text-xs text-gray-400">bpm</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                          <div className="text-xl">🩸</div>
                          <div className="text-xs text-gray-500">Blood Pressure</div>
                          <div className={`font-bold text-lg ${getVitalStatus(parseInt(patient.vitals.bloodPressure.split('/')[0]), "bp")}`}>
                            {patient.vitals.bloodPressure}
                          </div>
                          <div className="text-xs text-gray-400">mmHg</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                          <div className="text-xl">🌡️</div>
                          <div className="text-xs text-gray-500">Temperature</div>
                          <div className={`font-bold text-lg ${getVitalStatus(patient.vitals.temperature, "temperature")}`}>
                            {patient.vitals.temperature}°
                          </div>
                          <div className="text-xs text-gray-400">Fahrenheit</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                          <div className="text-xl">💨</div>
                          <div className="text-xs text-gray-500">O2 Saturation</div>
                          <div className={`font-bold text-lg ${getVitalStatus(patient.vitals.oxygenSat, "oxygenSat")}`}>
                            {patient.vitals.oxygenSat}%
                          </div>
                          <div className="text-xs text-gray-400">SpO2</div>
                        </div>
                        <div className="bg-red-50 rounded-lg p-2 text-center border border-red-100">
                          <div className="text-xl">😫</div>
                          <div className="text-xs text-gray-500">Pain Level</div>
                          <div className={`font-bold text-lg ${getVitalStatus(patient.vitals.painLevel, "painLevel")}`}>
                            {patient.vitals.painLevel}
                          </div>
                          <div className="text-xs text-gray-400">/ 10</div>
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
                    <div className="bg-white rounded-xl p-4 mb-4 shadow-lg animate-fade-in">
                      <h3 className="font-bold text-gray-800 mb-3">🏷️ Assign Triage Level</h3>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => assignTriage(selectedPatient, "critical")}
                          className="p-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-red-500/30"
                        >
                          <div className="text-2xl mb-1">🔴</div>
                          CRITICAL
                        </button>
                        <button
                          onClick={() => assignTriage(selectedPatient, "urgent")}
                          className="p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-orange-500/30"
                        >
                          <div className="text-2xl mb-1">🟠</div>
                          URGENT
                        </button>
                        <button
                          onClick={() => assignTriage(selectedPatient, "stable")}
                          className="p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg shadow-green-500/30"
                        >
                          <div className="text-2xl mb-1">🟢</div>
                          STABLE
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
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                      <h3 className="font-bold text-gray-800 mb-3">💊 Treatment Actions</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {treatmentActions.map((action) => {
                          const isAvailable = !action.requiredTriage || 
                            (patient.triageLevel && action.requiredTriage.includes(patient.triageLevel));
                          const canRelease = action.requiresStable ? patient.triageLevel === "stable" : true;
                          const isDisabled = !isAvailable || !canRelease;
                          
                          return (
                            <button
                              key={action.id}
                              onClick={() => performAction(action.id)}
                              disabled={isDisabled}
                              className={`p-3 rounded-xl text-center transition-all transform hover:scale-105 ${
                                isDisabled
                                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                              }`}
                            >
                              <div className="text-2xl mb-1">{action.icon}</div>
                              <div className="text-xs font-bold">{action.name}</div>
                              <div className="text-xs opacity-75">+{action.points} pts</div>
                            </button>
                          );
                        })}
                      </div>

                      {patient.treatmentsGiven.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600 mb-2">Treatments given:</div>
                          <div className="flex flex-wrap gap-2">
                            {patient.treatmentsGiven.map((t, i) => (
                              <span key={i} className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                                ✓ {t}
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
              <div className="bg-white/30 backdrop-blur rounded-xl p-12 text-center">
                <div className="text-6xl mb-4 animate-bounce">👆</div>
                <p className="text-white font-bold text-lg">Select a patient to begin triage</p>
                <p className="text-white/70 text-sm mt-2">Click on a patient card on the left</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Log */}
        <div className="mt-4 bg-gray-900/70 backdrop-blur rounded-xl p-3">
          <div className="text-white font-bold text-sm mb-2">📜 Action Log</div>
          <div className="text-white/70 text-xs max-h-24 overflow-y-auto space-y-1">
            {actionLog.slice(-6).reverse().map((log, i) => (
              <div key={i} className="border-l-2 border-white/30 pl-2">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
