"use client";

import { useState, useEffect, useCallback } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

interface TeacherSimulationProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

interface Student {
  id: string;
  name: string;
  avatar: string;
  engagement: number;
  questionProbability: number;
}

interface ClassroomEvent {
  id: string;
  type: "question" | "distraction" | "disruption" | "quiz" | "break";
  title: string;
  description: string;
  student?: Student;
  options: {
    id: string;
    text: string;
    correct: boolean;
    engagementChange: number;
    explanation: string;
  }[];
}

interface LessonPlan {
  id: string;
  title: string;
  topic: string;
  duration: number;
  events: ClassroomEvent[];
  targetEngagement: number;
}

const lessonPlans: Record<Difficulty, LessonPlan[]> = {
  easy: [
    {
      id: "lesson-e1",
      title: "Basic Math",
      topic: "Addition and Subtraction",
      duration: 5,
      targetEngagement: 50,
      events: [
        {
          id: "e1",
          type: "question",
          title: "Student Question",
          description: "Emma raises her hand: \"Teacher, what is 5 + 7?\"",
          student: { id: "s1", name: "Emma", avatar: "👧", engagement: 60, questionProbability: 0.3 },
          options: [
            { id: "a", text: "Give the answer directly: 12", correct: false, engagementChange: -10, explanation: "Students don't learn by just getting answers" },
            { id: "b", text: "Ask Emma to count on her fingers", correct: true, engagementChange: 15, explanation: "Hands-on learning helps!" },
            { id: "c", text: "Ignore her for now", correct: false, engagementChange: -20, explanation: "Student loses interest" },
          ],
        },
        {
          id: "e2",
          type: "distraction",
          title: "Side Conversation",
          description: "Two students in the back are whispering about a video game.",
          options: [
            { id: "a", text: "Continue teaching - they'll stop eventually", correct: false, engagementChange: -15, explanation: "Distraction spreads to others" },
            { id: "b", text: "Make eye contact and gesture to focus", correct: true, engagementChange: 5, explanation: "Non-verbal correction works!" },
            { id: "c", text: "Stop class and yell at them", correct: false, engagementChange: -20, explanation: "Creates negative atmosphere" },
          ],
        },
        {
          id: "e3",
          type: "quiz",
          title: "Pop Quiz Time!",
          description: "Time for a quick quiz on today's lesson!",
          options: [
            { id: "a", text: "Make it a fun team competition", correct: true, engagementChange: 20, explanation: "Students love friendly competition!" },
            { id: "b", text: "Silent individual quiz", correct: false, engagementChange: -10, explanation: "Too stressful for young students" },
            { id: "c", text: "Skip the quiz today", correct: false, engagementChange: -15, explanation: "Missed learning opportunity" },
          ],
        },
      ],
    },
  ],
  medium: [
    {
      id: "lesson-m1",
      title: "Science Experiment",
      topic: "Chemical Reactions",
      duration: 7,
      targetEngagement: 60,
      events: [
        {
          id: "e1",
          type: "question",
          title: "Science Question",
          description: "Jake asks: \"Why does baking soda bubble when we add vinegar?\"",
          student: { id: "s1", name: "Jake", avatar: "👦", engagement: 70, questionProbability: 0.4 },
          options: [
            { id: "a", text: "Explain the acid-base reaction in simple terms", correct: true, engagementChange: 20, explanation: "Great teachable moment!" },
            { id: "b", text: "That's beyond today's lesson", correct: false, engagementChange: -15, explanation: "Discourages curiosity" },
            { id: "c", text: "Because magic!", correct: false, engagementChange: -5, explanation: "Misleading answer" },
          ],
        },
        {
          id: "e2",
          type: "disruption",
          title: "Lab Accident",
          description: "A student's experiment is fizzing over onto the desk!",
          options: [
            { id: "a", text: "Stay calm, have student clean it up, continue lesson", correct: true, engagementChange: 10, explanation: "Good crisis management!" },
            { id: "b", text: "Panic and send everyone out of class", correct: false, engagementChange: -25, explanation: "Overreaction scares students" },
            { id: "c", text: "Ignore it and keep teaching", correct: false, engagementChange: -20, explanation: "Safety issue!" },
          ],
        },
        {
          id: "e3",
          type: "distraction",
          title: "Phone Notification",
          description: "A student's phone buzzes loudly during the experiment.",
          options: [
            { id: "a", text: "Remind about phone policy, continue", correct: true, engagementChange: 5, explanation: "Firm but fair" },
            { id: "b", text: "Confiscate phone for the rest of class", correct: false, engagementChange: -10, explanation: "Too harsh for first offense" },
            { id: "c", text: "Let it go this time", correct: false, engagementChange: -15, explanation: "Policy must be consistent" },
          ],
        },
        {
          id: "e4",
          type: "break",
          title: "Energy Dip",
          description: "The class seems tired after the experiment. Engagement is dropping.",
          options: [
            { id: "a", text: "Do a quick stretch break then continue", correct: true, engagementChange: 15, explanation: "Physical activity helps refocus!" },
            { id: "b", text: "Push through - there's more content", correct: false, engagementChange: -20, explanation: "Exhausted students can't learn" },
            { id: "c", text: "Let them have free time", correct: false, engagementChange: -10, explanation: "Loses momentum" },
          ],
        },
      ],
    },
  ],
  hard: [
    {
      id: "lesson-h1",
      title: "History Essay Workshop",
      topic: "American Revolution",
      duration: 10,
      targetEngagement: 70,
      events: [
        {
          id: "e1",
          type: "question",
          title: "Complex Question",
          description: "Morgan asks: \"Was the American Revolution justified? Isn't that just rebellion?\"",
          student: { id: "s1", name: "Morgan", avatar: "👤", engagement: 80, questionProbability: 0.5 },
          options: [
            { id: "a", text: "Guide a class discussion about perspectives", correct: true, engagementChange: 25, explanation: "Critical thinking at its best!" },
            { id: "b", text: "Give your opinion and move on", correct: false, engagementChange: 0, explanation: "Missed teaching moment" },
            { id: "c", text: "That's not appropriate to discuss", correct: false, engagementChange: -20, explanation: "Shuts down intellectual curiosity" },
          ],
        },
        {
          id: "e2",
          type: "disruption",
          title: "Plagiarism Accusation",
          description: "You notice two essays that are suspiciously similar.",
          options: [
            { id: "a", text: "Meet with students privately after class", correct: true, engagementChange: 10, explanation: "Fair investigation" },
            { id: "b", text: "Publicly accuse them of cheating now", correct: false, engagementChange: -25, explanation: "Embarrasses students, could be wrong" },
            { id: "c", text: "Ignore it this time", correct: false, engagementChange: -30, explanation: "Academic dishonesty must be addressed" },
          ],
        },
        {
          id: "e3",
          type: "distraction",
          title: "Parent Complaint",
          description: "A parent emails complaining their child isn't being challenged enough.",
          options: [
            { id: "a", text: "Acknowledge concern, offer extra resources", correct: true, engagementChange: 15, explanation: "Good parent communication!" },
            { id: "b", text: "Defend your teaching methods", correct: false, engagementChange: -10, explanation: "Defensive response" },
            { id: "c", text: "Ignore the email", correct: false, engagementChange: -20, explanation: "Parent relations suffer" },
          ],
        },
        {
          id: "e4",
          type: "quiz",
          title: "Surprise Quiz",
          description: "Test scores were low. How do you address this?",
          options: [
            { id: "a", text: "Review together, offer retake option", correct: true, engagementChange: 20, explanation: "Growth mindset approach!" },
            { id: "b", text: "Lecture about the importance of studying", correct: false, engagementChange: -15, explanation: "Too negative" },
            { id: "c", text: "Make the next quiz easier", correct: false, engagementChange: -5, explanation: "Dumbing down doesn't help" },
          ],
        },
        {
          id: "e5",
          type: "break",
          title: "End-of-Day Fatigue",
          description: "It's the last period on a Friday. Students are checked out.",
          options: [
            { id: "a", text: "Interactive debate on the revolution topic", correct: true, engagementChange: 20, explanation: "Engaging format keeps attention!" },
            { id: "b", text: "Give them free time - it's Friday", correct: false, engagementChange: -15, explanation: "Gives up on teaching" },
            { id: "c", text: "Show a documentary", correct: false, engagementChange: 5, explanation: "Too passive for tired students" },
          ],
        },
      ],
    },
  ],
};

