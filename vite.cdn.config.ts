import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	define: {
		// Polyfill process for browser environment (required by some dependencies)
		process: JSON.stringify({
			env: {
				NODE_ENV: "production",
			},
		}),
		"process.env.NODE_ENV": JSON.stringify("production"),
		// Polyfill React Refresh for standalone build in case it leaks
		$RefreshSig$: "() => (type) => type",
		$RefreshReg$: "() => {}",
	},
	plugins: [
		react({
			babel: {
				plugins: [],
			},
		}),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/widget.tsx"),
			name: "SmeduverseAI",
			formats: ["iife"],
			fileName: () => "smeduverse-ai.standalone.js",
		},
		rollupOptions: {
			// No externals for standalone build - bundle everything
			external: [],
			output: {
				name: "SmeduverseAI",
				inlineDynamicImports: true,
				exports: "named",
			},
		},
		cssCodeSplit: false,
		sourcemap: false,
		minify: true,
		target: "es2020",
	},
});
