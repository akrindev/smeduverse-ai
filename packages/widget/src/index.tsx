import { createRoot } from "react-dom/client";
import { SmeduverseAIWidget } from "./components/SmeduverseAIWidget";
import { ShadowRootProvider } from "./context/ShadowRootContext";
import {
  clearStoredToken,
  fetchMcpKey,
  getStoredToken,
  setStoredToken,
  useMcpKey,
} from "./hooks/useMcpKey";
import styles from "./styles/index.css?inline";

export type WidgetOptions = {
  container: string | HTMLElement;
  apiEndpoint?: string;
  mcpKeyEndpoint?: string;
  mcpKey?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  primaryColor?: string;
  title?: string;
  darkMode?: boolean;
};

class SmeduverseAI {
  private root: ReturnType<typeof createRoot> | null = null;
  private container: HTMLElement | null = null;
  private options: WidgetOptions;

  constructor(options: WidgetOptions) {
    this.options = options;
  }

  async init(): Promise<void> {
    // Get container
    if (typeof this.options.container === "string") {
      this.container = document.querySelector(this.options.container);
    } else {
      this.container = this.options.container;
    }

    if (!this.container) {
      console.error("SmeduverseAI: Container not found");
      return;
    }

    // Create shadow root
    let shadow = this.container.shadowRoot;
    if (!shadow) {
      shadow = this.container.attachShadow({ mode: "open" });
    }

    // Inject styles into shadow root
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    shadow.appendChild(styleEl);

    // Create mount point
    const mountPoint = document.createElement("div");
    mountPoint.style.height = "100%";
    mountPoint.style.width = "100%";
    shadow.appendChild(mountPoint);

    // Get MCP key
    let mcpKey = this.options.mcpKey || getStoredToken();

    if (!mcpKey && this.options.mcpKeyEndpoint) {
      try {
        mcpKey = await fetchMcpKey(this.options.mcpKeyEndpoint);
      } catch (err) {
        console.error("SmeduverseAI: Failed to fetch MCP key", err);
      }
    }

    if (!mcpKey) {
      console.error("SmeduverseAI: No MCP key available");
      return;
    }

    // Render widget
    this.root = createRoot(mountPoint);
    this.root.render(
      <ShadowRootProvider value={shadow}>
        <SmeduverseAIWidget
          apiEndpoint={this.options.apiEndpoint}
          mcpKey={mcpKey}
          position={this.options.position}
          primaryColor={this.options.primaryColor}
          title={this.options.title}
          darkMode={this.options.darkMode}
        />
      </ShadowRootProvider>
    );
  }

  destroy(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    if (this.container && this.container.shadowRoot) {
      this.container.shadowRoot.innerHTML = "";
    }
  }
}

// Auto-init from data attributes
function autoInit(): void {
  const containers = document.querySelectorAll("[data-smeduverse-ai]");
  containers.forEach((container) => {
    const el = container as HTMLElement;
    const widget = new SmeduverseAI({
      container: el,
      apiEndpoint: el.dataset.apiEndpoint || "http://localhost:3000/api/chat",
      mcpKeyEndpoint: el.dataset.mcpKeyEndpoint,
      mcpKey: el.dataset.mcpKey,
      position: (el.dataset.position as WidgetOptions["position"]) || "bottom-right",
      title: el.dataset.title,
      darkMode: el.dataset.darkMode === "true",
    });
    widget.init();
  });
}

// Auto-init on DOM ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInit);
  } else {
    autoInit();
  }
}

// Export for programmatic use
export {
  clearStoredToken, fetchMcpKey,
  getStoredToken,
  setStoredToken, SmeduverseAI, SmeduverseAIWidget, useMcpKey
};
export default SmeduverseAI;
