"use client";

import { Trophy, Career, Difficulty, GameMode, GameSession, XP_PER_LEVEL, calculateLevel, calculateXPForNextLevel, getTodayDate, getDailyChallenge, getStreakXPBonus } from "@/types/game";
import { GameButton, GradientCard, AnimatedIcon, AnimatedContainer, Badge } from "./ui/UIComponents";

interface StatsScreenProps {
  trophies: Trophy[];
  sessions: GameSession[];
  level: number;
  xp: number;
  streak: number;
  onBack: () => void;
}

const careerNames: Record<Career, string> = {
  programmer: "Programmer",
  nurse: "Nurse",
  engineer: "Engineer",
  teacher: "Teacher",
  chef: "Chef",
  architect: "Architect",
  lawyer: "Lawyer",
  retail: "Retail Worker",
  electrician: "Electrician",
};

const careerColors: Record<Career, string> = {
  programmer: "from-blue-500 to-indigo-600",
  nurse: "from-red-500 to-rose-600",
  engineer: "from-cyan-500 to-blue-600",
  teacher: "from-indigo-400 to-blue-500",
  chef: "from-amber-500 to-orange-600",
  architect: "from-violet-500 to-purple-600",
  lawyer: "from-blue-600 to-indigo-700",
  retail: "from-pink-500 to-rose-600",
  electrician: "from-yellow-500 to-amber-600",
};

const careerIcons: Record<Career, string> = {
  programmer: "💻",
  nurse: "🏥",
  engineer: "🏗️",
  teacher: "📚",
  chef: "👨‍🍳",
  architect: "🏛️",
  lawyer: "⚖️",
  retail: "🛍️",
  electrician: "⚡",
};

const gameModeLabels: Record<GameMode, string> = {
  challenge: "Challenge",
  "quick-recall": "Quick Recall",
  certification: "Certification",
};

const difficultyLabels: Record<Difficulty, string> = {
  easy: "🥉 Bronze",
  medium: "🥈 Silver",
  hard: "🥇 Gold",
};

const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician"];

