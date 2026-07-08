# OpenCode Model Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the model provider of smeduverse-ai from Google Gemini to OpenCode Zen using the mimo-v2.5-free model.

**Architecture:** We will replace the Google-specific `@langchain/google-genai` integration with the OpenAI-compatible `@langchain/openai` integration, configured via environment variables for base URL, model name, and API key.

**Tech Stack:** React 19, TypeScript, Bun, Hono, LangGraph, `@langchain/openai`

---

### Task 1: Add Dependency `@langchain/openai`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @langchain/openai package**

Run: `bun add @langchain/openai`
Expected output: Successful installation of `@langchain/openai` and updates to `package.json` and `bun.lock`.

- [ ] **Step 2: Commit dependency changes**

Run:
```bash
git add package.json bun.lock
git commit -m "chore: add @langchain/openai dependency"
```

---

### Task 2: Configure Environment Variables

**Files:**
- Modify: `.env`
- Modify: `.env.example`

- [ ] **Step 1: Update .env.example with new environment variables**

Change in `.env.example`:
Replace line 2:
```text
GOOGLE_API_KEY=your_google_api_key_here
```
with:
```text
OPENCODE_API_KEY=your_opencode_api_key_here
OPENCODE_API_BASE=https://opencode.ai/zen/v1
OPENCODE_MODEL=opencode/mimo-v2.5-free
```

- [ ] **Step 2: Update local .env with new environment variables**

Change in `.env`:
Replace line 2:
```text
GOOGLE_API_KEY=AIzaSyBj12dytbu3KK6CFaXqlPwrKJoOhCgOodY
```
with:
```text
OPENCODE_API_KEY=AIzaSyBj12dytbu3KK6CFaXqlPwrKJoOhCgOodY
OPENCODE_API_BASE=https://opencode.ai/zen/v1
OPENCODE_MODEL=opencode/mimo-v2.5-free
```
*(Note: We preserve the current key value for convenience in case it is compatible or can be reused for verification, or user replaces it later)*

- [ ] **Step 3: Commit environment template changes**

Run:
```bash
git add .env.example
git commit -m "config: replace google env vars with opencode env vars in example"
```

---

### Task 3: Refactor Model Initialization in agent.ts

**Files:**
- Modify: `server/src/services/agent.ts`

- [ ] **Step 1: Update model initialization code**

Modify `server/src/services/agent.ts` to import `ChatOpenAI` and update `getModel()`.

Replace lines 1-28:
```typescript
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver, MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { MultiServerMCPClient } from "@langchain/mcp-adapters";
import { getSystemPrompt } from "../prompts/system.js";

// Lazy initialization to avoid module-level crashes in serverless environments
let model: ChatGoogleGenerativeAI | null = null;

function getModel(): ChatGoogleGenerativeAI {
  if (!model) {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
    
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY environment variable is required");
    }

    model = new ChatGoogleGenerativeAI({
      model: "gemini-3-flash-preview",
      apiKey: GOOGLE_API_KEY,
      maxOutputTokens: 65000,
      temperature: 0.8,
      cache: true,
      maxRetries: 12,
    });
  }
  return model;
}
```
with:
```typescript
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
```

- [ ] **Step 2: Remove unused @langchain/google-genai package**

Run: `bun remove @langchain/google-genai`
Expected output: Package successfully uninstalled.

- [ ] **Step 3: Commit code changes**

Run:
```bash
git add server/src/services/agent.ts package.json bun.lock
git commit -m "feat: migrate agent.ts model to @langchain/openai with OpenCode config"
```

---

### Task 4: Verification and Testing

**Files:**
- None

- [ ] **Step 1: Run type checking**

Run: `bun run typecheck`
Expected: PASS (exit code 0, no compiler errors).

- [ ] **Step 2: Run linter**

Run: `bun run lint`
Expected: PASS (exit code 0, no lint errors).

- [ ] **Step 3: Run local build**

Run: `bun run build`
Expected: PASS (build completes successfully).
