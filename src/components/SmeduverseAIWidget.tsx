"use client";

import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

type WidgetConfig = {
  title?: string;
  initialMessage?: string;
};

/**
 * SmeduverseAIWidget - Educational AI Assistant using CopilotKit
 *
 * This widget provides a popup chat interface powered by:
 * - CopilotKit for the UI and state management
 * - Google Gemini as the LLM
 * - MCP Server for educational tools (dynamically loaded)
 *
 * The widget connects to the CopilotKit runtime at /api/copilotkit
 * which provides the educational AI assistant capabilities via MCP.
 */
export function SmeduverseAIWidget({
  title = "Smeduverse AI",
  initialMessage = "Halo, Bapak/Ibu Guru! Saya siap membantu menganalisis data pendidikan, membuat rencana pembelajaran, atau menjawab pertanyaan seputar kurikulum.",
}: WidgetConfig) {
  return (
    <>
      {/* Override CopilotKit styles to fix rendering issues */}
      <style>{`
				.copilotKitPopup {
					--copilot-kit-primary-color: hsl(222.2 47.4% 11.2%);
					--copilot-kit-contrast-color: #ffffff;
					--copilot-kit-background-color: #ffffff;
					--copilot-kit-secondary-color: #f4f4f5;
					--copilot-kit-secondary-contrast-color: hsl(222.2 47.4% 11.2%);
					--copilot-kit-separator-color: #e4e4e7;
					--copilot-kit-muted-color: #71717a;
					--copilot-kit-response-button-background-color: #f4f4f5;
					--copilot-kit-response-button-color: hsl(222.2 47.4% 11.2%);
					font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
					z-index: 9999 !important;
				}
				.copilotKitPopup * {
					box-sizing: border-box;
				}
				.copilotKitMessages {
					scrollbar-width: thin;
					scrollbar-color: #d4d4d8 transparent;
				}
				.copilotKitMessages::-webkit-scrollbar {
					width: 6px;
				}
				.copilotKitMessages::-webkit-scrollbar-track {
					background: transparent;
				}
				.copilotKitMessages::-webkit-scrollbar-thumb {
					background-color: #d4d4d8;
					border-radius: 3px;
				}
				.copilotKitMessage {
					line-height: 1.6;
					white-space: pre-wrap;
					word-wrap: break-word;
				}
				.copilotKitMessage p {
					margin: 0.5em 0;
				}
				.copilotKitMessage ul, .copilotKitMessage ol {
					margin: 0.5em 0;
					padding-left: 1.5em;
				}
				.copilotKitMessage li {
					margin: 0.25em 0;
				}
				.copilotKitMessage code {
					background: #f4f4f5;
					padding: 0.125em 0.375em;
					border-radius: 4px;
					font-size: 0.9em;
				}
				.copilotKitMessage pre {
					background: #1e1e1e;
					color: #d4d4d4;
					padding: 1em;
					border-radius: 8px;
					overflow-x: auto;
					margin: 0.75em 0;
				}
				.copilotKitMessage pre code {
					background: transparent;
					padding: 0;
					color: inherit;
				}
				.copilotKitAssistantMessage {
					background: #f4f4f5 !important;
					border-radius: 12px 12px 12px 4px !important;
				}
				.copilotKitUserMessage {
					background: hsl(222.2 47.4% 11.2%) !important;
					color: white !important;
					border-radius: 12px 12px 4px 12px !important;
				}
				.copilotKitInput {
					border-radius: 12px !important;
					border: 1px solid #e4e4e7 !important;
				}
				.copilotKitInput:focus-within {
					border-color: hsl(222.2 47.4% 11.2%) !important;
					box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05) !important;
				}
			`}</style>
      <CopilotPopup
        labels={{
          title: title,
          initial: initialMessage,
          placeholder: "Ketik pesan Anda...",
          stopGenerating: "Berhenti",
          regenerateResponse: "Ulangi",
        }}
        instructions={`Anda adalah asisten AI pendidikan Smeduverse yang membantu guru dan staf sekolah.

Tugas utama Anda:
- Analisis statistik sekolah dan siswa
- Pembuatan rencana pembelajaran (RPP)
- Insight performa guru dan kelas
- Pertanyaan kurikulum dan metode mengajar

Gunakan tools yang tersedia dari MCP server untuk mendapatkan data real-time.
Selalu gunakan Bahasa Indonesia yang baik dan format Markdown untuk respons yang rapi.`}
        defaultOpen={false}
        clickOutsideToClose={true}
      />
    </>
  );
}
