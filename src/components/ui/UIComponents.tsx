"use client";

import { ReactNode } from "react";

const cardStyles = {
  base: "rounded-2xl shadow-xl transition-all duration-300",
  elevated: "rounded-2xl shadow-2xl hover:shadow-3xl",
  interactive: "rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer",
};

const buttonStyles = {
  primary: "bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-6 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-200",
  secondary: "bg-white text-gray-800 font-bold py-3 px-5 rounded-lg border-2 border-gray-200 hover:bg-gray-50 hover:scale-105 transition-all duration-200",
  success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200",
  danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold py-3 px-5 rounded-lg hover:from-red-600 hover:to-rose-700 transition-all duration-200",
  ghost: "bg-white/10 text-white font-bold py-2 px-4 rounded-lg hover:bg-white/20 transition-all duration-200",
};

const badgeStyles = {
  easy: "bg-gradient-to-r from-green-400 to-emerald-500 text-white",
  medium: "bg-gradient-to-r from-yellow-400 to-orange-500 text-white",
  hard: "bg-gradient-to-r from-red-400 to-pink-500 text-white",
  trophy: "bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-500 text-white",
};

export function GameCard({ 
  children, 
  className = "", 
  interactive = false,
  elevated = false 
}: { 
  children: ReactNode; 
  className?: string; 
  interactive?: boolean;
  elevated?: boolean;
}) {
  const baseClass = interactive ? cardStyles.interactive : elevated ? cardStyles.elevated : cardStyles.base;
  return (
    <div className={`${baseClass} bg-white ${className}`}>
      {children}
    </div>
  );
}

export function GradientCard({
  children,
  className = "",
  gradient = "from-blue-500 to-indigo-600",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  gradient?: string;
  interactive?: boolean;
}) {
  return (
    <div className={`
      rounded-2xl shadow-xl 
      bg-gradient-to-br ${gradient}
      ${interactive ? "hover:shadow-2xl hover:scale-105 hover:-translate-y-1 cursor-pointer transition-all duration-300" : ""}
      ${className}
    `}>
      {children}
    </div>
  );
}

export function GameButton({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success" | "danger" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const baseClass = buttonStyles[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClass}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  variant = "easy",
  className = "",
}: {
  children: ReactNode;
  variant?: "easy" | "medium" | "hard" | "trophy";
  className?: string;
}) {
  return (
    <span className={`
      inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold
      ${badgeStyles[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}

export function AnimatedIcon({
  children,
  animate = "bounce",
  className = "",
}: {
  children: ReactNode;
  animate?: "bounce" | "pulse" | "spin" | "none";
  className?: string;
}) {
  const animationClass = {
    bounce: "animate-bounce",
    pulse: "animate-pulse",
    spin: "animate-spin",
    none: "",
  }[animate];
  
  return (
    <span className={`inline-block ${animationClass} ${className}`}>
      {children}
    </span>
  );
}

export function AnimatedContainer({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div 
      className={`animate-fadeIn ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function Confetti({ show = false }: { show?: boolean }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3000}ms`,
            animationDuration: `${3 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  );
}