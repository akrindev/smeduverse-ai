"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import {
    type ComponentProps,
    createContext,
    type HTMLAttributes,
    useContext,
    useState
} from "react";

type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: string;
  showLineNumbers?: boolean;
};

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
});

// Simple syntax highlighting without heavy Shiki bundle
// This provides basic styling without language-specific highlighting
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightCodeSimple(
  code: string,
  _language: string,
  showLineNumbers = false
): { light: string; dark: string } {
  const lines = code.split("\n");
  const htmlLines = lines.map((line, i) => {
    const lineNum = showLineNumbers
      ? `<span class="inline-block mr-4 min-w-10 text-muted-foreground text-right select-none">${i + 1}</span>`
      : "";
    return `<span class="line">${lineNum}${escapeHtml(line)}</span>`;
  });

  const content = htmlLines.join("\n");
  const wrapper = `<pre class="shiki" style="background-color: transparent;"><code>${content}</code></pre>`;

  return { light: wrapper, dark: wrapper };
}

export async function highlightCode(
  code: string,
  language: string,
  showLineNumbers = false
): Promise<[string, string]> {
  const { light, dark } = highlightCodeSimple(code, language, showLineNumbers);
  return [light, dark];
}

export const CodeBlock = ({
  code,
  language,
  showLineNumbers = false,
  className,
  children,
  ...props
}: CodeBlockProps) => {
  const { light: html, dark: darkHtml } = highlightCodeSimple(
    code,
    language,
    showLineNumbers
  );

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <div
        className={cn(
          "group relative bg-background border rounded-md w-full overflow-hidden text-foreground",
          className
        )}
        {...props}
      >
        <div className="relative">
          <div
            className="dark:hidden [&>pre]:bg-background! [&>pre]:m-0 [&>pre]:p-4 overflow-hidden [&_code]:font-mono [&>pre]:text-foreground! [&_code]:text-sm [&>pre]:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed."
            dangerouslySetInnerHTML={{ __html: html }}
          />
          <div
            className="hidden dark:block [&>pre]:bg-background! [&>pre]:m-0 [&>pre]:p-4 overflow-hidden [&_code]:font-mono [&>pre]:text-foreground! [&_code]:text-sm [&>pre]:text-sm"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: "this is needed."
            dangerouslySetInnerHTML={{ __html: darkHtml }}
          />
          {children && (
            <div className="top-2 right-2 absolute flex items-center gap-2">
              {children}
            </div>
          )}
        </div>
      </div>
    </CodeBlockContext.Provider>
  );
};

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  onCopy?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
};

export const CodeBlockCopyButton = ({
  onCopy,
  onError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator?.clipboard?.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};
