# Smeduverse AI

✨ Artificial Intelligence Powered School Management System with LangGraph Integration

## Features

- 🤖 **AI Chat Assistant** - Educational support for teachers and administrators
- 🧠 **LangGraph Architecture** - Stateful conversations with memory
- 🔧 **MCP Tools Integration** - Connect to external tools via Model Context Protocol
- 🎯 **Gemini 2.0 Flash** - Fast, high-quality responses
- 💾 **Thread Persistence** - Conversation state maintained via localStorage
- 🔌 **Vercel Ready** - Optimized for serverless deployment

## Tech Stack

- **Frontend**: React 19 + Vite
- **AI Framework**: LangGraph + LangChain
- **LLM**: Google Gemini 2.0 Flash Exp
- **Tool Integration**: Model Context Protocol (MCP) via @langchain/mcp-adapters
- **UI Components**: Radix UI + Tailwind CSS
- **Runtime**: Bun

## Quick Start

```bash
bun install
cp .env.example .env
# Add GOOGLE_API_KEY to .env
bun run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide.

## Project Structure

```
smeduverse-ai/
├── api/
│   └── chat.ts          # LangGraph backend with Gemini
├── src/
│   ├── components/
│   │   ├── SmeduverseAIWidget.tsx  # Main chat widget
│   │   └── ai-elements/            # UI components
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   └── main.tsx
├── DEPLOYMENT.md
└── package.json
```

## Environment Variables

- `GOOGLE_API_KEY` - Google AI API key for Gemini model
- `MCP_SERVER_URL` - URL to MCP server (default: `http://localhost:2222/mcp/smeduverse`)

## License

Private project
