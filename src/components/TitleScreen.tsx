"use client";

import { useState } from "react";
import { audioSystem } from "@/lib/audio";
import { GameMode, CustomTest } from "@/types/game";
import { GameButton, GradientCard, AnimatedIcon } from "./ui/UIComponents";

interface TitleScreenProps {
  onStart: (mode: GameMode) => void;
  onStartStory?: () => void;
  onOpenSettings: () => void;
  onViewTrophies: () => void;
  onViewStats: () => void;
  onOpenProfile: () => void;
  onOpenCustomCreate?: () => void;
  onEnterCode?: (code: string) => void;
  onPreviewCode?: (code: string) => void;
  previewTest?: CustomTest | null;
  approvedTests?: CustomTest[];
  currentUser?: string | null;
  onEditApprovedTest?: (test: CustomTest) => void;
}

export default function TitleScreen({ onStart, onStartStory, onOpenSettings, onViewTrophies, onViewStats, onOpenProfile, onOpenCustomCreate, onEnterCode, onPreviewCode, previewTest, approvedTests = [], currentUser, onEditApprovedTest }: TitleScreenProps) {
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [howToPlayStep, setHowToPlayStep] = useState(0);

  const howToPlaySteps = [
    {
      title: "Pick a Mode",
      description: "Choose Challenge, Quick Recall, Certification, or Story Mode from the title screen.",
      icon: "🎮",
    },
    {
      title: "Choose a Career",
      description: "Select a career path to practice real workplace decisions for that job.",
      icon: "🧭",
    },
    {
      title: "Answer Scenarios",
      description: "Read each situation, choose the best action, and review the explanation after each answer.",
      icon: "💡",
    },
    {
      title: "Earn Progress",
      description: "Pass challenges to earn trophies, XP, stats, and story milestone progress.",
      icon: "🏆",
    },
  ];

  const handleStart = (mode: GameMode) => {
    audioSystem.playClickSound();
    onStart(mode);
  };

  const handleCodeChange = (value: string) => {
    const code = value.toUpperCase();
    setInputCode(code);
    onPreviewCode?.(code);
  };

  const handleCodeSubmit = () => {
    const code = inputCode.trim().toUpperCase();
    if (!code) return;
    onPreviewCode?.(code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-3xl w-full relative z-10">
        <div className="absolute top-4 inset-x-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            onClick={() => {
              audioSystem.playClickSound();
              onOpenSettings();
            }}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 backdrop-blur-sm text-white font-bold hover:scale-110 transition-transform"
            title="Open Settings"
            aria-label="Open settings"
          >
            <span className="text-2xl">⚙️</span>
          </button>
          <button
            onClick={onOpenProfile}
            className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/30 to-indigo-500/30 backdrop-blur-sm text-white font-bold hover:scale-110 transition-transform"
            title="View Profile"
            aria-label="View profile"
          >
            <span className="text-2xl">👤</span>
          </button>
        </div>
        
        <GradientCard className="p-8 md:p-14 text-center" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="mb-8">
            <AnimatedIcon animate="bounce" className="text-7xl mb-6 inline-block">🎯</AnimatedIcon>
            <h1 className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-4 tracking-tight">
              Career Quest
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-2xl mx-auto">
              Explore careers through interactive challenges. Master real-world skills across 18 exciting career paths.
            </p>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
              <span className="text-amber-400">✨</span>
              <span className="text-white/80 font-medium">From coding to cooking, nursing to engineering</span>
            </div>
          </div>

          <div className="grid gap-4 max-w-lg mx-auto">
            <GameButton onClick={() => handleStart("challenge")} className="text-xl relative overflow-hidden group">
              <span className="relative z-10 flex items-center justify-center gap-3">
                🎮 Challenge Mode
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </GameButton>
            
            <GameButton 
              onClick={() => handleStart("quick-recall")} 
              className="text-xl bg-gradient-to-r from-emerald-500 to-teal-600 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                ⚡ Quick Recall
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </GameButton>

            <GameButton 
              onClick={() => handleStart("certification")} 
              className="text-xl bg-gradient-to-r from-purple-500 to-pink-600 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                📜 Certification Mode
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </GameButton>

            <GameButton
              onClick={() => {
                audioSystem.playClickSound();
                onStartStory?.();
              }}
              className="text-xl bg-gradient-to-r from-violet-500 to-fuchsia-600 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                📖 Story Mode
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </GameButton>

            {currentUser && (
              <GameButton 
                onClick={onOpenCustomCreate} 
                className="text-xl bg-gradient-to-r from-orange-500 to-red-600 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  🛠️ Create Custom Quiz
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </GameButton>
            )}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                audioSystem.playClickSound();
                setShowHowToPlay(true);
                setHowToPlayStep(0);
              }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-cyan-300/60 bg-cyan-400/10 text-cyan-100 text-sm font-bold hover:bg-cyan-400/20 transition"
            >
              ❔ How to Play
            </button>
            <button
              onClick={() => setShowCodeInput(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-white/30 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition"
            >
              🎯 Enter Quiz Code
            </button>
          </div>

          {approvedTests.length > 0 && (
            <div className="mt-8 text-left">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-white font-bold text-lg">Approved Custom Tests</h3>
                  <p className="text-white/60 text-sm">Play moderator-approved quizzes without entering a code.</p>
                </div>
                <button
                  onClick={() => setShowCodeInput(true)}
                  className="text-cyan-300 hover:text-cyan-200 text-sm font-bold"
                >
                  Use Code
                </button>
              </div>
              <div className="grid gap-3 max-h-72 overflow-y-auto pr-2">
                {approvedTests.map((test) => (
                  <button
                    key={test.code}
                    onClick={() => {
                      setInputCode(test.code);
                      onPreviewCode?.(test.code);
                      setShowCodeInput(true);
                    }}
                    className="rounded-xl border border-white/20 bg-white/10 p-4 text-left hover:bg-white/15 hover:scale-[1.01] transition"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{test.icon || "🎓"}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                          <h4 className="text-white font-bold break-words">{test.name}</h4>
                          <span className="text-amber-300 text-xs font-bold">{test.code}</span>
                        </div>
                        {test.description && (
                          <p className="text-white/70 text-sm mt-1 max-h-10 overflow-hidden">{test.description}</p>
                        )}
                        <p className="text-white/50 text-xs mt-2">
                          by @{test.creatorUsername} • {test.questions.length} questions • {test.mode}
                        </p>
                        {currentUser === test.creatorUsername && onEditApprovedTest && (
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              onEditApprovedTest(test);
                            }}
                            className="mt-2 text-cyan-300 hover:text-cyan-200 text-sm font-bold"
                          >
                            Edit Test
                          </button>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {showHowToPlay && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-label="How to Play">
              <div className="bg-slate-900 p-6 md:p-8 rounded-2xl max-w-2xl w-full border border-white/20">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <div className="text-5xl mb-3">{howToPlaySteps[howToPlayStep].icon}</div>
                    <h3 className="text-3xl font-extrabold text-white">How to Play</h3>
                    <p className="text-white/70 mt-2">
                      Step {howToPlayStep + 1} of {howToPlaySteps.length}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHowToPlay(false)}
                    className="text-white/70 hover:text-white text-3xl"
                    aria-label="Close how to play"
                  >
                    ×
                  </button>
                </div>

                <div className="rounded-xl bg-white/10 p-6 border border-white/15 mb-6">
                  <h4 className="text-2xl font-extrabold text-white mb-3">
                    {howToPlaySteps[howToPlayStep].title}
                  </h4>
                  <p className="text-white/80 text-lg leading-relaxed">
                    {howToPlaySteps[howToPlayStep].description}
                  </p>
                </div>

                <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                  {howToPlaySteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setHowToPlayStep(index)}
                      aria-label={`Go to step ${index + 1}`}
                      className={`h-3 flex-1 rounded-full min-w-12 ${
                        index === howToPlayStep ? "bg-cyan-300" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <GameButton
                    onClick={() => setHowToPlayStep((step) => Math.max(0, step - 1))}
                    disabled={howToPlayStep === 0}
                    variant="secondary"
                    className="flex-1"
                  >
                    ← Previous
                  </GameButton>
                  <GameButton
                    onClick={() => {
                      if (howToPlayStep < howToPlaySteps.length - 1) {
                        setHowToPlayStep((step) => step + 1);
                      } else {
                        setShowHowToPlay(false);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600"
                  >
                    {howToPlayStep === howToPlaySteps.length - 1 ? "Got It" : "Next →"}
                  </GameButton>
                </div>
              </div>
            </div>
          )}

          {showCodeInput && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 p-6 rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
                <h3 className="text-white font-bold mb-3">Enter Quiz Code</h3>
                <input
                  type="text"
                  value={inputCode.toUpperCase()}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  placeholder="ABCD12"
                  className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 text-white mb-4"
                  maxLength={8}
                />

                {previewTest && (
                  <div className="mb-4 rounded-lg border border-white/20 bg-white/10 p-4 text-left">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl">{previewTest.icon || "🎓"}</span>
                      <div>
                        <h4 className="text-white font-bold text-lg">{previewTest.name}</h4>
                        {previewTest.description && (
                          <p className="text-white/70 text-sm">{previewTest.description}</p>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-white/70 text-sm mb-2 font-bold">Skills Learned</p>
                      <div className="flex flex-wrap gap-2">
                        {(previewTest.skillsLearned || []).map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 rounded-full bg-white/15 text-white text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-white/70 text-sm mb-2 font-bold">Questions</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {previewTest.questions.map((question, idx) => (
                          <div key={question.id} className="rounded bg-black/20 p-3">
                            <p className="text-white text-sm font-semibold mb-1">
                              {idx + 1}. {question.question}
                            </p>
                            {question.image && (
                              <img
                                src={question.image}
                                alt={`Question ${idx + 1} image`}
                                className="mb-2 max-h-40 w-full rounded-lg object-contain bg-white/10"
                              />
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-white/70 text-xs">
                              {question.options.map((option, optIdx) => (
                                <span key={optIdx}>
                                  {String.fromCharCode(65 + optIdx)}. {option}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {approvedTests.length > 0 && (
                  <div className="mb-4">
                    <p className="text-white/70 text-sm mb-2 font-bold">Approved Tests</p>
                    <div className="grid gap-2 max-h-48 overflow-y-auto pr-2">
                      {approvedTests.map((test) => (
                        <button
                          key={test.code}
                          onClick={() => {
                            setInputCode(test.code);
                            onPreviewCode?.(test.code);
                          }}
                          className="rounded-lg bg-white/10 p-3 text-left hover:bg-white/15"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{test.icon || "🎓"}</span>
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm truncate">{test.name}</p>
                              <p className="text-white/50 text-xs">{test.code} • {test.questions.length} questions</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <GameButton
                    onClick={handleCodeSubmit}
                    className="flex-1"
                    disabled={!inputCode}
                  >
                    {previewTest ? "Update Preview" : "Preview Test"}
                  </GameButton>
                  {previewTest && onEnterCode && (
                    <GameButton
                      onClick={() => {
                        if (inputCode) {
                          onEnterCode(inputCode);
                        }
                      }}
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                    >
                      Play Test
                    </GameButton>
                  )}
                  <button
                    onClick={() => setShowCodeInput(false)}
                    className="px-4 py-2 rounded bg-gray-700 text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={() => {
                audioSystem.playClickSound();
                onViewTrophies();
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-amber-400/50 bg-gradient-to-r from-amber-400/20 to-yellow-500/20 text-amber-300 font-bold text-lg hover:from-amber-400/30 hover:to-yellow-500/30 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              🏆 View Trophy Case
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                audioSystem.playClickSound();
                onViewStats();
              }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border-2 border-blue-400/50 bg-gradient-to-r from-blue-400/20 to-indigo-500/20 text-blue-300 font-bold text-lg hover:from-blue-400/30 hover:to-indigo-500/30 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              📊 Stats & Analytics
            </button>
          </div>
          
          <div className="mt-8 text-sm text-white/60">
            Choose your path. Learn real skills. Shape your future.
          </div>
        </GradientCard>
      </div>
    </div>
  );
}