/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { type UIMessage as AIMessage, getToolName, isToolUIPart } from "ai";
import { Bot, User } from "lucide-react";
import { Fragment, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";
import { Conversation, ConversationContent } from "../ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "../ai-elements/message";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "../ai-elements/reasoning";

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
    <div className="flex-1 space-y-4 bg-background/50 p-2 overflow-y-auto">
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
                        "flex flex-col flex-1 gap-2",
                        m.role === "user" ? "items-end" : "items-start"
                      )}
                    >
                      {m.parts?.map((part: any, i: number) => {
                        if (part.type === "text") {
                          return (
                            <div
                              key={`${m.role}-${i}`}
                              className={cn(
                                "shadow-sm p-3 rounded-2xl text-sm leading-relaxed",
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

                          // Helper to get a readable input value
                          const getInputValue = () => {
                            if (!part.input || typeof part.input !== "object") return "";
                            const values = Object.values(part.input);
                            // Prioritize string inputs that look like queries
                            return (
                              values.find(
                                (v) => typeof v === "string" && v.length < 50
                              ) || ""
                            );
                          };

                          const inputValue = getInputValue();
                          let displayTitle = toolName;

                          // Map common tool patterns to friendly Indonesian text
                          if (
                            toolName === "listClasses" ||
                            toolName === "groupClassesByJurusan" ||
                            toolName === "listJurusan" ||
                            toolName === "listTahunAjaran" ||
                            toolName === "listJenisPtk"
                          ) {
                            displayTitle = "🏫 Mengambil data referensi sekolah...";
                          } else if (toolName === "getClassRoster") {
                            displayTitle = inputValue
                              ? `📋 Cek daftar kelas ${inputValue}`
                              : "📋 Mengambil daftar siswa di kelas...";
                          } else if (toolName === "listMapel") {
                            displayTitle = "📚 Mengambil daftar mata pelajaran...";
                          } else if (toolName === "getSchoolStats") {
                            displayTitle = "📊 Mengambil statistik sekolah...";
                          } else if (toolName === "listStudents") {
                            displayTitle = "👥 Mengambil daftar siswa...";
                          } else if (toolName === "getStudent") {
                            displayTitle = inputValue
                              ? `👤 Mencari data siswa "${inputValue}"`
                              : "👤 Mencari data siswa...";
                          } else if (toolName === "listTeachers") {
                            displayTitle = "👨‍🏫 Mengambil daftar guru...";
                          } else if (toolName === "getTeacher") {
                            displayTitle = inputValue
                              ? `👨‍🏫 Mencari data guru "${inputValue}"`
                              : "👨‍🏫 Mencari data guru...";
                          } else if (
                            toolName === "teacherAttendanceDay" ||
                            toolName === "teacherAttendanceRangeSummary" ||
                            toolName === "teacherAttendanceSettings" ||
                            toolName === "studentAttendance"
                          ) {
                            displayTitle = "📅 Mengakses data absensi...";
                          } else if (toolName.toLowerCase().includes("orbit")) {
                            displayTitle = "📚 Mengakses data LMS (Orbit)...";
                          } else if (toolName === "academicCalendar") {
                            displayTitle = "📅 Cek kalender akademik...";
                          } else if (
                            toolNameLower.includes("search") ||
                            toolNameLower.includes("google")
                          ) {
                            displayTitle = inputValue
                              ? `🔍 Mencari "${inputValue}"`
                              : "🔍 Sedang mencari informasi...";
                          } else if (
                            toolNameLower.includes("calculator") ||
                            toolNameLower.includes("math")
                          ) {
                            displayTitle = inputValue
                              ? `🧮 Menghitung ${inputValue}`
                              : "🧮 Sedang melakukan perhitungan...";
                          } else if (
                            toolNameLower.includes("image") ||
                            toolNameLower.includes("generate")
                          ) {
                            displayTitle = "🎨 Sedang membuat konten...";
                          } else if (toolNameLower.includes("weather")) {
                            displayTitle = inputValue
                              ? `☁️ Cek cuaca ${inputValue}`
                              : "☁️ Mengecek kondisi cuaca...";
                          } else if (
                            toolNameLower.includes("map") ||
                            toolNameLower.includes("location")
                          ) {
                            displayTitle = inputValue
                              ? `📍 Mencari lokasi ${inputValue}`
                              : "📍 Mengakses peta...";
                          } else if (
                            toolNameLower.includes("get") ||
                            toolNameLower.includes("fetch") ||
                            toolNameLower.includes("read")
                          ) {
                            displayTitle = "📥 Mengambil data...";
                          } else if (toolNameLower.includes("list")) {
                            displayTitle = "📋 Menyiapkan daftar...";
                          } else if (
                            toolNameLower.includes("send") ||
                            toolNameLower.includes("email")
                          ) {
                            displayTitle = "📤 Mengirim pesan...";
                          } else {
                            // Generic fallback but formatted nicely
                            const friendlyName = toolName
                              .replace(/_/g, " ")
                              .replace(/([A-Z])/g, " $1")
                              .trim();
                            displayTitle = `⚙️ Memproses: ${friendlyName}`;
                          }

                          return (
                            <div key={`${part.toolCallId}-tool-${i}`} className="py-1">
                              <div className="flex items-center gap-2 bg-secondary/50 px-2.5 py-1.5 rounded-lg w-fit text-muted-foreground text-xs">
                                <div
                                  className={cn(
                                    "rounded-full w-1.5 h-1.5",
                                    (part as any).state === "output-available"
                                      ? "bg-green-500"
                                      : (part as any).state === "output-error"
                                        ? "bg-red-500"
                                        : "bg-blue-500 animate-pulse"
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
  );
}
