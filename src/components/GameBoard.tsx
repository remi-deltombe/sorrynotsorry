"use client";

import { GameRound, Player } from "@/types/game";
import { config } from "@/config/app.config";
import { PlayerCard } from "./PlayerCard";

interface GameBoardProps {
  round: GameRound;
  onSorry: (player: Player) => void;
  onShowHistory: () => void;
  loading: boolean;
}

export function GameBoard({ round, onSorry, onShowHistory, loading }: GameBoardProps) {
  return (
    <div className="min-h-screen flex flex-col p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Sorry Not Sorry</h1>
        <button
          onClick={onShowHistory}
          className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          History
        </button>
      </div>

      {/* Pledge reminder */}
      <div className="bg-neutral-100 rounded-xl p-4 mb-6">
        <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
          Loser&apos;s pledge
        </p>
        <p className="text-sm font-medium">{round.pledge}</p>
      </div>

      {/* Player cards */}
      <div className="flex-1 grid grid-cols-1 gap-4 content-center">
        <PlayerCard
          name={config.players.player1.name}
          picture={config.players.player1.picture}
          count={round.player1Count}
          limit={round.sorryLimit}
          onClick={() => onSorry("player1")}
          disabled={loading}
          color="pink"
        />
        <PlayerCard
          name={config.players.player2.name}
          picture={config.players.player2.picture}
          count={round.player2Count}
          limit={round.sorryLimit}
          onClick={() => onSorry("player2")}
          disabled={loading}
          color="blue"
        />
      </div>

      {/* Recent events */}
      {round.events.length > 0 && (
        <div className="mt-6">
          <p className="text-xs text-neutral-500 uppercase tracking-wide mb-2">
            Recent
          </p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {round.events
              .slice(-5)
              .reverse()
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between text-sm py-1"
                >
                  <span className="text-neutral-600">
                    {event.player === "player1"
                      ? config.players.player1.name
                      : config.players.player2.name}{" "}
                    said sorry
                  </span>
                  <span className="text-neutral-400 text-xs">
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

