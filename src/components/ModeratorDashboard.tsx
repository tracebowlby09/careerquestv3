"use client";

import { useState } from "react";
import { CustomTest } from "@/types/game";
import { GradientCard, GameButton } from "./ui/UIComponents";

interface ModeratorDashboardProps {
  currentUser: string | null;
  onBack: () => void;
}

const MODERATOR_USERNAME = "Developer849";

function getStorageTests(prefix: string): CustomTest[] {
  if (typeof window === "undefined") return [];

  const tests: CustomTest[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(prefix)) continue;

    try {
      const raw = localStorage.getItem(key);
      if (raw) tests.push(JSON.parse(raw));
    } catch {}
  }

  return tests;
}

function formatDate(value?: string) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  return date.toLocaleString();
}

export default function ModeratorDashboard({ currentUser, onBack }: ModeratorDashboardProps) {
  const [search, setSearch] = useState("");
  const pendingTests = getStorageTests("customTestPending_");
  const approvedTests = getStorageTests("customTest_");
  const filteredPending = pendingTests.filter((test) => {
    const haystack = `${test.name} ${test.creatorUsername} ${test.code} ${test.description ?? ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });
  const filteredApproved = approvedTests.filter((test) => {
    const haystack = `${test.name} ${test.creatorUsername} ${test.code} ${test.description ?? ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const approveTest = (code: string) => {
    const pendingKey = `customTestPending_${code}`;
    const approvedKey = `customTest_${code}`;
    const raw = localStorage.getItem(pendingKey);
    if (!raw) return;

    try {
      const test: CustomTest = JSON.parse(raw);
      test.approved = true;
      test.approvedBy = MODERATOR_USERNAME;
      test.approvedAt = new Date().toISOString();
      localStorage.setItem(approvedKey, JSON.stringify(test));
      localStorage.removeItem(pendingKey);
      window.location.reload();
    } catch {}
  };

  const rejectTest = (code: string) => {
    localStorage.removeItem(`customTestPending_${code}`);
    window.location.reload();
  };

  const deleteApprovedTest = (code: string) => {
    localStorage.removeItem(`customTest_${code}`);
    window.location.reload();
  };

  const clearPendingTests = () => {
    pendingTests.forEach((test) => localStorage.removeItem(`customTestPending_${test.code}`));
    window.location.reload();
  };

  const clearApprovedTests = () => {
    approvedTests.forEach((test) => localStorage.removeItem(`customTest_${test.code}`));
    window.location.reload();
  };

  const copyCode = async (code: string) => {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    await navigator.clipboard.writeText(code);
  };

  const renderTestPreview = (test: CustomTest) => (
    <div className="mt-4 space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/80">
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-white/50 text-xs">Creator</p>
          <p className="font-bold">@{test.creatorUsername}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-white/50 text-xs">Created</p>
          <p className="font-bold">{formatDate(test.createdAt)}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-white/50 text-xs">Mode</p>
          <p className="font-bold capitalize">{test.mode}{test.difficulty ? ` • ${test.difficulty}` : ""}</p>
        </div>
        <div className="rounded-lg bg-black/20 p-3">
          <p className="text-white/50 text-xs">Approved</p>
          <p className="font-bold">{test.approved ? `${test.approvedBy ?? "Unknown"} • ${formatDate(test.approvedAt)}` : "No"}</p>
        </div>
      </div>

      {test.description && (
        <div className="rounded-lg bg-white/10 p-3 text-white/80">
          <p className="text-white/50 text-xs font-bold mb-1">Description</p>
          <p>{test.description}</p>
        </div>
      )}

      {test.skillsLearned && test.skillsLearned.length > 0 && (
        <div className="rounded-lg bg-white/10 p-3">
          <p className="text-white/50 text-xs font-bold mb-2">Skills Learned</p>
          <div className="flex flex-wrap gap-2">
            {test.skillsLearned.map((skill, index) => (
              <span key={index} className="px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg bg-white/10 p-3">
        <p className="text-white/50 text-xs font-bold mb-2">Questions ({test.questions.length})</p>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {test.questions.map((question, index) => (
            <div key={question.id} className="rounded bg-black/20 p-3">
              <p className="text-white font-semibold mb-1">
                {index + 1}. {question.question}
              </p>
              {question.image && (
                <img
                  src={question.image}
                  alt={`Question ${index + 1} image`}
                  className="mb-2 max-h-56 w-full rounded-lg object-contain bg-white/10"
                />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-white/70 text-sm">
                {question.options.map((option, optionIndex) => (
                  <span key={optionIndex}>
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTestCard = (test: CustomTest, approved: boolean) => (
    <GradientCard key={test.code} className="p-6" gradient="from-white/10 to-white/5">
      <div className="flex justify-between items-start gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{test.icon || "🎓"}</span>
            <div>
              <h3 className="text-xl font-bold text-white break-words">{test.name}</h3>
              <p className="text-white/60 text-sm">Code: {test.code}</p>
            </div>
          </div>
          <p className="text-white/60 text-sm">by @{test.creatorUsername} • {test.questions.length} questions</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${approved ? "bg-green-500/20 text-green-300" : "bg-amber-500/20 text-amber-300"}`}>
          {approved ? "Approved" : "Pending"}
        </span>
      </div>

      {renderTestPreview(test)}

      <div className="flex flex-wrap gap-2 mt-4">
        {approved ? (
          <>
            <GameButton
              onClick={() => copyCode(test.code)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600"
            >
              Copy Code
            </GameButton>
            <GameButton
              onClick={() => deleteApprovedTest(test.code)}
              className="bg-gradient-to-r from-red-500 to-red-600"
            >
              Delete Approved
            </GameButton>
          </>
        ) : (
          <>
            <GameButton
              onClick={() => approveTest(test.code)}
              className="bg-gradient-to-r from-green-500 to-emerald-600"
            >
              ✓ Approve
            </GameButton>
            <GameButton
              onClick={() => rejectTest(test.code)}
              className="bg-gradient-to-r from-red-500 to-red-600"
            >
              ✗ Reject
            </GameButton>
          </>
        )}
      </div>
    </GradientCard>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Developer Dashboard</h1>
            <p className="text-white/60 mt-1">
              Custom test management for admin panel users{currentUser ? ` • Signed in as @${currentUser}` : ""}.
            </p>
          </div>
          <GameButton onClick={onBack} className="bg-gradient-to-r from-gray-700 to-gray-800">Back to Title</GameButton>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <GradientCard className="p-4" gradient="from-white/10 to-white/5">
            <p className="text-white/50 text-sm">Pending</p>
            <p className="text-2xl font-extrabold text-white">{pendingTests.length}</p>
          </GradientCard>
          <GradientCard className="p-4" gradient="from-white/10 to-white/5">
            <p className="text-white/50 text-sm">Approved</p>
            <p className="text-2xl font-extrabold text-white">{approvedTests.length}</p>
          </GradientCard>
          <GradientCard className="p-4" gradient="from-white/10 to-white/5">
            <p className="text-white/50 text-sm">Total</p>
            <p className="text-2xl font-extrabold text-white">{pendingTests.length + approvedTests.length}</p>
          </GradientCard>
          <GradientCard className="p-4" gradient="from-white/10 to-white/5">
            <p className="text-white/50 text-sm">Questions</p>
            <p className="text-2xl font-extrabold text-white">{[...pendingTests, ...approvedTests].reduce((sum, test) => sum + test.questions.length, 0)}</p>
          </GradientCard>
        </div>

        <div className="mb-6">
          <label className="block text-white font-bold text-sm mb-2">Search tests</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, creator, code, or description"
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <GameButton onClick={clearPendingTests} disabled={pendingTests.length === 0} className="bg-gradient-to-r from-orange-500 to-red-600 disabled:opacity-50 disabled:cursor-not-allowed">
            Clear Pending
          </GameButton>
          <GameButton onClick={clearApprovedTests} disabled={approvedTests.length === 0} className="bg-gradient-to-r from-slate-600 to-slate-800 disabled:opacity-50 disabled:cursor-not-allowed">
            Clear Approved
          </GameButton>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Pending Tests ({filteredPending.length})</h2>
            {filteredPending.length === 0 ? (
              <GradientCard className="p-6 text-center" gradient="from-white/10 to-white/5">
                <p className="text-white/70">No pending tests match this view.</p>
              </GradientCard>
            ) : (
              <div className="space-y-4">
                {filteredPending.map((test) => renderTestCard(test, false))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Approved Tests ({filteredApproved.length})</h2>
            {filteredApproved.length === 0 ? (
              <GradientCard className="p-6 text-center" gradient="from-white/10 to-white/5">
                <p className="text-white/70">No approved tests match this view.</p>
              </GradientCard>
            ) : (
              <div className="space-y-4">
                {filteredApproved.map((test) => renderTestCard(test, true))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
