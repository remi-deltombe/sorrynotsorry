"use client";

import { GameRound } from "@/types/game";
import { config } from "@/config/app.config";

interface GameOverProps {
  round: GameRound;
  onNewRound: () => void;
  onShowHistory: () => void;
}

export function GameOver({ round, onNewRound, onShowHistory }: GameOverProps) {
  const loserName =
    round.loser === "player1"
      ? config.players.player1
      : config.players.player2;

  const winnerName =
    round.loser === "player1"
      ? config.players.player2
      : config.players.player1;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Trophy */}
        <div className="text-6xl mb-6">🏆</div>

        {/* Winner announcement */}
        <h1 className="text-2xl font-medium mb-2">{winnerName} wins!</h1>
        <p className="text-neutral-500 mb-8">
          {loserName} said sorry {round.sorryLimit} times
        </p>

        {/* Pledge */}
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8">
          <p className="text-xs text-red-400 uppercase tracking-wide mb-2">
            {loserName} must now
          </p>
          <p className="text-lg font-medium text-red-700">{round.pledge}</p>
        </div>

        {/* Final score */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold">{round.player1Count}</p>
            <p className="text-sm text-neutral-500">{config.players.player1}</p>
          </div>
          <div className="text-2xl text-neutral-300">vs</div>
          <div className="text-center">
            <p className="text-3xl font-bold">{round.player2Count}</p>
            <p className="text-sm text-neutral-500">{config.players.player2}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onNewRound}
            className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            New Round
          </button>
          <button
            onClick={onShowHistory}
            className="w-full py-3 border border-neutral-200 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
}

