/**
 * MCP (Model Context Protocol) HTTP Client for Smeduverse AI
 *
 * This client allows the LangGraph agent to connect to external MCP servers
 * via HTTP/SSE transport, enabling dynamic tool discovery and execution.
 *
 * Note: This is a placeholder for future MCP integration.
 * When MCP servers are available, this client will dynamically load
 * additional tools from those servers.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export interface MCPServerConfig {
	name: string;
	url: string;
	description?: string;
}

export interface MCPTool {
	name: string;
	description: string;
	inputSchema: Record<string, unknown>;
}

/**
 * MCP HTTP Client class for connecting to MCP servers
 */
export class MCPHttpClient {
	private client: Client | null = null;
	private transport: StreamableHTTPClientTransport | null = null;
	private serverConfig: MCPServerConfig;
	private connected = false;

	constructor(config: MCPServerConfig) {
		this.serverConfig = config;
	}

	/**
	 * Connect to the MCP server
	 */
	async connect(): Promise<void> {
		if (this.connected) {
			console.log(`Already connected to MCP server: ${this.serverConfig.name}`);
			return;
		}

		try {
			const url = new URL(this.serverConfig.url);

			this.transport = new StreamableHTTPClientTransport(url);

			this.client = new Client({
				name: "smeduverse-ai-agent",
				version: "1.0.0",
			});

			await this.client.connect(this.transport);
			this.connected = true;

			console.log(`Connected to MCP server: ${this.serverConfig.name}`);
		} catch (error) {
			console.error(
				`Failed to connect to MCP server ${this.serverConfig.name}:`,
				error
			);
			throw error;
		}
	}

	/**
	 * Disconnect from the MCP server
	 */
	async disconnect(): Promise<void> {
		if (!this.connected || !this.client) {
			return;
		}

		try {
			await this.client.close();
			this.connected = false;
			this.client = null;
			this.transport = null;
			console.log(`Disconnected from MCP server: ${this.serverConfig.name}`);
		} catch (error) {
			console.error(
				`Error disconnecting from MCP server ${this.serverConfig.name}:`,
				error
			);
		}
	}

	/**
	 * List available tools from the MCP server
	 */
	async listTools(): Promise<MCPTool[]> {
		if (!this.connected || !this.client) {
			throw new Error("Not connected to MCP server");
		}

		try {
			const response = await this.client.listTools();

			return response.tools.map((tool) => ({
				name: tool.name,
				description: tool.description || "",
				inputSchema: tool.inputSchema as Record<string, unknown>,
			}));
		} catch (error) {
			console.error("Failed to list tools:", error);
			return [];
		}
	}

	/**
	 * Call a tool on the MCP server
	 */
	async callTool(
		toolName: string,
		args: Record<string, unknown>
	): Promise<unknown> {
		if (!this.connected || !this.client) {
			throw new Error("Not connected to MCP server");
		}

		try {
			const response = await this.client.callTool({
				name: toolName,
				arguments: args,
			});

			return response.content;
		} catch (error) {
			console.error(`Failed to call tool ${toolName}:`, error);
			throw error;
		}
	}

	/**
	 * Check if connected to MCP server
	 */
	isConnected(): boolean {
		return this.connected;
	}

	/**
	 * Get server configuration
	 */
	getServerConfig(): MCPServerConfig {
		return this.serverConfig;
	}
}

/**
 * Create MCP client from environment variable
 */
export function createMCPClientFromEnv(
	mcpServerUrl?: string
): MCPHttpClient | null {
	const url = mcpServerUrl;

	if (!url) {
		console.log("MCP_SERVER_URL not set, MCP integration disabled");
		return null;
	}

	return new MCPHttpClient({
		name: "smeduverse-mcp",
		url: url,
		description: "Smeduverse MCP Server for additional educational tools",
	});
}

/**
 * Get or create MCP client instance
 */
export async function getMCPClient(
	mcpServerUrl?: string
): Promise<MCPHttpClient | null> {
	const client = createMCPClientFromEnv(mcpServerUrl);

	if (client) {
		try {
			await client.connect();
			return client;
		} catch {
			console.warn("Failed to connect to MCP server, continuing without MCP");
			return null;
		}
	}

	return null;
}
