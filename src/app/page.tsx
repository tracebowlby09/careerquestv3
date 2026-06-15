"use client";

import { useState, useEffect, useCallback } from "react";
import TitleScreen from "@/components/TitleScreen";
import CareerSelection from "@/components/CareerSelection";
import CertificationSelection from "@/components/CertificationSelection";
import CertificationWorld from "@/components/CertificationWorld";
import ProgrammerDifficulty from "@/components/difficulty/ProgrammerDifficulty";
import NurseDifficulty from "@/components/difficulty/NurseDifficulty";
import EngineerDifficulty from "@/components/difficulty/EngineerDifficulty";
import TeacherDifficulty from "@/components/difficulty/TeacherDifficulty";
import ChefDifficulty from "@/components/difficulty/ChefDifficulty";
import ArchitectDifficulty from "@/components/difficulty/ArchitectDifficulty";
import LawyerDifficulty from "@/components/difficulty/LawyerDifficulty";
import RetailDifficulty from "@/components/difficulty/RetailDifficulty";
import ElectricianDifficulty from "@/components/difficulty/ElectricianDifficulty";
import ProgrammerWorld from "@/components/careers/ProgrammerWorld";
import NurseWorld from "@/components/careers/NurseWorld";
import EngineerWorld from "@/components/careers/EngineerWorld";
import TeacherWorld from "@/components/careers/TeacherWorld";
import ChefWorld from "@/components/careers/ChefWorld";
import ArchitectWorld from "@/components/careers/ArchitectWorld";
import LawyerWorld from "@/components/careers/LawyerWorld";
import RetailWorld from "@/components/careers/RetailWorld";
import ElectricianWorld from "@/components/careers/ElectricianWorld";
import OutcomeScreen from "@/components/OutcomeScreen";
import Settings from "@/components/Settings";
import TrophyScreen from "@/components/TrophyScreen";
import StatsScreen from "@/components/StatsScreen";
import LevelUpPopup from "@/components/LevelUpPopup";
import ProfileScreen from "@/components/ProfileScreen";
import SecretTrophyPopup from "@/components/SecretTrophyPopup";
import HomeTutorial from "@/components/HomeTutorial";
import CareerInfoPage from "@/components/CareerInfoPage";
import { Career, Difficulty, GameMode, CertificationType, Trophy, AchievementType, IncorrectAnswer, GameSession, PlayerProgress, calculateLevel, calculateXPForNextLevel, getTodayDate, getDailyChallenge, getStreakXPBonus } from "@/types/game";
import { careerInfoByCareer } from "@/lib/careerInfo";
import { audioSystem } from "@/lib/audio";
import ScreenWrapper from "@/components/ScreenWrapper";

type GameState = "title" | "tutorial" | "career-select" | "certification-select" | "difficulty-select" | "playing" | "outcome" | "trophy" | "stats" | "career-info" | "profile";

const careerNames: Record<Career, string> = {
  programmer: "Software Programmer",
  nurse: "Registered Nurse",
  engineer: "Civil Engineer",
  teacher: "Teacher",
  chef: "Head Chef",
  architect: "Architect",
  lawyer: "Lawyer",
  retail: "Retail Worker",
  electrician: "Electrician",
};

// Load trophies from localStorage
const loadTrophies = (): Trophy[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("careerQuestTrophies");
  if (saved) {
    try {
      const trophies = JSON.parse(saved);
      // Convert date strings back to Date objects
      return trophies.map((t: any) => ({
        ...t,
        earnedAt: new Date(t.earnedAt),
      }));
    } catch {
      return [];
    }
  }
  return [];
};

// Save trophies to localStorage
const saveTrophies = (trophies: Trophy[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("careerQuestTrophies", JSON.stringify(trophies));
};

// Load game sessions from localStorage
const loadGameSessions = (): GameSession[] => {
  if (typeof window === "undefined") return [];
  const saved = localStorage.getItem("careerQuestSessions");
  if (saved) {
    try {
      const sessions = JSON.parse(saved);
      return sessions.map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
      }));
    } catch {
      return [];
    }
  }
  return [];
};

// Save game sessions to localStorage
const saveGameSessions = (sessions: GameSession[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("careerQuestSessions", JSON.stringify(sessions));
};

// Load player progress from localStorage
const loadPlayerProgress = (): PlayerProgress => {
  if (typeof window === "undefined") return { xp: 0, level: 1, streak: 0 };
  const saved = localStorage.getItem("careerQuestProgress");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { xp: 0, level: 1, streak: 0 };
    }
  }
  return { xp: 0, level: 1, streak: 0 };
};

// Save player progress to localStorage
const savePlayerProgress = (progress: PlayerProgress) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("careerQuestProgress", JSON.stringify(progress));
};

