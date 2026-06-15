"use client";

import { CertificationType } from "@/types/game";
import { certificationMetadata } from "@/lib/certificationQuestions";
import ScreenWrapper from "./ScreenWrapper";
import { GradientCard, AnimatedIcon, AnimatedContainer, GameButton } from "./ui/UIComponents";

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
    if (typeof window !== "undefined") { 
      const { audioSystem } = require("@/lib/audio"); 
      audioSystem.playClickSound(); 
    }
    onSelectCertification(certType);
  };

  return (
    <ScreenWrapper onOpenSettings={onOpenSettings} onExit={onExit}>
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 rounded-full mb-6 shadow-xl">
          <AnimatedIcon animate="none" className="text-3xl">🏆</AnimatedIcon>
          <span className="text-white font-bold text-2xl tracking-wide">CERTIFICATION EXAM</span>
          <AnimatedIcon animate="none" className="text-3xl">🏆</AnimatedIcon>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Choose Your Certification
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto">
          Select a certification to take the exam. Questions are randomized each attempt.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {certificationOrder.map((certType, idx) => {
          const meta = certificationMetadata[certType];
          return (
            <AnimatedContainer key={certType} delay={idx * 50}>
              <button 
                onClick={() => handleSelect(certType)}
                className="relative group overflow-hidden rounded-2xl p-7 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 text-left bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 hover:border-purple-400"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-400/30 rounded-full blur-xl"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300 text-center">
                    <AnimatedIcon animate="none">{meta.icon}</AnimatedIcon>
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-white text-center drop-shadow-md">
                    {meta.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-5 text-center">
                    {meta.description}
                  </p>
                  <div className="flex justify-center">
                    <span className="text-sm font-bold text-white bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                      Start Exam →
                    </span>
                  </div>
                </div>
              </button>
            </AnimatedContainer>
          );
        })}
      </div>

      <div className="mt-12 text-center">
        <p className="text-white/60 text-sm mb-6 flex items-center justify-center gap-2">
          <AnimatedIcon animate="none">📝</AnimatedIcon> Each exam has randomized questions. 80% or higher required to pass.
        </p>
        <GameButton onClick={onExit} variant="ghost">
          ← Back to Title
        </GameButton>
      </div>
    </ScreenWrapper>
  );
}