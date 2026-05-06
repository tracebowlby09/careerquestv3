"use client";

import { CertificationType } from "@/types/game";
import { certificationMetadata } from "@/lib/certificationQuestions";
import ScreenWrapper from "./ScreenWrapper";
import MorseStarfield from "./MorseStarfield";

const certificationOrder: CertificationType[] = [
  "aws-developer", "rn-license", "pe-license", "teaching-license", "servsafe",
  "are-exam", "bar-exam", "customer-service", "journeyman",
];

interface CertificationSelectionProps {
  onSelectCertification: (certType: CertificationType) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

export default function CertificationSelection({ onSelectCertification, onOpenSettings, onExit }: CertificationSelectionProps) {
  const handleSelect = (certType: CertificationType) => {
    if (typeof window !== "undefined") { const { audioSystem } = require("@/lib/audio"); audioSystem.playClickSound(); }
    onSelectCertification(certType);
  };

  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit}>
      {/* Morse code "KILL ME" starfield background - epilepsy-safe */}
      <MorseStarfield message="KILL ME" starCount={40} />

      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2 rounded-full mb-4 shadow-lg">
          <span className="text-2xl">🏆</span><span className="text-white font-bold text-lg">CERTIFICATION EXAM</span><span className="text-2xl">🏆</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Choose Your Certification</h2>
        <p className="text-xl text-white/80">Select a certification to take the exam. Questions are randomized each attempt.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 relative z-10">
        {certificationOrder.map((certType) => {
          const meta = certificationMetadata[certType];
          return (
            <button key={certType} onClick={() => handleSelect(certType)}
              className="relative group overflow-hidden rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 text-left bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-purple-400">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] animate-pulse" />
              <div className="relative z-10">
                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">{meta.icon}</div>
                <h3 className="text-xl font-bold mb-2 drop-shadow-md text-white">{meta.title}</h3>
                <p className="text-white/80 text-sm mb-4">{meta.description}</p>
                <div className="flex items-center gap-2"><span className="text-sm font-medium text-white bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">Start Exam →</span></div>
              </div>
            </button>
          );
        })}
      </div>
      <div className="mt-8 text-center relative z-10">
        <p className="text-white/60 text-sm mb-4">📝 Each exam has randomized questions. 70% or higher required to pass.</p>
        <button onClick={onExit} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 hover:opacity-80 transition-colors" style={{ color: "white", borderColor: "black", backgroundColor: "rgba(0,0,0,0.3)" }}>
          ← Back to Title
        </button>
      </div>
    </ScreenWrapper>
  );
}
