"use client";

import { marked } from "marked";
import type { HTMLAttributes } from "react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import { cn, downloadCSV, tableToCSV } from "../../lib/utils";

marked.setOptions({
  gfm: true,
  breaks: true,
});

type SimpleMarkdownProps = HTMLAttributes<HTMLDivElement> & {
  children?: string;
};

export const SimpleMarkdown = memo(
  ({ children, className, ...props }: SimpleMarkdownProps) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const html = useMemo(() => {
      if (!children) return "";
      return marked.parse(children, { async: false }) as string;
    }, [children]);

    const handleDownload = useCallback((table: HTMLTableElement) => {
      const csv = tableToCSV(table);
      const timestamp = new Date().toISOString().slice(0, 10);
      downloadCSV(csv, `data-${timestamp}.csv`);
    }, []);

    useEffect(() => {
      if (!containerRef.current) return;

      const tables = containerRef.current.querySelectorAll("table");
      tables.forEach((table) => {
        if (table.parentElement?.classList.contains("table-wrapper")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "table-wrapper relative group";

        const button = document.createElement("button");
        button.type = "button";
        button.className =
          "absolute -top-2 right-0 p-1.5 rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10";
        button.title = "Download CSV";
        button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`;
        button.onclick = () => handleDownload(table);

        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(button);
        wrapper.appendChild(table);
      });
    }, [html, handleDownload]);

    return (
      <div
        ref={containerRef}
        className={cn(
          "dark:prose-invert max-w-none prose prose-sm",
          "[&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
          "[&_p]:mb-2 [&_ul]:mb-2 [&_ol]:mb-2",
          "[&_pre]:bg-secondary/50 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto",
          "[&_code]:bg-secondary/50 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm",
          "[&_a]:text-primary [&_a]:underline",
          "[&_.table-wrapper]:relative [&_.table-wrapper]:my-4",
          "[&_table]:w-full [&_table]:border-collapse [&_table]:text-xs [&_table]:block [&_table]:overflow-x-auto",
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
