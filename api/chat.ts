import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { createUIMessageStreamResponse } from "ai";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";

/**
 * Backend API handler for Gemini 3 Flash Preview with LangGraph
 * Deployed on Vercel with stateful conversations and memory persistence
 */

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

if (!GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize Gemini model with LangChain
const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: GOOGLE_API_KEY,
  maxOutputTokens: 12000,
  temperature: 0.7,
});

const SYSTEM_PROMPT = `Anda adalah asisten AI Smeduverse yang membantu guru, staf, dan administrator di institusi pendidikan.
Anda membantu dengan:
- Analisis data pendidikan
- Pembuatan rencana pembelajaran (RPP)
- Menjawab pertanyaan seputar kurikulum
- Motivasi siswa dan strategi pengajaran

PENTING - Format Respons:
Anda HARUS menggunakan Markdown untuk memformat respons Anda. Gunakan:
- **bold** untuk penekanan penting
- *italic* untuk penekanan ringan
- \`code\` untuk inline code atau istilah teknis
- \`\`\`language untuk code blocks (JavaScript, SQL, Python, dll)
- - atau 1. untuk lists (bullet points atau numbered)
- [text](url) untuk links
- > untuk blockquotes/kutipan
- jangan pernah gunakan heading, instead gunakan bold

Berikan respons yang ringkas, membantu, dan informatif dalam Bahasa Indonesia dengan format markdown yang baik.`;

async function callModel(state: typeof MessagesAnnotation.State) {
  const systemMessage = {
    role: "system" as const,
    content: SYSTEM_PROMPT,
  };
  const messagesWithSystem = [systemMessage, ...state.messages];
  const response = await model.invoke(messagesWithSystem);
  return { messages: [response] };
}

const checkpointer = new MemorySaver();

const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addEdge("__start__", "agent")
  .addEdge("agent", "__end__")
  .compile({ checkpointer });

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
    const { messages, thread_id } = body;

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

    const stream = await graph.stream(
      { messages: langchainMessages },
      { streamMode: ["values", "messages"], ...config },
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
};
