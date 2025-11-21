import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

/**
 * Vite configuration for CDN widget build
 * Outputs a standalone, production-ready bundle that can be imported via <script> tag
 */
export default defineConfig({
	plugins: [
		react({
			// Disable React compiler for CDN build to avoid process env issues
			babel: {
				plugins: [],
			},
		}),
		tailwindcss(),
	],
	define: {
		// Polyfill process for browser environment (required by some dependencies)
		process: JSON.stringify({
			env: {
				NODE_ENV: "production",
			},
		}),
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			// Swap heavy components with lightweight CDN versions
			"./ai-elements/code-block": path.resolve(
				__dirname,
				"./src/components/ai-elements/code-block.cdn.tsx",
			),
			"./ai-elements/message": path.resolve(
				__dirname,
				"./src/components/ai-elements/message.cdn.tsx",
			),
			"./ai-elements/conversation": path.resolve(
				__dirname,
				"./src/components/ai-elements/conversation.cdn.tsx",
			),
		},
	},
	build: {
		// Output to dist/cdn directory
		outDir: "dist/cdn",
		// Clear output directory before build
		emptyOutDir: true,
		// Library mode configuration
		lib: {
			entry: path.resolve(__dirname, "src/cdn-entry.tsx"),
			name: "SmeduverseAI",
			formats: ["iife"],
			fileName: () => "smeduverse-ai-widget.js",
		},
		rollupOptions: {
			// Bundle everything - no externals for standalone CDN widget
			output: {
				// Inline all assets (CSS, fonts, etc.)
				inlineDynamicImports: false,
				// Asset file naming
				assetFileNames: "assets/[name].[ext]",
				// Ensure globals are properly handled
				globals: {},
			},
		},
		// Ensure all Node.js modules can be resolved
		commonjsOptions: {
			include: [/node_modules/],
			transformMixedEsModules: true,
		},
		// Aggressive minification for production
		minify: "terser",
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				pure_funcs: ["console.log", "console.info"],
			},
			format: {
				comments: false,
			},
		},
		// Source maps for debugging (optional, remove for smaller size)
		sourcemap: false,
		// Target modern browsers for smaller bundle
		target: "es2020",
		// Chunk size warning limit
		chunkSizeWarningLimit: 600,
	},
	// CSS configuration
	css: {
		modules: {
			localsConvention: "camelCase",
		},
	},
});
