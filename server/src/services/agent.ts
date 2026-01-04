import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { getSystemPrompt } from "../prompts/system.js";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "http://localhost:2222/mcp/smeduverse";

if (!GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize Gemini model with LangChain
const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  apiKey: GOOGLE_API_KEY,
  maxOutputTokens: 65000,
  temperature: 0.8,
  cache: true,
  maxRetries: 12,
  // thinkingConfig: {
  //   includeThoughts: true,
  //   thinkingLevel: "MEDIUM",
  // },
});

export const checkpointer = new MemorySaver();

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

    const serverUrl = sanitizeServerUrl(MCP_SERVER_URL);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createCallModel =
  (availableTools: any[]) => async (state: typeof MessagesAnnotation.State) => {
    const systemMessage = {
      role: "system" as const,
      content: getSystemPrompt(),
    };
    const messagesWithSystem = [systemMessage, ...state.messages];

    // Bind tools if available
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let modelWithTools: any = model;
    if (availableTools.length > 0) {
      modelWithTools = model.bindTools(availableTools);
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
