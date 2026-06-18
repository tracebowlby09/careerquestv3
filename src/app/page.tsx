"use client";

import { useState, useEffect, useCallback } from "react";
import TitleScreen from "@/components/TitleScreen";
import CustomTestWorld from "@/components/careers/CustomTestWorld";
import { GradientCard, GameButton } from "@/components/ui/UIComponents";
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
import FirefighterDifficulty from "@/components/difficulty/FirefighterDifficulty";
import PoliceDifficulty from "@/components/difficulty/PoliceDifficulty";
import PilotDifficulty from "@/components/difficulty/PilotDifficulty";
import VeterinarianDifficulty from "@/components/difficulty/VeterinarianDifficulty";
import JournalistDifficulty from "@/components/difficulty/JournalistDifficulty";
import SocialWorkerDifficulty from "@/components/difficulty/SocialWorkerDifficulty";
import AccountantDifficulty from "@/components/difficulty/AccountantDifficulty";
import DentistDifficulty from "@/components/difficulty/DentistDifficulty";
import ConstructionDifficulty from "@/components/difficulty/ConstructionDifficulty";
import ProgrammerWorld from "@/components/careers/ProgrammerWorld";
import NurseWorld from "@/components/careers/NurseWorld";
import EngineerWorld from "@/components/careers/EngineerWorld";
import TeacherWorld from "@/components/careers/TeacherWorld";
import ChefWorld from "@/components/careers/ChefWorld";
import ArchitectWorld from "@/components/careers/ArchitectWorld";
import LawyerWorld from "@/components/careers/LawyerWorld";
import RetailWorld from "@/components/careers/RetailWorld";
import ElectricianWorld from "@/components/careers/ElectricianWorld";
import FirefighterWorld from "@/components/careers/FirefighterWorld";
import PoliceWorld from "@/components/careers/PoliceWorld";
import PilotWorld from "@/components/careers/PilotWorld";
import VeterinarianWorld from "@/components/careers/VeterinarianWorld";
import JournalistWorld from "@/components/careers/JournalistWorld";
import SocialWorkerWorld from "@/components/careers/SocialWorkerWorld";
import AccountantWorld from "@/components/careers/AccountantWorld";
import DentistWorld from "@/components/careers/DentistWorld";
import ConstructionWorld from "@/components/careers/ConstructionWorld";
import OutcomeScreen from "@/components/OutcomeScreen";
import Settings from "@/components/Settings";
import TrophyScreen from "@/components/TrophyScreen";
import StatsScreen from "@/components/StatsScreen";
import LevelUpPopup from "@/components/LevelUpPopup";
import ProfileScreen from "@/components/ProfileScreen";
import HomeTutorial from "@/components/HomeTutorial";
import SecretTrophyPopup from "@/components/SecretTrophyPopup";
import CareerInfoPage from "@/components/CareerInfoPage";
import AuthScreen from "@/components/AuthScreen";
import ModeratorDashboard from "@/components/ModeratorDashboard";
import CustomTestCreate from "@/components/CustomTestCreate";
import CustomTestOutcome from "@/components/CustomTestOutcome";
import { Career, Difficulty, GameMode, CertificationType, Trophy, AchievementType, IncorrectAnswer, UserAccount, CustomTest, CustomQuestion, StoryProgress } from "@/types/game";
import { careerInfoByCareer } from "@/lib/careerInfo";
import { getTodayDate, calculateLevel, calculateXPForNextLevel, getStreakXPBonus, getDailyChallenge } from "@/types/game";
import { audioSystem } from "@/lib/audio";
import ScreenWrapper from "@/components/ScreenWrapper";
import StoryModeSelection from "@/components/StoryModeSelection";
import StoryOutcomeScreen from "@/components/StoryOutcomeScreen";
import StoryCompleteScreen from "@/components/StoryCompleteScreen";
import { storyJourneyByCareer, storyJourneyOrder, getStoryMilestone, updateStoryProgress } from "@/lib/storyMode";

type GameState = "title" | "tutorial" | "story-select" | "story-outcome" | "story-complete" | "career-select" | "certification-select" | "difficulty-select" | "playing" | "outcome" | "custom-outcome" | "trophy" | "stats" | "career-info" | "profile" | "auth" | "custom-create" | "custom-play" | "moderator";
type ResizeAnchor = "top-left" | "top-right" | "bottom-left" | "bottom-right";

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
  firefighter: "Firefighter",
  police: "Police Officer",
  pilot: "Commercial Pilot",
  veterinarian: "Veterinarian",
  journalist: "Journalist",
  "social-worker": "Social Worker",
  accountant: "Accountant",
dentist: "Dentist",
  construction: "Construction Manager",
};

// Simple user management (local-only, no server)
const USERS_KEY = "careerQuestUsers";

const getAllUsers = (): UserAccount[] => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveAllUsers = (users: UserAccount[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const findUser = (username: string) => {
  const normalized = username.toLowerCase().trim();
  return getAllUsers().find((u) => u.username.toLowerCase() === normalized) || null;
};

const createUser = (username: string, password: string) => {
  const normalized = username.toLowerCase().trim();
  if (!normalized || normalized.length < 3) return { success: false, reason: "Username must be at least 3 characters" as const };
  if (!password || password.length < 4) return { success: false, reason: "Password must be at least 4 characters" as const };
  const users = getAllUsers();
  if (users.some((u) => u.username.toLowerCase() === normalized)) return { success: false, reason: "Username already taken" as const };
  const newUser: UserAccount = { id: Date.now().toString(), username: normalized, password, createdAt: new Date().toISOString() };
  saveAllUsers([...users, newUser]);
  return { success: true, user: newUser };
};

const authenticateUser = (username: string, password: string) => {
  const user = findUser(username);
  if (!user) return { success: false, reason: "Account not found" as const };
  if (user.password !== password) return { success: false, reason: "Incorrect password" as const };
  return { success: true, user };
};

const getCurrentUserKey = (username: string) => `careerQuestUser_${username}`;

const deleteUserAccount = (username: string) => {
  const users = getAllUsers().filter((u) => u.username.toLowerCase() !== username.toLowerCase().trim());
  saveAllUsers(users);
  if (typeof window !== "undefined") {
    localStorage.removeItem(getCurrentUserKey(username));
  }
};

const getProgressForUser = (username: string) => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(getCurrentUserKey(username));
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const saveProgressForUser = (username: string, progress: PlayerProgress & { trophies?: Trophy[]; sessions?: GameSession[] }) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(getCurrentUserKey(username), JSON.stringify(progress));
};

const loadProgressForUser = (username: string) => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(getCurrentUserKey(username));
  if (!raw) {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      lastPlayedDate: undefined,
      trophies: [] as Trophy[],
      sessions: [] as GameSession[],
    };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      xp: parsed.xp ?? 0,
      level: parsed.level ?? 1,
      streak: parsed.streak ?? 0,
      lastPlayedDate: parsed.lastPlayedDate,
      trophies: (parsed.trophies ?? []).map((t: any) => ({
        ...t,
        earnedAt: new Date(t.earnedAt),
      })),
      sessions: (parsed.sessions ?? []).map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp),
      })),
    };
  } catch {
    return {
      xp: 0,
      level: 1,
      streak: 0,
      lastPlayedDate: undefined,
      trophies: [] as Trophy[],
      sessions: [] as GameSession[],
    };
  }
};

