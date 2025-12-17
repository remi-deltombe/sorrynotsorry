/**
 * App Configuration
 */

export const config = {
  // Password from environment variable
  password: process.env.APP_PASSWORD || "",

  // Player names
  players: {
    player1: "Katya",
    player2: "Remi",
  },

  // Default sorry limit before losing
  defaultSorryLimit: 15,
};
