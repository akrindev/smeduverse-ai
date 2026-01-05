"use client";

import { marked } from "marked";
import type { HTMLAttributes } from "react";
import { memo, useMemo } from "react";
import { cn } from "../../lib/utils";

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
          "[&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:text-xs [&_table]:block [&_table]:overflow-x-auto",
          "[&_thead]:table-header-group",
          "[&_tbody]:table-row-group",
          "[&_tr]:table-row",
          "[&_th]:border [&_th]:border-border [&_th]:bg-secondary/50 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:table-cell [&_th]:whitespace-nowrap",
          "[&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_td]:table-cell",
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
