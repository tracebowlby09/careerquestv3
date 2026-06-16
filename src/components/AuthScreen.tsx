"use client";

import { useState } from "react";
import { GradientCard, GameButton } from "./ui/UIComponents";

interface AuthScreenProps {
  onLogin: (username: string, password: string) => { success: boolean; reason?: string };
  onSignup: (username: string, password: string) => { success: boolean; reason?: string };
  onPlayAsGuest: () => void;
  onBack: () => void;
}

export default function AuthScreen({ onLogin, onSignup, onPlayAsGuest, onBack }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    if (isLogin) {
      const result = onLogin(username, password);
      if (!result.success) {
        setError(result.reason || "Login failed");
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      const result = onSignup(username, password);
      if (!result.success) {
        setError(result.reason || "Sign up failed");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
      <GradientCard gradient="from-purple-600 via-blue-600 to-indigo-600" className="p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">👤</div>
          <h2 className="text-3xl font-extrabold text-white mb-2">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-white/70 text-sm">
            {isLogin
              ? "Log in to save your progress across devices"
              : "Sign up to save your career quest progress"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-bold text-sm mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:outline-none"
              placeholder="Enter username"
              minLength={3}
            />
          </div>

          <div>
            <label className="block text-white font-bold text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:outline-none"
              placeholder="Enter password"
              minLength={4}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-white font-bold text-sm mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white placeholder-white/50 focus:border-white/50 focus:outline-none"
                placeholder="Confirm password"
                minLength={4}
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/20 border border-red-400/50">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <GameButton
            onClick={handleSubmit}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </GameButton>
        </form>

        <div className="mt-4 space-y-3">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
            }}
            className="w-full py-2 text-white/80 hover:text-white text-sm transition-colors"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
          </button>

          <button
            onClick={onPlayAsGuest}
            className="w-full py-3 rounded-full bg-white/10 border-2 border-white/30 text-white font-bold hover:bg-white/20 transition-transform"
          >
            🎮 Play as Guest
          </button>

          <button
            onClick={onBack}
            className="w-full py-2 text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Back to Title
          </button>
        </div>
      </GradientCard>
    </div>
  );
}
