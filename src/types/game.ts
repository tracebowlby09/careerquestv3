export type Difficulty = "easy" | "medium" | "hard";
export type Career = "programmer" | "nurse" | "engineer" | "teacher" | "chef" | "architect" | "lawyer" | "retail" | "electrician" | "firefighter" | "police" | "pilot" | "veterinarian" | "journalist" | "social-worker" | "accountant" | "dentist" | "construction";
export type GameMode = "challenge" | "quick-recall" | "certification";
export type CertificationType = "aws-developer" | "rn-license" | "pe-license" | "teaching-license" | "servsafe" | "are-exam" | "bar-exam" | "customer-service" | "journeyman" | "firefighter-cert" | "police-academy" | "cpl-license" | "vet-tech" | "journalism-award" | "lcsw" | "cpa" | "dental-board" | "osha-30";
export type AchievementType = "career-master" | "quick-recall-champion" | "perfect-recall" | "konami-master" | "all-careers-master" | "all-quick-recalls-master" | "lightning-reflex" | "marathon-runner" | "speed-demon" | "jack-of-all-trades" | "lucky-star" | "night-owl" | "early-bird" | "pi-pioneer" | "pi-explorer" | "pi-master" | "pi-genius" | "pi-legend" | "state-week" | "today-checkin" | "phoenix" | "keyboard-warrior" | "explorer" | "patience" | "streak-master" | "return-customer" | "committed" | "tech-savvy" | "variety-pack" | "second-chance" | "certification-master" | "all-certifications-master" | "nationals";

export interface Trophy {
  career: Career;
  difficulty: Difficulty;
  earnedAt: Date;
  isSecret?: boolean;
  achievementType?: AchievementType;
}

export interface StoryProgress {
  completedMilestones: string[];
  completedJourneys: Career[];
}

export interface GameProgress {
  trophies: Trophy[];
  currentScore: number;
}

export interface IncorrectAnswer {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface GameSession {
  id: string;
  career: Career;
  difficulty: Difficulty;
  gameMode: GameMode;
  score: number;
  total: number;
  success: boolean;
  timestamp: Date;
}

export interface PlayerProgress {
  xp: number;
  level: number;
  streak: number;
  lastPlayedDate?: string; // YYYY-MM-DD format
}

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  createdAt: string;
}

export interface DailyChallenge {
  career: Career;
  difficulty: Difficulty;
  completed: boolean;
  date: string; // YYYY-MM-DD format
}

// Custom test types
export interface CustomQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  image?: string;
}

export interface CustomTest {
  id: string;
  code: string; // Unique short code for sharing/playing
  name: string;
  description?: string;
  icon?: string;
  skillsLearned?: string[];
  creatorUsername: string;
  mode: "challenge" | "quick-recall";
  difficulty?: Difficulty;
  questions: CustomQuestion[];
  themeColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  backgroundImage?: string;
  createdAt: string;
  approved: boolean;
  approvedAt?: string;
  approvedBy?: string; // Moderator username
}

// XP required for each level (exponential growth)
export const XP_PER_LEVEL = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, 4000];
export const MAX_LEVEL = XP_PER_LEVEL.length - 1;

export const getXPForDifficulty = (difficulty: Difficulty, success: boolean): number => {
  const baseXP = { easy: 10, medium: 20, hard: 30 };
  return success ? baseXP[difficulty] : Math.floor(baseXP[difficulty] / 2);
};

export const getXPForGameMode = (gameMode: GameMode, score: number, total: number): number => {
  if (gameMode === "quick-recall") {
    const percentage = (score / total) * 100;
    return percentage >= 80 ? 50 : percentage >= 60 ? 30 : 15;
  }
  if (gameMode === "certification") {
    const percentage = (score / total) * 100;
    return percentage >= 80 ? 60 : percentage >= 60 ? 40 : 20;
  }
  return 0; // Regular challenge uses difficulty-based XP
};

export const calculateLevel = (xp: number): number => {
  let level = 1;
  for (let i = 1; i < XP_PER_LEVEL.length; i++) {
    if (xp >= XP_PER_LEVEL[i]) level = i;
  }
  return Math.min(level, MAX_LEVEL);
};

export const calculateXPForNextLevel = (xp: number): { current: number; needed: number } => {
  const level = calculateLevel(xp);
  const nextLevelXP = XP_PER_LEVEL[level + 1] || XP_PER_LEVEL[MAX_LEVEL];
  return {
    current: xp - XP_PER_LEVEL[level],
    needed: nextLevelXP - XP_PER_LEVEL[level],
  };
};

// Get today's date in YYYY-MM-DD format
export const getTodayDate = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// Get XP bonus for daily streak
export const getStreakXPBonus = (streak: number): number => {
  return Math.min(streak * 5, 50); // 5 XP per day, max 50
};

// Generate a daily challenge (rotates through careers based on date)
export const getDailyChallenge = (): { career: Career; difficulty: Difficulty } => {
  const allCareers: Career[] = ["programmer", "nurse", "engineer", "teacher", "chef", "architect", "lawyer", "retail", "electrician", "firefighter", "police", "pilot", "veterinarian", "journalist", "social-worker", "accountant", "dentist", "construction"];
  const difficulties: Difficulty[] = ["easy", "medium", "hard"];
  const today = new Date();
  // Calculate days since epoch for deterministic daily rotation
  const daysSinceEpoch = Math.floor(today.getTime() / (1000 * 60 * 60 * 24));
  const careerIndex = daysSinceEpoch % allCareers.length;
  const difficultyIndex = Math.floor(daysSinceEpoch / 3) % difficulties.length;
  return {
    career: allCareers[careerIndex],
    difficulty: difficulties[difficultyIndex],
  };
};