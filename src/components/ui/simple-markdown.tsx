"use client";

import { cn } from "@/lib/utils";
import { marked } from "marked";
import type { HTMLAttributes } from "react";
import { memo, useMemo } from "react";

// Configure marked for safe rendering
marked.setOptions({
  gfm: true,
  breaks: true,
});

type SimpleMarkdownProps = HTMLAttributes<HTMLDivElement> & {
  children?: string;
};

export const SimpleMarkdown = memo(
  ({ children, className, ...props }: SimpleMarkdownProps) => {
    const html = useMemo(() => {
      if (!children) return "";
      return marked.parse(children, { async: false }) as string;
    }, [children]);

    return (
      <div
        className={cn(
          "dark:prose-invert max-w-none prose prose-sm",
          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          "[&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2",
          "[&_pre]:bg-secondary/50 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto",
          "[&_code]:bg-secondary/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm",
          "[&_a]:text-primary [&_a]:underline",
          className
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown rendering
        dangerouslySetInnerHTML={{ __html: html }}
        {...props}
      />
    );
  },
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

SimpleMarkdown.displayName = "SimpleMarkdown";

export default SimpleMarkdown;