const eventTypeIcons: Record<string, string> = {
  question: "❓",
  distraction: "🎮",
  disruption: "⚡",
  quiz: "📝",
  break: "☕",
};

const eventTypeColors: Record<string, string> = {
  question: "bg-blue-500",
  distraction: "bg-purple-500",
  disruption: "bg-red-500",
  quiz: "bg-green-500",
  break: "bg-orange-500",
};

export default function TeacherSimulation({ difficulty, onComplete, onOpenSettings, onExit }: TeacherSimulationProps) {
  const plans = lessonPlans[difficulty];
  const [currentPlanIndex, setCurrentPlanIndex] = useState(0);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [engagement, setEngagement] = useState(70);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lessonProgress, setLessonProgress] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  const currentPlan = plans[currentPlanIndex];
  const currentEvent = currentPlan.events[currentEventIndex];

  useEffect(() => {
    setFadeIn(true);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEngagement((prev) => Math.max(0, prev - 2));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSelectOption = (optionId: string) => {
    if (showExplanation) return;
    setSelectedOption(optionId);
  };

  const handleSubmit = useCallback(() => {
    if (!selectedOption || !currentEvent) return;

    const selected = currentEvent.options.find((o) => o.id === selectedOption);
    if (!selected) return;

    const newEngagement = Math.min(100, Math.max(0, engagement + selected.engagementChange));
    setEngagement(newEngagement);

    if (selected.correct) {
      audioSystem.playSuccessSound();
      const basePoints = difficulty === "easy" ? 50 : difficulty === "medium" ? 75 : 100;
      const engagementBonus = Math.floor(newEngagement / 10);
      setTotalScore((prev) => prev + basePoints + engagementBonus);
      setFeedback("correct");
    } else {
      audioSystem.playFailureSound();
      setFeedback("incorrect");
    }

    setShowExplanation(true);
    setLessonProgress(((currentEventIndex + 1) / currentPlan.events.length) * 100);

    setTimeout(() => {
      if (currentEventIndex < currentPlan.events.length - 1) {
        setFadeIn(false);
        setTimeout(() => {
          setCurrentEventIndex((prev) => prev + 1);
          setSelectedOption(null);
          setShowExplanation(false);
          setFeedback(null);
          setFadeIn(true);
        }, 300);
      } else {
        setShowSuccess(true);
      }
    }, 2000);
  }, [selectedOption, currentEvent, currentEventIndex, currentPlan, engagement, difficulty]);

  const handleFinish = () => {
    const success = engagement >= currentPlan.targetEngagement;
    const maxScore = currentPlan.events.length * 150;
    onComplete(success, totalScore, maxScore);
  };

  const getEngagementColor = () => {
    if (engagement >= 70) return "bg-green-500";
    if (engagement >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getEngagementEmoji = () => {
    if (engagement >= 70) return "😊";
    if (engagement >= 40) return "😐";
    return "😴";
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center transform scale-100 animate-bounce">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Lesson Complete!</h2>
          <p className="text-gray-600 mb-4">
            Final class engagement: {engagement}%
          </p>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <div className="text-sm text-gray-500 mb-4">
            {engagement >= 80 ? "🌟 Outstanding teaching! The students learned a lot!" :
             engagement >= 60 ? "👍 Good lesson! Room for improvement." :
             "⚠️ Consider different strategies for next time."}
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">🍎 Classroom Management</h1>
            <p className="text-indigo-200">{currentPlan.title} - {currentPlan.topic}</p>
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

        {/* Engagement Meter */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-bold">📊 Class Engagement {getEngagementEmoji()}</span>
            <span className={`text-2xl font-bold ${engagement >= 70 ? "text-green-400" : engagement >= 40 ? "text-yellow-400" : "text-red-400"}`}>{engagement}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className={`h-4 rounded-full transition-all duration-500 ${getEngagementColor()}`}
              style={{ width: `${engagement}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-white/50 mt-1">
            <span>Target: {currentPlan.targetEngagement}%</span>
            <span>Event {currentEventIndex + 1} of {currentPlan.events.length}</span>
          </div>
        </div>

        {/* Event Card */}
        <div className={`bg-white rounded-xl p-6 mb-6 shadow-xl transition-all duration-300 transform ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-4xl p-3 rounded-xl ${eventTypeColors[currentEvent.type]} text-white shadow-lg`}>
              {eventTypeIcons[currentEvent.type]}
            </span>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentEvent.title}</h2>
              <span className="text-sm text-gray-500 capitalize px-2 py-1 bg-gray-100 rounded">{currentEvent.type}</span>
            </div>
          </div>

          <p className="text-gray-700 text-lg mb-6 bg-gray-50 p-4 rounded-lg">{currentEvent.description}</p>

          <div className="space-y-3">
            {currentEvent.options.map((option) => {
              const isSelected = selectedOption === option.id;
              let borderColor = "border-gray-200 bg-gray-50";
              
              if (showExplanation) {
                if (option.correct) {
                  borderColor = "border-green-500 bg-green-50 shadow-lg shadow-green-500/20";
                } else if (isSelected) {
                  borderColor = "border-red-500 bg-red-50";
                }
              } else if (isSelected) {
                borderColor = "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border-2 ${borderColor} hover:opacity-80 transition-all duration-200 transform hover:scale-[1.01]`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`text-lg font-bold w-8 h-8 flex items-center justify-center rounded-lg ${
                      isSelected ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
                    }`}>
                      {option.id.toUpperCase()}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">{option.text}</span>
                      {showExplanation && (
                        <div className={`mt-3 text-sm ${option.correct ? "text-green-600" : "text-red-600"}`}>
                          <span className="font-bold">{option.correct ? "✓ Great choice!" : "✗ Not ideal"}</span>
                          <span className="ml-2">- {option.explanation}</span>
                          <span className="ml-2 font-bold">
                            ({option.engagementChange > 0 ? "+" : ""}{option.engagementChange}% engagement)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedOption || showExplanation}
          className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 transform ${
            !selectedOption || showExplanation
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-[1.02] shadow-lg shadow-blue-500/25"
          }`}
        >
          {showExplanation ? (
            feedback === "correct" ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce">✓</span> Excellent Decision!
              </span>
            ) : (
              "✗ Could Be Better"
            )
          ) : (
            "✓ Make Decision"
          )}
        </button>

        <div className="mt-6 flex gap-2">
          {currentPlan.events.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                idx < currentEventIndex ? "bg-green-500" :
                idx === currentEventIndex ? "bg-white shadow-lg" :
                "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
