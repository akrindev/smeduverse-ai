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

## Architecture Overview

### Backend (api/chat.ts)
- **Model**: Gemini 2.0 Flash Exp
- **Framework**: LangGraph with StateGraph
- **Memory**: In-memory (MemorySaver) for state persistence
- **Streaming**: Uses `toUIMessageStream()` for AI SDK compatibility
- **Message Format**: LangChain `BaseMessage` converted from AI SDK `UIMessage`

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

## Next Steps for MCP Tools Integration

When ready to add HTTP MCP tools:

1. Install MCP client:
```bash
bun add @modelcontextprotocol/sdk
```

2. Define tools in LangGraph nodes:
```typescript
async function toolNode(state: typeof MessagesAnnotation.State) {
  const toolCalls = state.messages.at(-1)?.tool_calls;
  if (!toolCalls) return { messages: [] };

  // Execute MCP tools here
  const results = await executeMCPCalls(toolCalls);
  return { messages: results };
}
```

3. Update graph structure:
```typescript
const graph = new StateGraph(MessagesAnnotation)
  .addNode("agent", callModel)
  .addNode("tools", toolNode)
  .addEdge("__start__", "agent")
  .addConditionalEdges("agent", shouldContinue, {
    continue: "tools",
    end: "__end__"
  })
  .addEdge("tools", "agent")
  .compile({ checkpointer });
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
