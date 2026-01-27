"use client";

import { useState } from "react";

interface NurseWorldProps {
  onComplete: (success: boolean) => void;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  symptoms: string;
  vitals: string;
  priority: number; // 1 = highest, 3 = lowest
}

export default function NurseWorld({ onComplete }: NurseWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);

  const patients: Patient[] = [
    {
      id: "patient1",
      name: "John (45)",
      age: 45,
      symptoms: "Chest pain, shortness of breath, sweating",
      vitals: "BP: 160/95, HR: 110, O2: 92%",
      priority: 1, // Critical - possible heart attack
    },
    {
      id: "patient2",
      name: "Sarah (28)",
      age: 28,
      symptoms: "Sprained ankle from fall, moderate pain",
      vitals: "BP: 120/80, HR: 75, O2: 98%",
      priority: 3, // Non-urgent
    },
    {
      id: "patient3",
      name: "Emma (8)",
      age: 8,
      symptoms: "High fever (103°F), difficulty breathing, lethargy",
      vitals: "BP: 90/60, HR: 130, O2: 90%",
      priority: 2, // Urgent - pediatric with respiratory distress
    },
  ];

  const correctOrder = ["patient1", "patient3", "patient2"];

  const handlePatientClick = (patientId: string) => {
    if (selectedOrder.includes(patientId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== patientId));
    } else {
      setSelectedOrder([...selectedOrder, patientId]);
    }
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(correctOrder);
    onComplete(isCorrect);
  };

  if (stage === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🏥</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Registered Nurse
            </h2>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              <strong>Scenario:</strong> You&apos;re working the evening shift in a busy
              emergency department. Three patients have just arrived, and you need to
              perform triage.
            </p>
            
            <p>
              Triage is the process of determining the priority of patients&apos; treatments
              based on the severity of their condition. Lives depend on making the right call.
            </p>

            <div className="bg-teal-50 border-l-4 border-teal-500 p-4">
              <p className="font-semibold text-teal-900">Your Task:</p>
              <p className="text-teal-800">
                Assess each patient&apos;s condition and prioritize them in the correct order
                (most urgent first).
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
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🚨 Emergency Triage
          </h3>

          <p className="text-gray-700 mb-6">
            Click patients in order of priority (most urgent first). Click again to deselect.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {patients.map((patient, index) => {
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Hint:</strong> Consider life-threatening conditions first, 
              then urgent issues, then non-urgent cases.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== patients.length}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === patients.length
              ? "Submit Triage Order"
              : `Select All Patients (${selectedOrder.length}/${patients.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
