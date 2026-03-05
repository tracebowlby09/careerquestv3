"use client";

import { useState, useEffect } from "react";
import { audioSystem } from "@/lib/audio";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(50);

  // Sync with audio system when settings opens
  useEffect(() => {
    if (isOpen) {
      setMusicVolume(audioSystem.getMusicVolume() * 100);
      setSfxVolume(audioSystem.getSfxVolume() * 100);
    }
  }, [isOpen]);

  const handleMusicVolumeChange = (value: number) => {
    setMusicVolume(value);
    audioSystem.setMusicVolume(value / 100);
  };

  const handleSfxVolumeChange = (value: number) => {
    setSfxVolume(value);
    audioSystem.setSfxVolume(value / 100);
    // Play click sound to test volume
    audioSystem.playClickSound();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Music Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-semibold">
                🎵 Background Music
              </label>
              <span className="text-gray-600">{musicVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={musicVolume}
              onChange={(e) => handleMusicVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* SFX Volume */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-gray-700 font-semibold">
                🔊 Sound Effects
              </label>
              <span className="text-gray-600">{sfxVolume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={sfxVolume}
              onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 text-center">
              Adjust volumes to your preference. Changes are saved automatically.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
