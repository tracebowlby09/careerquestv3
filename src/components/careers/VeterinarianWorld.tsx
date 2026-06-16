"use client";

import { useState, useMemo, useEffect } from "react";
import { Difficulty, IncorrectAnswer } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import TutorialScreen from "@/components/TutorialScreen";

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface VeterinarianWorldProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number, incorrectAnswers?: IncorrectAnswer[]) => void;
  isQuickRecall?: boolean;
  isCertification?: boolean;
  alwaysCorrect?: boolean;
  onExit?: () => void;
  onTutorialBack?: () => void;
  onAnswerResult?: (isCorrect: boolean, timeMs: number) => void;
}

interface Animal {
  id: string;
  name: string;
  symptoms: string;
  priority: number;
}

interface Question {
  id: string;
  scenario: string;
  animals: Animal[];
  correctOrder: string[];
}

const questions: Record<Difficulty, Question[]> = {
  easy: [
    {
      id: "e1",
      scenario: "Three pets brought to clinic. Prioritize treatment by urgency.",
      animals: [
        { id: "p1", name: "Buddy (Dog)", symptoms: "Difficulty breathing, blue gums", priority: 1 },
        { id: "p2", name: "Whiskers (Cat)", symptoms: "Limping, minor limp", priority: 3 },
        { id: "p3", name: "Rocky (Dog)", symptoms: "Vomiting, lethargic", priority: 2 },
      ],
      correctOrder: ["p1", "p3", "p2"],
    },
  ],
  medium: [
    {
      id: "m1",
      scenario: "Busy clinic - multiple animal emergencies.",
      animals: [
        { id: "p1", name: "Max (Dog)", symptoms: "Seizure activity, uncontrolled", priority: 1 },
        { id: "p2", name: "Luna (Cat)", symptoms: "Not eating, minor dehydration", priority: 3 },
        { id: "p3", name: "Daisy (Dog)", symptoms: "Cut on paw, minor bleeding", priority: 4 },
        { id: "p4", name: "Charlie (Bird)", symptoms: "Labored breathing, wing droop", priority: 2 },
      ],
      correctOrder: ["p1", "p4", "p3", "p2"],
    },
  ],
  hard: [
    {
      id: "h1",
      scenario: "Emergency intake - critical animal cases.",
      animals: [
        { id: "p1", name: "Baby (Puppy)", symptoms: "Hypothermic, barely breathing", priority: 1 },
        { id: "p2", name: "Tiger (Cat)", symptoms: "Obstructed labor, distress", priority: 2 },
        { id: "p3", name: "Rex (Dog)", symptoms: "Severe allergic reaction", priority: 3 },
        { id: "p4", name: "Goldie (Fish)", symptoms: "Tank water cloudy, not eating", priority: 4 },
      ],
      correctOrder: ["p1", "p2", "p3", "p4"],
    },
  ],
};

