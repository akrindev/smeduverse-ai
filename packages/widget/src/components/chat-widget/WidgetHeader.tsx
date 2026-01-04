import { Maximize2, Minimize2, Sparkles, X } from "lucide-react";

interface WidgetHeaderProps {
  title: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClose: () => void;
}

export function WidgetHeader({
  title,
  isExpanded,
  onToggleExpand,
  onClose,
}: WidgetHeaderProps) {
  return (
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
          onClick={onToggleExpand}
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
          onClick={onClose}
          type="button"
          className="hover:bg-destructive/10 p-2 rounded-full text-white hover:text-destructive transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
