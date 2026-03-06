"use client";

import { useState, useEffect, useCallback } from "react";
import { Difficulty } from "@/types/game";
import { audioSystem } from "@/lib/audio";

interface TeacherSimulationProps {
  difficulty: Difficulty;
  onComplete: (success: boolean, score: number, total: number) => void;
}

interface Scenario {
  id: string;
  situation: string;
  student: string;
  avatar: string;
  options: {
    id: string;
    text: string;
    correct: boolean;
    consequence: string;
  }[];
}

interface LessonTopic {
  id: string;
  topic: string;
  correctOrder: number;
}

interface TeacherTask {
  id: string;
  title: string;
  description: string;
  scenarios?: Scenario[];
  lessonTopics?: LessonTopic[];
  timeLimit: number;
  points: number;
  type: "scenario" | "ordering";
}

const teacherTasks: Record<Difficulty, TeacherTask[]> = {
  easy: [
    {
      id: "tea-e1",
      title: "Classroom Management",
      description: "Handle these classroom situations. Choose the best response for each.",
      type: "scenario",
      scenarios: [
        {
          id: "s1",
          situation: "A student is talking while you're explaining a lesson",
          student: "Alex",
          avatar: "👦",
          options: [
            { id: "a", text: "Ignore it and continue teaching", correct: false, consequence: "Other students will also start talking" },
            { id: "b", text: "Pause and make eye contact, then continue", correct: true, consequence: "Student stops, class stays focused" },
            { id: "c", text: "Yell at the student to be quiet", correct: false, consequence: "Creates negative atmosphere" },
          ],
        },
        {
          id: "s2",
          situation: "Two students are arguing over a pencil",
          student: "Sam & Jordan",
          avatar: "👧👦",
          options: [
            { id: "a", text: "Send both to the principal's office", correct: false, consequence: "Misses learning opportunity" },
            { id: "b", text: "Ask them to solve it peacefully, then continue", correct: true, consequence: "Students learn conflict resolution" },
            { id: "c", text: "Take the pencil away from both", correct: false, consequence: "Doesn't teach problem-solving" },
          ],
        },
      ],
      timeLimit: 60,
      points: 100,
    },
  ],
  medium: [
    {
      id: "tea-m1",
      title: "Diverse Classroom",
      description: "Handle escalating situations with multiple factors to consider.",
      type: "scenario",
      scenarios: [
        {
          id: "s1",
          situation: "A student with ADHD is having trouble sitting still during a 30-minute lecture",
          student: "Taylor",
          avatar: "👧",
          options: [
            { id: "a", text: "Tell them to sit down and be quiet", correct: false, consequence: "Student becomes frustrated and disruptive" },
            { id: "b", text: "Give them a fidget tool and let them stand in back", correct: true, consequence: "Student can focus while moving" },
            { id: "c", text: "Send them out of the classroom", correct: false, consequence: "Student misses learning, feels excluded" },
          ],
        },
        {
          id: "s2",
          situation: "A student is struggling with reading comprehension while others are finishing quickly",
          student: "Morgan",
          avatar: "👦",
          options: [
            { id: "a", text: "Move to the next lesson - they'll catch up later", correct: false, consequence: "Student falls further behind" },
            { id: "b", text: "Pair them with a peer tutor for extra help", correct: true, consequence: "Student gets support, peer learns by teaching" },
            { id: "c", text: "Give them more homework to practice", correct: false, consequence: "Overwhelms the struggling student" },
          ],
        },
        {
          id: "s3",
          situation: "Parents complain their child is being bullied but the accused student denies it",
          student: "Casey",
          avatar: "👧",
          options: [
            { id: "a", text: "Ignore it - kids will be kids", correct: false, consequence: "Bullying may escalate" },
            { id: "b", text: "Investigate privately and mediate a conversation", correct: true, consequence: "Addresses issue while being fair to all" },
            { id: "c", text: "Suspend both students immediately", correct: false, consequence: "Punishes potentially innocent student" },
          ],
        },
      ],
      timeLimit: 90,
      points: 150,
    },
  ],
  hard: [
    {
      id: "tea-h1",
      title: "Full Classroom Challenge",
      description: "Multiple issues happening at once. Prioritize and address them all!",
      type: "scenario",
      scenarios: [
        {
          id: "s1",
          situation: "A fire drill starts during an important test",
          student: "Entire Class",
          avatar: "👨‍👩‍👧‍👦",
          options: [
            { id: "a", text: "Have students leave papers open for when you return", correct: false, consequence: "Test integrity compromised" },
            { id: "b", text: "Collect all papers quickly, resume after drill", correct: true, consequence: "Fair to all, maintains academic integrity" },
            { id: "c", text: "Cancel the test entirely", correct: false, consequence: "Rewards disruption, wastes preparation" },
          ],
        },
        {
          id: "s2",
          situation: "A student comes to class upset after receiving bad news. They won't participate.",
          student: "Riley",
          avatar: "👦",
          options: [
            { id: "a", text: "Force them to participate in group work", correct: false, consequence: "Doesn't respect student's emotional needs" },
            { id: "b", text: "Check in privately, offer to catch them up later", correct: true, consequence: "Shows empathy while maintaining expectations" },
            { id: "c", text: "Send them to the counselor immediately", correct: false, consequence: "May embarrass student, removes agency" },
          ],
        },
        {
          id: "s3",
          situation: "A parent volunteers in class but is giving unsolicited advice to other students",
          student: "Parent",
          avatar: "👨",
          options: [
            { id: "a", text: "Publicly tell them to stop interfering", correct: false, consequence: "Creates conflict, embarrasses parent" },
            { id: "b", text: "Thank them and redirect: 'Let's let the students try first'", correct: true, consequence: "Polite but maintains boundaries" },
            { id: "c", text: "Ask them to not volunteer anymore", correct: false, consequence: "Loses potential help, creates tension" },
          ],
        },
        {
          id: "s4",
          situation: "Technology fails during a critical presentation - no projector works",
          student: "Class",
          avatar: "👨‍👩‍👧‍👦",
          options: [
            { id: "a", text: "Cancel the lesson and have free time", correct: false, consequence: "Wasted class time" },
            { id: "b", text: "Pivot to discussion-based lesson using whiteboard", correct: true, consequence: "Adaptable teaching, maintains engagement" },
            { id: "c", text: "Have students read from textbooks silently", correct: false, consequence: "Missed learning opportunity" },
          ],
        },
      ],
      timeLimit: 120,
      points: 200,
    },
  ],
};

