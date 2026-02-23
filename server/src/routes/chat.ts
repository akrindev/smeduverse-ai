import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse } from "ai";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { checkpointer, createGraphWithTools, initializeMCPClient } from "../services/agent.js";

// Detect if running on Vercel (serverless) or locally (Bun)
const isVercel = process.env.VERCEL === "1";

/**
 * Backend API handler for Gemini 3 Flash Preview with LangGraph
 * Deployed on Vercel with stateful conversations and memory persistence
 */

// Agent and tool wiring moved to agent.ts

// Create Hono app
const app = new Hono();

// Add CORS middleware with explicit allowlist
app.use(
  "/*",
  cors({
    origin: [
      "https://smkdiponegoropekalongan.sch.id",
      "https://ai.smkdiponegoropekalongan.sch.id",
      "https://smeduverse.smkdiponegoropekalongan.sch.id",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:8080",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
    ],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "X-CSRF-Token",
      "Cache-Control",
      "Pragma",
    ],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 86400,
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.options("/api/chat", (c) => {
  return c.body(null, 204);
});

app.post("/api/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { messages, thread_id, mcp_key } = body;

    const tools = await initializeMCPClient(mcp_key);

    if (!messages || !Array.isArray(messages)) {
      return c.json({ error: "Messages array is required" }, 400);
    }

    const config = {
      configurable: {
        thread_id: thread_id || crypto.randomUUID(),
      },
      checkpointer,
    };

    const langchainMessages = await toBaseMessages(messages);

    const graph = createGraphWithTools(tools);

    const stream = await graph.stream(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { messages: langchainMessages as any },
      {
        streamMode: ["values", "messages"],
        ...config,
      },
    );

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(stream),
    });
  } catch (error) {
    console.error("Chat request error:", error);
    return c.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      500,
    );
  }
});

// Export the Hono app
// - For Vercel: exports the app instance directly (used via api/index.ts)
// - For local Bun: exports config object with port and fetch handler
export { app };

export default isVercel
  ? app
  : {
      port: 3000,
      fetch: app.fetch,
      idleTimeout: 120, // 120 seconds to allow long-running AI operations
    };
