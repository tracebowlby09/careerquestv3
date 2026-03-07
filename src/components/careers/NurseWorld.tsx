"use client";

import { useState, useMemo, useEffect } from "react";
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
  alwaysCorrect?: boolean;
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

// Quick Recall mode - 30 nursing triage questions for practice
const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "ER Triage: Multiple patients in waiting room - cardiac emergency, sprain, minor cut",
    patients: [
      { id: "p1", name: "Patient A - Chest Pain", symptoms: "Chest pain, diaphoretic, substernal", vitals: "BP: 160/100, HR: 110, O2: 96%", priority: 1 },
      { id: "p2", name: "Patient B - Sprain", symptoms: "Ankle sprain, walking", vitals: "BP: 120/80, HR: 75", priority: 3 },
      { id: "p3", name: "Patient C - Cut", symptoms: "Minor laceration, small cut", vitals: "BP: 118/78, HR: 72", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr2",
    scenario: "Floor: Three patients - respiratory distress, routine medication, visitor question",
    patients: [
      { id: "p1", name: "Patient A - Respiratory", symptoms: "SOB, cyanotic lips", vitals: "BP: 90/60, HR: 120, O2: 85%", priority: 1 },
      { id: "p2", name: "Patient B - Meds", symptoms: "Needs routine BP medication", vitals: "BP: 140/85, HR: 80", priority: 3 },
      { id: "p3", name: "Visitor", symptoms: "Question about visiting hours", vitals: "Healthy", priority: 5 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Clinic: Pediatric emergency - seizure, ear infection, check-up",
    patients: [
      { id: "p1", name: "Toddler - Seizure", symptoms: "High fever 104°F, active seizure", vitals: "HR: 160, O2: 94%", priority: 1 },
      { id: "p2", name: "Child - Ear Infection", symptoms: "Ear pain, fever 101°F", vitals: "HR: 100, temp 101°F", priority: 2 },
      { id: "p3", name: "Baby - Checkup", symptoms: "Routine 6-month checkup", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr4",
    scenario: "ER Trauma: Multiple injuries - hemorrhage, head injury, fractures",
    patients: [
      { id: "p1", name: "Patient A - Bleeding", symptoms: "Active bleeding, altered mental status", vitals: "BP: 80/50, HR: 130", priority: 1 },
      { id: "p2", name: "Patient B - Head", symptoms: "Head injury, conscious but confused", vitals: "BP: 140/90, HR: 85", priority: 2 },
      { id: "p3", name: "Patient C - Fracture", symptoms: "Broken wrist, stable", vitals: "BP: 120/75, HR: 75", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr5",
    scenario: "ICU: Multiple critical patients - vent alarm, sedation review, routine care",
    patients: [
      { id: "p1", name: "Patient A - Vent", symptoms: "Vent alarm, sats dropping to 78%", vitals: "O2: 78%, HR: 140", priority: 1 },
      { id: "p2", name: "Patient B - Sedation", symptoms: "Due for sedation vacation", vitals: "Stable", priority: 3 },
      { id: "p3", name: "Patient C - Turn", symptoms: "Routine turning schedule", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr6",
    scenario: "Outpatient: Multiple patients - hip fracture, sore throat, prescription refill",
    patients: [
      { id: "p1", name: "Elderly - Hip", symptoms: "Hip pain, can't bear weight", vitals: "BP: 140/80, HR: 90", priority: 1 },
      { id: "p2", name: "Adult - Throat", symptoms: "Sore throat, difficulty swallowing", vitals: "HR: 95, temp 101°F", priority: 2 },
      { id: "p3", name: "Patient - Rx", symptoms: "Prescription refill request", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr7",
    scenario: "ER: Two patients - one with chest pain, one with ankle sprain",
    patients: [
      { id: "p1", name: "Chest Pain", symptoms: "Substernal pain", vitals: "BP: 150/95, HR: 100", priority: 1 },
      { id: "p2", name: "Ankle Sprain", symptoms: "Swollen ankle", vitals: "BP: 120/80, HR: 80", priority: 3 },
    ],
    correctOrder: ["p1", "p2"],
  },
  {
    id: "qr8",
    scenario: "Pediatric ER: Multiple children - allergic reaction, broken arm, cold symptoms",
    patients: [
      { id: "p1", name: "Child - Reaction", symptoms: "Wheezing, hive reaction to bee sting", vitals: "HR: 120, O2: 90%", priority: 1 },
      { id: "p2", name: "Child - Fracture", symptoms: "Broken arm from fall", vitals: "BP: 110/70, HR: 95", priority: 2 },
      { id: "p3", name: "Child - Cold", symptoms: "Runny nose, cough", vitals: "HR: 80, temp: 99°F", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr9",
    scenario: "Surgical floor: Post-op patients - sepsis, pain management, routine assessment",
    patients: [
      { id: "p1", name: "Patient A - Sepsis", symptoms: "Tachycardia, fever 102°F, hypotension", vitals: "HR: 120, BP: 100/60", priority: 1 },
      { id: "p2", name: "Patient B - Pain", symptoms: "Post-op pain rating 8/10", vitals: "BP: 130/80, HR: 90", priority: 2 },
      { id: "p3", name: "Patient C - Routine", symptoms: "Day 3 assessment", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr10",
    scenario: "Waiting room: Multiple patients - meningitis suspected, migraine, sprain",
    patients: [
      { id: "p1", name: "Patient A - Neuro", symptoms: "Thunderclap headache, nuchal rigidity", vitals: "BP: 180/110, HR: 70", priority: 1 },
      { id: "p2", name: "Patient B - Migraine", symptoms: "Severe headache, photophobia", vitals: "BP: 130/85, HR: 80", priority: 3 },
      { id: "p3", name: "Patient C - Sprain", symptoms: "Wrist sprain", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr11",
    scenario: "Clinic: Multiple patients - diabetic emergency, hypertension check, follow-up",
    patients: [
      { id: "p1", name: "Patient A - DKA", symptoms: "Confusion, fruity breath, Kussmaul breathing", vitals: "BP: 100/60, HR: 100", priority: 1 },
      { id: "p2", name: "Patient B - BP Check", symptoms: "Routine BP check", vitals: "BP: 145/90, HR: 75", priority: 3 },
      { id: "p3", name: "Patient C - Follow-up", symptoms: "Diabetes follow-up", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr12",
    scenario: "ER: Three patients - cardiac arrest, broken arm, minor cuts",
    patients: [
      { id: "p1", name: "Code Blue", symptoms: "Unconscious, no pulse", vitals: "No pulse", priority: 1 },
      { id: "p2", name: "Arm Fracture", symptoms: "Deformed arm", vitals: "BP: 130/80", priority: 2 },
      { id: "p3", name: "Abrasions", symptoms: "Superficial cuts", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr13",
    scenario: "L&D: Multiple OB emergencies - preeclampsia, contractions, routine prenatal",
    patients: [
      { id: "p1", name: "Patient A - Pre-Eclampsia", symptoms: "Headache, visual changes, swelling, 38 weeks", vitals: "BP: 160/100", priority: 1 },
      { id: "p2", name: "Patient B - Labor", symptoms: "Active labor, 5cm dilated", vitals: "BP: 120/80, HR: 95", priority: 2 },
      { id: "p3", name: "Patient C - Prenatal", symptoms: "Routine prenatal checkup", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr14",
    scenario: "Psych unit: Multiple situations - violent patient, suicidal ideation, medication refusal",
    patients: [
      { id: "p1", name: "Patient A - Violent", symptoms: "Becoming aggressive, physical with staff", vitals: "BP: 150/90, HR: 110", priority: 1 },
      { id: "p2", name: "Patient B - SI", symptoms: "Expressing suicidal thoughts", vitals: "BP: 110/70, HR: 95", priority: 2 },
      { id: "p3", name: "Patient C - Med Refusal", symptoms: "Refusing evening medications", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr15",
    scenario: "Nursing home: Multiple residents - stroke, fall, routine care",
    patients: [
      { id: "p1", name: "Resident A - Stroke", symptoms: "Sudden weakness, facial droop, slurred speech", vitals: "BP: 170/100", priority: 1 },
      { id: "p2", name: "Resident B - Fall", symptoms: "Found on floor, hip pain", vitals: "BP: 140/80, HR: 90", priority: 2 },
      { id: "p3", name: "Resident C - Routine", symptoms: "Morning care, bath scheduled", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr16",
    scenario: "Walk-in clinic: Multiple eye injuries - chemical splash, foreign body, scratch",
    patients: [
      { id: "p1", name: "Patient A - Chemical", symptoms: "Chemical exposure to eye, burning", vitals: "Normal", priority: 1 },
      { id: "p2", name: "Patient B - FB", symptoms: "Foreign body sensation in eye", vitals: "Normal", priority: 2 },
      { id: "p3", name: "Patient C - Scratch", symptoms: "Corneal abrasion, light sensitivity", vitals: "HR: 85", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr17",
    scenario: "ER: Multiple patients - intoxication, chest pain, ankle injury",
    patients: [
      { id: "p1", name: "Patient A - Intox", symptoms: "Confusion, diaphoresis, glucose 60", vitals: "HR: 110", priority: 1 },
      { id: "p2", name: "Patient B - Chest Pain", symptoms: "Substernal chest pain", vitals: "BP: 155/95, HR: 100", priority: 2 },
      { id: "p3", name: "Patient C - Ankle", symptoms: "Twisted ankle, swelling", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr18",
    scenario: "Pediatric floor: Multiple children - dehydration, asthma, routine admission",
    patients: [
      { id: "p1", name: "Infant - Dehydration", symptoms: "Sunken fontanelle, dry mucous, no tears", vitals: "HR: 160", priority: 1 },
      { id: "p2", name: "Child - Asthma", symptoms: "Mild wheezing, O2 94%", vitals: "HR: 100", priority: 2 },
      { id: "p3", name: "Child - Admission", symptoms: "Scheduled tonsillectomy", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr19",
    scenario: "ER: Multiple emergencies - anaphylaxis, chest pain, laceration",
    patients: [
      { id: "p1", name: "Patient A - Anaphylaxis", symptoms: "Airway compromise, throat closing, hives", vitals: "BP: 70/40, HR: 120", priority: 1 },
      { id: "p2", name: "Patient B - Chest Pain", symptoms: "Substernal pain, diaphoretic", vitals: "BP: 145/90, HR: 95", priority: 2 },
      { id: "p3", name: "Patient C - Laceration", symptoms: "Forehead cut, bleeding controlled", vitals: "BP: 120/80", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr20",
    scenario: "ER: Stroke alerts - multiple patients with different onset times",
    patients: [
      { id: "p1", name: "Patient A - Stroke", symptoms: "Weakness, slurred speech, last well 1 hour ago", vitals: "BP: 160/90", priority: 1 },
      { id: "p2", name: "Patient B - TIA", symptoms: "Brief weakness, resolved 30 min ago", vitals: "BP: 140/85", priority: 2 },
      { id: "p3", name: "Patient C - Old CVA", symptoms: "History of stroke, routine follow-up", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr21",
    scenario: "Med-Surg floor: Multiple metabolic emergencies - DKA, hypoglycemia, routine",
    patients: [
      { id: "p1", name: "Patient A - DKA", symptoms: "Blood glucose 600, altered consciousness", vitals: "HR: 110, BP: 90/60", priority: 1 },
      { id: "p2", name: "Patient B - Hypo", symptoms: "Glucose 50, confusion, diaphoresis", vitals: "HR: 100, BP: 110/70", priority: 2 },
      { id: "p3", name: "Patient C - Routine", symptoms: "Diabetes education session", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr22",
    scenario: "Clinic: Multiple respiratory patients - severe asthma, mild exacerbation, routine",
    patients: [
      { id: "p1", name: "Patient A - Severe", symptoms: "Can't speak, tripoding, O2 88%", vitals: "O2: 88%, HR: 120", priority: 1 },
      { id: "p2", name: "Patient B - Mild", symptoms: "Wheezing, can speak in sentences", vitals: "O2: 95%, HR: 95", priority: 2 },
      { id: "p3", name: "Patient C - Routine", symptoms: "Routine inhaler refill", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr23",
    scenario: "Trauma: Multiple trauma patients - severe head injury, chest trauma, extremities",
    patients: [
      { id: "p1", name: "Patient A - Head", symptoms: "GCS 8, unequal pupils", vitals: "BP: 180/110, HR: 60", priority: 1 },
      { id: "p2", name: "Patient B - Chest", symptoms: "Sternal tenderness, difficulty breathing", vitals: "BP: 110/70, HR: 110", priority: 2 },
      { id: "p3", name: "Patient C - Extremity", symptoms: "Forearm fracture, neuro intact", vitals: "BP: 125/80", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr24",
    scenario: "Dialysis unit: Multiple patients - chest pain, hypotension, routine run",
    patients: [
      { id: "p1", name: "Patient A - Chest Pain", symptoms: "Chest pain during treatment, hypotensive", vitals: "BP: 80/50", priority: 1 },
      { id: "p2", name: "Patient B - Cramping", symptoms: "Leg cramps during run", vitals: "BP: 100/60", priority: 2 },
      { id: "p3", name: "Patient C - Routine", symptoms: "Routine dialysis session", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr25",
    scenario: "Post-op floor: Multiple patients - bleeding, pain crisis, routine recovery",
    patients: [
      { id: "p1", name: "Patient A - Bleeding", symptoms: "Surgical site bleeding through dressings", vitals: "BP: 100/70, HR: 100", priority: 1 },
      { id: "p2", name: "Patient B - Pain", symptoms: "Sickle cell crisis, severe pain", vitals: "HR: 110, BP: 130/85", priority: 2 },
      { id: "p3", name: "Patient C - Routine", symptoms: "Day 1 post-op, ambulating", vitals: "Stable", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr26",
    scenario: "ER: Multiple trauma - electrical burn, laceration, abrasion",
    patients: [
      { id: "p1", name: "Patient A - Electrical", symptoms: "Entry wound hand, exit wound foot", vitals: "HR: 100", priority: 1 },
      { id: "p2", name: "Patient B - Laceration", symptoms: "Deep arm laceration", vitals: "BP: 120/80, HR: 85", priority: 2 },
      { id: "p3", name: "Patient C - Abrasion", symptoms: "Road rash, minor", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr27",
    scenario: "Maternity: Multiple OB emergencies - abruption, previa, routine prenatal",
    patients: [
      { id: "p1", name: "Patient A - Abruption", symptoms: "Painless bleeding, 32 weeks, suspected abruption", vitals: "BP: 110/70, HR: 90", priority: 1 },
      { id: "p2", name: "Patient B - Previa", symptoms: "Painless bleeding, known previa", vitals: "BP: 115/75, HR: 85", priority: 2 },
      { id: "p3", name: "Patient C - Prenatal", symptoms: "Routine 20-week ultrasound", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr28",
    scenario: "School nurse: Multiple students - deep laceration, broken arm, nosebleed",
    patients: [
      { id: "p1", name: "Student A - Laceration", symptoms: "Forehead laceration, bone visible", vitals: "Stable", priority: 1 },
      { id: "p2", name: "Student B - Fracture", symptoms: "Fall from swing, arm deformity", vitals: "BP: 110/70, HR: 90", priority: 2 },
      { id: "p3", name: "Student C - Nosebleed", symptoms: "Minor nosebleed, controlled", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr29",
    scenario: "Oncology floor: Multiple immunocompromised patients - fever, transfusion, chemo",
    patients: [
      { id: "p1", name: "Patient A - Neutropenic", symptoms: "Fever 101.5°F, immunocompromised", vitals: "HR: 110", priority: 1 },
      { id: "p2", name: "Patient B - Transfusion", symptoms: "Due for blood transfusion", vitals: "Stable", priority: 2 },
      { id: "p3", name: "Patient C - Chemo", symptoms: "Scheduled chemo infusion", vitals: "Normal", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr30",
    scenario: "ER: Multiple envenomation and trauma - snake bite, bee sting, fracture",
    patients: [
      { id: "p1", name: "Patient A - Snake Bite", symptoms: "Progressive swelling up arm, pain", vitals: "BP: 100/60", priority: 1 },
      { id: "p2", name: "Patient B - Bee Sting", symptoms: "Facial swelling, difficulty breathing", vitals: "HR: 110, O2: 92%", priority: 2 },
      { id: "p3", name: "Patient C - Fracture", symptoms: "Wrist fracture from fall", vitals: "Normal", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
];

export default function NurseWorld({ difficulty, onComplete, isQuickRecall, alwaysCorrect }: NurseWorldProps) {
  const [stage, setStage] = useState<"intro" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  
  // Quick Recall hearts system
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showHeartLost, setShowHeartLost] = useState(false);

  // Quick Recall timer countdown
  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - lose a heart
          setHearts((h) => h - 1);
          setShowHeartLost(true);
          setTimeout(() => setShowHeartLost(false), 1000);
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuickRecall, stage, hearts]);

  // Reset timer on new question
  useEffect(() => {
    if (isQuickRecall && stage === "challenge") {
      setTimeLeft(20);
    }
  }, [currentQuestionIndex, isQuickRecall, stage]);

  const handleLoseHeart = () => {
    setHearts((h) => h - 1);
    setShowHeartLost(true);
    setTimeout(() => setShowHeartLost(false), 1000);
  };

  // Use quick recall questions if available, otherwise fall back to easy questions
  const currentQuestions = isQuickRecall 
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  // Auto-select correct answer when alwaysCorrect is enabled
  useEffect(() => {
    if (alwaysCorrect && currentQuestion) {
      setSelectedOrder(currentQuestion.correctOrder);
    }
  }, [alwaysCorrect, currentQuestionIndex]);

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
    
    if (isCorrect) {
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
        setSelectedOrder([]);
      } else {
        onComplete(true, newScore, totalQuestions);
      }
    } else {
      // Wrong answer in Quick Recall - lose a heart
      if (isQuickRecall) {
        handleLoseHeart();
        setStreak(0); // Reset streak on wrong answer
        
        if (hearts <= 1) {
          // Game over - no hearts left
          onComplete(false, score, totalQuestions);
        } else if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOrder([]);
        } else {
          onComplete(score >= Math.ceil(totalQuestions * 0.6), score, totalQuestions);
        }
      } else {
        // Regular challenge mode
        const newScore = score;
        setAnsweredQuestions([...answeredQuestions, false]);

        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOrder([]);
        } else {
          const passThreshold = Math.ceil(totalQuestions * 0.6);
          onComplete(newScore >= passThreshold, newScore, totalQuestions);
        }
      }
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
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <div className="flex items-center gap-2">
                  <div className="text-lg font-semibold text-gray-700">Timer:</div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-teal-600"}`}>
                    {timeLeft}s
                  </div>
                </div>
              )}
              {isQuickRecall && (
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <span key={i} className={`text-2xl ${i < hearts ? "💖" : "🖤"}`} />
                  ))}
                </div>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-teal-600">{score}/{currentQuestionIndex}</div>
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

          {/* Heart lost animation */}
          {showHeartLost && (
            <div className="fixed inset-0 bg-red-500/30 flex items-center justify-center z-50 pointer-events-none">
              <div className="text-8xl animate-pulse">💔</div>
            </div>
          )}

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
