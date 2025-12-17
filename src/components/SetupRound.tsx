"use client";

import { useState } from "react";
import { config } from "@/config/app.config";

interface SetupRoundProps {
  onStart: (sorryLimit: number, pledge: string) => void;
  loading: boolean;
}

export function SetupRound({ onStart, loading }: SetupRoundProps) {
  const [sorryLimit, setSorryLimit] = useState<number>(config.defaultSorryLimit);
  const [pledge, setPledge] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledge.trim()) return;
    onStart(sorryLimit, pledge.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-medium tracking-tight mb-2">
            New Round
          </h1>
          <p className="text-sm text-neutral-500">
            Set the rules for this round
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Sorry Limit
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="3"
                max="50"
                value={sorryLimit}
                onChange={(e) => setSorryLimit(Number(e.target.value))}
                className="flex-1 accent-neutral-900"
              />
              <span className="w-12 text-center font-mono text-lg">
                {sorryLimit}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              First to say &quot;sorry&quot; {sorryLimit} times loses
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Loser&apos;s Pledge
            </label>
            <textarea
              value={pledge}
              onChange={(e) => setPledge(e.target.value)}
              placeholder="What must the loser do?"
              rows={3}
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !pledge.trim()}
            className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Starting..." : "Start Round"}
          </button>
        </form>
      </div>
    </div>
  );
}

