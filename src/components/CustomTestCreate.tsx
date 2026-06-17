"use client";

import { useState } from "react";
import { GameButton, GradientCard } from "./ui/UIComponents";
import { CustomTest, CustomQuestion } from "@/types/game";

interface CustomTestCreateProps {
  onBack: () => void;
  onTestCreated: (test: CustomTest, code: string) => void;
  currentUser: string | null;
  initialTest?: CustomTest | null;
}

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const generateCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const createDefaultQuestion = (): CustomQuestion => ({
  id: Date.now().toString(),
  question: "",
  options: ["", "", "", ""],
  correctIndex: 0,
  explanation: ""
});

export default function CustomTestCreate({ onBack, onTestCreated, currentUser, initialTest }: CustomTestCreateProps) {
  const [testName, setTestName] = useState(initialTest?.name ?? "");
  const [description, setDescription] = useState(initialTest?.description ?? "");
  const [icon, setIcon] = useState(initialTest?.icon ?? "🎓");
  const [skillsLearned, setSkillsLearned] = useState<string[]>(() => {
    const defaults = ["", "", ""];
    return initialTest?.skillsLearned?.length ? [...initialTest.skillsLearned, ...defaults].slice(0, 3) : defaults;
  });
  const [mode, setMode] = useState<"challenge" | "quick-recall">(initialTest?.mode ?? "challenge");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(initialTest?.difficulty ?? "medium");
  const [questions, setQuestions] = useState<CustomQuestion[]>(() => {
    return initialTest?.questions?.length ? initialTest.questions.map(q => ({ ...q, options: [...q.options], explanation: q.explanation ?? "" })) : [createDefaultQuestion()];
  });

  const [primaryColor, setPrimaryColor] = useState(initialTest?.themeColors?.primary ?? "#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState(initialTest?.themeColors?.secondary ?? "#8b5cf6");
  const [accentColor, setAccentColor] = useState(initialTest?.themeColors?.accent ?? "#fbbf24");
  const [backgroundImage, setBackgroundImage] = useState(initialTest?.backgroundImage ?? "");
  const [imageError, setImageError] = useState<string | null>(null);

  const addQuestion = () => {
    setQuestions([...questions, createDefaultQuestion()]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const updateQuestion = (id: string, field: keyof CustomQuestion, value: string | number) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateQuestionImage = (id: string, file: File | null) => {
    if (!file) return;
    setImageError(null);

    if (file.type && !file.type.startsWith("image/")) {
      setImageError("Please upload an image file.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("Question photos must be smaller than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      updateQuestion(id, "image", String(reader.result));
    };
    reader.onerror = () => setImageError("Could not read that image.");
    reader.readAsDataURL(file);
  };

  const updateOption = (qId: string, optIdx: number, value: string) => {
    setQuestions(questions.map(q => 
      q.id === qId ? { ...q, options: q.options.map((opt, idx) => idx === optIdx ? value : opt) } : q
    ));
  };

  const updateSkill = (idx: number, value: string) => {
    setSkillsLearned(skillsLearned.map((skill, skillIdx) => skillIdx === idx ? value : skill));
  };

  const handleCreate = () => {
    if (!testName.trim()) return;
    if (!icon.trim()) return;
    if (skillsLearned.some(skill => !skill.trim())) return;
    if (questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()))) return;

    const code = initialTest?.code || generateCode();
    const test: CustomTest = {
       id: initialTest?.id || Date.now().toString(),
       code,
       name: testName.trim(),
       description: description.trim() || undefined,
       icon: icon.trim(),
       skillsLearned: skillsLearned.map(skill => skill.trim()),
       creatorUsername: currentUser || "Guest",
       mode,
      ...(mode === "challenge" && { difficulty }),
      questions: questions.map(q => ({
        ...q,
        question: q.question.trim(),
        options: q.options.map(option => option.trim()),
        explanation: q.explanation?.trim() || undefined,
        image: q.image || undefined,
      })),
      themeColors: {
        primary: primaryColor !== "#3b82f6" ? primaryColor : undefined,
        secondary: secondaryColor !== "#8b5cf6" ? secondaryColor : undefined,
        accent: accentColor !== "#fbbf24" ? accentColor : undefined,
      },
      backgroundImage: backgroundImage || undefined,
      createdAt: initialTest?.createdAt || new Date().toISOString(),
      approved: false
    };

    const pendingKey = `customTestPending_${code}`;
    localStorage.setItem(pendingKey, JSON.stringify(test));
    
    if (initialTest) {
      localStorage.removeItem(`customTest_${code}`);
    }

    onTestCreated(test, code);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <GradientCard className="p-6 mb-6" gradient="from-purple-600 via-blue-600 to-indigo-600">
          <h2 className="text-2xl font-bold text-white mb-4">{initialTest ? "Edit Custom Quiz" : "Create Custom Quiz"}</h2>
          {initialTest?.approved && (
            <p className="text-white/70 mb-4 text-sm">
              This approved quiz has been moved back to pending review. The code will stay the same until it is approved again.
            </p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white font-bold text-sm mb-1">Quiz Name</label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white"
                placeholder="My Custom Career Quiz"
              />
            </div>
            
            <div>
              <label className="block text-white font-bold text-sm mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as "challenge" | "quick-recall")}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white"
              >
                <option value="challenge">Challenge Mode</option>
                <option value="quick-recall">Quick Recall Mode</option>
              </select>
            </div>

            {mode === "challenge" && (
              <div>
                <label className="block text-white font-bold text-sm mb-1">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-white font-bold text-sm mb-1">Test Icon Emoji</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white text-center text-2xl"
                placeholder="🎓"
                maxLength={6}
              />
            </div>

            {skillsLearned.map((skill, idx) => (
              <div key={idx}>
                <label className="block text-white font-bold text-sm mb-1">Skill {idx + 1}</label>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => updateSkill(idx, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white"
                  placeholder={`Skill learned ${idx + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-white font-bold text-sm mb-1">Test Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white"
              placeholder="Describe what players will learn in this custom test..."
              rows={3}
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-white mb-2">Theme Colors</h3>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-white/70 text-xs mb-1">Primary</label>
                <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-full h-10 rounded" />
              </div>
              <div>
                <label className="block text-white/70 text-xs mb-1">Secondary</label>
                <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-full h-10 rounded" />
              </div>
              <div>
                <label className="block text-white/70 text-xs mb-1">Accent</label>
                <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="w-full h-10 rounded" />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-white font-bold text-sm mb-1">Background Image URL (optional)</label>
            <input
              type="text"
              value={backgroundImage}
              onChange={(e) => setBackgroundImage(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border-2 border-white/20 text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </GradientCard>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-white">Questions ({questions.length})</h3>
            <GameButton onClick={addQuestion} className="text-sm">Add Question</GameButton>
          </div>
          
          {questions.map((q, idx) => (
            <GradientCard key={q.id} className="p-4" gradient="from-white/10 to-white/5">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-white font-bold">Question {idx + 1}</h4>
                {questions.length > 1 && (
                  <button onClick={() => removeQuestion(q.id)} className="text-red-400 hover:text-red-300">✕</button>
                )}
              </div>
              
              <textarea
                value={q.question}
                onChange={(e) => updateQuestion(q.id, "question", e.target.value)}
                className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white mb-2"
                placeholder="Enter your question here..."
                rows={2}
              />

              <div className="mb-3">
                <label className="block text-white font-bold text-sm mb-1">Question Photo (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => updateQuestionImage(q.id, e.target.files?.[0] ?? null)}
                  className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm file:mr-3 file:rounded file:border-0 file:bg-white/20 file:px-3 file:py-2 file:text-white"
                />
                {q.image && (
                  <div className="mt-3">
                    <img src={q.image} alt={`Question ${idx + 1} preview`} className="max-h-64 w-full object-contain rounded-lg border border-white/20 bg-black/20" />
                    <button onClick={() => updateQuestion(q.id, "image", "")} className="mt-2 text-sm text-red-300 hover:text-red-200">
                      Remove Photo
                    </button>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-2">
                {q.options.map((opt, optIdx) => (
                  <input
                    key={optIdx}
                    type="text"
                    value={opt}
                    onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                    className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white"
                    placeholder={`Option ${optIdx + 1}`}
                  />
                ))}
              </div>
              
              <select
                value={q.correctIndex}
                onChange={(e) => updateQuestion(q.id, "correctIndex", parseInt(e.target.value))}
                className="px-3 py-1 rounded bg-white/10 border border-white/20 text-white mb-2"
              >
                <option value={0}>Option 1 is correct</option>
                <option value={1}>Option 2 is correct</option>
                <option value={2}>Option 3 is correct</option>
                <option value={3}>Option 4 is correct</option>
              </select>
              
              <textarea
                value={q.explanation || ""}
                onChange={(e) => updateQuestion(q.id, "explanation", e.target.value)}
                className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white"
                placeholder="Explanation (optional)"
                rows={1}
              />
            </GradientCard>
          ))}
        </div>

        {imageError && (
          <div className="mb-4 rounded-lg bg-red-500/20 border border-red-400/50 p-3 text-center text-red-200 text-sm">
            {imageError}
          </div>
        )}

        <div className="flex gap-3">
          <GameButton type="button" onClick={handleCreate} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600">
            {initialTest ? "Save Quiz for Reapproval" : "Create Quiz & Generate Code"}
          </GameButton>
          <GameButton onClick={onBack} className="bg-gradient-to-r from-gray-700 to-gray-800">
            Cancel
          </GameButton>
        </div>
      </div>
    </div>
  );
}
