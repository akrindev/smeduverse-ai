/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { type UIMessage as AIMessage, getToolName, isToolUIPart } from "ai";
import { Bot, User } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Conversation, ConversationContent } from "../ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "../ai-elements/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "../ai-elements/reasoning";
import { ToolStatus } from "./ToolStatus";

interface ChatMessageListProps {
  messages: AIMessage[];
  isLoading: boolean;
}

export function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 space-y-4 bg-gray-50/50 dark:bg-gray-950/50 px-2 py-4 md:px-4 md:py-6 overflow-y-auto">
      <Conversation>
        <ConversationContent className="p-2">
          {(() => {
            const seenToolCallIds = new Set<string>();
            return messages.map((m) => (
              <Fragment key={m.id}>
                <Message from={m.role} className="max-w-[90%]">
                  <MessageContent
                    className={cn(
                      "flex gap-3 max-w-full",
                      m.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                  >
                    <div
                      className={cn(
                        "flex justify-center items-center border rounded-full w-8 h-8 shrink-0",
                        m.role === "user"
                          ? "bg-blue-700 text-white border-blue-700"
                          : "bg-secondary text-secondary-foreground border-border"
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
                        "flex flex-col flex-1 gap-2 overflow-hidden",
                        m.role === "user" ? "items-end" : "items-start"
                      )}
                    >
                      {m.parts?.map((part: any, i: number) => {
                        if (part.type === "text") {
                          return (
                            <div
                              key={`${m.role}-${i}`}
                              className={cn(
                                "shadow-sm p-3 rounded-2xl text-sm leading-relaxed break-words overflow-x-auto max-w-full",
                                m.role === "user"
                                  ? "bg-blue-700 text-white rounded-tr-none"
                                  : "bg-card border border-border rounded-tl-none"
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
                              className="bg-card shadow-sm p-3 border border-border rounded-2xl rounded-tl-none text-sm leading-relaxed break-words overflow-x-auto max-w-full"
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

                          return (
                            <ToolStatus
                              key={`${part.toolCallId}-tool-${i}`}
                              toolName={getToolName(part)}
                              input={(part as any).args || (part as any).input}
                              state={(part as any).state}
                            />
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
  );
}