// Check for achievements
const checkAchievements = (
  allTrophies: Trophy[],
  isQuickRecallMode: boolean,
  isCertificationMode: boolean,
  score: number,
  total: number
): AchievementType[] => {
  const achievements: AchievementType[] = [];
  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician"];
  const allDifficulties: Difficulty[] = ["easy", "medium", "hard"];
  
  // Check for Career Master - all 3 difficulties for any career
  for (const career of allCareers) {
    const careerTrophies = allTrophies.filter(
      (t) => t.career === career && !t.achievementType
    );
    const earnedDifficulties = new Set(careerTrophies.map((t) => t.difficulty));
    const hasAllDifficulties = allDifficulties.every((d) => earnedDifficulties.has(d));
    
    if (hasAllDifficulties) {
      // Check if we already have this achievement
      const alreadyHasCareerMaster = allTrophies.some(
        (t) => t.achievementType === "career-master" && t.career === career
      );
      if (!alreadyHasCareerMaster) {
        achievements.push("career-master");
      }
    }
  }
  
  // Check for Quick Recall Champion - complete any quick recall
  if (isQuickRecallMode) {
    const alreadyHasChampion = allTrophies.some(
      (t) => t.achievementType === "quick-recall-champion"
    );
    if (!alreadyHasChampion) {
      achievements.push("quick-recall-champion");
    }
    
    // Check for Perfect Recall - all questions right, no misses
    if (score === total && total > 0) {
      const alreadyHasPerfect = allTrophies.some(
        (t) => t.achievementType === "perfect-recall"
      );
      if (!alreadyHasPerfect) {
        achievements.push("perfect-recall");
      }
    }
  }
  
  // Check for Certification Master - complete any certification
  if (isCertificationMode) {
    const alreadyHasCertMaster = allTrophies.some(
      (t) => t.achievementType === "certification-master"
    );
    if (!alreadyHasCertMaster) {
      achievements.push("certification-master");
    }
  }
  
  // Check for All Careers Master - complete all 3 difficulties for ALL careers
  let hasAllCareersMaster = true;
  for (const career of allCareers) {
    const careerTrophies = allTrophies.filter(
      (t) => t.career === career && !t.achievementType
    );
    const earnedDifficulties = new Set(careerTrophies.map((t) => t.difficulty));
    if (!allDifficulties.every((d) => earnedDifficulties.has(d))) {
      hasAllCareersMaster = false;
      break;
    }
  }
  if (hasAllCareersMaster) {
    const alreadyHasAllCareersMaster = allTrophies.some(
      (t) => t.achievementType === "all-careers-master"
    );
    if (!alreadyHasAllCareersMaster) {
      achievements.push("all-careers-master");
    }
  }
  
  // Check for All Quick Recalls Master - complete quick recall for ALL careers
  const quickRecallTrophies = allTrophies.filter(
    (t) => t.achievementType === "quick-recall-champion"
  );
  const quickRecallCareers = new Set(quickRecallTrophies.map((t) => t.career));
  if (quickRecallCareers.size === allCareers.length) {
    const alreadyHasAllQuickRecallsMaster = allTrophies.some(
      (t) => t.achievementType === "all-quick-recalls-master"
    );
    if (!alreadyHasAllQuickRecallsMaster) {
      achievements.push("all-quick-recalls-master");
    }
  }
  
  // Check for All Certifications Master - complete certifications for ALL careers
  const certTrophies = allTrophies.filter(
    (t) => t.achievementType === "certification-master"
  );
  const certCareers = new Set(certTrophies.map((t) => t.career));
  if (certCareers.size === allCareers.length) {
    const alreadyHasAllCertsMaster = allTrophies.some(
      (t) => t.achievementType === "all-certifications-master"
    );
    if (!alreadyHasAllCertsMaster) {
      achievements.push("all-certifications-master");
    }
  }
  
  return achievements;
};

