/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import { Bot, Maximize2, Minimize2, RotateCcw, Send, Sparkles, Square, User, X } from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { Conversation, ConversationContent } from "./ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "./ai-elements/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "./ai-elements/reasoning";

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
      const saved = localStorage.getItem("smeduverse_thread_id");
      if (saved) return saved;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } },
  ): void => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

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
          "flex flex-col bg-card shadow-2xl border border-border rounded-2xl overflow-hidden",
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
            {/* Header */}
            <div className="flex justify-between items-center bg-blue-700 backdrop-blur-sm p-4 border-border border-b">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center rounded-full w-8 h-8">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">{title}</h3>
                  <p className="flex items-center gap-1 text-white text-xs">
                    <span className="bg-green-500 rounded-full w-1.5 h-1.5 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  type="button"
                  className="hidden sm:flex hover:bg-secondary p-2 rounded-full text-white hover:text-foreground transition-colors"
                >
                  {isExpanded ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  type="button"
                  className="hover:bg-destructive/10 p-2 rounded-full text-white hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 space-y-4 bg-background/50 p-2 overflow-y-auto">
              {messages.length === 0 && (
                <div className="flex flex-col justify-center items-center space-y-4 p-8 h-full text-muted-foreground text-center">
                  <div className="flex justify-center items-center bg-secondary/50 mb-2 rounded-2xl w-16 h-16">
                    <Bot className="opacity-50 w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="mb-1 font-medium text-foreground">Halo, Bapak/Ibu Guru!</h4>
                    <p className="mx-auto max-w-60 text-sm">
                      Saya siap membantu menganalisis nilai siswa, membuat RPP, atau menjawab
                      pertanyaan seputar kurikulum.
                    </p>
                  </div>
                  <div className="gap-2 grid grid-cols-1 w-full max-w-xs text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setInput("Buatkan rencana pembelajaran untuk topik Fotosintesis kelas 7");
                        // Optional: auto-submit or just fill input
                      }}
                      className="bg-card hover:bg-secondary/50 p-2 border border-border rounded-lg text-left transition-colors"
                    >
                      "Buatkan RPP Fotosintesis kelas 7"
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInput("Bagaimana cara meningkatkan motivasi siswa yang rendah?");
                      }}
                      className="bg-card hover:bg-secondary/50 p-2 border border-border rounded-lg text-left transition-colors"
                    >
                      "Tips motivasi siswa"
                    </button>
                  </div>
                </div>
              )}

              <Conversation>
                <ConversationContent>
                  {(() => {
                    const seenToolCallIds = new Set<string>();
                    return messages.map((m) => (
                      <Fragment key={m.id}>
                        <Message from={m.role} className="max-w-[90%]">
                          <MessageContent
                            className={cn(
                              "flex gap-3 max-w-full",
                              m.role === "user" ? "ml-auto flex-row-reverse" : "",
                            )}
                          >
                            <div
                              className={cn(
                                "flex justify-center items-center border rounded-full w-8 h-8 shrink-0",
                                m.role === "user"
                                  ? "bg-blue-700 text-white border-blue-700"
                                  : "bg-secondary text-secondary-foreground border-border",
                              )}
                            >
                              {m.role === "user" ? (
                                <User className="w-4 h-4" />
                              ) : (
                                <Bot className="w-4 h-4" />
                              )}
                            </div>
                            <div
                              className={cn(
                                "flex flex-col flex-1 gap-2",
                                m.role === "user" ? "items-end" : "items-start",
                              )}
                            >
                              {m.parts.map((part: any, i) => {
                                if (part.type === "text") {
                                  return (
                                    <div
                                      key={`${m.role}-${i}`}
                                      className={cn(
                                        "shadow-sm p-3 rounded-2xl text-sm leading-relaxed",
                                        m.role === "user"
                                          ? "bg-blue-700 text-white rounded-tr-none"
                                          : "bg-card border border-border rounded-tl-none",
                                      )}
                                    >
                                      <MessageResponse>{part.text}</MessageResponse>
                                    </div>
                                  );
                                }

                                if (part.type === "reasoning") {
                                  return (
                                    <div
                                      key={`${m.id}-reasoning-${i}`}
                                      className="bg-card shadow-sm p-3 border border-border rounded-2xl rounded-tl-none text-sm leading-relaxed"
                                    >
                                      <Reasoning>
                                        <ReasoningTrigger />
                                        <ReasoningContent>{part.reasoning}</ReasoningContent>
                                      </Reasoning>
                                    </div>
                                  );
                                }

                                if (isToolUIPart(part)) {
                                  if (part.toolCallId && seenToolCallIds.has(part.toolCallId)) {
                                    return null;
                                  }
                                  if (part.toolCallId) {
                                    seenToolCallIds.add(part.toolCallId);
                                  }

                                  const toolName = getToolName(part);
                                  const toolNameLower = toolName.toLowerCase();

                                  let displayTitle = toolName;
                                  if (toolNameLower.includes("search")) {
                                    const inputValues =
                                      part.input && typeof part.input === "object"
                                        ? Object.values(part.input)
                                        : [];
                                    const firstInput =
                                      inputValues.find((v) => typeof v === "string") || "";
                                    displayTitle = firstInput
                                      ? `Mencari Informasi - ${firstInput}`
                                      : toolName;
                                  } else if (
                                    toolNameLower.includes("get") ||
                                    toolNameLower.includes("fetch") ||
                                    toolNameLower.includes("list") ||
                                    toolNameLower.includes("query")
                                  ) {
                                    displayTitle = `Mendapatkan Informasi`;
                                  }

                                  return (
                                    <div key={`${part.toolCallId}-tool-${i}`} className="py-1">
                                      <div className="flex items-center gap-2 bg-secondary/50 px-2.5 py-1.5 rounded-lg w-fit text-muted-foreground text-xs">
                                        <div
                                          className={cn(
                                            "rounded-full w-1.5 h-1.5",
                                            part.state === "output-available"
                                              ? "bg-green-500"
                                              : part.state === "output-error"
                                                ? "bg-red-500"
                                                : "bg-blue-500 animate-pulse",
                                          )}
                                        />
                                        <span className="font-medium">{displayTitle}</span>
                                      </div>
                                    </div>
                                  );
                                }

                                return null;
                              })}
                            </div>
                          </MessageContent>
                        </Message>
                      </Fragment>
                    ));
                  })()}
                </ConversationContent>
              </Conversation>

              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="flex justify-center items-center bg-secondary border border-border rounded-full w-8 h-8 shrink-0">
                    <Bot className="w-4 h-4 animate-pulse" />
                  </div>
                  <div className="flex items-center gap-1 bg-card shadow-sm p-3 border border-border rounded-2xl rounded-tl-none text-sm">
                    <span className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-bounce [animation-delay:-0.3s]" />
                    <span className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-bounce [animation-delay:-0.15s]" />
                    <span className="bg-muted-foreground rounded-full w-1.5 h-1.5 animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-card p-4 border-border border-t">
              <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="hover:bg-secondary p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                  title="Mulai Percakapan Baru"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    value={input || ""}
                    onChange={handleInputChange}
                    placeholder="Ketik pesan Anda..."
                    className="bg-secondary/50 px-4 py-2.5 pr-10 border border-border focus:border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full placeholder:text-muted-foreground text-sm transition-all"
                  />
                </div>
                <button
                  type={isLoading ? "button" : "submit"}
                  onClick={(e) => {
                    if (isLoading) {
                      e.preventDefault();
                      stop();
                    }
                  }}
                  disabled={!isLoading && !input?.trim()}
                  className={cn(
                    "p-2.5 rounded-xl transition-all duration-200",
                    isLoading
                      ? "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:opacity-90 animate-pulse"
                      : input?.trim()
                        ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20 hover:opacity-90"
                        : "bg-secondary text-muted-foreground cursor-not-allowed",
                  )}
                >
                  {isLoading ? (
                    <Square className="fill-current w-5 h-5" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
              <div className="mt-2 text-[10px] text-muted-foreground text-center">
                Didukung oleh AI. Mohon verifikasi informasi penting.
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "z-50 flex justify-center items-center shadow-2xl rounded-full w-14 h-14 transition-all duration-200",
          "hover:scale-105 active:scale-95",
          isOpen
            ? "bg-secondary text-foreground rotate-90"
            : "bg-blue-700 text-white hover:bg-blue-800 hover:shadow-blue-700/25",
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7" />
            <span className="-top-1 -right-1 absolute bg-green-500 border-2 border-background rounded-full w-3 h-3" />
          </div>
        )}
      </button>
    </div>
  );
}
