import { GameState, GameRound, Player, SorryEvent } from "@/types/game";
import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

const GAME_STATE_KEY = "sorry-game-state";
const LOCAL_FILE_PATH = path.join(process.cwd(), ".game-state.json");

// Check if Upstash Redis is available at runtime
function isUpstashAvailable(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

// Create Redis client lazily
let redisClient: Redis | null = null;
function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redisClient;
}

// Local file-based storage for development
async function getLocalState(): Promise<GameState> {
  try {
    const data = await fs.readFile(LOCAL_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { currentRound: null, history: [] };
  }
}

async function saveLocalState(state: GameState): Promise<void> {
  await fs.writeFile(LOCAL_FILE_PATH, JSON.stringify(state, null, 2));
}

export async function getGameState(): Promise<GameState> {
  if (isUpstashAvailable()) {
    const redis = getRedisClient();
    const state = await redis.get<GameState>(GAME_STATE_KEY);
    return state || { currentRound: null, history: [] };
  }
  return getLocalState();
}

export async function saveGameState(state: GameState): Promise<void> {
  if (isUpstashAvailable()) {
    const redis = getRedisClient();
    await redis.set(GAME_STATE_KEY, state);
  } else {
    await saveLocalState(state);
  }
}

export async function startNewRound(
  sorryLimit: number,
  pledge: string
): Promise<GameRound> {
  const state = await getGameState();

  const newRound: GameRound = {
    id: crypto.randomUUID(),
    sorryLimit,
    pledge,
    player1Count: 0,
    player2Count: 0,
    events: [],
    startedAt: new Date().toISOString(),
    endedAt: null,
    loser: null,
    isActive: true,
  };

  state.currentRound = newRound;
  await saveGameState(state);
  return newRound;
}

export async function addSorry(player: Player): Promise<GameRound | null> {
  const state = await getGameState();

  if (!state.currentRound || !state.currentRound.isActive) {
    return null;
  }

  const event: SorryEvent = {
    id: crypto.randomUUID(),
    player,
    timestamp: new Date().toISOString(),
  };

  state.currentRound.events.push(event);

  if (player === "player1") {
    state.currentRound.player1Count++;
  } else {
    state.currentRound.player2Count++;
  }

  // Check if game is over
  const count =
    player === "player1"
      ? state.currentRound.player1Count
      : state.currentRound.player2Count;

  if (count >= state.currentRound.sorryLimit) {
    state.currentRound.loser = player;
    state.currentRound.isActive = false;
    state.currentRound.endedAt = new Date().toISOString();
    state.history.unshift(state.currentRound);
    state.currentRound = null;
  }

  await saveGameState(state);
  return state.currentRound;
}

export async function getCurrentRound(): Promise<GameRound | null> {
  const state = await getGameState();
  return state.currentRound;
}

export async function getHistory(): Promise<GameRound[]> {
  const state = await getGameState();
  return state.history;
}

export async function resetCurrentRound(): Promise<void> {
  const state = await getGameState();
  if (state.currentRound) {
    state.currentRound.isActive = false;
    state.currentRound.endedAt = new Date().toISOString();
    state.history.unshift(state.currentRound);
    state.currentRound = null;
    await saveGameState(state);
  }
}
