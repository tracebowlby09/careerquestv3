"use client";

import { useState, useEffect } from "react";
import { audioSystem } from "@/lib/audio";
import { GradientCard, GameButton, AnimatedIcon } from "./ui/UIComponents";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: () => void;
}

export default function Settings({ isOpen, onClose, onSettingsChange }: SettingsProps) {
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(50);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
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