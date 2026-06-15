"use client";


import { Career } from "@/types/game";
import { careerInfoByCareer } from "@/lib/careerInfo";
import { audioSystem } from "@/lib/audio";
import ScreenWrapper from "./ScreenWrapper";
import { AnimatedIcon, AnimatedContainer, Badge } from "./ui/UIComponents";

interface CareerInfoPageProps {
  career: Career;
  onBack?: () => void;
  onStartCareer?: (career: Career) => void;
  onOpenSettings?: () => void;
  onExit?: () => void;
}

const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-2xl border border-white/20 bg-white/10 p-6 shadow-xl backdrop-blur-xl ${className}`}>
    {children}
  </div>
);

export default function CareerInfoPage({ career, onBack, onStartCareer, onOpenSettings, onExit }: CareerInfoPageProps) {
  const info = careerInfoByCareer[career];

  if (!info) {
    return null;
  }

  const handleBack = () => {
    audioSystem.playClickSound();
    onBack?.();
  };

  const handleStart = () => {
    audioSystem.playClickSound();
    onStartCareer?.(career);
  };

  return (
    <ScreenWrapper
      onOpenSettings={onOpenSettings}
      onExit={onExit}
      dark
      fullScreen
      backgroundImage={info.backgroundImage}
    >
      <main className="min-h-screen p-4 md:p-8">
        <div className="mx-auto max-w-6xl">
          <AnimatedContainer className="mb-6">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105"
            >
              ← Back to careers
            </button>
          </AnimatedContainer>

          <section className={`relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br ${info.gradient} p-6 shadow-2xl md:p-10`}>
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/20 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-black/20 blur-3xl"></div>
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
              <div className="text-center lg:text-left">
                <div className="text-7xl md:text-8xl">
                  <AnimatedIcon animate="bounce">{info.icon}</AnimatedIcon>
                </div>
              </div>
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white">
                  Career Information
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-6xl">
                  {info.title}
                </h1>
                <p className="mt-5 text-lg text-white/90 md:text-xl">
                  {info.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                  <button
                    onClick={handleStart}
                    className="rounded-full bg-white px-7 py-4 font-extrabold text-slate-900 shadow-xl transition-all hover:scale-105 hover:bg-blue-50"
                  >
                    Start This Career
                  </button>
                  <button
                    onClick={() => onExit?.()}
                    className="rounded-full border border-white/40 px-7 py-4 font-extrabold text-white transition-all hover:bg-white/15"
                  >
                    Return Home
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <SectionCard>
              <div className="mb-2 flex items-center gap-2 text-amber-300">
                <AnimatedIcon animate="none">💰</AnimatedIcon>
                <span className="text-sm font-extrabold uppercase tracking-wider">Salary Range</span>
              </div>
              <p className="text-2xl font-black text-white">{info.salaryRange}</p>
              <p className="mt-2 text-sm text-white/60">Approximate U.S. range</p>
            </SectionCard>
            <SectionCard>
              <div className="mb-2 flex items-center gap-2 text-emerald-300">
                <AnimatedIcon animate="none">📊</AnimatedIcon>
                <span className="text-sm font-extrabold uppercase tracking-wider">Median Salary</span>
              </div>
              <p className="text-2xl font-black text-white">{info.medianSalary}</p>
              <p className="mt-2 text-sm text-white/60">Varies by location and experience</p>
            </SectionCard>
            <SectionCard>
              <div className="mb-2 flex items-center gap-2 text-sky-300">
                <AnimatedIcon animate="none">🧭</AnimatedIcon>
                <span className="text-sm font-extrabold uppercase tracking-wider">Path to Start</span>
              </div>
              <p className="text-lg font-bold leading-7 text-white">{info.pathToStart}</p>
            </SectionCard>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <SectionCard>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl">📘</span>
                <div>
                  <h2 className="text-2xl font-extrabold text-white">What You Learn</h2>
                  <p className="text-white/60">Core skills used in this career</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {info.skills.map((skill) => (
                  <Badge key={skill} variant="trophy" className="px-4 py-2 text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="mt-8 space-y-4">
                {info.whatYouDo.map((item) => (
                  <div key={item} className="flex gap-4 rounded-xl bg-white/5 p-4">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15 font-black text-white">
                      ✓
                    </span>
                    <p className="text-white/85 text-base leading-7">{item}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard>
              <div className="mb-6 flex items-center gap-3">
                <span className="text-3xl">☀️</span>
                <div>
                  <h2 className="text-2xl font-extrabold text-white">Day in the Life</h2>
                  <p className="text-white/60">A realistic workday snapshot</p>
                </div>
              </div>
              <ol className="space-y-5">
                {info.dayInLife.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 font-black text-slate-900">
                      {index + 1}
                    </span>
                    <p className="text-white/85 text-base leading-7 pt-1">{item}</p>
                  </li>
                ))}
              </ol>
            </SectionCard>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <SectionCard>
              <h2 className="mb-4 text-xl font-extrabold text-white">Tools You&apos;ll Use</h2>
              <ul className="space-y-3">
                {info.tools.map((tool) => (
                  <li key={tool} className="flex items-center gap-3 text-white/80">
                    <span className="h-2 w-2 rounded-full bg-sky-300"></span>
                    {tool}
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard>
              <h2 className="mb-4 text-xl font-extrabold text-white">Training & Certifications</h2>
              <ul className="space-y-3">
                {info.certifications.map((certification) => (
                  <li key={certification} className="flex items-center gap-3 text-white/80">
                    <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
                    {certification}
                  </li>
                ))}
              </ul>
            </SectionCard>
            <SectionCard>
              <h2 className="mb-4 text-xl font-extrabold text-white">Fast Facts</h2>
              <ul className="space-y-3">
                {info.fastFacts.map((fact) => (
                  <li key={fact} className="flex items-start gap-3 text-white/80">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-300"></span>
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </SectionCard>
          </div>

          <div className="mt-8 rounded-3xl border border-white/20 bg-white/10 p-6 text-center shadow-xl backdrop-blur-xl">
            <h2 className="text-2xl font-extrabold text-white">Ready to try it?</h2>
            <p className="mx-auto mt-2 max-w-2xl text-white/70">
              {info.overview}
            </p>
            <button
              onClick={handleStart}
              className="mt-6 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-8 py-4 font-extrabold text-slate-900 shadow-xl transition-all hover:scale-105"
            >
              Start the {info.title} Challenge
            </button>
          </div>
        </div>
      </main>
    </ScreenWrapper>
  );
}
