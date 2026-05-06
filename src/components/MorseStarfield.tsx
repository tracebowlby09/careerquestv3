"use client";

import { useEffect, useState } from "react";

interface MorseStarfieldProps {
  message: string;
  starCount?: number;
}

export default function MorseStarfield({ message, starCount = 40 }: MorseStarfieldProps) {
  const [stars, setStars] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);
  const [litStarId, setLitStarId] = useState<number | null>(null);

  useEffect(() => {
    const newStars = Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 2,
    }));
    setStars(newStars);
  }, [starCount]);

  const morseSequence = useMorseSequence(message);

  useEffect(() => {
    if (stars.length === 0 || morseSequence.length === 0) return;

    let stepIndex = 0;
    let starIndex = 0;

    const interval = setInterval(() => {
      const step = morseSequence[stepIndex];

      if (step.type === 'lit') {
        const star = stars[starIndex % stars.length];
        setLitStarId(star.id);
        starIndex++;
      } else {
        setLitStarId(null);
      }

      stepIndex = (stepIndex + 1) % morseSequence.length;
    }, 2000);

    return () => clearInterval(interval);
  }, [stars, morseSequence]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map((star) => {
        const isLit = litStarId === star.id;
        return (
          <div
            key={star.id}
            className="absolute rounded-full transition-all duration-1000 ease-in-out"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: isLit ? 'rgba(255, 220, 150, 0.9)' : 'rgba(255, 255, 255, 0.2)',
              boxShadow: isLit
                ? `0 0 ${star.size * 3}px ${star.size * 1.5}px rgba(255, 200, 100, 0.4)`
                : 'none',
              opacity: isLit ? 1 : 0.2,
            }}
          />
        );
      })}
    </div>
  );
}

function useMorseSequence(message: string) {
  const morseMap: Record<string, string> = {
    'A': '·-', 'B': '-···', 'C': '-·-·', 'D': '-··', 'E': '·',
    'F': '··-·', 'G': '--·', 'H': '····', 'I': '··', 'J': '·---',
    'K': '-·-', 'L': '·-..', 'M': '--', 'N': '-·', 'O': '---',
    'P': '·--·', 'Q': '--·-', 'R': '·-·', 'S': '···', 'T': '-',
    'U': '··-', 'V': '···-', 'W': '·--', 'X': '-··-', 'Y': '-·--',
    'Z': '--··',
  };

  const DOT_MS = 2000;
  const SYMBOL_GAP_MS = 2000;
  const LETTER_GAP_MS = 6000;

  const buildSequence = () => {
    const seq: Array<{ type: 'lit' | 'gap'; duration: number }> = [];
    const chars = message.toUpperCase().split('');

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (char === ' ') {
        if (seq.length > 0) seq[seq.length - 1].duration += LETTER_GAP_MS - SYMBOL_GAP_MS;
        continue;
      }

      const code = morseMap[char];
      if (!code) continue;

      for (let j = 0; j < code.length; j++) {
        const symbol = code[j];
        seq.push({
          type: 'lit',
          duration: symbol === '·' ? DOT_MS : DOT_MS * 3,
        });
        if (j < code.length - 1) seq.push({ type: 'gap', duration: SYMBOL_GAP_MS });
      }
      if (i < chars.length - 1) seq.push({ type: 'gap', duration: LETTER_GAP_MS });
    }

    if (seq.length === 0) seq.push({ type: 'lit', duration: DOT_MS });
    return seq;
  };

  const [sequence] = useState(buildSequence);
  return sequence;
}
