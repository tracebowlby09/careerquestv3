"use client";

import { useState, useEffect, useRef } from "react";
import { audioSystem } from "@/lib/audio";
import { Career } from "@/types/game";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const careerInfo: { career: Career; name: string; icon: string }[] = [
  { career: "programmer", name: "Programmer", icon: "💻" },
  { career: "nurse", name: "Nurse", icon: "🏥" },
  { career: "engineer", name: "Engineer", icon: "🏗️" },
  { career: "teacher", name: "Teacher", icon: "📚" },
  { career: "chef", name: "Chef", icon: "👨‍🍳" },
  { career: "architect", name: "Architect", icon: "🏛️" },
];

const STORAGE_KEY = "careerQuestBackgrounds";

interface Backgrounds {
  [career: string]: string | null;
}

function loadBackgrounds(): Backgrounds {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return {};
    }
  }
  return {};
}

function saveBackgrounds(backgrounds: Backgrounds) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(backgrounds));
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
  const [musicVolume, setMusicVolume] = useState(30);
  const [sfxVolume, setSfxVolume] = useState(50);
  const [backgrounds, setBackgrounds] = useState<Backgrounds>({});
  const [activeTab, setActiveTab] = useState<"audio" | "backgrounds">("audio");
  const fileInputRefs = useRef<{ [career: string]: HTMLInputElement | null }>({});

  // Sync with audio system when settings opens
  useEffect(() => {
    if (isOpen) {
      setMusicVolume(audioSystem.getMusicVolume() * 100);
      setSfxVolume(audioSystem.getSfxVolume() * 100);
      setBackgrounds(loadBackgrounds());
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

  const handleImageUpload = (career: Career, file: File | null) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const newBackgrounds = { ...backgrounds, [career]: result };
      setBackgrounds(newBackgrounds);
      saveBackgrounds(newBackgrounds);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBackground = (career: Career) => {
    const newBackgrounds = { ...backgrounds, [career]: null };
    setBackgrounds(newBackgrounds);
    saveBackgrounds(newBackgrounds);
    // Reset file input
    if (fileInputRefs.current[career]) {
      fileInputRefs.current[career]!.value = "";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            onClick={() => setActiveTab("audio")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "audio"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            🎵 Audio
          </button>
          <button
            onClick={() => setActiveTab("backgrounds")}
            className={`px-4 py-2 font-semibold ${
              activeTab === "backgrounds"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            🖼️ Backgrounds
          </button>
        </div>

        {activeTab === "audio" && (
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
        )}

        {activeTab === "backgrounds" && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              Upload custom backgrounds for each career. The default gradient will be used if no image is set.
            </p>

            {careerInfo.map(({ career, name, icon }) => (
              <div key={career} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{icon}</span>
                  <span className="font-semibold">{name}</span>
                </div>

                {backgrounds[career] ? (
                  <div className="space-y-2">
                    <div className="relative h-24 rounded-lg overflow-hidden">
                      <img
                        src={backgrounds[career]!}
                        alt={`${name} background`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveBackground(career)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      ✕ Remove custom background
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={(el) => { fileInputRefs.current[career] = el; }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(career, e.target.files?.[0] || null)}
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

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
