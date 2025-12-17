"use client";

import { useState, useEffect, useCallback } from "react";
import { GameState, GameRound, Player } from "@/types/game";
import { Login } from "@/components/Login";
import { SetupRound } from "@/components/SetupRound";
import { GameBoard } from "@/components/GameBoard";
import { GameOver } from "@/components/GameOver";
import { History } from "@/components/History";

type View = "login" | "setup" | "game" | "gameover" | "history";

export default function Home() {
  const [view, setView] = useState<View>("login");
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [lastEndedRound, setLastEndedRound] = useState<GameRound | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchGameState = useCallback(async () => {
    try {
      const res = await fetch("/api/game");
      if (res.ok) {
        const state: GameState = await res.json();
        setGameState(state);

        if (state.currentRound?.isActive) {
          setView("game");
        } else if (!state.currentRound) {
          setView("setup");
        }
      }
    } catch (error) {
      console.error("Failed to fetch game state:", error);
    }
  }, []);

  useEffect(() => {
    // Check if already authenticated
    const isAuth = localStorage.getItem("sorry-auth");
    if (isAuth) {
      setView("setup");
      fetchGameState();
    }
  }, [fetchGameState]);

  const handleLoginSuccess = () => {
    fetchGameState();
  };

  const handleStartRound = async (sorryLimit: number, pledge: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start", sorryLimit, pledge }),
      });

      if (res.ok) {
        const { round } = await res.json();
        setGameState((prev) => ({
          ...prev!,
          currentRound: round,
        }));
        setView("game");
      }
    } catch (error) {
      console.error("Failed to start round:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSorry = async (player: Player) => {
    setLoading(true);
    try {
      const res = await fetch("/api/game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "sorry", player }),
      });

      if (res.ok) {
        const { state } = await res.json();
        
        // Check if the game just ended
        if (!state.currentRound && gameState?.currentRound) {
          // Game ended - show game over screen
          setLastEndedRound(state.history[0]);
          setGameState(state);
          setView("gameover");
        } else {
          setGameState(state);
        }
      }
    } catch (error) {
      console.error("Failed to record sorry:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewRound = () => {
    setLastEndedRound(null);
    setView("setup");
  };

  const handleShowHistory = () => {
    setView("history");
  };

  const handleBackFromHistory = () => {
    if (gameState?.currentRound?.isActive) {
      setView("game");
    } else if (lastEndedRound) {
      setView("gameover");
    } else {
      setView("setup");
    }
  };

  // Render based on view
  switch (view) {
    case "login":
      return <Login onSuccess={handleLoginSuccess} />;

    case "setup":
      return <SetupRound onStart={handleStartRound} loading={loading} />;

    case "game":
      if (!gameState?.currentRound) return null;
      return (
        <GameBoard
          round={gameState.currentRound}
          onSorry={handleSorry}
          onShowHistory={handleShowHistory}
          loading={loading}
        />
      );

    case "gameover":
      if (!lastEndedRound) return null;
      return (
        <GameOver
          round={lastEndedRound}
          onNewRound={handleNewRound}
          onShowHistory={handleShowHistory}
        />
      );

    case "history":
      return (
        <History
          history={gameState?.history || []}
          onBack={handleBackFromHistory}
        />
      );

    default:
      return null;
  }
}

