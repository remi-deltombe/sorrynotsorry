import { GameState, GameRound, Player, SorryEvent } from "@/types/game";
import { Redis } from "@upstash/redis";

const GAME_STATE_KEY = "sorry-game-state";

// Get Redis credentials - support multiple env var naming conventions
function getRedisCredentials(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  
  if (url && token) {
    return { url, token };
  }
  return null;
}

// Create Redis client lazily
let redisClient: Redis | null = null;
function getRedisClient(): Redis | null {
  const credentials = getRedisCredentials();
  if (!credentials) {
    console.error("Redis credentials not found. Available env vars:", Object.keys(process.env).filter(k => k.includes('UPSTASH') || k.includes('KV') || k.includes('REDIS')));
    return null;
  }
  
  if (!redisClient) {
    redisClient = new Redis({
      url: credentials.url,
      token: credentials.token,
    });
  }
  return redisClient;
}

export async function getGameState(): Promise<GameState> {
  const redis = getRedisClient();
  if (!redis) {
    throw new Error("Redis not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.");
  }
  
  const state = await redis.get<GameState>(GAME_STATE_KEY);
  return state || { currentRound: null, history: [] };
}

export async function saveGameState(state: GameState): Promise<void> {
  const redis = getRedisClient();
  if (!redis) {
    throw new Error("Redis not configured. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.");
  }
  
  await redis.set(GAME_STATE_KEY, state);
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
