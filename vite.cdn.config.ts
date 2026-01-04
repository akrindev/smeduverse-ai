import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	define: {
		process: JSON.stringify({
			env: {
				NODE_ENV: "production",
			},
		}),
		"process.env.NODE_ENV": JSON.stringify("production"),
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
			"@widget": path.resolve(__dirname, "./packages/widget/src"),
		},
	},
	build: {
		lib: {
			entry: path.resolve(__dirname, "packages/widget/src/index.tsx"),
			name: "SmeduverseAI",
			formats: ["iife"],
			fileName: () => "smeduverse-ai.standalone.js",
		},
		rollupOptions: {
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
