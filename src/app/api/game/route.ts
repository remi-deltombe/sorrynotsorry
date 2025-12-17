import { NextRequest, NextResponse } from "next/server";
import { getGameState, startNewRound, addSorry, resetCurrentRound, resetDatabase } from "@/lib/kv";
import { Player } from "@/types/game";

export async function GET() {
  try {
    const state = await getGameState();
    return NextResponse.json(state);
  } catch (error) {
    console.error("Failed to get game state:", error);
    return NextResponse.json({ error: "Failed to get game state" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "start": {
        const { sorryLimit, pledge } = body;
        const round = await startNewRound(sorryLimit, pledge);
        return NextResponse.json({ success: true, round });
      }

      case "sorry": {
        const { player } = body as { action: string; player: Player };
        const round = await addSorry(player);
        const state = await getGameState();
        return NextResponse.json({ success: true, round, state });
      }

      case "reset": {
        await resetCurrentRound();
        return NextResponse.json({ success: true });
      }

      case "resetdb": {
        await resetDatabase();
        return NextResponse.json({ success: true, message: "Database reset" });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Game action failed:", error);
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}

