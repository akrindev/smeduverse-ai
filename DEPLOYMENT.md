# Deployment Guide

## Local Development

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY
```

3. Run development server:
```bash
bun run dev
```

This will start:
- Vite dev server on http://localhost:5173
- API server on http://localhost:3000

## Vercel Deployment

### Prerequisites
- Vercel account
- Google AI API key

### Setup Steps

1. Install Vercel CLI (if not already installed):
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Add your Google AI API key:
```bash
vercel env add GOOGLE_API_KEY
```

4. Deploy to Vercel:
```bash
vercel
```

### Configuration Notes

The `vercel.json` file handles:
- ✅ API routing to LangGraph backend
- ✅ Bun runtime for serverless functions
- ✅ 30s max duration for API calls
- ✅ Static file serving for frontend

### Environment Variables Required

- `GOOGLE_API_KEY`: Your Google AI API key
- `MCP_SERVER_URL`: MCP server endpoint (default: `http://localhost:2222/mcp/smeduverse`)

## Architecture Overview

### Backend (api/chat.ts)
- **Model**: Gemini 2.0 Flash Exp
- **Framework**: LangGraph with StateGraph
- **Memory**: In-memory (MemorySaver) for state persistence
- **Streaming**: Uses `toUIMessageStream()` for AI SDK compatibility
- **Message Format**: LangChain `BaseMessage` converted from AI SDK `UIMessage`
- **Tool Integration**: MCP tools via `@langchain/mcp-adapters` with `MultiServerMCPClient`
- **Tool Execution**: ToolNode for executing MCP tools with conditional routing

### Frontend (SmeduverseAIWidget)
- **Transport**: DefaultChatTransport with thread_id support
- **State**: Thread ID persisted in localStorage
- **New Conversation**: Reloads page with new thread_id
- **API Endpoint**: Configurable via props

### Integration Points

1. **Message Conversion**: `toBaseMessages()` converts UI messages → LangChain format
2. **Streaming**: `toUIMessageStream()` converts LangGraph streams → AI SDK format
3. **Memory**: LangGraph checkpointer maintains conversation state across requests
4. **Thread Management**: Client generates unique thread_id, passed with each request
5. **MCP Tools**: `MultiServerMCPClient` connects to MCP server, tools bound to model
6. **Tool Routing**: Conditional edges route to tool execution when model requests tool use

## MCP Integration

### Architecture

The backend now integrates with Model Context Protocol (MCP) servers to provide tool capabilities:

```
User Request → LangGraph Agent → (if tool needed) → ToolNode → MCP Server
                                      ↓
                                    Response
```

### Setup

1. **Configure MCP Server URL**:
```bash
# In .env file
MCP_SERVER_URL=http://localhost:2222/mcp/smeduverse
```

2. **MCP Client Auto-initialization**:
- Backend automatically connects to MCP server on startup
- Tools are discovered and bound to the model
- If MCP server is unavailable, chat continues without tools

3. **Tool Execution Flow**:
- Model decides when to use tools based on user query
- `toolsCondition` checks if tool calls are requested
- `ToolNode` executes tools via MCP protocol
- Results returned to conversation context

### Adding More MCP Servers

To connect additional MCP servers, modify `api/chat.ts`:

```typescript
mcpClient = new MultiServerMCPClient({
  mcpServers: {
    smeduverse: {
      url: "http://localhost:2222/mcp/smeduverse",
      transport: "http",
    },
    // Add more servers:
    filesystem: {
      url: "http://localhost:3001/mcp",
      transport: "http",
    }
  }
});
```

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `bun install`
- Check TypeScript version matches requirements (~5.9.3)

### Runtime Errors
- Verify `GOOGLE_API_KEY` is set in environment variables
- Check Vercel function logs for API errors
- Ensure thread_id is being passed in request body

### Streaming Issues
- Verify `toUIMessageStream()` is being used correctly
- Check that graph is compiled with proper stream modes
- Ensure client is using DefaultChatTransport correctly
