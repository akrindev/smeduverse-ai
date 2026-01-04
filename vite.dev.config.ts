import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// Development config for running the demo app
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
			"@widget": path.resolve(__dirname, "./packages/widget/src"),
		},
	},
	root: ".",
	build: {
		outDir: "dist",
		emptyOutDir: false,
	},
});
