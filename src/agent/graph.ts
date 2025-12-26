/**
 * Smeduverse AI Agent - LangGraph with CopilotKit Integration
 *
 * This agent provides educational AI capabilities using:
 * - LangGraph.js for agent orchestration
 * - Google Gemini (gemini-2.5-flash-preview-05-20) as the LLM
 * - CopilotKit for frontend integration
 */

import { CopilotKitStateAnnotation } from "@copilotkit/sdk-js/langgraph";
import { SystemMessage } from "@langchain/core/messages";
import type { AIMessage } from "@langchain/core/messages";
import type { RunnableConfig } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";

import { educationalTools } from "./tools";

// Define the agent state with CopilotKit integration
export const AgentStateAnnotation = Annotation.Root({
	...CopilotKitStateAnnotation.spec,
});

export type AgentState = typeof AgentStateAnnotation.State;

// System prompt for the Smeduverse AI assistant
const SYSTEM_PROMPT = `Kamu adalah Smeduverse AI, asisten AI cerdas untuk platform pendidikan Smeduverse.

Kamu membantu guru, siswa, dan administrator sekolah dengan:
- Melihat dan menganalisis statistik sekolah
- Memantau performa guru dan siswa
- Membuat rencana pembelajaran (RPP)
- Melihat laporan kehadiran
- Memberikan saran dan rekomendasi pendidikan

Selalu jawab dalam Bahasa Indonesia yang sopan dan profesional.
Gunakan tools yang tersedia untuk mendapatkan data yang diperlukan.
Jika tidak ada tools yang sesuai, berikan jawaban berdasarkan pengetahuan umum tentang pendidikan.`;

// Initialize the Google Gemini model
const model = new ChatGoogleGenerativeAI({
	model: "gemini-2.5-flash-preview-05-20",
	temperature: 0.7,
	maxOutputTokens: 2048,
});

// Bind tools to the model
const modelWithTools = model.bindTools(educationalTools);

// Create tool node for executing tools
const toolNode = new ToolNode(educationalTools);

// Agent node - calls the LLM with tools
async function agentNode(
	state: AgentState,
	config: RunnableConfig
): Promise<Partial<AgentState>> {
	const systemMessage = new SystemMessage({ content: SYSTEM_PROMPT });

	const response = await modelWithTools.invoke(
		[systemMessage, ...state.messages],
		config
	);

	return {
		messages: [response],
	};
}

// Conditional edge to determine next step
function shouldContinue(state: AgentState): "tools" | typeof END {
	const messages = state.messages;
	const lastMessage = messages[messages.length - 1];

	// Check if the last message has tool calls
	if (
		lastMessage &&
		"tool_calls" in lastMessage &&
		Array.isArray((lastMessage as AIMessage).tool_calls) &&
		((lastMessage as AIMessage).tool_calls?.length ?? 0) > 0
	) {
		return "tools";
	}

	return END;
}

// Build the graph
const workflow = new StateGraph(AgentStateAnnotation)
	.addNode("agent", agentNode)
	.addNode("tools", toolNode)
	.addEdge(START, "agent")
	.addConditionalEdges("agent", shouldContinue, ["tools", END])
	.addEdge("tools", "agent");

// Compile and export the graph
export const graph = workflow.compile();

// Export graph name for CopilotKit registration
export const AGENT_NAME = "smeduverse_agent";