export default function TeacherSimulation({ difficulty, onComplete }: TeacherSimulationProps) {
  const tasks = teacherTasks[difficulty];
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showConsequence, setShowConsequence] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentTask = tasks[currentTaskIndex];

  // Initialize
  useEffect(() => {
    if (currentTask) {
      setSelectedAnswers({});
      setShowConsequence({});
      setTimeLeft(currentTask.timeLimit);
      setFeedback(null);
    }
  }, [currentTask]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || feedback === "correct") return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, feedback]);

  const handleOptionSelect = (scenarioId: string, optionId: string) => {
    if (showConsequence[scenarioId]) return; // Already answered
    
    const scenario = currentTask.scenarios?.find(s => s.id === scenarioId);
    const option = scenario?.options.find(o => o.id === optionId);
    
    setSelectedAnswers({ ...selectedAnswers, [scenarioId]: optionId });
    setShowConsequence({ ...showConsequence, [scenarioId]: option?.consequence || "" });
  };

  const handleSubmit = useCallback(() => {
    if (!currentTask || !currentTask.scenarios) return;

    let correctCount = 0;
    const totalScenarios = currentTask.scenarios.length;

    currentTask.scenarios.forEach((scenario) => {
      const selectedOption = scenario.options.find(o => o.id === selectedAnswers[scenario.id]);
      if (selectedOption?.correct) {
        correctCount++;
      }
    });

    const percentage = correctCount / totalScenarios;
    let pointsEarned = 0;

    if (percentage === 1) {
      audioSystem.playSuccessSound();
      pointsEarned = currentTask.points;
      const timeBonus = Math.floor((timeLeft / currentTask.timeLimit) * 20);
      pointsEarned += timeBonus;
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
      }, 2000);
    } else {
      setFeedback("incorrect");
      setTimeout(() => {
        setSelectedAnswers({});
        setShowConsequence({});
        setTimeLeft((prev) => Math.max(0, prev - 15));
        setFeedback(null);
      }, 2000);
    }
  }, [currentTask, selectedAnswers, timeLeft, currentTaskIndex, tasks.length]);

  const handleFinish = () => {
    const success = totalScore > 0;
    onComplete(success, totalScore, tasks.length * 200);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">👩‍🏫</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Teaching Complete!</h2>
          <p className="text-gray-600 mb-4">
            You demonstrated excellent classroom management!
          </p>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-4 mb-6">
            <div className="text-white text-sm">Total Score</div>
            <div className="text-4xl font-bold text-white">{totalScore}</div>
          </div>
          <button
            onClick={handleFinish}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all"
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">👩‍🏫 Teacher Simulation</h1>
            <p className="text-indigo-200">Task {currentTaskIndex + 1} of {tasks.length}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{totalScore} pts</div>
            <div className={`text-lg ${timeLeft <= 20 ? "text-red-300 animate-pulse" : "text-green-300"}`}>
              ⏱️ {timeLeft}s
            </div>
          </div>
        </div>

        {/* Task Info */}
        <div className="bg-white/10 backdrop-blur rounded-xl p-4 mb-6">
          <h2 className="text-xl font-bold text-white mb-2">{currentTask.title}</h2>
          <p className="text-indigo-100">{currentTask.description}</p>
        </div>

        {/* Scenarios */}
        <div className="space-y-6">
          {currentTask.scenarios?.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-xl p-5 shadow-lg"
            >
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{scenario.avatar}</span>
                <div>
                  <div className="font-bold text-gray-800">{scenario.student}</div>
                  <div className="text-gray-600">{scenario.situation}</div>
                </div>
              </div>

              <div className="space-y-2">
                {scenario.options.map((option) => {
                  const isSelected = selectedAnswers[scenario.id] === option.id;
                  const showResult = showConsequence[scenario.id];
                  const isCorrect = option.correct;
                  
                  let borderColor = "border-gray-200";
                  if (showResult) {
                    if (isCorrect) borderColor = "border-green-500 bg-green-50";
                    else if (isSelected) borderColor = "border-red-500 bg-red-50";
                  }
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleOptionSelect(scenario.id, option.id)}
                      disabled={!!showResult}
                      className={`w-full text-left p-3 rounded-lg border-2 ${borderColor} hover:bg-gray-50 transition-all disabled:cursor-not-allowed`}
                    >
                      <span className="font-medium text-gray-800">{option.text}</span>
                      
                      {showResult && (
                        <div className={`mt-2 text-sm ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                          {isCorrect ? "✓ " : "✗ "}{option.consequence}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Feedback */}
        {feedback === "correct" && (
          <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 mt-6 text-center">
            <span className="text-green-300 font-bold text-lg">✓ Excellent teaching decisions!</span>
          </div>
        )}
        {feedback === "incorrect" && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mt-6 text-center">
            <span className="text-red-300 font-bold text-lg">✗ Some decisions need improvement. Try again!</span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={feedback !== null || Object.keys(selectedAnswers).length < (currentTask.scenarios?.length || 0)}
          className="w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✓ Submit Decisions
        </button>

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
