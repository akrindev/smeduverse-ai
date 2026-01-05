import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse } from "ai";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { checkpointer, createGraphWithTools, initializeMCPClient } from "../services/agent";

// Detect if running on Vercel (serverless) or locally (Bun)
const isVercel = process.env.VERCEL === "1";

/**
 * Backend API handler for Gemini 3 Flash Preview with LangGraph
 * Deployed on Vercel with stateful conversations and memory persistence
 */

// Agent and tool wiring moved to agent.ts

// Create Hono app
const app = new Hono();

const allowedBaseDomain = "smkdiponegoropekalongan.sch.id";

// Add CORS middleware with explicit allowlist
app.use(
  "/*",
  cors({
    origin: (origin) => {
      if (!origin) return null;
      try {
        const hostname = new URL(origin).hostname;
        // Allow apex domain and any subdomain of smkdiponegoropekalongan.sch.id
        return hostname === allowedBaseDomain || hostname.endsWith(`.${allowedBaseDomain}`)
          ? origin
          : null;
      } catch {
        return null;
      }
    },
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "X-CSRF-Token",
      "Access-Control-Allow-Origin",
    ],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Serve static files from dist directory (only in local dev with Bun)
// On Vercel, static files are served from public/ directory via CDN
if (!isVercel) {
  app.use("/cdn/*", serveStatic({ root: "./dist" }));
}

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok" });
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