// Guest warning helper
const GUEST_WARNING_KEY = "careerQuestGuestWarningDismissed";
const hasDismissedGuestWarning = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_WARNING_KEY) === "true";
};
const dismissGuestWarning = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(GUEST_WARNING_KEY, "true");
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
  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician", "firefighter", "police", "pilot", "veterinarian", "journalist", "social-worker", "accountant", "dentist", "construction"];
  const allDifficulties: Difficulty[] = ["easy", "medium", "hard"];
  
  // Check for Career Master - all 3 difficulties for any career
  for (const career of allCareers) {
    const careerTrophies = allTrophies.filter(
      (t) => t.career === career && !t.achievementType
    );
    const earnedDifficulties = new Set(careerTrophies.map((t: Trophy) => t.difficulty));
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
    const earnedDifficulties = new Set(careerTrophies.map((t: Trophy) => t.difficulty));
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
  const quickRecallCareers = new Set(quickRecallTrophies.map((t: Trophy) => t.career));
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
  const certCareers = new Set(certTrophies.map((t: Trophy) => t.career));
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
  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician", "firefighter", "police", "pilot", "veterinarian", "journalist", "social-worker", "accountant", "dentist", "construction"];

  // Lightning Reflex - 5 correct answers in a row
  if (currentConsecutiveCorrect >= 5) {
    const alreadyHas = allTrophies.some((t: Trophy) => t.achievementType === "lightning-reflex");
    if (!alreadyHas) {
      achievements.push("lightning-reflex");
    }
  }

  // Marathon Runner - Complete challenge mode with no wrong answers
  if (!isQuickRecallMode && !hadWrongAnswer && score === total && total > 0) {
    const alreadyHas = allTrophies.some((t: Trophy) => t.achievementType === "marathon-runner");
    if (!alreadyHas) {
      achievements.push("marathon-runner");
    }
  }

  // Speed Demon - Quick Recall perfect score under 30 seconds (30000ms)
  if (isQuickRecallMode && score === total && total > 0 && quickRecallTimeMs !== null && quickRecallTimeMs < 30000) {
    const alreadyHas = allTrophies.some((t: Trophy) => t.achievementType === "speed-demon");
    if (!alreadyHas) {
      achievements.push("speed-demon");
    }
  }

  // Jack of All Trades - Play at least one question from each career
  if (careersPlayedSet.size === allCareers.length) {
    const alreadyHas = allTrophies.some((t: Trophy) => t.achievementType === "jack-of-all-trades");
    if (!alreadyHas) {
      achievements.push("jack-of-all-trades");
    }
  }

  // Lucky Star - Got a question wrong but still passed on Hard mode
  if (passedWithWrong && difficulty === "hard") {
    const alreadyHas = allTrophies.some((t: Trophy) => t.achievementType === "lucky-star");
    if (!alreadyHas) {
      achievements.push("lucky-star");
    }
  }

  // Night Owl - Play after 10 PM (hour >= 22)
  if (gameStartHourValue !== null && gameStartHourValue >= 22) {
    const alreadyHas = allTrophies.some((t: Trophy) => t.achievementType === "night-owl");
    if (!alreadyHas) {
      achievements.push("night-owl");
    }
  }

  // Early Bird - Play before 6 AM (hour < 6)
  if (gameStartHourValue !== null && gameStartHourValue < 6) {
    const alreadyHas = allTrophies.some((t: Trophy) => t.achievementType === "early-bird");
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
  const [pendingStartMode, setPendingStartMode] = useState<GameMode | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedCertification, setSelectedCertification] = useState<CertificationType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [storyModeActive, setStoryModeActive] = useState(false);
  const [pendingStoryMode, setPendingStoryMode] = useState(false);
  const [storyStep, setStoryStep] = useState(0);
  const [storyProgress, setStoryProgress] = useState<StoryProgress>({ completedMilestones: [], completedJourneys: [] });
  const [storyLastResult, setStoryLastResult] = useState<{ success: boolean; score: number; total: number } | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [challengeSuccess, setChallengeSuccess] = useState(false);
  const [incorrectAnswers, setIncorrectAnswers] = useState<IncorrectAnswer[]>([]);
  const [trophies, setTrophies] = useState<Trophy[]>([]);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({ xp: 0, level: 1, streak: 0 });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [oldLevel, setOldLevel] = useState(1);
  const [xpGainedLastChallenge, setXpGainedLastChallenge] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showSecretTrophyPopup, setShowSecretTrophyPopup] = useState(false);
  const [currentAchievementType, setCurrentAchievementType] = useState<string | null>(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [showGuestWarning, setShowGuestWarning] = useState(false);

  const loadStoryProgressForUser = useCallback((username: string | null) => {
    if (typeof window === "undefined") return { completedMilestones: [] as string[], completedJourneys: [] as Career[] };
    const key = username ? `careerQuestStoryProgress_${username}` : "careerQuestStoryProgress";
    const saved = localStorage.getItem(key);
    if (!saved) return { completedMilestones: [] as string[], completedJourneys: [] as Career[] };
    try {
      const parsed = JSON.parse(saved);
      return {
        completedMilestones: Array.isArray(parsed.completedMilestones) ? parsed.completedMilestones : [],
        completedJourneys: Array.isArray(parsed.completedJourneys) ? parsed.completedJourneys.filter((career: Career) => storyJourneyOrder.includes(career)) : [],
      };
    } catch {
      return { completedMilestones: [] as string[], completedJourneys: [] as Career[] };
    }
  }, []);

  const saveStoryProgressForUser = useCallback((username: string | null, progress: StoryProgress) => {
    if (typeof window === "undefined") return;
    const key = username ? `careerQuestStoryProgress_${username}` : "careerQuestStoryProgress";
    localStorage.setItem(key, JSON.stringify(progress));
  }, []);

  // Load user data on mount or when currentUser changes
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("careerQuestCurrentUser") : null;
    setCurrentUser(storedUser);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (currentUser) {
      const userProgress = loadProgressForUser(currentUser);
      if (userProgress) {
        setPlayerProgress({ xp: userProgress.xp, level: userProgress.level, streak: userProgress.streak });
        setTrophies(userProgress.trophies);
        setSessions(userProgress.sessions);
        setStoryProgress(loadStoryProgressForUser(currentUser));
      } else {
        setPlayerProgress({ xp: 0, level: 1, streak: 0 });
        setTrophies([]);
        setSessions([]);
        setStoryProgress(loadStoryProgressForUser(currentUser));
      }
    } else {
      // Guest mode - load from default localStorage keys (existing non-user progress)
      setPlayerProgress(loadPlayerProgress());
      setTrophies(loadTrophies());
      setSessions(loadGameSessions());
      setStoryProgress(loadStoryProgressForUser(null));
    }
  }, [currentUser, isMounted, loadStoryProgressForUser]);

  // Load/save functions that use currentUser state
  const loadTrophiesForUser = useCallback(() => {
    if (typeof window === "undefined") return [];
    const key = currentUser ? `careerQuestTrophies_${currentUser}` : "careerQuestTrophies";
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const trophies = JSON.parse(saved);
        return trophies.map((t: any) => ({
          ...t,
          earnedAt: new Date(t.earnedAt),
        }));
      } catch {
        return [];
      }
    }
    return [];
  }, [currentUser]);

  const loadGameSessionsForUser = useCallback(() => {
    if (typeof window === "undefined") return [];
    const key = currentUser ? `careerQuestSessions_${currentUser}` : "careerQuestSessions";
    const saved = localStorage.getItem(key);
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
  }, [currentUser]);

  const loadPlayerProgressForUserState = useCallback(() => {
    if (typeof window === "undefined") return { xp: 0, level: 1, streak: 0 };
    const key = currentUser ? `careerQuestProgress_${currentUser}` : "careerQuestProgress";
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { xp: 0, level: 1, streak: 0 };
      }
    }
    return { xp: 0, level: 1, streak: 0 };
  }, [currentUser]);

  const saveTrophiesForUser = useCallback((trophies: Trophy[]) => {
    if (typeof window === "undefined") return;
    const key = currentUser ? `careerQuestTrophies_${currentUser}` : "careerQuestTrophies";
    localStorage.setItem(key, JSON.stringify(trophies));
  }, [currentUser]);

  const saveGameSessionsForUser = useCallback((sessions: GameSession[]) => {
    if (typeof window === "undefined") return;
    const key = currentUser ? `careerQuestSessions_${currentUser}` : "careerQuestSessions";
    localStorage.setItem(key, JSON.stringify(sessions));
  }, [currentUser]);

  const savePlayerProgressForUserState = useCallback((progress: PlayerProgress) => {
    if (typeof window === "undefined") return;
    const key = currentUser ? `careerQuestProgress_${currentUser}` : "careerQuestProgress";
    localStorage.setItem(key, JSON.stringify(progress));
  }, [currentUser]);

  // Helper functions that use currentUser state (for backward compatibility in existing code)
  const loadTrophies = loadTrophiesForUser;
  const loadGameSessions = loadGameSessionsForUser;
  const loadPlayerProgress = loadPlayerProgressForUserState;
  const saveTrophies = saveTrophiesForUser;
  const saveGameSessions = saveGameSessionsForUser;
  const savePlayerProgress = savePlayerProgressForUserState;

  // Custom test state
  const [customTestCode, setCustomTestCode] = useState<string | null>(null);
  const [activeCustomTest, setActiveCustomTest] = useState<CustomTest | null>(null);
  const [customTestPreview, setCustomTestPreview] = useState<CustomTest | null>(null);
  const [customTestResult, setCustomTestResult] = useState<{ success: boolean; score: number; total: number } | null>(null);
  const [editingCustomTest, setEditingCustomTest] = useState<CustomTest | null>(null);
  const [customTestWasEdited, setCustomTestWasEdited] = useState(false);

  // Custom test handlers
  const handleCustomTestCreate = (test: CustomTest, code: string) => {
    const wasEdited = Boolean(editingCustomTest?.approved);
    setEditingCustomTest(null);
    setCustomTestWasEdited(wasEdited);
    setCustomTestCode(code);
    setActiveCustomTest(test);
    setCustomTestResult(null);
    setGameState("custom-play");
  };

  const handlePreviewCustomTest = (code: string) => {
    setCustomTestPreview(loadCustomTestByCode(code.trim().toUpperCase()));
  };

  const handleCustomTestComplete = (success: boolean, finalScore: number, total: number) => {
    setCustomTestResult({ success, score: finalScore, total });
    setGameState("custom-outcome");
  };

  const handleCustomTestPlayAgain = () => {
    setCustomTestResult(null);
    setGameState("playing");
  };

  const loadCustomTestByCode = (code: string): CustomTest | null => {
    const normalizedCode = code.trim().toUpperCase();
    if (typeof window === "undefined") return null;
    const pendingKey = `customTestPending_${normalizedCode}`;
    const approvedKey = `customTest_${normalizedCode}`;
    const raw = localStorage.getItem(pendingKey) || localStorage.getItem(approvedKey);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
    return null;
  };

  const getApprovedCustomTests = (): CustomTest[] => {
    if (typeof window === "undefined") return [];
    const tests: CustomTest[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("customTest_")) continue;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const test: CustomTest = JSON.parse(raw);
        if (test.approved) tests.push(test);
      } catch {}
    }
    return tests.sort((a, b) => (b.approvedAt || "").localeCompare(a.approvedAt || ""));
  };

  const handlePlayCustomTest = (code: string) => {
    const test = loadCustomTestByCode(code);
    if (test) {
      setActiveCustomTest(test);
      setCustomTestCode(code);
      setCustomTestPreview(test);
      setCustomTestResult(null);
      setGameMode(test.mode);
      setSelectedCareer("programmer");
      setSelectedDifficulty(test.mode === "challenge" ? test.difficulty || "medium" : null);
      setGameState("playing");
    }
  };

  const handleEditApprovedCustomTest = (test: CustomTest) => {
    setEditingCustomTest(test);
    setCustomTestPreview(null);
    setCustomTestWasEdited(false);
    setGameState("custom-create");
  };

  // Admin code detection (5839201746)
  const adminCode = ["5", "8", "3", "9", "2", "0", "1", "7", "4", "6"];
  const [adminIndex, setAdminIndex] = useState(0);
  const [adminMode, setAdminMode] = useState(false);
  const [alwaysCorrect, setAlwaysCorrect] = useState(false);
  const [adminMinimized, setAdminMinimized] = useState(false);
  const [adminPosition, setAdminPosition] = useState({ x: 20, y: 20 });
  const [adminSize, setAdminSize] = useState({ width: 420, height: 680 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeAnchor, setResizeAnchor] = useState<ResizeAnchor | null>(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
  const [resizeStartPosition, setResizeStartPosition] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 420, height: 680 });
  const [adminCustomCode, setAdminCustomCode] = useState("");
  const [adminTrophyAchievement, setAdminTrophyAchievement] = useState<AchievementType | "">("");
  const [adminTrophyCareer, setAdminTrophyCareer] = useState<Career>("programmer");
  const [adminTrophyDifficulty, setAdminTrophyDifficulty] = useState<Difficulty>("hard");

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
        const alreadyUnlocked = trophies.some((t: Trophy) => t.isSecret);
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
        
        const alreadyHasLegend = trophies.some((t: Trophy) => t.achievementType === "pi-legend");
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
        const alreadyHas = (type: string) => trophies.some((t: Trophy) => t.achievementType === type);
        
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
    // Auth check - redirect to auth screen if needed
    if (!currentUser && !hasDismissedGuestWarning()) {
      setPendingStartMode(mode);
      setGameState("auth");
      return;
    }
    
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
      const alreadyHasStateWeek = existingTrophies.some((t: Trophy) => t.achievementType === "state-week");
      if (!alreadyHasStateWeek) {
        dateAchievements.push("state-week");
      }
    }
    
    if (hasTodayCheckin) {
      const alreadyHasTodayCheckin = existingTrophies.some((t: Trophy) => t.achievementType === "today-checkin");
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

  const handleOpenStoryMode = () => {
    if (!currentUser && !hasDismissedGuestWarning()) {
      setPendingStoryMode(true);
      setGameState("auth");
      return;
    }

    audioSystem.playClickSound();
    audioSystem.playTitleMusic();
    setSelectedCertification(null);
    setStoryModeActive(true);
    setStoryStep(0);
    setStoryLastResult(null);
    setGameState("story-select");
  };

  const handleStartStoryJourney = (career: Career) => {
    const journey = storyJourneyByCareer[career];
    const firstMilestone = journey.milestones[0];
    if (!firstMilestone) return;

    audioSystem.playClickSound();
    audioSystem.playTitleMusic();
    setSelectedCareer(career);
    setSelectedDifficulty(firstMilestone.difficulty);
    setSelectedCertification(null);
    setGameMode("challenge");
    setStoryModeActive(true);
    setStoryStep(0);
    setStoryLastResult(null);
    setGameState("playing");

    const currentHour = new Date().getHours();
    setGameStartHour(currentHour);
    setConsecutiveCorrect(0);
    setCareersPlayed(new Set([career]));
    setHasWrongAnswer(false);
    setQuickRecallStartTime(null);
  };

  const handleStoryNext = () => {
    if (!selectedCareer) return;

    if (!storyLastResult?.success) {
      setStoryLastResult(null);
      setGameState("playing");
      return;
    }

    const journey = storyJourneyByCareer[selectedCareer];
    const nextStep = storyStep + 1;

    if (nextStep >= journey.milestones.length) {
      setGameState("story-complete");
      return;
    }

    const nextMilestone = getStoryMilestone(selectedCareer, nextStep);
    if (!nextMilestone) return;

    setStoryStep(nextStep);
    setSelectedDifficulty(nextMilestone.difficulty);
    setStoryLastResult(null);
    setGameState("playing");
  };

  const handleStoryBackToSelection = () => {
    setStoryLastResult(null);
    setGameState("story-select");
  };

  const handleStoryReplayMilestone = () => {
    setStoryLastResult(null);
    setGameState("playing");
  };

  const handleStoryReplayJourney = () => {
    setStoryStep(0);
    setStoryLastResult(null);
    if (selectedCareer) {
      const journey = storyJourneyByCareer[selectedCareer];
      const firstMilestone = journey.milestones[0];
      if (firstMilestone) {
        setSelectedDifficulty(firstMilestone.difficulty);
      }
    }
    setGameState("playing");
  };

  const handleCareerSelect = (career: Career) => {
    if (storyModeActive) {
      handleStartStoryJourney(career);
      return;
    }

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
      "firefighter-cert": "firefighter",
      "police-academy": "police",
      "cpl-license": "pilot",
      "vet-tech": "veterinarian",
      "journalism-award": "journalist",
      "lcsw": "social-worker",
      "cpa": "accountant",
      "dental-board": "dentist",
      "osha-30": "construction",
    };
    setSelectedCareer(certToCareerMap[certType]);
    setGameState("playing");
  };

  const handleDifficultySelect = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setGameState("playing");
  };

  // Auth handlers
  const handleLogin = (username: string, password: string) => {
    const result = authenticateUser(username, password);
    if (result.success && result.user) {
      setCurrentUser(result.user.username);
      localStorage.setItem("careerQuestCurrentUser", result.user.username);
      // Load this user's progress (or defaults if none)
      const userProgress = loadProgressForUser(result.user.username);
      setPlayerProgress({ 
        xp: userProgress?.xp ?? 0, 
        level: userProgress?.level ?? 1, 
        streak: userProgress?.streak ?? 0 
      });
      setTrophies(userProgress?.trophies ?? []);
      setSessions(userProgress?.sessions ?? []);
      setStoryProgress(loadStoryProgressForUser(result.user.username));
      // Continue with pending mode if any
      if (pendingStoryMode) {
        setPendingStoryMode(false);
        setStoryModeActive(true);
        setGameState("story-select");
      } else if (pendingStartMode) {
        setGameMode(pendingStartMode);
        setGameState("career-select");
        setPendingStartMode(null);
      } else {
        setGameState("title");
      }
    }
    return result;
  };

  const handleSignup = (username: string, password: string) => {
    const result = createUser(username, password);
    if (result.success && result.user) {
      setCurrentUser(result.user.username);
      localStorage.setItem("careerQuestCurrentUser", result.user.username);
      // Initialize empty progress for new user
      saveProgressForUser(result.user.username, { xp: 0, level: 1, streak: 0, trophies: [], sessions: [] });
      saveStoryProgressForUser(result.user.username, { completedMilestones: [], completedJourneys: [] });
      setStoryProgress({ completedMilestones: [], completedJourneys: [] });
      // Continue with pending mode if any
      if (pendingStoryMode) {
        setPendingStoryMode(false);
        setStoryModeActive(true);
        setGameState("story-select");
      } else if (pendingStartMode) {
        setGameMode(pendingStartMode);
        setGameState("career-select");
        setPendingStartMode(null);
      } else {
        setGameState("title");
      }
    }
    return result;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("careerQuestCurrentUser");
    // Reset to default progress
    setPlayerProgress({ xp: 0, level: 1, streak: 0 });
    setTrophies([]);
    setSessions([]);
    setStoryProgress({ completedMilestones: [], completedJourneys: [] });
    setStoryModeActive(false);
    setPendingStoryMode(false);
  };

  const continueAsGuest = () => {
    dismissGuestWarning();
    if (pendingStoryMode) {
      setPendingStoryMode(false);
      setStoryModeActive(true);
      setGameState("story-select");
    } else if (pendingStartMode) {
      setGameMode(pendingStartMode);
      setGameState("career-select");
      setPendingStartMode(null);
    }
    // If no pending mode, user was dismissed in profile, stay on title
  };

  const handleChallengeComplete = (success: boolean, finalScore: number, total: number, incorrect?: IncorrectAnswer[]) => {
    // Determine game modes first
    const isStoryMode = storyModeActive;
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

        setXpGainedLastChallenge(xpGain);

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

    if (isStoryMode && selectedCareer) {
      const nextStoryProgress = updateStoryProgress(storyProgress, selectedCareer, storyStep, success);
      setStoryProgress(nextStoryProgress);
      saveStoryProgressForUser(currentUser, nextStoryProgress);
      setStoryLastResult({ success, score: finalScore, total });
      setGameState("story-outcome");
      return;
    }

    setGameState("outcome");
  };

  const handlePlayAgain = () => {
    setStoryLastResult(null);
    setGameState("playing");
  };

  const handleChangeDifficulty = () => {
    setSelectedDifficulty(null);
    setGameState(storyModeActive ? "story-select" : "difficulty-select");
  };

  const handleNewCareer = () => {
    setSelectedCareer(null);
    setSelectedDifficulty(null);
    setSelectedCertification(null);
    setGameState(storyModeActive ? "story-select" : "career-select");
  };

  const handleBackToSelection = () => {
    setSelectedCareer(null);
    setSelectedDifficulty(null);
    if (storyModeActive) {
      setGameState("story-select");
      return;
    }
    if (gameMode === "certification") {
      setSelectedCertification(null);
      setGameState("certification-select");
    } else {
      setGameState("career-select");
    }
  };

  const handleBackToCareerSelect = () => {
    setSelectedCareer(null);
    setGameState(storyModeActive ? "story-select" : "career-select");
  };

  const handleExitToTitle = () => {
    audioSystem.stopBackgroundMusic();
    audioSystem.playTitleMusic();
    setSelectedCertification(null);
    setActiveCustomTest(null);
    setCustomTestCode(null);
    setCustomTestResult(null);
    setCustomTestPreview(null);
    setEditingCustomTest(null);
    setCustomTestWasEdited(false);
    setStoryModeActive(false);
    setPendingStoryMode(false);
    setStoryStep(0);
    setStoryLastResult(null);
    setGameState("title");
  };

  const handleCustomTestBackToTitle = () => {
    setActiveCustomTest(null);
    setCustomTestCode(null);
    setCustomTestResult(null);
    setEditingCustomTest(null);
    setCustomTestWasEdited(false);
    handleExitToTitle();
  };

  const handleExitToDifficultySelect = () => {
    // Go back to difficulty selection screen
    setSelectedDifficulty(null);
    setGameState(storyModeActive ? "story-select" : "difficulty-select");
  };

  const handleExitToCareerSelect = () => {
    // Go back to career selection screen
    setSelectedCareer(null);
    setGameState(storyModeActive ? "story-select" : "career-select");
  };

  // Render Settings modal (always available)
  const handleSettingsChange = useCallback(() => {
    const existingTrophies = loadTrophies();
    const alreadyHasTechSavvy = existingTrophies.some((t: Trophy) => t.achievementType === "tech-savvy");
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
  const handleToggleAlwaysCorrect = () => {
    setAlwaysCorrect(!alwaysCorrect);
    audioSystem.playClickSound();
  };

  const getActiveProgressKey = () => currentUser ? `careerQuestProgress_${currentUser}` : "careerQuestProgress";
  const getActiveTrophiesKey = () => currentUser ? `careerQuestTrophies_${currentUser}` : "careerQuestTrophies";
  const getActiveSessionsKey = () => currentUser ? `careerQuestSessions_${currentUser}` : "careerQuestSessions";

  const handleResetCurrentProgress = () => {
    const emptyProgress: PlayerProgress = { xp: 0, level: 1, streak: 0 };
    setPlayerProgress(emptyProgress);
    setTrophies([]);
    setSessions([]);
    localStorage.removeItem(getActiveProgressKey());
    localStorage.removeItem(getActiveTrophiesKey());
    localStorage.removeItem(getActiveSessionsKey());
    audioSystem.playSuccessSound();
  };

  const handleResetLevel = () => {
    const progress: PlayerProgress = { ...playerProgress, xp: 0, level: 1 };
    setPlayerProgress(progress);
    savePlayerProgress(progress);
    audioSystem.playSuccessSound();
  };

  const handleClearSessions = () => {
    setSessions([]);
    saveGameSessions([]);
    audioSystem.playSuccessSound();
  };

  const handleClearTrophies = () => {
    setTrophies([]);
    saveTrophies([]);
    audioSystem.playSuccessSound();
  };

  const handleAwardCareerTrophy = () => {
    const alreadyHasTrophy = trophies.some(
      (trophy) => !trophy.achievementType && trophy.career === adminTrophyCareer && trophy.difficulty === adminTrophyDifficulty
    );
    if (alreadyHasTrophy) return;

    const nextTrophies: Trophy[] = [
      ...trophies,
      {
        career: adminTrophyCareer,
        difficulty: adminTrophyDifficulty,
        earnedAt: new Date(),
      },
    ];
    setTrophies(nextTrophies);
    saveTrophies(nextTrophies);
    audioSystem.playSuccessSound();
  };

  const handleAwardSecretTrophy = () => {
    if (!adminTrophyAchievement) return;

    const alreadyHasTrophy = trophies.some(
      (trophy) => trophy.achievementType === adminTrophyAchievement
    );
    if (alreadyHasTrophy) return;

    const nextTrophies: Trophy[] = [
      ...trophies,
      {
        career: adminTrophyCareer,
        difficulty: adminTrophyDifficulty,
        earnedAt: new Date(),
        isSecret: true,
        achievementType: adminTrophyAchievement,
      },
    ];
    setTrophies(nextTrophies);
    saveTrophies(nextTrophies);
    setCurrentAchievementType(adminTrophyAchievement);
    setShowSecretTrophyPopup(true);
    audioSystem.playSuccessSound();
  };

  const handleAwardAllSecretTrophies = () => {
    const adminAchievementOptions: AchievementType[] = [
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
      "nationals",
    ];
    const newAchievements = adminAchievementOptions.filter(
      (achievement) => !trophies.some((trophy) => trophy.achievementType === achievement)
    );
    if (newAchievements.length === 0) return;

    const nextTrophies: Trophy[] = [
      ...trophies,
      ...newAchievements.map((achievement) => ({
        career: adminTrophyCareer,
        difficulty: adminTrophyDifficulty,
        earnedAt: new Date(),
        isSecret: true,
        achievementType: achievement,
      })),
    ];
    setTrophies(nextTrophies);
    saveTrophies(nextTrophies);
    setCurrentAchievementType(newAchievements[0]);
    setShowSecretTrophyPopup(true);
    audioSystem.playSuccessSound();
  };

  const handleToggleGuestWarning = () => {
    if (hasDismissedGuestWarning()) {
      localStorage.removeItem(GUEST_WARNING_KEY);
    } else {
      localStorage.setItem(GUEST_WARNING_KEY, "true");
    }
    audioSystem.playClickSound();
  };

  const handlePlayAdminCustomTest = () => {
    if (adminCustomCode.trim()) {
      handlePlayCustomTest(adminCustomCode.trim());
      setAdminCustomCode("");
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
    if (isResizing) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      let nextWidth = resizeStartSize.width;
      let nextHeight = resizeStartSize.height;
      let nextX = resizeStartPosition.x;
      let nextY = resizeStartPosition.y;

      if (resizeAnchor === "bottom-right" || resizeAnchor === "top-right") {
        nextWidth = Math.max(340, resizeStartSize.width + deltaX);
      }
      if (resizeAnchor === "bottom-left" || resizeAnchor === "top-left") {
        nextWidth = Math.max(340, resizeStartSize.width - deltaX);
        nextX = resizeStartPosition.x + (resizeStartSize.width - nextWidth);
      }
      if (resizeAnchor === "bottom-right" || resizeAnchor === "bottom-left") {
        nextHeight = Math.max(420, resizeStartSize.height + deltaY);
      }
      if (resizeAnchor === "top-right" || resizeAnchor === "top-left") {
        nextHeight = Math.max(420, resizeStartSize.height - deltaY);
        nextY = resizeStartPosition.y + (resizeStartSize.height - nextHeight);
      }

      setAdminSize({ width: nextWidth, height: nextHeight });
      setAdminPosition({ x: nextX, y: nextY });
      return;
    }

    if (!isDragging) return;
    setAdminPosition({
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    });
  };

  const handleAdminMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeAnchor(null);
  };

  const handleResizeMouseDown = (e: React.MouseEvent, anchor: ResizeAnchor) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeAnchor(anchor);
    setResizeStart({ x: e.clientX, y: e.clientY });
    setResizeStartPosition(adminPosition);
    setResizeStartSize(adminSize);
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
          width: adminSize.width,
          height: adminSize.height,
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
          <div className="relative bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 w-full h-full shadow-2xl border-2 border-purple-500 flex flex-col overflow-hidden">
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
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-white/80 text-sm">
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-white/50 text-xs">User</p>
                  <p className="font-bold truncate">{currentUser || "Guest"}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-white/50 text-xs">Level</p>
                  <p className="font-bold">{playerProgress.level}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-white/50 text-xs">XP</p>
                  <p className="font-bold">{playerProgress.xp}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-white/50 text-xs">Trophies</p>
                  <p className="font-bold">{trophies.length}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-white/50 text-xs">Sessions</p>
                  <p className="font-bold">{sessions.length}</p>
                </div>
                <div className="rounded-xl bg-white/10 p-3">
                  <p className="text-white/50 text-xs">Mode</p>
                  <p className="font-bold capitalize">{gameMode}</p>
                </div>
              </div>

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

              <div className="rounded-xl bg-white/10 p-3 space-y-3">
                <p className="text-white font-bold">Trophy Commands</p>
                <select
                  value={adminTrophyCareer}
                  onChange={(e) => setAdminTrophyCareer(e.target.value as Career)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                >
                  <option value="programmer">Programmer</option>
                  <option value="nurse">Nurse</option>
                  <option value="engineer">Engineer</option>
                  <option value="teacher">Teacher</option>
                  <option value="chef">Chef</option>
                  <option value="architect">Architect</option>
                  <option value="lawyer">Lawyer</option>
                  <option value="retail">Retail</option>
                  <option value="electrician">Electrician</option>
                  <option value="firefighter">Firefighter</option>
                  <option value="police">Police</option>
                  <option value="pilot">Pilot</option>
                  <option value="veterinarian">Veterinarian</option>
                  <option value="journalist">Journalist</option>
                  <option value="social-worker">Social Worker</option>
                  <option value="accountant">Accountant</option>
                  <option value="dentist">Dentist</option>
                  <option value="construction">Construction</option>
                </select>
                <select
                  value={adminTrophyDifficulty}
                  onChange={(e) => setAdminTrophyDifficulty(e.target.value as Difficulty)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select
                  value={adminTrophyAchievement}
                  onChange={(e) => setAdminTrophyAchievement(e.target.value as AchievementType | "")}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white"
                >
                  <option value="">Select secret trophy</option>
                  <option value="career-master">Career Master</option>
                  <option value="quick-recall-champion">Quick Recall Champion</option>
                  <option value="perfect-recall">Perfect Recall</option>
                  <option value="konami-master">Konami Master</option>
                  <option value="all-careers-master">All Careers Master</option>
                  <option value="all-quick-recalls-master">All Quick Recalls Master</option>
                  <option value="lightning-reflex">Lightning Reflex</option>
                  <option value="marathon-runner">Marathon Runner</option>
                  <option value="speed-demon">Speed Demon</option>
                  <option value="jack-of-all-trades">Jack of All Trades</option>
                  <option value="lucky-star">Lucky Star</option>
                  <option value="night-owl">Night Owl</option>
                  <option value="early-bird">Early Bird</option>
                  <option value="pi-pioneer">Pi Pioneer</option>
                  <option value="pi-explorer">Pi Explorer</option>
                  <option value="pi-master">Pi Master</option>
                  <option value="pi-genius">Pi Genius</option>
                  <option value="pi-legend">Pi Legend</option>
                  <option value="state-week">State Week</option>
                  <option value="today-checkin">Today Check-in</option>
                  <option value="phoenix">Phoenix</option>
                  <option value="keyboard-warrior">Keyboard Warrior</option>
                  <option value="explorer">Explorer</option>
                  <option value="patience">Patience</option>
                  <option value="streak-master">Streak Master</option>
                  <option value="return-customer">Return Customer</option>
                  <option value="committed">Committed</option>
                  <option value="tech-savvy">Tech Savvy</option>
                  <option value="variety-pack">Variety Pack</option>
                  <option value="second-chance">Second Chance</option>
                  <option value="certification-master">Certification Master</option>
                  <option value="all-certifications-master">All Certifications Master</option>
                  <option value="nationals">Nationals</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleAwardSecretTrophy}
                    disabled={!adminTrophyAchievement}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Award Secret
                  </button>
                  <button
                    onClick={handleAwardCareerTrophy}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold"
                  >
                    Award Career
                  </button>
                </div>
                <button
                  onClick={handleAwardAllSecretTrophies}
                  className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold"
                >
                  Award All Secret Trophies
                </button>
                <button
                  onClick={handleClearTrophies}
                  className="w-full py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold"
                >
                  Clear Trophies
                </button>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={adminCustomCode}
                  onChange={(e) => setAdminCustomCode(e.target.value.toUpperCase())}
                  placeholder="Custom test code"
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40"
                  maxLength={8}
                />
                <button
                  onClick={handlePlayAdminCustomTest}
                  disabled={!adminCustomCode.trim()}
                  className="w-full py-3 px-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Play Custom Test
                </button>
              </div>
              
              <button
                onClick={handleClearSessions}
                className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                📊 Clear Sessions
              </button>

              <button
                onClick={handleResetLevel}
                className="w-full py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                ⬇️ Reset Level/XP
              </button>

              <button
                onClick={handleResetCurrentProgress}
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                🗑️ Reset Current Progress
              </button>

              <button
                onClick={handleToggleGuestWarning}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                {hasDismissedGuestWarning() ? "Show Guest Warning" : "Hide Guest Warning"}
              </button>

              <button
                onClick={() => setGameState("moderator")}
                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl transition-all transform hover:scale-105"
              >
                🔐 Developer Dashboard
              </button>
              
              <div className="pt-4 border-t border-purple-700">
                <p className="text-purple-300 text-sm text-center">
                  Code: 5839201746
                </p>
              </div>
            </div>

            <div
              className="absolute top-0 left-0 w-6 h-6 cursor-nwse-resize flex items-start justify-start text-white/50 hover:text-white"
              onMouseDown={(e) => handleResizeMouseDown(e, "top-left")}
            >
              <span className="text-xs leading-none">↖</span>
            </div>
            <div
              className="absolute top-0 right-0 w-6 h-6 cursor-nesw-resize flex items-start justify-end text-white/50 hover:text-white"
              onMouseDown={(e) => handleResizeMouseDown(e, "top-right")}
            >
              <span className="text-xs leading-none">↗</span>
            </div>
            <div
              className="absolute bottom-0 left-0 w-6 h-6 cursor-nesw-resize flex items-end justify-start text-white/50 hover:text-white"
              onMouseDown={(e) => handleResizeMouseDown(e, "bottom-left")}
            >
              <span className="text-xs leading-none">↙</span>
            </div>
            <div
              className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-end justify-end text-white/50 hover:text-white"
              onMouseDown={(e) => handleResizeMouseDown(e, "bottom-right")}
            >
              <span className="text-xs leading-none">↘</span>
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
        onLogin={() => {
          setShowTutorial(false);
          setGameState("auth");
        }}
        onSignup={() => {
          setShowTutorial(false);
          setGameState("auth");
        }}
      />
    );
  }

  if (gameState === "title") {
    return (
      <>
        <TitleScreen 
          onStart={handleStart} 
          onStartStory={handleOpenStoryMode}
          onOpenSettings={() => setSettingsOpen(true)} 
          onViewTrophies={() => setGameState("trophy")}
          onViewStats={() => setGameState("stats")}
          onOpenProfile={() => setGameState("profile")}
          onOpenCustomCreate={() => setGameState("custom-create")}
          onEnterCode={handlePlayCustomTest}
          onPreviewCode={handlePreviewCustomTest}
          previewTest={customTestPreview}
          approvedTests={getApprovedCustomTests()}
          currentUser={currentUser}
          onEditApprovedTest={handleEditApprovedCustomTest}
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
        {renderAdminPanel()}
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

  if (gameState === "story-select") {
    return (
      <>
        <StoryModeSelection
          progress={storyProgress}
          onStartJourney={handleStartStoryJourney}
          onBack={() => {
            setStoryModeActive(false);
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
          onLearnMore={(career) => {
            setSelectedCareer(career);
            setGameState("career-info");
          }}
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
      firefighter: "/images/firefighter-bg.jpg",
      police: "/images/police-bg.jpg",
      pilot: "/images/pilot-bg.jpg",
      veterinarian: "/images/veterinarian-bg.jpg",
      journalist: "/images/journalist-bg.jpg",
      "social-worker": "/images/social-worker-bg.jpg",
      accountant: "/images/accountant-bg.jpg",
      dentist: "/images/dentist-bg.jpg",
      construction: "/images/construction-bg.jpg",
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
        case 'firefighter':
          return (
            <FirefighterDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'police':
          return (
            <PoliceDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'pilot':
          return (
            <PilotDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'veterinarian':
          return (
            <VeterinarianDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'journalist':
          return (
            <JournalistDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'social-worker':
          return (
            <SocialWorkerDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'accountant':
          return (
            <AccountantDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'dentist':
          return (
            <DentistDifficulty
              onSelectDifficulty={handleDifficultySelect}
              onBack={handleBackToCareerSelect}
              onOpenSettings={() => setSettingsOpen(true)}
              onExit={handleExitToTitle}
              backgroundImage={backgroundImage}
            />
          );
        case 'construction':
          return (
            <ConstructionDifficulty
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

  if (gameState === "playing" && (selectedCareer || activeCustomTest)) {
    const isQuickRecall = gameMode === "quick-recall";
    
    // Custom test mode
    if (activeCustomTest) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
          <CustomTestWorld
            test={activeCustomTest}
            isQuickRecall={isQuickRecall}
            alwaysCorrect={alwaysCorrect}
            onExit={handleExitToTitle}
            onAnswerResult={handleAnswerResult}
            onComplete={handleCustomTestComplete}
          />
        </div>
      );
    }
    
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
          {selectedCareer === "firefighter" && (
            <FirefighterWorld
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
          {selectedCareer === "police" && (
            <PoliceWorld
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
          {selectedCareer === "pilot" && (
            <PilotWorld
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
          {selectedCareer === "veterinarian" && (
            <VeterinarianWorld
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
          {selectedCareer === "journalist" && (
            <JournalistWorld
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
          {selectedCareer === "social-worker" && (
            <SocialWorkerWorld
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
          {selectedCareer === "accountant" && (
            <AccountantWorld
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
          {selectedCareer === "dentist" && (
            <DentistWorld
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
          {selectedCareer === "construction" && (
            <ConstructionWorld
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

  if (gameState === "story-outcome" && selectedCareer && storyLastResult) {
    const journey = storyJourneyByCareer[selectedCareer];
    const milestone = getStoryMilestone(selectedCareer, storyStep);

    if (!milestone) {
      setGameState("story-select");
      return null;
    }

    return (
      <>
        <StoryOutcomeScreen
          career={selectedCareer}
          careerTitle={journey.title}
          careerIcon={journey.icon}
          milestone={milestone}
          milestoneIndex={storyStep}
          totalMilestones={journey.milestones.length}
          success={storyLastResult.success}
          score={storyLastResult.score}
          total={storyLastResult.total}
          completedMilestones={storyProgress.completedMilestones.filter((id) => id.startsWith(`${selectedCareer}-`)).length}
          onNext={handleStoryNext}
          onReplay={handleStoryReplayMilestone}
          onBackToJourney={handleStoryBackToSelection}
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
      </>
    );
  }

  if (gameState === "story-complete" && selectedCareer) {
    return (
      <>
        <StoryCompleteScreen
          career={selectedCareer}
          onPlayAgain={handleStoryReplayJourney}
          onChooseJourney={handleStoryBackToSelection}
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
          streak={playerProgress.streak}
          onBack={() => setGameState("title")}
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

  if (gameState === "profile") {
    const level = calculateLevel(playerProgress.xp);
    const today = getTodayDate();
    const completedToday = playerProgress.lastPlayedDate === today;
    return (
      <>
        <ProfileScreen
          trophies={trophies}
          xp={playerProgress.xp}
          level={calculateLevel(playerProgress.xp)}
          streak={playerProgress.streak}
          onBack={() => setGameState("title")}
          onAcceptDailyChallenge={(career, difficulty) => {
            setSelectedCareer(career);
            setSelectedDifficulty(difficulty);
            setGameMode("challenge");
            setGameState("difficulty-select");
          }}
          completedToday={playerProgress.lastPlayedDate === getTodayDate()}
          isGuest={!currentUser}
          onLogin={() => setGameState("auth")}
          onSignup={() => setGameState("auth")}
          onLogout={handleLogout}
          currentUsername={currentUser}
          onDismissGuestWarning={dismissGuestWarning}
          onOpenModerator={() => setGameState("moderator")}
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

  if (gameState === "auth") {
    return (
      <>
        <AuthScreen
          onLogin={handleLogin}
          onSignup={handleSignup}
          onPlayAsGuest={continueAsGuest}
          onBack={() => setGameState("title")}
        />
        {settingsModal}
      </>
    );
  }

  if (gameState === "custom-create") {
    return (
      <CustomTestCreate
        onBack={() => {
          setEditingCustomTest(null);
          setGameState("title");
        }}
        onTestCreated={handleCustomTestCreate}
        currentUser={currentUser}
        initialTest={editingCustomTest}
      />
    );
  }

  if (gameState === "custom-play" && customTestCode && activeCustomTest) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
          <GradientCard className="p-8 max-w-md w-full" gradient="from-purple-600 via-blue-600 to-indigo-600">
            <h2 className="text-2xl font-bold text-white mb-4">
              {customTestWasEdited ? "Custom Test Updated & Sent for Reapproval!" : "Custom Test Created!"}
            </h2>
            <p className="text-white/70 mb-6">
              {customTestWasEdited
                ? "Your approved quiz is back in pending review. The code stayed the same and will return to the front page after approval."
                : "Share this code with friends or use it anytime:"}
            </p>
            <div className="bg-white/20 rounded-lg p-4 mb-4">
              <p className="text-4xl font-bold text-center text-yellow-400">{customTestCode}</p>
            </div>
            <div className="space-y-3">
              <GameButton onClick={() => handlePlayCustomTest(customTestCode)} className="w-full">
                Play Now
              </GameButton>
              <GameButton onClick={() => {
                setEditingCustomTest(null);
                setCustomTestWasEdited(false);
                setGameState("title");
              }}className="w-full bg-gradient-to-r from-gray-700 to-gray-800">
                Back to Title
              </GameButton>
            </div>
          </GradientCard>
        </div>
        {settingsModal}
      </>
    );
  }

  if (gameState === "custom-outcome" && activeCustomTest && customTestResult) {
    return (
      <>
        <CustomTestOutcome
          test={activeCustomTest}
          success={customTestResult.success}
          score={customTestResult.score}
          total={customTestResult.total}
          onPlayAgain={handleCustomTestPlayAgain}
          onBackToTitle={handleCustomTestBackToTitle}
        />
        {settingsModal}
      </>
    );
  }

  if (gameState === "moderator") {
    return (
      <ModeratorDashboard
        currentUser={currentUser}
        onBack={() => setGameState("title")}
      />
    );
  }


  if (gameState === "career-info" && selectedCareer) {
    return (
      <>
        <CareerInfoPage 
          career={selectedCareer}
          onBack={() => setGameState("career-select")}
          onStartCareer={(career) => {
            setSelectedCareer(career);
            setGameState("difficulty-select");
          }}
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
      </>
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
      </>
    );
  }
}
