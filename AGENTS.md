# Overview

Smeduverse AI is a React widget for school management AI chat. It uses LangGraph + Gemini for the backend and exports as a standalone library for embedding in other projects.

**Stack:** React 19, TypeScript, Bun, Hono, LangGraph, Tailwind CSS v4, Radix UI

## Setup & Commands

```bash
# Install dependencies
bun install

# Development (backend + frontend)
bun run dev

# Build widget library (ES + UMD)
bun run build:widget

# Build standalone (IIFE with React bundled)
bun run build:standalone

# Type check
bun run lint

# Start backend only
bun run start
```

## Project Structure

```
api/           # Backend (Hono server + LangGraph agent)
  ├── agent.ts    # LangGraph state machine + MCP tools
  ├── chat.ts     # Hono API routes
  └── prompt.ts   # System prompt
src/           # Frontend (React widget)
  ├── widget.tsx              # Library entry point
  ├── components/
  │   ├── SmeduverseAIWidget.tsx  # Main widget component
  │   ├── ai-elements/            # AI chat UI components
  │   └── ui/                     # Radix-based UI primitives
  └── hooks/
      └── useMcpKey.ts            # MCP authentication hook
```

## Code Style & Conventions

### Do
- Use TypeScript strict mode
- Use Tailwind CSS v4 with `@theme` tokens
- Use Radix UI primitives for accessible components
- Use `cn()` from `lib/utils.ts` for class merging
- Use `bun` instead of `npm` or `yarn`
- Keep components small and focused
- Use `marked` for markdown parsing (lightweight)
- Use axios with `withCredentials: true` for authenticated requests

### Don't
- Do not use `framer-motion` (removed for bundle size)
- Do not use `shiki` or `streamdown` (too heavy)
- Do not add heavy dependencies without checking bundle impact
- Do not hardcode colors - use CSS variables
- Do not use `fetch` for MCP key endpoint - use axios with credentials

## TypeScript

- Strict mode enabled
- Path alias: `@/` maps to `src/`
- Target: ES2020
- Use `type` imports when possible: `import type { ... }`

## Component Patterns

```tsx
// Use cn() for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-classes",
  condition && "conditional-classes"
)} />

// Use Radix primitives
import { Button } from "@/components/ui/button";
```

## API Patterns

Backend uses Hono with streaming responses:

```typescript
// api/chat.ts
app.post("/api/chat", async (c) => {
  const { messages, thread_id, mcp_key } = await c.req.json();
  // ... LangGraph streaming
});
```

## Environment Variables

```env
# Backend (required)
GOOGLE_API_KEY=...

# Backend (optional)
MCP_SERVER_URL=http://localhost:2222/mcp/smeduverse

# Frontend (VITE_ prefix)
VITE_API_ENDPOINT=http://localhost:3000/api/chat
VITE_MCP_KEY_ENDPOINT=http://localhost:2222/mcp/key
```

## Bundle Size Guidelines

Current widget size: ~1.1 MB (gzip: ~310 KB)

Before adding dependencies, check their size:
```bash
bun run build:widget
# Check dist/*.js sizes
```

## Git Conventions

- Commit messages: `feat:`, `fix:`, `refactor:`, `docs:`
- Keep PRs small and focused
- Update this file when build/conventions change
