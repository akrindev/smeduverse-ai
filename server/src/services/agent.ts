import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { getSystemPrompt } from "../prompts/system.js";

// Lazy initialization to avoid module-level crashes in serverless environments
let model: ChatOpenAI | null = null;

function getModel(): ChatOpenAI {
  if (!model) {
    const OPENCODE_API_KEY = process.env.OPENCODE_API_KEY || "";
    const OPENCODE_API_BASE = process.env.OPENCODE_API_BASE || "https://opencode.ai/zen/v1";
    const OPENCODE_MODEL = process.env.OPENCODE_MODEL || "opencode/mimo-v2.5-free";

    if (!OPENCODE_API_KEY) {
      throw new Error("OPENCODE_API_KEY environment variable is required");
    }

    model = new ChatOpenAI({
      model: OPENCODE_MODEL,
      apiKey: OPENCODE_API_KEY,
      configuration: {
        baseURL: OPENCODE_API_BASE,
      },
      temperature: 0.8,
      maxRetries: 12,
    });
  }
  return model;
}

// Lazy-initialize checkpointer to avoid module-level instantiation issues in serverless
export const checkpointer = new MemorySaver();

const DEFAULT_MCP_URL = "http://localhost:2222/mcp/smeduverse";

// MCP client cache (initialized per server/key)
let mcpClient: MultiServerMCPClient | null = null;
let lastMcpKey: string | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedTools: any[] = [];

const sanitizeServerUrl = (url: string) => url.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "");

export async function initializeMCPClient(mcpKey?: string) {
  try {
    if (mcpClient && (!mcpKey || mcpKey === lastMcpKey)) {
      return cachedTools;
    }

    // Determine the MCP server URL
    let serverUrl = process.env.MCP_SERVER_URL;

    // Optimization: In Vercel/Production, if no URL is explicitly provided, skip connection
    // This prevents hanging on localhost connections that will never succeed
    const isProduction = process.env.VERCEL === "1" || process.env.NODE_ENV === "production";

    if (!serverUrl) {
      if (isProduction) {
        console.log("No MCP_SERVER_URL provided in production environment. Skipping MCP connection.");
        cachedTools = [];
        return cachedTools;
      }
      // Only default to localhost in local development
      serverUrl = DEFAULT_MCP_URL;
    }

    serverUrl = sanitizeServerUrl(serverUrl);
    console.log(`Connecting to MCP server at ${serverUrl}...`);

    // Build MCP server config with optional authentication
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mcpConfig: any = {
      smeduverse: {
        url: serverUrl,
        transport: "http", // Explicitly use HTTP transport, not SSE
        automaticSSEFallback: false, // Disable SSE fallback since server is HTTP-only
      },
    };

    // Add authentication headers if mcpKey is provided
    if (mcpKey) {
      mcpConfig.smeduverse.headers = {
        Authorization: `Bearer ${mcpKey}`,
      };
      console.log(
        `Using authentication with MCP server (token length: ${mcpKey.length}, starts with: ${mcpKey.substring(0, 10)}...)`,
      );
    } else {
      console.log(`No MCP key provided, connecting without authentication`);
    }

    mcpClient = new MultiServerMCPClient({
      mcpServers: mcpConfig,
    });

    cachedTools = await mcpClient.getTools();
    lastMcpKey = mcpKey || null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.log(`MCP tools loaded: ${cachedTools.map((t: any) => t.name).join(", ") || "none"}`);
    return cachedTools;
  } catch (error) {
    console.warn("Failed to connect to MCP server, continuing without tools:", error);
    cachedTools = [];
    lastMcpKey = mcpKey || null;
    return cachedTools;
  }
}

const createCallModel =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (availableTools: any[]) => async (state: typeof MessagesAnnotation.State) => {
    const systemMessage = {
      role: "system" as const,
      content: getSystemPrompt(),
    };
    const messagesWithSystem = [systemMessage, ...state.messages];

    // Bind tools if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let modelWithTools: any = getModel();
    if (availableTools.length > 0) {
      modelWithTools = getModel().bindTools(availableTools);
    }

    const response = await modelWithTools.invoke(messagesWithSystem);
    return { messages: [response] };
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createGraphWithTools = (availableTools: any[]) =>
  new StateGraph(MessagesAnnotation)
    .addNode("agent", createCallModel(availableTools))
    .addNode("tools", new ToolNode(availableTools))
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", toolsCondition, {
      tools: "tools",
      __end__: "__end__",
    })
    .addEdge("tools", "agent")
    .compile({ checkpointer });
