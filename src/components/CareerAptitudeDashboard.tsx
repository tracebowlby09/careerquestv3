"use client";

import { Career, GameSession, Trophy } from "@/types/game";
import { GameButton, GradientCard, AnimatedContainer } from "./ui/UIComponents";
import { careerInfoByCareer } from "@/lib/careerInfo";

interface CareerAptitudeDashboardProps {
  sessions: GameSession[];
  trophies: Trophy[];
  onExploreCareer: (career: Career) => void;
  onExit: () => void;
}

interface SkillMatch {
  skill: string;
  strength: number;
}

interface CareerAptitude {
  career: Career;
  aptitudeScore: number;
  keySkills: { skill: string; strength: number }[];
  matchCategory: "high" | "medium" | "low";
}

const skillMappingByCareer: Record<Career, string[]> = {
  programmer: ["Problem-solving", "Logical Thinking", "Attention to Detail", "Debugging"],
  nurse: ["Prioritization", "Clinical Assessment", "Communication", "Empathy"],
  engineer: ["Analytical", "Constraint Optimization", "Safety Mindset", "Trade-off Analysis"],
  teacher: ["Communication", "Patience", "Classroom Management", "Adaptability"],
  chef: ["Time Management", "Creativity", "Quality Control", "Pressure Handling"],
  architect: ["Spatial Thinking", "Design Integration", "Aesthetics Sense", "Code Knowledge"],
  lawyer: ["Critical Analysis", "Case Evaluation", "Legal Reasoning", "Attention to Detail"],
  retail: ["Customer Service", "Problem Solving", "Sales", "Reliability"],
  electrician: ["Technical Knowledge", "Safety Protocols", "Troubleshooting", "Precision"],
  firefighter: ["Rapid Assessment", "Equipment Operation", "Team Coordination", "Life-saving"],
  police: ["Situational Awareness", "De-escalation", "Legal Knowledge", "Community Focus"],
  pilot: ["Decision Making", "Weather Assessment", "Safety-first", "Emergency Procedures"],
  veterinarian: ["Clinical Assessment", "Animal Care", "Client Communication", "Compassion"],
  journalist: ["News Judgment", "Verification", "Research", "Deadline Management"],
  "social-worker": ["Crisis Intervention", "Case Management", "Advocacy", "Ethical Decision"],
  accountant: ["Accuracy", "Financial Analysis", "Compliance", "Attention to Detail"],
  dentist: ["Clinical Skills", "Patient Safety", "Diagnostic Skills", "Precision"],
  construction: ["Safety Protocol", "Project Management", "Quality Control", "Team Leadership"],
};

const skillSynonyms: Record<string, string[]> = {
  "Problem-solving": ["Problem-solving", "Problem Solving", "Analytical"],
  "Logical Thinking": ["Logical Thinking", "Logical", "Debugging"],
  "Prioritization": ["Prioritization", "Triage", "Priority"],
  "Communication": ["Communication", "Communication Skills"],
  "Time Management": ["Time Management", "Multitasking"],
  "Attention to Detail": ["Attention to Detail", "Precision", "Detail"],
};

export default function CareerAptitudeDashboard({
  sessions,
  trophies,
  onExploreCareer,
  onExit,
}: CareerAptitudeDashboardProps) {
  const calculateSkillStrength = (career: Career, skill: string): number => {
    let strength = 0;
    const synonyms = skillSynonyms[skill] || [skill];

    const careerSessions = sessions.filter(s => s.career === career);
    const careerTrophies = trophies.filter(s => s.career === career && !s.achievementType);

    careerSessions.forEach(session => {
      if (session.success) {
        strength += 2;
      }
      const maxScore = session.total;
      const sessionScore = session.score / maxScore;
      if (sessionScore >= 0.8) strength += 1;
      else if (sessionScore >= 0.6) strength += 0.5;
    });

    careerTrophies.forEach(() => {
      strength += 3;
    });

    const maxStrength = 10;
    return Math.min(Math.round((strength / maxStrength) * 100), 100);
  };

  const calculateCareerAptitude = (): CareerAptitude[] => {
    const allCareers: Career[] = [
      "programmer", "nurse", "engineer", "teacher", "chef", "architect", 
      "lawyer", "retail", "electrician", "firefighter", "police", "pilot", 
      "veterinarian", "journalist", "social-worker", "accountant", "dentist", "construction"
    ];

    return allCareers.map(career => {
      const skills = skillMappingByCareer[career];
      const skillScores = skills.map(skill => ({
        skill,
        strength: calculateSkillStrength(career, skill),
      }));

      const avgScore = skillScores.reduce((sum, s) => sum + s.strength, 0) / skills.length;
      const matchCategory: "high" | "medium" | "low" = 
        avgScore >= 70 ? "high" : avgScore >= 40 ? "medium" : "low";

      return {
        career,
        aptitudeScore: Math.round(avgScore),
        keySkills: skillScores,
        matchCategory,
      };
    }).sort((a, b) => b.aptitudeScore - a.aptitudeScore);
  };

  const aptitudes = calculateCareerAptitude();
  const topMatches = aptitudes.filter(a => a.matchCategory === "high");
  const otherCareers = aptitudes.filter(a => a.matchCategory !== "high");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Career Aptitude Dashboard
          </h1>
          <p className="text-white/70 text-lg">
            Based on your gameplay performance across careers
          </p>
        </div>

        {topMatches.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span>🏆</span> Your Strong Matches
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topMatches.map((aptitude, index) => (
                <AnimatedContainer key={aptitude.career} delay={index * 50}>
                  <GradientCard className="p-5" gradient="from-amber-900/40 to-yellow-900/40 border border-amber-500/30">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{careerInfoByCareer[aptitude.career].icon}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white">{careerInfoByCareer[aptitude.career].title}</h3>
                        <div className="text-amber-300 font-bold">{aptitude.aptitudeScore}% Aptitude</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {aptitude.keySkills.slice(0, 2).map(skill => (
                        <div key={skill.skill} className="flex items-center justify-between text-sm">
                          <span className="text-white/70">{skill.skill}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-400 to-yellow-500"
                                style={{ width: `${skill.strength}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <GameButton 
                      onClick={() => onExploreCareer(aptitude.career)}
                      className="w-full mt-4 text-sm bg-gradient-to-r from-amber-500 to-yellow-600"
                    >
                      Explore Career
                    </GameButton>
                  </GradientCard>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">All Careers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherCareers.map((aptitude, index) => (
              <AnimatedContainer key={aptitude.career} delay={index * 30}>
                <GradientCard className="p-5" gradient="from-white/10 to-white/5 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{careerInfoByCareer[aptitude.career].icon}</span>
                    <div>
                      <h3 className="text-lg font-bold text-white">{careerInfoByCareer[aptitude.career].title}</h3>
                      <div className="text-white/60 text-sm">{aptitude.aptitudeScore}% Aptitude</div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {aptitude.keySkills.slice(0, 2).map(skill => (
                      <div key={skill.skill} className="flex items-center justify-between text-xs">
                        <span className="text-white/50">{skill.skill}</span>
                        <span className="text-white/40">{skill.strength}%</span>
                      </div>
                    ))}
                  </div>
                  <GameButton 
                    onClick={() => onExploreCareer(aptitude.career)}
                    className="w-full mt-3 text-xs bg-gradient-to-r from-purple-600 to-indigo-600"
                  >
                    Explore
                  </GameButton>
                </GradientCard>
              </AnimatedContainer>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <GameButton onClick={onExit} variant="ghost">
            ← Exit Dashboard
          </GameButton>
        </div>
      </div>
    </div>
  );
}