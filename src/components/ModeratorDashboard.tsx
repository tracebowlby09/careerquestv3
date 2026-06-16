"use client";

import { CustomTest } from "@/types/game";
import { GradientCard, GameButton } from "./ui/UIComponents";

interface ModeratorDashboardProps {
  currentUser: string | null;
  onBack: () => void;
}

const MODERATOR_USERNAME = "Developer849";

export default function ModeratorDashboard({ currentUser, onBack }: ModeratorDashboardProps) {
  const isModerator = currentUser === MODERATOR_USERNAME;
  
  if (!isModerator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8 flex items-center justify-center">
        <GradientCard className="p-8 max-w-md" gradient="from-red-600 to-red-800">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-white/70 mb-4">Only the moderator account ({MODERATOR_USERNAME}) can access this page.</p>
          <GameButton onClick={onBack}>Back to Title</GameButton>
        </GradientCard>
      </div>
    );
  }

  // Get all pending tests
  const getPendingTests = (): CustomTest[] => {
    if (typeof window === "undefined") return [];
    const tests: CustomTest[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("customTestPending_")) {
        try {
          const test = JSON.parse(localStorage.getItem(key)!);
          tests.push(test);
        } catch {}
      }
    }
    return tests;
  };

  const pendingTests = getPendingTests();
  const totalTests = pendingTests.length;

  const approveTest = (code: string) => {
    const pendingKey = `customTestPending_${code}`;
    const approvedKey = `customTest_${code}`;
    const raw = localStorage.getItem(pendingKey);
    if (raw) {
      const test: CustomTest = JSON.parse(raw);
      test.approved = true;
      test.approvedBy = MODERATOR_USERNAME;
      test.approvedAt = new Date().toISOString();
      localStorage.setItem(approvedKey, JSON.stringify(test));
      localStorage.removeItem(pendingKey);
      window.location.reload();
    }
  };

  const rejectTest = (code: string) => {
    const key = `customTestPending_${code}`;
    localStorage.removeItem(key);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-white">Moderator Dashboard</h1>
          <GameButton onClick={onBack} className="bg-gradient-to-r from-gray-700 to-gray-800">Back to Title</GameButton>
        </div>

        {totalTests === 0 ? (
          <GradientCard className="p-8 text-center" gradient="from-white/10 to-white/5">
            <p className="text-white/70 text-lg">No pending tests to approve.</p>
          </GradientCard>
        ) : (
          <div className="space-y-4">
            {pendingTests.map((test) => (
              <GradientCard key={test.code} className="p-6" gradient="from-white/10 to-white/5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white">{test.name}</h3>
                    <p className="text-white/60 text-sm">by @{test.creatorUsername} • {test.mode} mode</p>
                    <p className="text-amber-400 font-bold mt-1">Code: {test.code}</p>
                  </div>
                  <span className="text-xs bg-amber-500/20 px-2 py-1 rounded">{test.questions.length} questions</span>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <GameButton 
                    onClick={() => approveTest(test.code)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600"
                  >
                    ✓ Approve
                  </GameButton>
                  <GameButton 
                    onClick={() => rejectTest(test.code)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600"
                  >
                    ✗ Reject
                  </GameButton>
                </div>
              </GradientCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}