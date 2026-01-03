import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

const isStandalone = process.env.BUILD_STANDALONE === "true";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
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
			formats: isStandalone ? ["iife"] : ["es", "umd"],
			fileName: (format) =>
				isStandalone
					? "smeduverse-ai.standalone.js"
					: `smeduverse-ai.${format}.js`,
		},
		rollupOptions: {
			// For ES/UMD builds, externalize React so consumers provide their own
			external: isStandalone
				? []
				: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				// Global variable name for UMD/IIFE builds
				name: "SmeduverseAI",
				// Inline all CSS into the JS bundle
				inlineDynamicImports: true,
				// Ensure exports are accessible
				exports: "named",
				globals: isStandalone
					? {}
					: {
							react: "React",
							"react-dom": "ReactDOM",
							"react/jsx-runtime": "jsxRuntime",
						},
			},
		},
		// Ensure CSS is inlined
		cssCodeSplit: false,
		// Disable sourcemaps for production (smaller files)
		sourcemap: false,
		// Minify for smaller size
		minify: true,
		// Target modern browsers for smaller output
		target: "es2020",
	},
});
