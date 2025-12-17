"use client";

import { GameRound } from "@/types/game";
import { config } from "@/config/app.config";

interface HistoryProps {
  history: GameRound[];
  onBack: () => void;
}

export function History({ history, onBack }: HistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-medium">Game History</h1>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          No games played yet
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((round) => {
            const loserName =
              round.loser === "player1"
                ? config.players.player1
                : config.players.player2;
            const winnerName =
              round.loser === "player1"
                ? config.players.player2
                : config.players.player1;

            return (
              <div
                key={round.id}
                className="border border-neutral-200 rounded-xl overflow-hidden"
              >
                {/* Round header */}
                <div className="bg-neutral-50 p-4 border-b border-neutral-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {winnerName} won
                    </span>
                    <span className="text-sm text-neutral-500">
                      {formatDate(round.startedAt)}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span>
                      {config.players.player1}: {round.player1Count}
                    </span>
                    <span>
                      {config.players.player2}: {round.player2Count}
                    </span>
                  </div>
                </div>

                {/* Pledge */}
                <div className="p-4 border-b border-neutral-200">
                  <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                    Pledge
                  </p>
                  <p className="text-sm">
                    {loserName}: {round.pledge}
                  </p>
                </div>

                {/* Timeline */}
                <details className="group">
                  <summary className="p-4 cursor-pointer hover:bg-neutral-50 transition-colors flex items-center justify-between">
                    <span className="text-sm font-medium">
                      Timeline ({round.events.length} events)
                    </span>
                    <span className="text-neutral-400 group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {round.events.map((event, index) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-500">
                            {index + 1}
                          </span>
                          <span className="flex-1">
                            {event.player === "player1"
                              ? config.players.player1
                              : config.players.player2}
                          </span>
                          <span className="text-neutral-400 text-xs">
                            {formatTime(event.timestamp)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

