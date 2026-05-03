export type Difficulty = "easy" | "medium" | "hard";
export type Career = "programmer" | "nurse" | "engineer" | "teacher" | "chef" | "architect" | "lawyer" | "retail" | "electrician";
export type GameMode = "challenge" | "quick-recall" | "certification";
export type AchievementType = "career-master" | "quick-recall-champion" | "perfect-recall" | "konami-master" | "all-careers-master" | "all-quick-recalls-master" | "lightning-reflex" | "marathon-runner" | "speed-demon" | "jack-of-all-trades" | "lucky-star" | "night-owl" | "early-bird" | "pi-pioneer" | "pi-explorer" | "pi-master" | "pi-genius" | "pi-legend" | "state-week" | "today-checkin" | "phoenix" | "keyboard-warrior" | "explorer" | "patience" | "streak-master" | "return-customer" | "committed" | "tech-savvy" | "variety-pack" | "second-chance";

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
//game.ts pmo