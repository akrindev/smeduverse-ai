import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse } from "ai";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { checkpointer, createGraphWithTools, initializeMCPClient } from "./agent";

/**
 * Backend API handler for Gemini 3 Flash Preview with LangGraph
 * Deployed on Vercel with stateful conversations and memory persistence
 */

// Agent and tool wiring moved to agent.ts

// Create Hono app
const app = new Hono();

// Add CORS middleware
app.use("/*", cors());

// Serve static files from dist directory
app.use("/cdn/*", serveStatic({ root: "./dist" }));

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
      { messages: langchainMessages },
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

export default {
  port: 3000,
  fetch: app.fetch,
  idleTimeout: 120, // 120 seconds to allow long-running AI operations
};
