import { RotateCcw, Send, Square } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isLoading: boolean;
  onStop: () => void;
  onReset: () => void;
  onSubmit: (e?: React.FormEvent) => void;
  autoFocusTrigger?: boolean;
}

export function ChatInput({
  input,
  setInput,
  isLoading,
  onStop,
  onReset,
  onSubmit,
  autoFocusTrigger,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocusTrigger && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocusTrigger]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement> | { target: { value: string } }
  ) => {
    setInput(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-gray-900 px-4 py-4 border-border border-t">
      <form onSubmit={onSubmit} className="relative flex items-end gap-2.5">
        <button
          type="button"
          onClick={onReset}
          className="hover:bg-secondary p-2.5 rounded-xl text-muted-foreground hover:text-foreground transition-colors shrink-0"
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
            className="bg-secondary/50 px-4 py-3 border border-border focus:border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full placeholder:text-muted-foreground text-sm transition-all"
          />
        </div>
        <button
          type={isLoading ? "button" : "submit"}
          onClick={(e) => {
            if (isLoading) {
              e.preventDefault();
              onStop();
            }
          }}
          disabled={!isLoading && !input?.trim()}
          className={cn(
            "p-3 rounded-xl transition-all duration-200 shrink-0",
            isLoading
              ? "bg-red-500 text-white shadow-lg shadow-red-500/20 hover:opacity-90 animate-pulse"
              : input?.trim()
                ? "bg-blue-700 text-white shadow-lg shadow-blue-700/20 hover:opacity-90"
                : "bg-secondary text-muted-foreground cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <Square className="fill-current w-5 h-5" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      <div className="mt-3 text-[11px] text-muted-foreground text-center">
        Didukung oleh AI. Mohon verifikasi informasi penting.
      </div>
    </div>
  );
}
