/**
 * App Configuration
 */

export const config = {
  // Password from environment variable
  password: process.env.APP_PASSWORD || "",

  // Player configuration
  players: {
    player1: {
      name: "Katya",
      picture: process.env.NEXT_PUBLIC_PLAYER1_PICTURE || "",
    },
    player2: {
      name: "Remi",
      picture: process.env.NEXT_PUBLIC_PLAYER2_PICTURE || "",
    },
  },

  // Default sorry limit before losing
  defaultSorryLimit: 15,
};
