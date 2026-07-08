# Design Spec: Migrate Model Provider to OpenCode Zen

**Date:** 2026-07-08  
**Status:** Proposed  
**Topic:** Model Provider Migration (Google Gemini -> OpenCode Zen)

## 1. Goal
Migrate the AI model provider of the `smeduverse-ai` backend from Google Gemini (`gemini-3-flash-preview` / `@langchain/google-genai`) to OpenCode Zen (`opencode/mimo-v2.5-free` via an OpenAI-compatible interface using `@langchain/openai`).

## 2. Configuration & Dependencies

### 2.1 Dependency Changes
* Add `@langchain/openai` to `package.json` dependencies.
* Remove `@langchain/google-genai` from `package.json` dependencies if it is no longer used.

### 2.2 Environment Variables
The following environment variables will be added/configured in the backend environment:
* `OPENCODE_API_KEY`: API Key for accessing the OpenCode Zen endpoint.
* `OPENCODE_API_BASE`: (Optional) Custom API endpoint. Defaults to `https://opencode.ai/zen/v1`.
* `OPENCODE_MODEL`: (Optional) Custom model ID. Defaults to `opencode/mimo-v2.5-free`.

The following environment variables will no longer be required (but can remain for fallback/other setups):
* `GOOGLE_API_KEY`

## 3. Code Modifications

### 3.1 Model Instantiation in `server/src/services/agent.ts`
* Update imports: replace `ChatGoogleGenerativeAI` with `ChatOpenAI` from `@langchain/openai`.
* Modify `getModel()` to return an instance of `ChatOpenAI` configured with the OpenCode baseURL and apiKey.

```typescript
import { ChatOpenAI } from "@langchain/openai";

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

## 4. Verification & Testing

### 4.1 Automated Tests
* Verify TypeScript compilation with `bun run typecheck`.
* Verify ESLint check with `bun run lint`.

### 4.2 Manual Verification
* Start local dev servers (`bun run dev`).
* Verify chat interface is working correctly by sending messages.
* Confirm that MCP tools are initialized and called correctly by the agent.
