# Sorry Not Sorry

A fun web app to track who says "sorry" first in a game between Katya and Remi.

## How It Works

1. **Login** - Enter the password to access the app
2. **Setup** - Set the sorry limit and the loser's pledge
3. **Play** - Tap a player's card when they say "sorry"
4. **Game Over** - When someone reaches the limit, they lose and must fulfill the pledge!

## Configuration

Edit `src/config/app.config.ts` to change:

- **Password** - Change `password` to secure your app
- **Player names** - Update `players.player1` and `players.player2`
- **Default sorry limit** - Adjust `defaultSorryLimit`

## Development

```bash
npm install
npm run dev
```

## Deployment to Vercel

### 1. Create a Vercel KV Store

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Create or select your project
3. Go to the **Storage** tab
4. Click **Create Database** and select **KV**
5. Follow the prompts to create your KV store
6. Connect it to your project

### 2. Deploy

```bash
# Using Vercel CLI
npm i -g vercel
vercel

# Or push to GitHub and connect to Vercel
```

The app will automatically use the KV store for persistence across all devices.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Vercel KV (Redis-compatible)

