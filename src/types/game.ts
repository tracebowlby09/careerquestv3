export type Difficulty = "easy" | "medium" | "hard";
export type Career = "programmer" | "nurse" | "engineer" | "teacher" | "chef" | "architect" | "lawyer" | "retail" | "electrician";
export type GameMode = "challenge" | "quick-recall" | "certification";
export type CertificationType = "aws-developer" | "rn-license" | "pe-license" | "teaching-license" | "servsafe" | "are-exam" | "bar-exam" | "customer-service" | "journeyman";
export type AchievementType = "career-master" | "quick-recall-champion" | "perfect-recall" | "konami-master" | "all-careers-master" | "all-quick-recalls-master" | "lightning-reflex" | "marathon-runner" | "speed-demon" | "jack-of-all-trades" | "lucky-star" | "night-owl" | "early-bird" | "pi-pioneer" | "pi-explorer" | "pi-master" | "pi-genius" | "pi-legend" | "state-week" | "today-checkin" | "phoenix" | "keyboard-warrior" | "explorer" | "patience" | "streak-master" | "return-customer" | "committed" | "tech-savvy" | "variety-pack" | "second-chance" | "certification-master" | "all-certifications-master";

export interface Trophy {
  career: Career;
  difficulty: Difficulty;
  earnedAt: Date;
  isSecret?: boolean;
  achievementType?: AchievementType;
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
//game.ts pmo