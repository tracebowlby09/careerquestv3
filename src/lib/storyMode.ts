import type { Career, Difficulty, StoryProgress } from "@/types/game";
import { careerInfoByCareer } from "@/lib/careerInfo";

export interface StoryCharacter {
  name: string;
  role: string;
  icon: string;
  quote: string;
}

export interface StoryMilestone {
  id: string;
  title: string;
  difficulty: Difficulty;
  character: StoryCharacter;
  objective: string;
  briefing: string;
  successLine: string;
  retryLine: string;
}

export interface StoryJourney {
  career: Career;
  title: string;
  icon: string;
  mentor: StoryCharacter;
  milestones: StoryMilestone[];
}

export interface StoryMilestoneTemplate {
  title: string;
  difficulty: Difficulty;
  characterIndex: number;
  objective: string;
  briefing: string;
  successLine: string;
  retryLine: string;
}

export const storyJourneyOrder: Career[] = [
  "programmer",
  "nurse",
  "engineer",
  "teacher",
  "chef",
  "architect",
  "lawyer",
  "retail",
  "electrician",
  "firefighter",
  "police",
  "pilot",
  "veterinarian",
  "journalist",
  "social-worker",
  "accountant",
  "dentist",
  "construction",
];

const storyCharactersByRole: StoryCharacter[] = [
  {
    name: "Mentor",
    role: "Guide",
    icon: "🧭",
    quote: "Start with the basics, then make each decision with purpose.",
  },
  {
    name: "Teammate",
    role: "Partner",
    icon: "🤝",
    quote: "Good teams move faster when everyone knows the plan.",
  },
  {
    name: "Client",
    role: "Stakeholder",
    icon: "💬",
    quote: "I need a solution that is safe, useful, and clear.",
  },
  {
    name: "Supervisor",
    role: "Leader",
    icon: "📋",
    quote: "Pressure reveals whether your habits are strong enough.",
  },
  {
    name: "Community",
    role: "Impact",
    icon: "🌟",
    quote: "Your work matters most when it helps real people.",
  },
];

export const storyCharactersByCareer: Record<Career, StoryCharacter> = {
  programmer: {
    name: "Avery Brooks",
    role: "Senior Programmer",
    icon: "💻",
    quote: "Clean code is code your future team can understand.",
  },
  nurse: {
    name: "Maya Patel",
    role: "Charge Nurse",
    icon: "🏥",
    quote: "Safety comes first, then speed.",
  },
  engineer: {
    name: "Jordan Lee",
    role: "Senior Civil Engineer",
    icon: "🏗️",
    quote: "Every design decision carries responsibility.",
  },
  teacher: {
    name: "Ms. Rivera",
    role: "Lead Teacher",
    icon: "📚",
    quote: "Students learn best when expectations are clear and kind.",
  },
  chef: {
    name: "Chef Marco",
    role: "Head Chef",
    icon: "👨‍🍳",
    quote: "Mise en place turns chaos into service.",
  },
  architect: {
    name: "Elena Stone",
    role: "Design Principal",
    icon: "🏛️",
    quote: "Great spaces balance beauty, safety, and human needs.",
  },
  lawyer: {
    name: "Nora Hayes",
    role: "Senior Attorney",
    icon: "⚖️",
    quote: "The strongest argument begins with careful facts.",
  },
  retail: {
    name: "Sam Taylor",
    role: "Store Manager",
    icon: "🛍️",
    quote: "Every customer interaction is a chance to build trust.",
  },
  electrician: {
    name: "Riley Morgan",
    role: "Master Electrician",
    icon: "⚡",
    quote: "Respect the code, respect the current, respect the team.",
  },
  firefighter: {
    name: "Captain Brooks",
    role: "Fire Captain",
    icon: "🚒",
    quote: "Size up the scene before you commit to action.",
  },
  police: {
    name: "Officer Chen",
    role: "Field Training Officer",
    icon: "👮",
    quote: "Protect people, preserve evidence, and communicate clearly.",
  },
  pilot: {
    name: "Captain Rivera",
    role: "Training Captain",
    icon: "✈️",
    quote: "A calm checklist can turn pressure into control.",
  },
  veterinarian: {
    name: "Dr. Morgan",
    role: "Veterinarian",
    icon: "🐕",
    quote: "Listen to the animal, guide the owner, and stay calm.",
  },
  journalist: {
    name: "Iris Kim",
    role: "Investigations Editor",
    icon: "📰",
    quote: "Verify first, publish with care.",
  },
  "social-worker": {
    name: "Alex Green",
    role: "Licensed Social Worker",
    icon: "🤝",
    quote: "Advocacy starts with listening and ends with a plan.",
  },
  accountant: {
    name: "Priya Shah",
    role: "CPA",
    icon: "📊",
    quote: "Numbers tell a story, but accuracy tells the truth.",
  },
  dentist: {
    name: "Dr. Ellis",
    role: "Dentist",
    icon: "🦷",
    quote: "Precision and reassurance go hand in hand.",
  },
  construction: {
    name: "Marcus Wright",
    role: "Construction Manager",
    icon: "🏗️",
    quote: "A safe site is a productive site.",
  },
};