const quickRecallQuestions: Question[] = [
  {
    id: "qr1",
    scenario: "Prioritize: respiratory distress, minor injury, routine checkup",
    animals: [
      { id: "p1", name: "Dog - Breathing", symptoms: "Difficulty breathing", priority: 1 },
      { id: "p2", name: "Dog - Injury", symptoms: "Minor limp", priority: 3 },
      { id: "p3", name: "Dog - Checkup", symptoms: "Annual vaccines", priority: 4 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr2",
    scenario: "Prioritize: emergency veterinary patients today",
    animals: [
      { id: "p1", name: "Puppy - Parvo", symptoms: "Vomiting, diarrhea, severe dehydration", priority: 1 },
      { id: "p2", name: "Cat - Blocked", symptoms: "Straining to urinate, abdominal pain", priority: 2 },
      { id: "p3", name: "Dog - Vaccines", symptoms: "Routine vaccine update due", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr3",
    scenario: "Prioritize: surgical emergency triage",
    animals: [
      { id: "p1", name: "Dog - Bloat", symptoms: "Distended abdomen, retching, shock", priority: 1 },
      { id: "p2", name: "Cat - Obstruction", symptoms: "Vomiting, no bowel movement, pain", priority: 2 },
      { id: "p3", name: "Bird - Fracture", symptoms: "Wing droop, lameness, stable", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr4",
    scenario: "Prioritize: vaccine clinic prioritization",
    animals: [
      { id: "p1", name: "Puppy - First Shots", symptoms: "Puppy series starting at 8 weeks", priority: 1 },
      { id: "p2", name: "Cat - Rabies Booster", symptoms: "One-year rabies vaccine due", priority: 2 },
      { id: "p3", name: "Dog - Bordetella", symptoms: "Kennel cough vaccine for boarding", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr5",
    scenario: "Prioritize: dental procedure scheduling",
    animals: [
      { id: "p1", name: "Cat - Tooth Resorption", symptoms: "Drooling, difficulty eating, pain", priority: 1 },
      { id: "p2", name: "Dog - Cleaning", symptoms: "Bad breath, tartar buildup visible", priority: 2 },
      { id: "p3", name: "Rabbit - Checkup", symptoms: "Routine wellness examination", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr6",
    scenario: "Prioritize: dosage calculation accuracy review",
    animals: [
      { id: "p1", name: "Dog - Heartworm", symptoms: "Calculate monthly preventive dosage", priority: 1 },
      { id: "p2", name: "Cat - Antibiotics", symptoms: "Determine proper antibiotic dosing", priority: 2 },
      { id: "p3", name: "Bird - Vitamins", symptoms: "Administer daily vitamin supplements", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr7",
    scenario: "Prioritize: diagnostic testing sequence",
    animals: [
      { id: "p1", name: "Cat - Bloodwork", symptoms: "Suspected kidney disease, run panel", priority: 1 },
      { id: "p2", name: "Dog - X-rays", symptoms: "Check bone density and organ size", priority: 2 },
      { id: "p3", name: "Rabbit - Urinalysis", symptoms: "Check for urinary issues", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr8",
    scenario: "Prioritize: surgery preparation checklist",
    animals: [
      { id: "p1", name: "Dog - Pre-anesthetic", symptoms: "Complete blood work before surgery", priority: 1 },
      { id: "p2", name: "Cat - Fasting", symptoms: "Confirm patient fasting 12 hours prior", priority: 2 },
      { id: "p3", name: "Rabbit - Comfort", symptoms: "Provide quiet recovery area setup", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr9",
    scenario: "Prioritize: client communication urgency",
    animals: [
      { id: "p1", name: "Owner - Critical", symptoms: "Call about pet in emergency status", priority: 1 },
      { id: "p2", name: "Owner - Results", symptoms: "Share lab results from yesterday", priority: 2 },
      { id: "p3", name: "Owner - Follow-up", symptoms: "Check on pet recovery post-surgery", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr10",
    scenario: "Prioritize: farm call emergencies",
    animals: [
      { id: "p1", name: "Cow - Dystocia", symptoms: "Difficult birth, calf stuck inside", priority: 1 },
      { id: "p2", name: "Horse - Colic", symptoms: "Severe abdominal pain, rolling", priority: 2 },
      { id: "p3", name: "Goat - Vaccines", symptoms: "Annual vaccines and health certificate", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr11",
    scenario: "Prioritize: exotic pet emergency intake",
    animals: [
      { id: "p1", name: "Lizard - Impaction", symptoms: "Not eating, weight loss, lethargy", priority: 1 },
      { id: "p2", name: "Snake - Shedding", symptoms: "Incomplete shed, retained eye caps", priority: 2 },
      { id: "p3", name: "Hamster - Checkup", symptoms: "Routine wellness examination", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr12",
    scenario: "Prioritize: pharmacy inventory management",
    animals: [
      { id: "p1", name: "Inventory - Critical", symptoms: "Refill controlled substances expiring soon", priority: 1 },
      { id: "p2", name: "Inventory - Routine", symptoms: "Restock common vaccines for clinic", priority: 2 },
      { id: "p3", name: "Inventory - Specialty", symptoms: "Order exotic diet foods for patients", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr13",
    scenario: "Prioritize: emergency clinic after hours calls",
    animals: [
      { id: "p1", name: "Animal - Poisoning", symptoms: "Dog ingested chocolate, toxic symptoms", priority: 1 },
      { id: "p2", name: "Animal - Injury", symptoms: "Cat with bite wound, after hours", priority: 2 },
      { id: "p3", name: "Animal - Routine", symptoms: "Owner with general questions", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr14",
    scenario: "Prioritize: emergency surgery preparation",
    animals: [
      { id: "p1", name: "Patient - Stabilization", symptoms: "Shocky animal needs IV fluids now", priority: 1 },
      { id: "p2", name: "Patient - Preparation", symptoms: "Sterile prep for emergency surgery", priority: 2 },
      { id: "p3", name: "Patient - Monitoring", symptoms: "Continuous vital signs during surgery", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr15",
    scenario: "Prioritize: dermatology case assessment",
    animals: [
      { id: "p1", name: "Dog - Hot Spot", symptoms: "Acute skin infection, spreading redness", priority: 1 },
      { id: "p2", name: "Cat - Allergies", symptoms: "Chronic scratching, skin irritation", priority: 2 },
      { id: "p3", name: "Rabbit - Grooming", symptoms: "Regular grooming and nail trim", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr16",
    scenario: "Prioritize: endocrinology emergency cases",
    animals: [
      { id: "p1", name: "Dog - Diabetic", symptoms: "Diabetic ketoacidosis, weakness", priority: 1 },
      { id: "p2", name: "Cat - Hyperthyroid", symptoms: "Weight loss, hyperactivity, meowing", priority: 2 },
      { id: "p3", name: "Dog - Checkup", symptoms: "Routine senior panel blood work", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr17",
    scenario: "Prioritize: oncology case management",
    animals: [
      { id: "p1", name: "Cat - Cancer", symptoms: "Aggressive tumor removal surgery", priority: 1 },
      { id: "p2", name: "Dog - Chemotherapy", symptoms: "Administer cancer treatment protocol", priority: 2 },
      { id: "p3", name: "Rabbit - Follow-up", symptoms: "Check surgical site healing", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr18",
    scenario: "Prioritize: ophthalmology emergency patients",
    animals: [
      { id: "p1", name: "Dog - Glaucoma", symptoms: "Sudden blindness, eye pain, red", priority: 1 },
      { id: "p2", name: "Cat - Cataracts", symptoms: "Gradual vision loss, blurry eyes", priority: 2 },
      { id: "p3", name: "Rabbit - Checkup", symptoms: "Routine eye health examination", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr19",
    scenario: "Prioritize: orthopedic trauma cases",
    animals: [
      { id: "p1", name: "Dog - Fracture", symptoms: "Severe lameness, obvious bone break", priority: 1 },
      { id: "p2", name: "Cat - Luxation", symptoms: "Knee cap dislocation, intermittent limp", priority: 2 },
      { id: "p3", name: "Rabbit - Checkup", symptoms: "Routine mobility and joint check", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
  {
    id: "qr20",
    scenario: "Prioritize: nutrition consultation priorities",
    animals: [
      { id: "p1", name: "Dog - Obesity", symptoms: "Severe obesity, joint pain, diet urgent", priority: 1 },
      { id: "p2", name: "Cat - Weight Loss", symptoms: "Unexplained weight loss investigation", priority: 2 },
      { id: "p3", name: "Rabbit - Diet", symptoms: "Review hay and pellet feeding amounts", priority: 3 },
    ],
    correctOrder: ["p1", "p2", "p3"],
  },
];

export default function VeterinarianWorld({ difficulty, onComplete, isQuickRecall, isCertification, alwaysCorrect, onExit, onTutorialBack, onAnswerResult }: VeterinarianWorldProps) {
  const [stage, setStage] = useState<"intro" | "tutorial" | "challenge">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>([]);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [showHeartLost, setShowHeartLost] = useState(false);

  useEffect(() => {
    if (!isQuickRecall || stage !== "challenge" || hearts <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
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

  useEffect(() => {
    if (isQuickRecall && stage === "challenge") {
      setTimeLeft(20);
    }
  }, [currentQuestionIndex, isQuickRecall, stage]);

  const currentQuestions = isQuickRecall
    ? (quickRecallQuestions.length > 0 ? quickRecallQuestions : questions.easy)
    : questions[difficulty];
  const currentQuestion = currentQuestions[currentQuestionIndex];
  const totalQuestions = currentQuestions.length;

  useEffect(() => {
    if (alwaysCorrect && currentQuestion) {
      setSelectedOrder(currentQuestion.correctOrder);
    }
  }, [alwaysCorrect, currentQuestionIndex]);

  const shuffledAnimals = useMemo(() => {
    return shuffleArray(currentQuestion.animals);
  }, [currentQuestionIndex]);

  const handleAnimalClick = (animalId: string) => {
    audioSystem.playClickSound();
    if (selectedOrder.includes(animalId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== animalId));
    } else {
      setSelectedOrder([...selectedOrder, animalId]);
    }
  };

  const handleSubmit = () => {
    const isCorrect = JSON.stringify(selectedOrder) === JSON.stringify(currentQuestion.correctOrder);

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      setAnsweredQuestions([...answeredQuestions, true]);
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
      if (isQuickRecall) {
        setHearts((h) => h - 1);
        setShowHeartLost(true);
        setTimeout(() => setShowHeartLost(false), 1000);
        setStreak(0);
        if (hearts <= 1) {
          onComplete(false, score, totalQuestions, incorrectAnswers);
        } else if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOrder([]);
        } else {
          onComplete(score >= Math.ceil(totalQuestions * 0.6), score, totalQuestions, incorrectAnswers);
        }
      } else {
        setAnsweredQuestions([...answeredQuestions, false]);
        let updatedIncorrect = [...incorrectAnswers, {
          question: currentQuestion.scenario,
          selectedAnswer: selectedOrder.join(" → "),
          correctAnswer: currentQuestion.correctOrder.join(" → "),
          explanation: "Incorrect animal treatment prioritization.",
        }];
        setIncorrectAnswers(updatedIncorrect);
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOrder([]);
        } else {
          const passThreshold = Math.ceil(totalQuestions * 0.6);
          onComplete(score >= passThreshold, score, totalQuestions, updatedIncorrect);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && selectedOrder.length > 0 && stage === "challenge") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedOrder, stage, handleSubmit]);

  if (stage === "intro") {
    return (
      <TutorialScreen
        careerName="Veterinarian"
        careerIcon="🐕"
        steps={[
          {
            title: "Understand Each Scenario",
            content: "Each question describes animal patients needing care.",
            icon: "📖",
          },
          {
            title: "Prioritize by Severity",
            content: "Life-threatening conditions come before routine care.",
            icon: "⚡",
          },
          {
            title: "Choose Treatment Order",
            content: "Click animals in the order you would treat them.",
            icon: "👆",
          },
          {
            title: isCertification ? "Pass the Certification" : "Pass the Challenge",
            content: `You need ${Math.ceil(questions[difficulty].length * (isCertification ? 0.8 : 0.6))} out of ${questions[difficulty].length} correct to pass.`,
            icon: isCertification ? "📜" : "🏆",
          },
        ]}
        onStart={() => setStage("challenge")}
        onBack={() => {
          if (onTutorialBack) {
            audioSystem.playClickSound();
            onTutorialBack();
          } else if (onExit) {
            audioSystem.playClickSound();
            onExit();
          }
        }}
      />
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 font-serif">
              🐾 Scenario {currentQuestionIndex + 1} of {totalQuestions}
            </h3>
            <div className="flex items-center gap-4">
              {isQuickRecall && (
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(3)].map((_, i) => (
                      <span key={i} className={`text-2xl ${i < hearts ? "💖" : "🖤"}`} />
                    ))}
                  </div>
                  <div className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-green-600"}`}>
                    {timeLeft}s
                  </div>
                </>
              )}
              <div className="text-right">
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-2xl font-bold text-green-600">{score}/{currentQuestionIndex}</div>
              </div>
            </div>
          </div>

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
                        ? "bg-green-500"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="font-semibold text-green-900">{currentQuestion.scenario}</p>
          </div>

          <p className="text-gray-700 mb-6">
            Click animals in order of priority (most urgent first). Click again to deselect.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {shuffledAnimals.map((animal) => {
              const orderIndex = selectedOrder.indexOf(animal.id);
              const isSelected = orderIndex !== -1;

              return (
                <button
                  key={animal.id}
                  onClick={() => handleAnimalClick(animal.id)}
                  className={`p-4 border-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300 hover:border-green-400"
                  }`}
                >
                  {isSelected && (
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      #{orderIndex + 1}
                    </div>
                  )}
                  <h4 className="font-bold text-lg text-gray-900 mb-2">
                    {animal.name}
                  </h4>
                  <p className="text-gray-700 text-sm">{animal.symptoms}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={selectedOrder.length !== currentQuestion.animals.length}
            className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {selectedOrder.length === currentQuestion.animals.length
              ? currentQuestionIndex < totalQuestions - 1
                ? "Next Scenario →"
                : "Submit Final Answer"
              : `Select All Animals (${selectedOrder.length}/${currentQuestion.animals.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}