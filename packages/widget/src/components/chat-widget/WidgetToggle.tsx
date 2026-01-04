import { Bot, X } from "lucide-react";
import { cn } from "../../lib/utils";

interface WidgetToggleProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function WidgetToggle({ isOpen, setIsOpen }: WidgetToggleProps) {
  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "z-50 flex justify-center items-center shadow-2xl rounded-full w-14 h-14 transition-all duration-200",
        "hover:scale-105 active:scale-95",
        isOpen
          ? "bg-secondary text-foreground rotate-90"
          : "bg-blue-700 text-white hover:bg-blue-800 hover:shadow-blue-700/25"
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
  );
}
