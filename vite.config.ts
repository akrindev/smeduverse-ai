import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
			// Exclude the standalone build from React plugin processing to avoid Babel warnings
			exclude: /smeduverse-ai\.standalone\.js/,
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
			formats: ["es", "umd"],
			fileName: (format) => `smeduverse-ai.${format}.js`,
		},
		rollupOptions: {
			// Externalize React for library builds
			external: ["react", "react-dom", "react/jsx-runtime"],
			output: {
				name: "SmeduverseAI",
				inlineDynamicImports: true,
				exports: "named",
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"react/jsx-runtime": "jsxRuntime",
				},
			},
		},
		cssCodeSplit: false,
		sourcemap: false,
		minify: true,
		target: "es2020",
	},
});