// Check for easter egg achievements
const checkEasterEggAchievements = (
  allTrophies: Trophy[],
  isQuickRecallMode: boolean,
  score: number,
  total: number,
  difficulty: Difficulty | null,
  currentConsecutiveCorrect: number,
  quickRecallTimeMs: number | null,
  careersPlayedSet: Set<Career>,
  hadWrongAnswer: boolean,
  passedWithWrong: boolean,
  gameStartHourValue: number | null
): AchievementType[] => {
  const achievements: AchievementType[] = [];
  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician"];

  // Lightning Reflex - 5 correct answers in a row
  if (currentConsecutiveCorrect >= 5) {
    const alreadyHas = allTrophies.some((t) => t.achievementType === "lightning-reflex");
    if (!alreadyHas) {
      achievements.push("lightning-reflex");
    }
  }

  // Marathon Runner - Complete challenge mode with no wrong answers
  if (!isQuickRecallMode && !hadWrongAnswer && score === total && total > 0) {
    const alreadyHas = allTrophies.some((t) => t.achievementType === "marathon-runner");
    if (!alreadyHas) {
      achievements.push("marathon-runner");
    }
  }

  // Speed Demon - Quick Recall perfect score under 30 seconds (30000ms)
  if (isQuickRecallMode && score === total && total > 0 && quickRecallTimeMs !== null && quickRecallTimeMs < 30000) {
    const alreadyHas = allTrophies.some((t) => t.achievementType === "speed-demon");
    if (!alreadyHas) {
      achievements.push("speed-demon");
    }
  }

  // Jack of All Trades - Play at least one question from each career
  if (careersPlayedSet.size === allCareers.length) {
    const alreadyHas = allTrophies.some((t) => t.achievementType === "jack-of-all-trades");
    if (!alreadyHas) {
      achievements.push("jack-of-all-trades");
    }
  }

  // Lucky Star - Got a question wrong but still passed on Hard mode
  if (passedWithWrong && difficulty === "hard") {
    const alreadyHas = allTrophies.some((t) => t.achievementType === "lucky-star");
    if (!alreadyHas) {
      achievements.push("lucky-star");
    }
  }

  // Night Owl - Play after 10 PM (hour >= 22)
  if (gameStartHourValue !== null && gameStartHourValue >= 22) {
    const alreadyHas = allTrophies.some((t) => t.achievementType === "night-owl");
    if (!alreadyHas) {
      achievements.push("night-owl");
    }
  }

  // Early Bird - Play before 6 AM (hour < 6)
  if (gameStartHourValue !== null && gameStartHourValue < 6) {
    const alreadyHas = allTrophies.some((t) => t.achievementType === "early-bird");
    if (!alreadyHas) {
      achievements.push("early-bird");
    }
  }

  return achievements;
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("title");
  const [showTutorial, setShowTutorial] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("homeTutorialSkipped");
    }
    return false;
  });
  const [gameMode, setGameMode] = useState<GameMode>("challenge");
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<CertificationType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [trophies, setTrophies] = useState<Trophy[]>(() => loadTrophies());
  const [sessions, setSessions] = useState<GameSession[]>(() => loadGameSessions());
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>(() => loadPlayerProgress());
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [oldLevel, setOldLevel] = useState(1);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showSecretTrophyPopup, setShowSecretTrophyPopup] = useState(false);
  const [currentAchievementType, setCurrentAchievementType] = useState<string | null>(null);

  // Admin code detection (5839201746)
  const adminCode = ["5", "8", "3", "9", "2", "0", "1", "7", "4", "6"];
  const [adminIndex, setAdminIndex] = useState(0);
  const [adminMode, setAdminMode] = useState(false);
  const [alwaysCorrect, setAlwaysCorrect] = useState(false);
  const [adminMinimized, setAdminMinimized] = useState(false);
  const [adminPosition, setAdminPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Konami code detection
  const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  const [konamiIndex, setKonamiIndex] = useState(0);

  // Pi digit code detection (type the digits of Pi: 3.1415926...)
  const piCode = ["3", ".", "1", "4", "1", "5", "9", "2", "6"];
  const [piIndex, setPiIndex] = useState(0);

  // Easter egg tracking
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [quickRecallStartTime, setQuickRecallStartTime] = useState<number | null>(null);
  const [careersPlayed, setCareersPlayed] = useState<Set<Career>>(new Set());
  const [hasWrongAnswer, setHasWrongAnswer] = useState(false);
  const [gameStartHour, setGameStartHour] = useState<number | null>(null);
  const [timeBasedTrophiesChecked, setTimeBasedTrophiesChecked] = useState(false);

  // Callback to track answer results for easter eggs
  const handleAnswerResult = useCallback((isCorrect: boolean, timeMs: number) => {
    if (isCorrect) {
      // Track consecutive correct for Lightning Reflex
      setConsecutiveCorrect(prev => prev + 1);
      
      // Check if answer was fast (< 10 seconds = 10000ms)
      if (timeMs < 10000) {
        // This will be checked when the game completes
      }
    } else {
      // Track wrong answers for Lucky Star and Marathon Runner
      setHasWrongAnswer(true);
      setConsecutiveCorrect(0);
    }
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    const key = event.key;
    
    // Admin code detection (5839201746)
    if (key === adminCode[adminIndex]) {
      const newAdminIndex = adminIndex + 1;
      if (newAdminIndex === adminCode.length) {
        // Admin code entered!
        setAdminMode(true);
        setAdminIndex(0);
        audioSystem.playSuccessSound();
      } else {
        setAdminIndex(newAdminIndex);
      }
    } else {
      // Reset if wrong key
      setAdminIndex(0);
    }
    
    if (key === konamiCode[konamiIndex]) {
      const newIndex = konamiIndex + 1;
      if (newIndex === konamiCode.length) {
        // Konami code entered! Award secret trophy
        const secretTrophy: Trophy = {
          career: "programmer", // Placeholder career
          difficulty: "hard", // Placeholder difficulty
          earnedAt: new Date(),
          isSecret: true,
          achievementType: "konami-master",
        };
        
        // Check if already unlocked
        const alreadyUnlocked = trophies.some((t) => t.isSecret);
        if (!alreadyUnlocked) {
          setTrophies([...trophies, secretTrophy]);
          saveTrophies([...trophies, secretTrophy]);
          setShowSecretTrophyPopup(true);
          setCurrentAchievementType("konami-master");
        }
        
        // Reset index
        setKonamiIndex(0);
      } else {
        setKonamiIndex(newIndex);
      }
    } else {
      // Reset if wrong key
      setKonamiIndex(0);
    }

    // Pi digit code detection (type 3.1415926...)
    if (key === piCode[piIndex]) {
      const newPiIndex = piIndex + 1;
      if (newPiIndex === piCode.length) {
        // Full Pi code entered! Award highest Pi trophy
        const piTrophy: Trophy = {
          career: "programmer",
          difficulty: "hard",
          earnedAt: new Date(),
          isSecret: true,
          achievementType: "pi-legend",
        };
        
        const alreadyHasLegend = trophies.some((t) => t.achievementType === "pi-legend");
        if (!alreadyHasLegend) {
          setTrophies([...trophies, piTrophy]);
          saveTrophies([...trophies, piTrophy]);
          setShowSecretTrophyPopup(true);
          setCurrentAchievementType("pi-legend");
        }
        
        setPiIndex(0);
      } else {
        // Check for intermediate achievements based on how many digits entered
        const digitsEntered = newPiIndex;
        let newAchievement: AchievementType | null = null;
        
        // Check current progress
        const alreadyHas = (type: string) => trophies.some((t) => t.achievementType === type);
        
        // Pi code has 9 characters: 3.1415926
        // Check thresholds for each Pi trophy
        if (digitsEntered >= 9 && !alreadyHas("pi-legend")) {
          newAchievement = "pi-legend";
        } else if (digitsEntered >= 7 && !alreadyHas("pi-genius")) {
          newAchievement = "pi-genius";
        } else if (digitsEntered >= 6 && !alreadyHas("pi-master")) {
          newAchievement = "pi-master";
        } else if (digitsEntered >= 5 && !alreadyHas("pi-explorer")) {
          newAchievement = "pi-explorer";
        } else if (digitsEntered >= 4 && !alreadyHas("pi-pioneer")) {
          newAchievement = "pi-pioneer";
        }
        
        if (newAchievement) {
            const trophy: Trophy = {
              career: "programmer",
              difficulty: "hard",
              earnedAt: new Date(),
              isSecret: true,
              achievementType: newAchievement,
            };
            setTrophies([...trophies, trophy]);
            saveTrophies([...trophies, trophy]);
            setShowSecretTrophyPopup(true);
            setCurrentAchievementType(newAchievement);
          }
        }
        
        setPiIndex(newPiIndex);
      // Reset if wrong key (but only if it's not a digit we might need)
      const validDigits = ["3", ".", "1", "4", "5", "9", "2", "6"];
      if (!validDigits.includes(key)) {
        setPiIndex(0);
      }
    }
  }, [konamiIndex, konamiCode, trophies, adminIndex, adminCode, piIndex, piCode]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleStart = (mode: GameMode) => {
    audioSystem.playClickSound();
    audioSystem.playTitleMusic();
    setGameMode(mode);
    setSelectedCertification(null);
    if (mode === "certification") {
      setGameState("certification-select");
    } else {
      setGameState("career-select");
    }
    
    // Set game start hour for Night Owl / Early Bird trophies
    const currentHour = new Date().getHours();
    setGameStartHour(currentHour);
    
    // Reset easter egg tracking
    setConsecutiveCorrect(0);
    setCareersPlayed(new Set());
    setHasWrongAnswer(false);
    setQuickRecallStartTime(null);
    
    // Check time-based trophies immediately if not already checked
    if (!timeBasedTrophiesChecked) {
      const hour = currentHour;
      const timeAchievements: AchievementType[] = [];
      
      if (hour >= 22) {
        timeAchievements.push("night-owl");
      }
      if (hour < 6) {
        timeAchievements.push("early-bird");
      }
      
      if (timeAchievements.length > 0) {
        const existingTrophies = loadTrophies();
        const newTimeTrophies = timeAchievements.map((achievement) => ({
          career: "programmer" as Career,
          difficulty: "hard" as Difficulty,
          earnedAt: new Date(),
          isSecret: true,
          achievementType: achievement,
        }));
        
        setTrophies([...existingTrophies, ...newTimeTrophies]);
        saveTrophies([...existingTrophies, ...newTimeTrophies]);
        setShowSecretTrophyPopup(true);
        setCurrentAchievementType(timeAchievements[0]);
        setTimeBasedTrophiesChecked(true);
      }
    }
    
    // Check date-based trophies (State Week: April 27-29, 2026 and Today Check-in)
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed
    const currentDay = now.getDate();
    
    // State Week trophy: April 27-29, 2026
    const isStateWeek = currentMonth === 4 && currentDay >= 27 && currentDay <= 29 && currentYear === 2026;
    
    // Today Check-in trophy: any day (today is April 17, 2026)
    const hasTodayCheckin = true;
    
    const existingTrophies = loadTrophies();
    const dateAchievements: AchievementType[] = [];
    
    if (isStateWeek) {
      const alreadyHasStateWeek = existingTrophies.some((t) => t.achievementType === "state-week");
      if (!alreadyHasStateWeek) {
        dateAchievements.push("state-week");
      }
    }
    
    if (hasTodayCheckin) {
      const alreadyHasTodayCheckin = existingTrophies.some((t) => t.achievementType === "today-checkin");
      if (!alreadyHasTodayCheckin) {
        dateAchievements.push("today-checkin");
      }
    }
    
    if (dateAchievements.length > 0) {
      const newDateTrophies = dateAchievements.map((achievement) => ({
        career: "programmer" as Career,
        difficulty: "hard" as Difficulty,
        earnedAt: new Date(),
        isSecret: true,
        achievementType: achievement,
      }));
      
      const allTrophies = [...existingTrophies, ...newDateTrophies];
      setTrophies(allTrophies);
      saveTrophies(allTrophies);
      setShowSecretTrophyPopup(true);
      setCurrentAchievementType(dateAchievements[0]);
    }
  };

  const handleCareerSelect = (career: Career) => {
    setSelectedCareer(career);
    
    // Track careers played for Jack of All Trades trophy
    setCareersPlayed(prev => {
      const newSet = new Set(prev);
      newSet.add(career);
      return newSet;
    });
    
    if (gameMode === "quick-recall") {
      // Start Quick Recall timer for Speed Demon trophy
      setQuickRecallStartTime(Date.now());
      setGameState("playing");
    } else if (gameMode === "certification") {
      setSelectedDifficulty("hard");
      setGameState("difficulty-select");
    } else {
      setGameState("difficulty-select");
    }
  };

  const handleLearnMore = (career: Career) => {
    setSelectedCareer(career);
    setSelectedDifficulty(null);
    setSelectedCertification(null);
    setGameState("career-info");
  };

  const handleCertificationSelect = (certType: CertificationType) => {
    setSelectedCertification(certType);
    // Map certification type to career for outcome screen
    const certToCareerMap: Record<CertificationType, Career> = {
      "aws-developer": "programmer",
      "rn-license": "nurse",
      "pe-license": "engineer",
      "teaching-license": "teacher",
      "servsafe": "chef",
      "are-exam": "architect",
      "bar-exam": "lawyer",
      "customer-service": "retail",
      "journeyman": "electrician",
    };
    setSelectedCareer(certToCareerMap[certType]);
    setGameState("playing");
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setGameState("playing");
  };

  const handleChallengeComplete = (success: boolean, finalScore: number, total: number, incorrect?: IncorrectAnswer[]) => {
    // Determine game modes first
    const isQuickRecallMode = gameMode === "quick-recall";
    const isCertificationMode = gameMode === "certification";
    
    setChallengeSuccess(success);
    setScore(finalScore);
    setTotalQuestions(total);
    if (incorrect) {
      setIncorrectAnswers(incorrect);
    }
    
    // Save game session for stats tracking
    if (selectedCareer && selectedDifficulty) {
      const newSession: GameSession = {
        id: Date.now().toString(),
        career: selectedCareer,
        difficulty: selectedDifficulty,
        gameMode: isQuickRecallMode ? "quick-recall" : isCertificationMode ? "certification" : "challenge",
        score: finalScore,
        total,
        success,
        timestamp: new Date(),
      };
      const updatedSessions = [...sessions, newSession];
      setSessions(updatedSessions);
      saveGameSessions(updatedSessions);
      
      // Calculate and award XP
      const baseXP = { easy: 10, medium: 20, hard: 30 };
      const xpFromDifficulty = success ? baseXP[selectedDifficulty] : Math.floor(baseXP[selectedDifficulty] / 2);
      
      let xpFromMode = 0;
      if (isQuickRecallMode) {
        const percentage = (finalScore / total) * 100;
        xpFromMode = percentage >= 80 ? 50 : percentage >= 60 ? 30 : 15;
      } else if (isCertificationMode) {
        const percentage = (finalScore / total) * 100;
        xpFromMode = percentage >= 80 ? 60 : percentage >= 60 ? 40 : 20;
      }
      
      const totalXP = xpFromDifficulty + xpFromMode;
      
      // Update streak and award XP bonus
      const today = getTodayDate();
      const { streak: oldStreak = 0, lastPlayedDate: oldDate, xp: oldXP, level: oldPlayerLevel } = playerProgress;
      let updatedStreak = oldStreak;
      
      // Check if this is a new day (different from last played)
      const isNewDay = oldDate !== today;
      if (isNewDay) {
        const lastDate = oldDate ? new Date(oldDate) : new Date(today);
        const currentDate = new Date(today);
        const dayDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutive day - increment streak
          updatedStreak = oldStreak + 1;
        } else if (dayDiff > 1) {
          // Gap in days - reset streak to 1
          updatedStreak = 1;
        }
      }
      
      // Streak XP bonus (5 XP per day, max 50)
      const streakXP = isNewDay ? Math.min(updatedStreak * 5, 50) : 0;
      const xpGain = totalXP + streakXP;
      
      if (xpGain > 0) {
        const newXP = oldXP + totalXP + streakXP;
        const levelBefore = calculateLevel(oldXP);
        const levelAfter = calculateLevel(newXP);
        
        setPlayerProgress({ 
          xp: newXP, 
          level: Math.max(oldPlayerLevel, levelAfter), 
          streak: updatedStreak, 
          lastPlayedDate: today 
        });
        savePlayerProgress({ 
          xp: newXP, 
          level: Math.max(oldPlayerLevel, levelAfter), 
          streak: updatedStreak, 
          lastPlayedDate: today 
        });
        
        if (levelAfter > levelBefore) {
          setOldLevel(levelBefore);
          setShowLevelUp(true);
        }
      }
    }
    
    // Play success or failure sound (only for challenge mode)
    if (!isQuickRecallMode && !isCertificationMode) {
      if (success) {
        audioSystem.playSuccessSound();
      } else {
        audioSystem.playFailureSound();
      }
    }
    
    // Calculate quick recall time
    let quickRecallTimeMs: number | null = null;
    if (isQuickRecallMode && quickRecallStartTime !== null) {
      quickRecallTimeMs = Date.now() - quickRecallStartTime;
    }
    
    // Check for easter egg achievements
    const passedWithWrong = success && hasWrongAnswer;
    const easterEggAchievements = checkEasterEggAchievements(
      trophies,
      isQuickRecallMode,
      finalScore,
      total,
      isCertificationMode ? "hard" : selectedDifficulty,
      consecutiveCorrect,
      quickRecallTimeMs,
      careersPlayed,
      hasWrongAnswer,
      passedWithWrong,
      gameStartHour
    );
    
    // Award trophy if successful
    if (success && selectedCareer) {
      let difficulty: Difficulty | undefined;
      
      if (isCertificationMode) {
        // Certification uses "hard" difficulty for the trophy
        difficulty = "hard";
      } else if (isQuickRecallMode) {
        // Quick Recall uses "hard" as the difficulty (mastery level)
        difficulty = "hard";
      } else {
        // Regular challenge mode uses selected difficulty
        difficulty = selectedDifficulty || undefined;
      }
      
      if (difficulty) {
        const newTrophy: Trophy = {
          career: selectedCareer,
          difficulty: difficulty,
          earnedAt: new Date(),
        };
        
        // Check for achievements after awarding the new trophy
        const allTrophies = [...trophies, newTrophy];
        const newAchievements = checkAchievements(allTrophies, isQuickRecallMode, isCertificationMode, finalScore, total);
        
        // Combine regular achievements with easter egg achievements
        const allNewAchievements = [...newAchievements, ...easterEggAchievements];
        
        if (allNewAchievements.length > 0) {
          // Add achievement trophies
          const achievementTrophies = allNewAchievements.map((achievement) => ({
            career: selectedCareer,
            difficulty: "hard" as Difficulty,
            earnedAt: new Date(),
            isSecret: true,
            achievementType: achievement,
          }));
          
          setTrophies([...allTrophies, ...achievementTrophies]);
          saveTrophies([...allTrophies, ...achievementTrophies]);
          
          // Show popup for achievements
          setShowSecretTrophyPopup(true);
          setCurrentAchievementType(allNewAchievements[0]);
        } else {
          setTrophies(allTrophies);
          saveTrophies(allTrophies);
        }
      }
    } else if (easterEggAchievements.length > 0) {
      // Even if not successful, check for easter egg achievements (like Lucky Star)
      const achievementTrophies = easterEggAchievements.map((achievement) => ({
        career: selectedCareer || "programmer",
        difficulty: "hard" as Difficulty,
        earnedAt: new Date(),
        isSecret: true,
        achievementType: achievement,
      }));
      
      setTrophies([...trophies, ...achievementTrophies]);
      saveTrophies([...trophies, ...achievementTrophies]);
      
      // Show popup for achievements
      setShowSecretTrophyPopup(true);
      setCurrentAchievementType(easterEggAchievements[0]);
    }
    
    setGameState("outcome");
  };

  const handlePlayAgain = () => {
    setGameState("playing");
  };

  const handleChangeDifficulty = () => {
    setSelectedDifficulty(null);
    setGameState("difficulty-select");
  };

  const handleNewCareer = () => {
    setSelectedCareer(null);
    setSelectedDifficulty(null);
    setSelectedCertification(null);
    setGameState("career-select");
  };

  const handleBackToSelection = () => {
    setSelectedCareer(null);
    setSelectedDifficulty(null);
    if (gameMode === "certification") {
      setSelectedCertification(null);
      setGameState("certification-select");
    } else {
      setGameState("career-select");
    }
  };

  const handleBackToCareerSelect = () => {
    setSelectedCareer(null);
    setGameState("career-select");
  };

  const handleExitToTitle = () => {
    audioSystem.stopBackgroundMusic();
    audioSystem.playTitleMusic();
    setSelectedCertification(null);
    setGameState("title");
  };

  const handleExitToDifficultySelect = () => {
    // Go back to difficulty selection screen
    setSelectedDifficulty(null);
    setGameState("difficulty-select");
  };

  const handleExitToCareerSelect = () => {
    // Go back to career selection screen
    setSelectedCareer(null);
    setGameState("career-select");
  };

  // Render Settings modal (always available)
  const handleSettingsChange = useCallback(() => {
    const existingTrophies = loadTrophies();
    const alreadyHasTechSavvy = existingTrophies.some((t) => t.achievementType === "tech-savvy");
    if (!alreadyHasTechSavvy) {
      const techSavvyTrophy: Trophy = {
        career: "programmer",
        difficulty: "hard",
        earnedAt: new Date(),
        isSecret: true,
        achievementType: "tech-savvy",
      };
      setTrophies([...existingTrophies, techSavvyTrophy]);
      saveTrophies([...existingTrophies, techSavvyTrophy]);
      setShowSecretTrophyPopup(true);
      setCurrentAchievementType("tech-savvy");
    }
  }, []);

  const settingsModal = <Settings isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} onSettingsChange={handleSettingsChange} />;

  // Admin panel functions
  const handleClearTrophies = () => {
    setTrophies([]);
    setSessions([]);
    saveTrophies([]);
    saveGameSessions([]);
    audioSystem.playSuccessSound();
  };

  const handleToggleAlwaysCorrect = () => {
    setAlwaysCorrect(!alwaysCorrect);
    audioSystem.playClickSound();
  };

  const handleAwardAllRegularTrophies = () => {
    const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician"];
    const allDifficulties: Difficulty[] = ["easy", "medium", "hard"];
    const regularTrophies: Trophy[] = [];
    allCareers.forEach((career) => {
      allDifficulties.forEach((difficulty) => {
        regularTrophies.push({
          career,
          difficulty,
          earnedAt: new Date(),
        });
      });
    });
    const existingKeys = new Set(
      trophies.filter((t) => !t.isSecret).map((t) => `${t.career}-${t.difficulty}`)
    );
    const newRegularTrophies = regularTrophies.filter(
      (t) => !existingKeys.has(`${t.career}-${t.difficulty}`)
    );
    if (newRegularTrophies.length > 0) {
      const updatedTrophies = [...trophies, ...newRegularTrophies];
      setTrophies(updatedTrophies);
      saveTrophies(updatedTrophies);
      audioSystem.playSuccessSound();
    }
  };

  const handleAwardAllSecretTrophies = () => {
    const allAchievements: AchievementType[] = [
      "career-master",
      "quick-recall-champion",
      "perfect-recall",
      "konami-master",
      "all-careers-master",
      "all-quick-recalls-master",
      "lightning-reflex",
      "marathon-runner",
      "speed-demon",
      "jack-of-all-trades",
      "lucky-star",
      "night-owl",
      "early-bird",
      "pi-pioneer",
      "pi-explorer",
      "pi-master",
      "pi-genius",
      "pi-legend",
      "state-week",
      "today-checkin",
      "phoenix",
      "keyboard-warrior",
      "explorer",
      "patience",
      "streak-master",
      "return-customer",
      "committed",
      "tech-savvy",
      "variety-pack",
      "second-chance",
      "certification-master",
      "all-certifications-master",
    ];
    const existingTypes = new Set(
      trophies
        .filter((t) => t.isSecret && t.achievementType)
        .map((t) => t.achievementType!)
    );
    const newAchievementTrophies = allAchievements
      .filter((a) => !existingTypes.has(a))
      .map((achievement) => ({
        career: "programmer" as Career,
        difficulty: "hard" as Difficulty,
        earnedAt: new Date(),
        isSecret: true,
        achievementType: achievement,
      }));
    if (newAchievementTrophies.length > 0) {
      const updatedTrophies = [...trophies, ...newAchievementTrophies];
      setTrophies(updatedTrophies);
      saveTrophies(updatedTrophies);
      audioSystem.playSuccessSound();
    }
  };

  const handleCloseAdmin = () => {
    setAdminMode(false);
  };

  const handleAdminMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - adminPosition.x,
      y: e.clientY - adminPosition.y
    });
  };

  const handleAdminMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setAdminPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleAdminMouseUp = () => {
    setIsDragging(false);
  };

  // Admin panel JSX
  const renderAdminPanel = () => {
    if (!adminMode) return null;
    
    return (
      <div 
        className="fixed z-50"
        style={{ 
          left: adminPosition.x, 
          top: adminPosition.y,
          transform: isDragging ? 'none' : 'none'
        }}
        onMouseMove={handleAdminMouseMove}
        onMouseUp={handleAdminMouseUp}
        onMouseLeave={handleAdminMouseUp}
      >
        {adminMinimized ? (
          // Minimized version - just a bar
          <div 
            className="bg-gradient-to-r from-purple-800 to-indigo-800 rounded-full px-4 py-2 cursor-move shadow-lg border border-purple-500 flex items-center gap-2"
            onMouseDown={handleAdminMouseDown}
          >
            <span className="text-white text-lg">🔧</span>
            <button
              onClick={() => setAdminMinimized(false)}
              className="text-white/70 hover:text-white text-sm"
            >
              ▲ Expand
            </button>
          </div>
        ) : (
          // Full version
          <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-sm w-full shadow-2xl border-2 border-purple-500">
            <div 
              className="flex justify-between items-center mb-6 cursor-move -mx-2 -mt-2 p-2 rounded-t-xl hover:bg-purple-800/30"
              onMouseDown={handleAdminMouseDown}
            >
              <h2 className="text-2xl font-bold text-white">🔧 Admin Panel</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setAdminMinimized(true)}
                  className="text-white/70 hover:text-white text-xl"
                  title="Minimize"
                >
                  ▼
                </button>
                <button
                  onClick={handleCloseAdmin}
                  className="text-white/70 hover:text-white text-xl"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleToggleAlwaysCorrect}
                className={`w-full py-3 px-4 rounded-xl font-bold transition-all transform hover:scale-105 ${
                  alwaysCorrect 
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/50" 
                    : "bg-gray-600 text-gray-300"
                }`}
              >
                {alwaysCorrect ? "✅ Always Correct: ON" : "⬜ Always Correct: OFF"}
              </button>
              
              <button
                onClick={handleClearTrophies}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                🗑️ Clear All Trophies
              </button>
              
              <button
                onClick={handleAwardAllRegularTrophies}
                className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                🏆 Award All Regular Trophies
              </button>
              
              <button
                onClick={handleAwardAllSecretTrophies}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                🔮 Award All Secret Trophies
              </button>
              
              <button
                onClick={handleClearTrophies}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                🗑️ Clear All Trophies
              </button>
              
              <div className="pt-4 border-t border-purple-700">
                <p className="text-purple-300 text-sm text-center">
                  Code: 5839201746
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render current game state
  if (showTutorial) {
    return (
      <HomeTutorial 
        onSkip={() => setShowTutorial(false)}
      />
    );
  }

  if (gameState === "title") {
    return (
      <>
        <TitleScreen 
          onStart={handleStart} 
          onOpenSettings={() => setSettingsOpen(true)} 
          onViewTrophies={() => setGameState("trophy")}
          onViewStats={() => setGameState("stats")}
          onOpenProfile={() => setGameState("profile")}
          level={playerProgress.level}
          xp={playerProgress.xp}
          streak={playerProgress.streak || 0}
          completedToday={playerProgress.lastPlayedDate === getTodayDate()}
          onAcceptDailyChallenge={(career, difficulty) => {
            setSelectedCareer(career);
            setSelectedDifficulty(difficulty);
            setGameState("playing");
          }}
        />
        {settingsModal}
        <SecretTrophyPopup
          show={showSecretTrophyPopup}
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }}
        />
        {adminMode && renderAdminPanel()}

      </>
    );
  }

  if (gameState === "certification-select") {
    return (
      <>
        <CertificationSelection
          onSelectCertification={handleCertificationSelect}
          onOpenSettings={() => setSettingsOpen(true)}
          onExit={() => {
            setGameMode("challenge");
            setGameState("title");
          }}
        />
        {settingsModal}
        <SecretTrophyPopup
          show={showSecretTrophyPopup}
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }}
        />
        {adminMode && renderAdminPanel()}
      </>
    );
  }

  if (gameState === "career-select") {
    return (
      <>
        <CareerSelection
          onSelectCareer={handleCareerSelect}
          onLearnMore={handleLearnMore}
          onOpenSettings={() => setSettingsOpen(true)}
          onExit={handleExitToTitle}
          gameMode={gameMode}
        />
        {settingsModal}
        <SecretTrophyPopup
          show={showSecretTrophyPopup}
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }}
        />
        {adminMode && renderAdminPanel()}
      </>
    );
  }

  if (gameState === "career-info" && selectedCareer && careerInfoByCareer[selectedCareer]) {
    return (
      <>
        <CareerInfoPage
          career={selectedCareer}
          onBack={handleBackToCareerSelect}
          onStartCareer={handleCareerSelect}
          onOpenSettings={() => setSettingsOpen(true)}
          onExit={handleExitToTitle}
        />
        {settingsModal}
        <SecretTrophyPopup
          show={showSecretTrophyPopup}
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }}
        />
        {adminMode && renderAdminPanel()}
      </>
    );
  }

  if (gameState === "difficulty-select") {
    if (!selectedCareer) {
      setGameState("career-select");
      return null;
    }

    const careerBackgrounds: Record<string, string> = {
      programmer: "/images/programmer-bg.jpg",
      nurse: "/images/nurse-bg.jpg",
      engineer: "/images/engineer-bg.jpg",
      teacher: "/images/teacher-bg.jpg",
      chef: "/images/chef-bg.jpg",
      architect: "/images/architect-bg.jpg",
      lawyer: "/images/lawyer-bg.jpg",
      retail: "/images/retail-bg.jpg",
      electrician: "/images/electrician-bg.jpg",
    };
    const backgroundImage = selectedCareer ? careerBackgrounds[selectedCareer] : undefined;
    
    const renderDifficultySelection = () => {
      switch (selectedCareer) {
        case 'programmer':
          return (
            <ProgrammerDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'nurse':
          return (
            <NurseDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'engineer':
          return (
            <EngineerDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'teacher':
          return (
            <TeacherDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'chef':
          return (
            <ChefDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'architect':
          return (
            <ArchitectDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'lawyer':
          return (
            <LawyerDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'retail':
          return (
            <RetailDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'electrician':
          return (
            <ElectricianDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        default:
          return null;
      }
    };
    
    return (
      <>
        {renderDifficultySelection()}
        {settingsModal}
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }} 
        />
      </>
    );
  }

  if (gameState === "playing" && selectedCertification) {
    return (
      <>
        <CertificationWorld
          certificationType={selectedCertification}
          onComplete={handleChallengeComplete}
          onExit={handleExitToTitle}
          onTutorialBack={() => setGameState("certification-select")}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        {settingsModal}
        <SecretTrophyPopup
          show={showSecretTrophyPopup}
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }}
        />
      </>
    );
  }

  if (gameState === "playing" && selectedCareer) {
    const isQuickRecall = gameMode === "quick-recall";
    
    // Determine which handler to use for tutorial back button based on game mode
    const tutorialBackHandler = isQuickRecall ? handleExitToCareerSelect : handleExitToDifficultySelect;
    
    // Get background image for the selected career
    const careerBackgrounds: Record<string, string> = {
      programmer: "/images/programmer-bg.jpg",
      nurse: "/images/nurse-bg.jpg",
      engineer: "/images/engineer-bg.jpg",
      teacher: "/images/teacher-bg.jpg",
      chef: "/images/chef-bg.jpg",
      architect: "/images/architect-bg.jpg",
      lawyer: "/images/lawyer-bg.jpg",
      retail: "/images/retail-bg.jpg",
      electrician: "/images/electrician-bg.jpg",
    };
    const backgroundImage = selectedCareer ? careerBackgrounds[selectedCareer] : undefined;
    
    return (
      <ScreenWrapper
        onOpenSettings={() => setSettingsOpen(true)}
        onExit={handleExitToTitle}
        showExitWarning={true}
        dark={true}
        fullScreen={true}
        backgroundImage={backgroundImage}
      >
        {selectedCareer === "programmer" && (
          <ProgrammerWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {selectedCareer === "nurse" && (
          <NurseWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {selectedCareer === "engineer" && (
          <EngineerWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {selectedCareer === "teacher" && (
          <TeacherWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {selectedCareer === "chef" && (
          <ChefWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {selectedCareer === "architect" && (
          <ArchitectWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {selectedCareer === "lawyer" && (
          <LawyerWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {selectedCareer === "retail" && (
          <RetailWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {selectedCareer === "electrician" && (
          <ElectricianWorld
            difficulty={selectedDifficulty ?? "easy"}
            onComplete={handleChallengeComplete}
            isQuickRecall={isQuickRecall}
            isCertification={gameMode === "certification"}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onTutorialBack={tutorialBackHandler}
            onAnswerResult={handleAnswerResult}
          />
        )}
        {settingsModal}
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }} 
        />
      </ScreenWrapper>
    );
  }

  if (gameState === "trophy") {
    return (
      <>
        <TrophyScreen 
          trophies={trophies} 
          onBack={() => setGameState("title")} 
        />
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }} 
        />
      </>
    );
  }

  if (gameState === "stats") {
    return (
      <>
        <StatsScreen 
          trophies={trophies}
          sessions={sessions}
          level={playerProgress.level}
          xp={playerProgress.xp}
          streak={playerProgress.streak || 0}
          onBack={() => setGameState("title")} 
        />
        <LevelUpPopup
          show={showLevelUp}
          oldLevel={oldLevel}
          newLevel={playerProgress.level}
          onClose={() => setShowLevelUp(false)}
        />
      </>
    );
  }

  if (gameState === "profile") {
    return (
      <ProfileScreen
        trophies={trophies}
        level={playerProgress.level}
        xp={playerProgress.xp}
        onBack={() => setGameState("title")}
      />
    );
  }

if (gameState === "outcome" && selectedCareer) {
    return (
      <>
        <OutcomeScreen
          career={selectedCareer}
          difficulty={selectedDifficulty ?? "easy"}
          success={challengeSuccess}
          score={score}
          total={totalQuestions}
          onPlayAgain={handlePlayAgain}
          onNewCareer={handleNewCareer}
          onChangeDifficulty={handleChangeDifficulty}
          onOpenSettings={() => setSettingsOpen(true)}
          onExit={handleExitToTitle}
          isQuickRecall={gameMode === "quick-recall"}
          isCertification={gameMode === "certification"}
          onBackToSelection={handleBackToSelection}
          incorrectAnswers={incorrectAnswers}
        />
        {settingsModal}
        <SecretTrophyPopup 
          show={showSecretTrophyPopup} 
          achievementType={currentAchievementType}
          onClose={() => {
            setShowSecretTrophyPopup(false);
            setCurrentAchievementType(null);
          }} 
        />
        <LevelUpPopup
          show={showLevelUp}
          oldLevel={oldLevel}
          newLevel={playerProgress.level}
          onClose={() => setShowLevelUp(false)}
        />
      </>
    );
  }
}