export default function StatsScreen({ trophies, sessions, level, xp, streak, onBack }: StatsScreenProps) {
  const xpProgress = calculateXPForNextLevel(xp);
  const todayChallenge = getDailyChallenge();
  const streakXP = getStreakXPBonus(streak + 1);
  const totalSessions = sessions.length;
  const totalWins = sessions.filter(s => s.success).length;
  const overallWinRate = totalSessions > 0 ? Math.round((totalWins / totalSessions) * 100) : 0;

  const sessionsByCareer = allCareers.reduce((acc, career) => {
    acc[career] = sessions.filter(s => s.career === career);
    return acc;
  }, {} as Record<Career, GameSession[]>);

  const sessionsByDifficulty = {
    easy: sessions.filter(s => s.difficulty === "easy"),
    medium: sessions.filter(s => s.difficulty === "medium"),
    hard: sessions.filter(s => s.difficulty === "hard"),
  };

  const sessionsByMode = {
    challenge: sessions.filter(s => s.gameMode === "challenge"),
    "quick-recall": sessions.filter(s => s.gameMode === "quick-recall"),
    certification: sessions.filter(s => s.gameMode === "certification"),
  };

  const getWinRate = (sessionList: GameSession[]) => {
    if (sessionList.length === 0) return 0;
    return Math.round((sessionList.filter(s => s.success).length / sessionList.length) * 100);
  };

  const getAverageScore = (sessionList: GameSession[]) => {
    if (sessionList.length === 0) return 0;
    const total = sessionList.reduce((sum, s) => sum + (s.score / s.total) * 100, 0);
    return Math.round(total / sessionList.length);
  };

  const regularTrophies = trophies.filter(t => !t.isSecret && !t.achievementType);
  const careerCompletion = allCareers.map(career => {
    const careerTrophies = regularTrophies.filter(t => t.career === career);
    const difficultiesUnlocked = careerTrophies.length;
    return { career, unlocked: difficultiesUnlocked, total: 3 };
  });

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <GradientCard className="p-8 md:p-12" gradient="from-white/10 to-white/5 backdrop-blur-xl border border-white/20">
          <div className="text-center mb-10">
            <AnimatedIcon animate="bounce" className="text-7xl mb-4 inline-block">📊</AnimatedIcon>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-2">
              Stats & Analytics
            </h2>
            <p className="text-white/70 text-lg mb-4">
              Track your progress across all career paths
            </p>
            
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/30 to-indigo-500/30 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <span className="text-yellow-400 font-bold text-xl">⚡ Level {level}</span>
              <span className="text-white/80 text-lg">| {xp} XP</span>
            </div>
            
            <div className="max-w-md mx-auto mb-6">
              <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgress.needed > 0 ? (xpProgress.current / xpProgress.needed) * 100 : 100}%` }}
                />
              </div>
              {xpProgress.needed > 0 && (
                <p className="text-white/60 text-sm mt-1">
                  {xpProgress.current} / {xpProgress.needed} XP to next level
                </p>
              )}
            </div>
          </div>

          {totalSessions === 0 ? (
            <div className="text-center py-16">
              <AnimatedIcon animate="pulse" className="text-8xl mb-6 inline-block">🎮</AnimatedIcon>
              <p className="text-2xl text-white/80 mb-4 font-bold">No games played yet!</p>
              <p className="text-white/60 text-lg mb-8">
                Complete career challenges to see your stats and performance trends.
              </p>
              <GameButton onClick={onBack} className="text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                ← Start Playing
              </GameButton>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <AnimatedContainer delay={0}>
                  <GradientCard className="p-6 text-center" gradient="from-blue-600/80 to-indigo-600/80">
                    <div className="text-5xl font-extrabold text-white mb-2">{totalSessions}</div>
                    <p className="text-blue-200 font-medium">Total Games Played</p>
                  </GradientCard>
                </AnimatedContainer>
                
                <AnimatedContainer delay={100}>
                  <GradientCard className="p-6 text-center" gradient="from-green-600/80 to-emerald-600/80">
                    <div className="text-5xl font-extrabold text-white mb-2">{totalWins}</div>
                    <p className="text-green-200 font-medium">Games Won</p>
                  </GradientCard>
                </AnimatedContainer>
                
                <AnimatedContainer delay={200}>
                  <GradientCard className="p-6 text-center" gradient="from-purple-600/80 to-pink-600/80">
                    <div className="text-5xl font-extrabold text-white mb-2">{overallWinRate}%</div>
                    <p className="text-purple-200 font-medium">Overall Win Rate</p>
                  </GradientCard>
                </AnimatedContainer>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎯</span> Performance by Career
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {careerCompletion.map(({ career, unlocked, total }, idx) => {
                    const careerSessions = sessionsByCareer[career];
                    const winRate = getWinRate(careerSessions);
                    const avgScore = getAverageScore(careerSessions);
                    
                    return (
                      <AnimatedContainer key={career} delay={idx * 50}>
                        <div className={`
                          rounded-xl p-5 border-2 transition-all duration-300
                          bg-gradient-to-br ${careerColors[career]}/80 border-white/20
                        `}>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{careerIcons[career]}</span>
                            <div>
                              <p className="font-bold text-white text-lg">{careerNames[career]}</p>
                              <p className="text-white/60 text-sm">{unlocked}/{total} trophies</p>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Win Rate:</span>
                              <span className="font-bold text-white">{winRate}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Avg Score:</span>
                              <span className="font-bold text-white">{avgScore}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Games:</span>
                              <span className="font-bold text-white">{careerSessions.length}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${winRate}%` }}
                            />
                          </div>
                        </div>
                      </AnimatedContainer>
                    );
                  })}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📈</span> Performance by Difficulty
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["easy", "medium", "hard"] as Difficulty[]).map((difficulty, idx) => {
                    const difficultySessions = sessionsByDifficulty[difficulty];
                    const winRate = getWinRate(difficultySessions);
                    const avgScore = getAverageScore(difficultySessions);
                    
                    const difficultyLabels: Record<Difficulty, string> = {
                      easy: "🥉 Bronze",
                      medium: "🥈 Silver",
                      hard: "🥇 Gold",
                    };
                    
                    return (
                      <AnimatedContainer key={difficulty} delay={idx * 50}>
                        <div className="rounded-xl p-5 border-2 border-white/20 bg-white/10">
                          <p className="font-bold text-white text-lg mb-3">{difficultyLabels[difficulty]}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Win Rate:</span>
                              <span className="font-bold text-white">{winRate}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Avg Score:</span>
                              <span className="font-bold text-white">{avgScore}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Games:</span>
                              <span className="font-bold text-white">{difficultySessions.length}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`
                                h-full rounded-full transition-all duration-500
                                ${difficulty === "easy" ? "bg-gradient-to-r from-green-400 to-emerald-500" : 
                                  difficulty === "medium" ? "bg-gradient-to-r from-yellow-400 to-orange-500" : 
                                  "bg-gradient-to-r from-purple-400 to-pink-500"}
                              `}
                              style={{ width: `${winRate}%` }}
                            />
                          </div>
                        </div>
                      </AnimatedContainer>
                    );
                  })}
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>🎮</span> Performance by Mode
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(["challenge", "quick-recall", "certification"] as GameMode[]).map((mode, idx) => {
                    const modeSessions = sessionsByMode[mode];
                    const winRate = getWinRate(modeSessions);
                    const avgScore = getAverageScore(modeSessions);
                    
                    return (
                      <AnimatedContainer key={mode} delay={idx * 50}>
                        <div className="rounded-xl p-5 border-2 border-white/20 bg-white/10">
                          <p className="font-bold text-white text-lg mb-3">{gameModeLabels[mode]}</p>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Win Rate:</span>
                              <span className="font-bold text-white">{winRate}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Avg Score:</span>
                              <span className="font-bold text-white">{avgScore}%</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">Games:</span>
                              <span className="font-bold text-white">{modeSessions.length}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3 bg-white/20 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500"
                              style={{ width: `${winRate}%` }}
                            />
                          </div>
                        </div>
                      </AnimatedContainer>
                    );
                  })}
                </div>
              </div>

              {recentSessions.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>🕒</span> Recent Games
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {recentSessions.map((session, idx) => {
                      const date = new Date(session.timestamp);
                      const timeStr = date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      
                      return (
                        <AnimatedContainer key={session.id} delay={idx * 30}>
                          <div className="flex items-center justify-between p-4 rounded-lg bg-white/10 border border-white/10">
                            <div className="flex items-center gap-4">
                              <span className="text-2xl">{careerIcons[session.career]}</span>
                              <div>
                                <p className="font-bold text-white">{careerNames[session.career]} - {gameModeLabels[session.gameMode]}</p>
                                <p className="text-white/60 text-sm">{timeStr}</p>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className={`font-bold text-lg ${session.success ? "text-green-400" : "text-red-400"}`}>
                                {session.score}/{session.total} ({Math.round((session.score / session.total) * 100)}%)
                              </div>
                              <Badge variant={session.difficulty} className="text-xs">
                                {session.difficulty === "easy" ? "Bronze" : session.difficulty === "medium" ? "Silver" : "Gold"}
                              </Badge>
                            </div>
                          </div>
                        </AnimatedContainer>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="mt-10 pt-8 border-t-2 border-white/20">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <span>🏆</span> Trophy Summary
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-white/10">
                    <p className="text-3xl font-extrabold text-amber-400">{regularTrophies.length}</p>
                    <p className="text-white/70 text-sm">Challenge Trophies</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/10">
                    <p className="text-3xl font-extrabold text-purple-400">
                      {trophies.filter(t => t.achievementType === "quick-recall-champion").length}
                    </p>
                    <p className="text-white/70 text-sm">Quick Recall Wins</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/10">
                    <p className="text-3xl font-extrabold text-purple-400">
                      {trophies.filter(t => t.achievementType === "certification-master").length}
                    </p>
                    <p className="text-white/70 text-sm">Certifications</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/10">
                    <p className="text-3xl font-extrabold text-cyan-400">
                      {trophies.filter(t => t.isSecret && t.achievementType).length}
                    </p>
                    <p className="text-white/70 text-sm">Secret Achievements</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t-2 border-orange-400/30">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                    <span>🔥</span> Daily Challenge & Streak
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-white/10">
                    <p className="text-3xl font-extrabold text-orange-400">{streak}</p>
                    <p className="text-white/70 text-sm">Current Streak (days)</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/10">
                    <p className="text-3xl font-extrabold text-yellow-400">+{streakXP} XP</p>
                    <p className="text-white/70 text-sm">Next Streak Bonus</p>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                    <span className="text-2xl">{careerIcons[todayChallenge.career]}</span>
                    <div className="text-left">
                      <p className="font-bold text-white">{careerNames[todayChallenge.career]} - {difficultyLabels[todayChallenge.difficulty]}</p>
                      <p className="text-white/60 text-sm">Today's Challenge</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10 text-center">
                <GameButton onClick={onBack} className="text-lg px-10 py-4 bg-gradient-to-r from-gray-700 to-gray-800">
                  ← Back to Menu
                </GameButton>
              </div>
            </>
          )}
        </GradientCard>
      </div>
    </div>
  );
}