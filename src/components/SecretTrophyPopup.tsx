"use client";

import { useEffect, useState } from "react";

interface SecretTrophyPopupProps {
  show: boolean;
  onClose: () => void;
}

export default function SecretTrophyPopup({ show, onClose }: SecretTrophyPopupProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show && !visible) return null;

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      }`}
    >
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white px-8 py-4 rounded-xl shadow-2xl border-2 border-yellow-400">
        <div className="flex items-center gap-4">
          <div className="text-4xl animate-bounce">🏆</div>
          <div>
            <h3 className="text-xl font-bold text-yellow-300">
              SECRET TROPHY UNLOCKED!
            </h3>
            <p className="text-white font-semibold">
              🎮 Konami Code Master - You found the easter egg!
            </p>
          </div>
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onClose, 300);
            }}
            className="ml-4 text-white hover:text-yellow-300 text-2xl font-bold"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
