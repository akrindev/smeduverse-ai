/**
 * CDN Entry Point for SMEduverse AI Widget
 * This file is the entry point for the CDN-distributed widget bundle
 * Usage: <script src="https://your-domain.vercel.app/cdn/smeduverse-ai-widget.js"></script>
 */

import { StrictMode } from "react";
import type { Root } from "react-dom/client";
import { createRoot } from "react-dom/client";
// Import CSS using raw import for CDN build
import cssContent from "./cdn-styles.css?raw";
import { SmeduverseAIWidget } from "./components/SmeduverseAIWidget.cdn";

// Inject CSS into document head
if (typeof document !== "undefined") {
	const styleElement = document.createElement("style");
	styleElement.textContent = cssContent;
	document.head.appendChild(styleElement);
}

// Widget configuration interface
export interface SmeduverseAIConfig {
	apiEndpoint: string;
	position?: "bottom-right" | "bottom-left" | "bottom-center";
	primaryColor?: string;
	title?: string;
	darkMode?: boolean;
	containerId?: string;
}

// Store active widget instances
const widgetInstances: Map<string, Root> = new Map();

/**
 * Initialize the SMEduverse AI Widget
 * @param config - Widget configuration
 * @returns Cleanup function to destroy the widget
 */
function init(config: SmeduverseAIConfig): () => void {
	const {
		apiEndpoint,
		position = "bottom-right",
		primaryColor,
		title = "Smeduverse AI",
		darkMode = false,
		containerId = "smeduverse-ai-widget-container",
	} = config;

	// Validate required config
	if (!apiEndpoint) {
		throw new Error("SmeduverseAI.init: apiEndpoint is required");
	}

	// Create container if it doesn't exist
	let container = document.getElementById(containerId);
	if (!container) {
		container = document.createElement("div");
		container.id = containerId;
		document.body.appendChild(container);
	}

	// Destroy existing instance if any
	if (widgetInstances.has(containerId)) {
		destroy(containerId);
	}

	// Create and render widget
	const root = createRoot(container);
	root.render(
		<StrictMode>
			<SmeduverseAIWidget
				apiEndpoint={apiEndpoint}
				position={position}
				primaryColor={primaryColor}
				title={title}
				darkMode={darkMode}
			/>
		</StrictMode>,
	);

	// Store instance
	widgetInstances.set(containerId, root);

	// Return cleanup function
	return () => destroy(containerId);
}

/**
 * Destroy a widget instance
 * @param containerId - ID of the container to destroy
 */
function destroy(containerId = "smeduverse-ai-widget-container"): void {
	const root = widgetInstances.get(containerId);
	if (root) {
		root.unmount();
		widgetInstances.delete(containerId);

		// Remove container from DOM
		const container = document.getElementById(containerId);
		if (container) {
			container.remove();
		}
	}
}

/**
 * Get version information
 */
function getVersion(): string {
	return "1.0.0";
}

// Create global API
const SmeduverseAI = {
	init,
	destroy,
	getVersion,
};

// Expose to window object
declare global {
	interface Window {
		SmeduverseAI: typeof SmeduverseAI;
	}
}

window.SmeduverseAI = SmeduverseAI;

// Auto-initialize if data attributes are present
if (typeof document !== "undefined") {
	// Wait for DOM to be ready
	const autoInit = () => {
		const scriptTag = document.querySelector(
			'script[data-smeduverse-ai="auto"]',
		);
		if (scriptTag) {
			const apiEndpoint = scriptTag.getAttribute("data-api-endpoint");
			const position = scriptTag.getAttribute("data-position") as
				| "bottom-right"
				| "bottom-left"
				| "bottom-center"
				| null;
			const primaryColor = scriptTag.getAttribute("data-primary-color");
			const title = scriptTag.getAttribute("data-title");
			const darkMode = scriptTag.getAttribute("data-dark-mode") === "true";

			if (apiEndpoint) {
				SmeduverseAI.init({
					apiEndpoint,
					position: position || undefined,
					primaryColor: primaryColor || undefined,
					title: title || undefined,
					darkMode,
				});
			} else {
				console.error(
					"SmeduverseAI: Auto-init enabled but data-api-endpoint not found",
				);
			}
		}
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", autoInit);
	} else {
		autoInit();
	}
}

// Export for module usage (if needed)
export default SmeduverseAI;
