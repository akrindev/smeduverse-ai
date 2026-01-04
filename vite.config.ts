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
			exclude: /smeduverse-ai\.standalone\.js/,
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
			formats: ["es", "umd"],
			fileName: (format) => `smeduverse-ai.${format}.js`,
		},
		rollupOptions: {
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
