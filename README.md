# Smeduverse AI Widget

A powerful, AI-powered school management chat widget built with React, LangGraph, and Gemini. This widget can be embedded into any web application to provide intelligent assistance to users.

## Features

- 🤖 **AI Chat Assistant**: Context-aware educational support.
- 🧠 **LangGraph Integration**: Stateful conversations with memory and reasoning.
- 🛠️ **MCP Tools**: Extensible tool system via Model Context Protocol.
- 🎨 **Customizable UI**: Built with Tailwind CSS and Radix UI.
- 📦 **Flexible Integration**: Use as a React component or a standalone script.

## Installation

### Prerequisites

- Node.js (v18+) or Bun (v1+)
- A backend server running the Smeduverse AI API (included in this repo)

### Building the Widget

To build the widget for production:

```bash
# Install dependencies
bun install

# Build for React applications (ES Module & UMD)
bun run build:widget

# Build for non-React applications (Standalone IIFE)
bun run build:standalone
```

The build artifacts will be generated in the `dist/` directory:
- `smeduverse-ai.es.js`: ES Module for bundlers.
- `smeduverse-ai.umd.js`: UMD build.
- `smeduverse-ai.standalone.js`: Self-contained bundle with React included.

---

## Implementation Guide

### 1. React Application

If you are using a React application, install the package (or link it locally) and import the component.

```tsx
import { SmeduverseAIWidget } from 'smeduverse-ai-agent';
import 'smeduverse-ai-agent/dist/style.css'; // If CSS is not inlined

function App() {
  return (
    <div className="App">
      <SmeduverseAIWidget 
        apiEndpoint="http://localhost:3000/api/chat"
        mcpKeyEndpoint="http://localhost:2222/mcp/key"
        title="School Assistant"
        initialMessage="Hello! How can I help you with school management today?"
      />
    </div>
  );
}
```

### 2. Standalone HTML (Script Tag)

For legacy applications or non-React sites, use the standalone build. This bundles React and ReactDOM so you don't need to provide them.

#### Option A: Automatic Initialization
Add the `data-smeduverse-ai` attribute to a container div. The widget will automatically mount there.

```html
<!DOCTYPE html>
<html>
<head>
    <title>My School App</title>
</head>
<body>
    <!-- Widget Container -->
    <div 
        data-smeduverse-ai
        data-api-endpoint="http://localhost:3000/api/chat"
        data-mcp-key-endpoint="http://localhost:2222/mcp/key"
        data-title="Smeduverse Assistant"
        data-position="bottom-right"
    ></div>

    <!-- Load the Script -->
    <script src="./dist/smeduverse-ai.standalone.js"></script>
</body>
</html>
```

#### Option B: Manual Initialization
You can manually initialize the widget using the global `SmeduverseAI` object.

```html
<div id="my-widget-container"></div>

<script src="./dist/smeduverse-ai.standalone.js"></script>
<script>
    SmeduverseAI.init({
        containerId: 'my-widget-container',
        apiEndpoint: 'http://localhost:3000/api/chat',
        title: 'Custom Assistant',
        theme: 'light'
    });
</script>
```

---

## Configuration

### Props / Data Attributes

| Prop Name        | Data Attribute          | Type    | Default         | Description                                      |
| ---------------- | ----------------------- | ------- | --------------- | ------------------------------------------------ |
| `apiEndpoint`    | `data-api-endpoint`     | string  | (Required)      | URL of the chat API backend.                     |
| `mcpKeyEndpoint` | `data-mcp-key-endpoint` | string  | (Optional)      | URL to fetch MCP authentication keys.            |
| `title`          | `data-title`            | string  | "Smeduverse AI" | Title shown in the chat header.                  |
| `initialMessage` | `data-initial-message`  | string  | "..."           | The first message shown to the user.             |
| `position`       | `data-position`         | string  | "bottom-right"  | Widget position (`bottom-right`, `bottom-left`). |
| `isOpen`         | `data-is-open`          | boolean | false           | Whether the chat window is open by default.      |

---

## Backend Setup

The widget requires a backend to handle LangGraph processing and LLM communication.

1.  **Configure Environment**:
    Copy `.env.example` to `.env` and add your keys:
    ```env
    GOOGLE_API_KEY=your_gemini_key
    ```

2.  **Start the Server**:
    ```bash
    bun run start
    ```
    The API will be available at `http://localhost:3000/api/chat`.

## Development

To run the full development environment (Frontend + Backend):

```bash
bun run dev
```

This starts the Hono server for the API and the Vite dev server for the React widget.
