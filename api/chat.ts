import { createGroq } from "@ai-sdk/groq";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { cors } from "hono/cors";
import { z } from "zod";

/**
 * Backend API handler for Groq LLM with Vercel AI SDK
 * This should be deployed on your server to keep the API key secure
 *
 * Example using Bun.js:
 * bun run backend/api.ts
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY || "";

if (!GROQ_API_KEY) {
	console.error("ERROR: GROQ_API_KEY environment variable is required");
	process.exit(1);
}

// Initialize Groq with AI SDK
const groq = createGroq({
	apiKey: GROQ_API_KEY,
});

// Define tools using AI SDK format
const getSchoolStats = tool({
	description:
		"Get current school statistics including student count, attendance, grades, and recent events in structured table format.",
	inputSchema: z.object({}),
	execute: async () => "test",
});

const getTeacherPerformance = tool({
	description: "Get teacher performance data in structured table format.",
	inputSchema: z.object({}),
	execute: async () => "test",
});

// System prompt untuk Smeduverse analytics dalam Bahasa Indonesia
const SYSTEM_PROMPT = `Anda adalah asisten AI Smeduverse yang mengkhususkan diri dalam menganalisis data pendidikan untuk institusi akademik. 
Anda membantu guru, staf, dan administrator memahami data mereka melalui query bahasa natural.

Anda memiliki akses ke alat untuk mendapatkan data dalam format tabel terstruktur:
- 'getSchoolStats' untuk statistik sekolah (jumlah siswa, kehadiran, nilai rata-rata)
- 'getTeacherPerformance' untuk data performa guru

PENTING - Format Respons:
Anda HARUS menggunakan Markdown untuk memformat respons Anda. Gunakan:
- **bold** untuk penekanan penting
- *italic* untuk penekanan ringan
- \`code\` untuk inline code atau istilah teknis
- \`\`\`language untuk code blocks (JavaScript, SQL, Python, dll)
- - atau 1. untuk lists (bullet points atau numbered)
- [text](url) untuk links
- > untuk blockquotes/kutipan
- jangan pernah gunakan heading, instead gunakan bold

Untuk pertanyaan tentang statistik sekolah, statistik kehadiran, atau data guru, gunakan alat yang tersedia dan berikan respons yang mencakup:
1. Penjelasan ringkas dalam bahasa Indonesia dengan format markdown yang sesuai
2. Tabel data terstruktur dengan kolom dan baris yang jelas (akan di-render otomatis)

Berikan respons yang ringkas, membantu, dan berbasis data dalam Bahasa Indonesia dengan format markdown yang baik.`;

// Create Hono app
const app = new Hono();

// Add CORS middleware
app.use("/*", cors());

// Serve static files from dist directory
app.use("/cdn/*", serveStatic({ root: "./dist" }));

// Health check endpoint
app.get("/health", (c) => {
	return c.json({ status: "ok" });
});

// Chat endpoint using AI SDK
app.post("/api/chat", async (c) => {
	try {
		const body = await c.req.json();
		const { messages } = body;

		if (!messages || !Array.isArray(messages)) {
			return c.json({ error: "Messages array is required" }, 400);
		}

		// Use AI SDK's streamText with Groq
		const result = streamText({
			model: groq("openai/gpt-oss-120b"),
			maxOutputTokens: 12000,
			temperature: 0.7,
			system: SYSTEM_PROMPT,
			messages: convertToModelMessages(messages),
			tools: {
				getSchoolStats,
				getTeacherPerformance,
			},
			stopWhen: stepCountIs(20),
		});

		// Return AI SDK data stream response
		return result.toUIMessageStreamResponse({
			headers: {
				"Transfer-Encoding": "chunked",
				Connection: "keep-alive",
			},
		});
	} catch (error) {
		console.error("Chat request error:", error);
		return c.json(
			{
				error: error instanceof Error ? error.message : "Internal server error",
			},
			500,
		);
	}
});

export default {
	port: 3000,
	fetch: app.fetch,
};