const milestoneTemplates: StoryMilestoneTemplate[] = [
  {
    title: "First Day Orientation",
    difficulty: "easy",
    characterIndex: 0,
    objective: "Learn the core tools, routines, and safety habits for the role.",
    briefing: "Your mentor introduces the workplace, explains the daily workflow, and asks you to prove you understand the fundamentals.",
    successLine: "You build a strong first impression by preparing carefully and asking the right questions.",
    retryLine: "Review the basics of the role and try the orientation again.",
  },
  {
    title: "First Real Task",
    difficulty: "easy",
    characterIndex: 1,
    objective: "Complete a practical task with a teammate watching your process.",
    briefing: "A teammate gives you a real assignment and looks for clear communication, steady work, and smart prioritization.",
    successLine: "You show that you can turn guidance into reliable action.",
    retryLine: "Focus on the task steps and communicate your plan before trying again.",
  },
  {
    title: "Busy Shift Challenge",
    difficulty: "medium",
    characterIndex: 2,
    objective: "Handle competing needs from a customer, client, patient, student, or community member.",
    briefing: "A stakeholder brings a time-sensitive problem. You must balance their needs with safety, quality, and workplace rules.",
    successLine: "You protect trust by making thoughtful decisions under pressure.",
    retryLine: "Pause, identify the highest priority, and try the shift again.",
  },
  {
    title: "Unexpected Problem",
    difficulty: "hard",
    characterIndex: 3,
    objective: "Respond to a surprise problem without skipping safety or procedure.",
    briefing: "Your supervisor reports an unexpected issue. The best choice requires careful assessment, teamwork, and professional judgment.",
    successLine: "You earn confidence by staying calm, checking the facts, and choosing the safest path.",
    retryLine: "Review the warning signs and try the crisis round again.",
  },
  {
    title: "Career Milestone",
    difficulty: "hard",
    characterIndex: 4,
    objective: "Finish the journey by proving you can help people with the skills of the career.",
    briefing: "Your final milestone tests whether you can combine technical knowledge, communication, and responsibility in one complete career challenge.",
    successLine: "You complete the career journey and prove you are ready for the next level.",
    retryLine: "Strengthen your career knowledge and try the final milestone again.",
  },
];

export const getStoryMilestoneId = (career: Career, index: number): string => `${career}-${index + 1}`;

const buildJourney = (career: Career): StoryJourney => {
  const info = careerInfoByCareer[career];
  const mentor = storyCharactersByCareer[career];
  const skillText = info.skills.slice(0, 3).join(", ");

  return {
    career,
    title: info.title,
    icon: info.icon,
    mentor,
    milestones: milestoneTemplates.map((template, index) => ({
      id: getStoryMilestoneId(career, index),
      title: template.title,
      difficulty: template.difficulty,
      character: storyCharactersByRole[template.characterIndex],
      objective: template.objective,
      briefing: `${template.briefing} In ${info.title}, this means using ${skillText} to make smart, responsible choices.`,
      successLine: template.successLine,
      retryLine: template.retryLine,
    })),
  };
};

export const storyJourneyByCareer: Record<Career, StoryJourney> = Object.fromEntries(
  storyJourneyOrder.map((career) => [career, buildJourney(career)])
) as Record<Career, StoryJourney>;

export const getStoryMilestone = (career: Career, index: number): StoryMilestone | undefined => {
  return storyJourneyByCareer[career].milestones[index];
};

export const getStoryJourneyProgress = (progress: StoryProgress, career: Career): number => {
  const journey = storyJourneyByCareer[career];
  return journey.milestones.filter((_, index) => progress.completedMilestones.includes(getStoryMilestoneId(career, index))).length;
};

export const isStoryJourneyComplete = (progress: StoryProgress, career: Career): boolean => {
  return getStoryJourneyProgress(progress, career) === storyJourneyByCareer[career].milestones.length;
};

export const updateStoryProgress = (
  progress: StoryProgress,
  career: Career,
  milestoneIndex: number,
  success: boolean
): StoryProgress => {
  const completedMilestones = new Set(progress.completedMilestones);
  const milestoneId = getStoryMilestoneId(career, milestoneIndex);

  if (success) {
    completedMilestones.add(milestoneId);
  }

  const journey = storyJourneyByCareer[career];
  const journeyComplete = journey.milestones.every((_, index) => completedMilestones.has(getStoryMilestoneId(career, index)));
  const completedJourneys = new Set(progress.completedJourneys);

  if (journeyComplete) {
    completedJourneys.add(career);
  }

  return {
    completedMilestones: Array.from(completedMilestones),
    completedJourneys: Array.from(completedJourneys),
  };
};
