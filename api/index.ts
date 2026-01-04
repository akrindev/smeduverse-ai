/**
 * Vercel Serverless Function Entry Point
 *
 * This file exports the Hono app for Vercel deployment.
 * Vercel automatically detects api/index.ts and serves it as a serverless function.
 *
 * For local development, use: bun run dev (which runs server/src/routes/chat.ts directly)
 * For Vercel deployment, this file is used as the entry point.
 */

import { app } from "../server/src/routes/chat.js";

// Export the Hono app for Vercel
// Vercel's Bun runtime expects a default export of the Hono app instance
export default app;
