"use client";

import { useState, useEffect } from "react";
import { audioSystem } from "@/lib/audio";
import { GradientCard, GameButton, AnimatedIcon } from "./ui/UIComponents";

interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  readableLayout: boolean;
  reduceMotion: boolean;
}

const ACCESSIBILITY_KEY = "careerQuestAccessibilityPreferences";

const defaultAccessibilityPreferences: AccessibilityPreferences = {
  highContrast: false,
  largeText: false,
  readableLayout: false,
  reduceMotion: false,
};

function applyAccessibilityPreferences(preferences: AccessibilityPreferences) {
  document.body.classList.toggle("cq-high-contrast", preferences.highContrast);
  document.body.classList.toggle("cq-large-text", preferences.largeText);
  document.body.classList.toggle("cq-readable-layout", preferences.readableLayout);
  document.body.classList.toggle("cq-reduce-motion", preferences.reduceMotion);
}
interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: () => void;
}

export default function Settings({ isOpen, onClose, onSettingsChange }: SettingsProps) {
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [accessibilityPreferences, setAccessibilityPreferences] = useState<AccessibilityPreferences>(defaultAccessibilityPreferences);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ACCESSIBILITY_KEY);
      const parsed = saved ? JSON.parse(saved) : defaultAccessibilityPreferences;
      const next = { ...defaultAccessibilityPreferences, ...parsed };
      setAccessibilityPreferences(next);
      applyAccessibilityPreferences(next);
    } catch {
      applyAccessibilityPreferences(defaultAccessibilityPreferences);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setMusicVolume(audioSystem.getMusicVolume() * 100);
      setSfxVolume(audioSystem.getSfxVolume() * 100);
    }
  }, [isOpen]);

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
    audioSystem.setMusicVolume(value / 100);
    onSettingsChange?.();
  };

  const handleSfxVolumeChange = (value: number) => {
    setSfxVolume(value);
    audioSystem.setSfxVolume(value / 100);
    audioSystem.playClickSound();
    onSettingsChange?.();
  };

  const updateAccessibilityPreference = (key: keyof AccessibilityPreferences, value: boolean) => {
    const next = { ...accessibilityPreferences, [key]: value };
    setAccessibilityPreferences(next);
    localStorage.setItem(ACCESSIBILITY_KEY, JSON.stringify(next));
    applyAccessibilityPreferences(next);
    onSettingsChange?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Settings">
      <GradientCard 
        gradient="from-white/20 to-white/10 backdrop-blur-xl" 
        className="p-8 max-w-md w-full border border-white/20"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-3xl transition-colors"
          >
            ×
          </button>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-white font-bold text-lg flex items-center gap-2">
                🎵 Background Music
              </label>
              <span className="text-amber-400 font-bold text-xl">{musicVolume}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={musicVolume}
                onChange={(e) => handleMusicVolumeChange(Number(e.target.value))}
                className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer accent-amber-400"
              />
              <div 
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full pointer-events-none"
                style={{ width: `${musicVolume}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-white font-bold text-lg flex items-center gap-2">
                🔊 Sound Effects
              </label>
              <span className="text-amber-400 font-bold text-xl">{sfxVolume}%</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={sfxVolume}
                onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
                className="w-full h-3 bg-white/20 rounded-full appearance-none cursor-pointer accent-amber-400"
              />
              <div 
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full pointer-events-none"
                style={{ width: `${sfxVolume}%` }}
              ></div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-extrabold text-xl mb-4">Accessibility</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between gap-4 rounded-xl bg-white/10 p-4 border border-white/15">
                <span>
                  <span className="block text-white font-bold">High Contrast Text</span>
                  <span className="block text-white/65 text-sm">Improves readability with a black and white theme.</span>
                </span>
                <input
                  type="checkbox"
                  checked={accessibilityPreferences.highContrast}
                  onChange={(e) => updateAccessibilityPreference("highContrast", e.target.checked)}
                  className="w-6 h-6 accent-amber-400"
                  aria-label="Enable high contrast text"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-xl bg-white/10 p-4 border border-white/15">
                <span>
                  <span className="block text-white font-bold">Larger Text</span>
                  <span className="block text-white/65 text-sm">Increases base text size across the game.</span>
                </span>
                <input
                  type="checkbox"
                  checked={accessibilityPreferences.largeText}
                  onChange={(e) => updateAccessibilityPreference("largeText", e.target.checked)}
                  className="w-6 h-6 accent-amber-400"
                  aria-label="Enable larger text"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-xl bg-white/10 p-4 border border-white/15">
                <span>
                  <span className="block text-white font-bold">Readable Layout</span>
                  <span className="block text-white/65 text-sm">Adds larger spacing, line height, and softer card shapes.</span>
                </span>
                <input
                  type="checkbox"
                  checked={accessibilityPreferences.readableLayout}
                  onChange={(e) => updateAccessibilityPreference("readableLayout", e.target.checked)}
                  className="w-6 h-6 accent-amber-400"
                  aria-label="Enable readable layout"
                />
              </label>

              <label className="flex items-center justify-between gap-4 rounded-xl bg-white/10 p-4 border border-white/15">
                <span>
                  <span className="block text-white font-bold">Reduce Motion</span>
                  <span className="block text-white/65 text-sm">Disables animations and bouncing icons.</span>
                </span>
                <input
                  type="checkbox"
                  checked={accessibilityPreferences.reduceMotion}
                  onChange={(e) => updateAccessibilityPreference("reduceMotion", e.target.checked)}
                  className="w-6 h-6 accent-amber-400"
                  aria-label="Reduce motion"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-white/20">
            <p className="text-white/70 text-sm text-center">
              Adjust volumes to your preference. Changes are saved automatically.
            </p>
          </div>
        </div>

        <GameButton onClick={onClose} className="w-full mt-8 text-lg">
          Close
        </GameButton>
      </GradientCard>
    </div>
  );
}