import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

/**
 * CopilotKit Runtime API with MCP Integration and Google Gemini
 *
 * This backend serves as the bridge between the React frontend (CopilotKit)
 * and the AI capabilities for Smeduverse educational assistant.
 *
 * Architecture:
 * 1. CopilotKit Runtime handles the frontend communication
 * 2. Google Gemini is used as the LLM via GoogleGenerativeAIAdapter
 * 3. MCP Server provides educational tools dynamically
 */

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const MCP_SERVER_URL = process.env.MCP_SERVER_URL || "https://smeduverse.salju.test/mcp/smeduverse";

if (!GOOGLE_API_KEY) {
  console.error("ERROR: GOOGLE_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize Google Gemini adapter for LLM access
const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: "gemini-2.5-flash-preview-05-20",
});

/**
 * Create an MCP client that implements CopilotKit's MCPClient interface
 * Uses StreamableHTTPClientTransport (the recommended transport over deprecated SSE)
 */
async function createMCPClientInstance(config: { endpoint: string; apiKey?: string }) {
  const url = new URL(config.endpoint);
  const transport = new StreamableHTTPClientTransport(url);

  const client = new Client({
    name: "smeduverse-copilotkit",
    version: "1.0.0",
  });

  await client.connect(transport);

  return {
    async tools() {
      const response = await client.listTools();
      const toolsMap: Record<
        string,
        {
          description?: string;
          schema?: { parameters?: { properties?: Record<string, unknown>; required?: string[] } };
          execute: (params: unknown) => Promise<unknown>;
        }
      > = {};

      for (const tool of response.tools) {
        toolsMap[tool.name] = {
          description: tool.description,
          schema: {
            parameters: {
              properties:
                (tool.inputSchema as { properties?: Record<string, unknown> })?.properties || {},
              required: (tool.inputSchema as { required?: string[] })?.required || [],
            },
          },
          execute: async (params: unknown) => {
            const result = await client.callTool({
              name: tool.name,
              arguments: params as Record<string, unknown>,
            });
            return result.content;
          },
        };
      }

      return toolsMap;
    },
    async close() {
      await client.close();
    },
  };
}

// Create CopilotKit Runtime with MCP server integration
const runtime = new CopilotRuntime({
  mcpServers: [{ endpoint: MCP_SERVER_URL }],
  createMCPClient: createMCPClientInstance,
});

// Create the endpoint handler using Next.js App Router style (works with Vercel)
const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
  runtime,
  serviceAdapter,
  endpoint: "/api/copilotkit",
});

// Export handlers for Vercel API routes
export async function POST(req: Request) {
  return handleRequest(req);
}

export async function GET() {
  return new Response(
    JSON.stringify({
      status: "ok",
      model: "gemini-2.5-flash-preview-05-20",
      mcp_server: MCP_SERVER_URL,
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}

// For local development with Bun
const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health check
    if (
      url.pathname === "/health" ||
      (url.pathname === "/api/copilotkit" && req.method === "GET")
    ) {
      const response = await GET();
      // Add CORS headers
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
      return new Response(response.body, { status: response.status, headers });
    }

    // CopilotKit endpoint
    if (url.pathname === "/api/copilotkit" && req.method === "POST") {
      const response = await POST(req);
      // Add CORS headers
      const headers = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));
      return new Response(response.body, { status: response.status, headers });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`
Smeduverse AI Backend Started
-------------------------------
Server: http://localhost:${server.port}
Model: gemini-2.5-flash-preview-05-20
MCP Server: ${MCP_SERVER_URL}

Tools are loaded dynamically from the MCP server.
`);
