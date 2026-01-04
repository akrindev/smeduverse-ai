/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useMemo, useState } from "react";
import { cn } from "../lib/utils";
import { ChatInput } from "./chat-widget/ChatInput";
import { ChatMessageList } from "./chat-widget/ChatMessageList";
import { WelcomeScreen } from "./chat-widget/WelcomeScreen";
import { WidgetHeader } from "./chat-widget/WidgetHeader";
import { WidgetToggle } from "./chat-widget/WidgetToggle";

const DEFAULT_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/chat";

type WidgetConfig = {
  apiEndpoint?: string;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  primaryColor?: string;
  title?: string;
  darkMode?: boolean;
  mcpKey: string;
};

export function SmeduverseAIWidget({
  apiEndpoint = DEFAULT_API_ENDPOINT,
  position = "bottom-right",
  primaryColor,
  title = "Smeduverse AI",
  darkMode = false,
  mcpKey,
}: WidgetConfig) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState(() => {
    if (typeof window !== "undefined") {
      // const saved = localStorage.getItem("smeduverse_thread_id");
      // if (saved) return saved;
      const newId = crypto.randomUUID();
      localStorage.setItem("smeduverse_thread_id", newId);
      return newId;
    }
    return crypto.randomUUID();
  });

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: apiEndpoint,
        body: () => ({
          thread_id: threadId,
          mcp_key: mcpKey,
        }),
      }),
    [apiEndpoint, threadId, mcpKey],
  );

  const { messages, sendMessage, status, setMessages, stop } = useChat({
    id: threadId,
    transport,
  });
  const isLoading = status === "submitted" || status === "streaming";

  // Reset chat handler
  const handleReset = () => {
    // Stop any ongoing streaming
    stop?.();
    // Generate new thread ID
    const newThreadId = crypto.randomUUID();
    localStorage.setItem("smeduverse_thread_id", newThreadId);
    setThreadId(newThreadId);
    // Clear all messages
    setMessages([]);
    // Clear input
    setInput("");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  // Helper for position classes
  const getPositionClasses = () => {
    switch (position) {
      case "bottom-left":
        return "bottom-6 left-1 items-start";
      case "bottom-center":
        return "bottom-6 left-1/2 -translate-x-1/2 items-center";
      case "bottom-right":
      default:
        return "bottom-6 right-2 md:right-6 items-end";
    }
  };

  // Helper for custom styles
  const getCustomStyles = () => {
    const styles: Record<string, any> = {};
    if (primaryColor) {
      // Note: This assumes the primaryColor is a valid CSS color string.
      // If using oklch in globals, this might override it with a hex/rgb value,
      // which is fine as long as the browser understands it.
      styles["--primary"] = primaryColor;
    }
    return styles as React.CSSProperties;
  };

  return (
    <div
      className={cn(
        "z-99999 fixed flex flex-col gap-4 font-sans",
        getPositionClasses(),
        darkMode ? "dark" : "",
      )}
      style={getCustomStyles()}
    >
      {/* Chat Window */}
      <div
        className={cn(
          "flex flex-col bg-white dark:bg-gray-900 shadow-2xl border border-border rounded-2xl overflow-hidden",
          "max-w-[calc(100vw-1rem)] max-h-[calc(100vh-6rem)]",
          "transition-all duration-200 ease-out origin-bottom-right",
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-5 pointer-events-none h-0",
        )}
        style={{
          height: isOpen ? (isExpanded ? "80vh" : "600px") : 0,
          width: isOpen ? (isExpanded ? "920px" : "550px") : "550px",
        }}
      >
        {isOpen && (
          <>
            <WidgetHeader
              title={title}
              isExpanded={isExpanded}
              onToggleExpand={() => setIsExpanded(!isExpanded)}
              onClose={() => setIsOpen(false)}
            />

            {messages.length === 0 ? (
              <WelcomeScreen onSuggestionClick={(text) => setInput(text)} />
            ) : (
              <ChatMessageList messages={messages} isLoading={isLoading} />
            )}

            <ChatInput
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              onStop={() => stop()}
              onReset={handleReset}
              onSubmit={handleSubmit}
              autoFocusTrigger={isOpen}
            />
          </>
        )}
      </div>

      <WidgetToggle isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
