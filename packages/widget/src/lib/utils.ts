import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convert HTML table element to CSV string
 */
export function tableToCSV(table: HTMLTableElement): string {
  const rows: string[][] = [];
  
  // Process all rows (thead + tbody)
  const allRows = table.querySelectorAll("tr");
  allRows.forEach((row) => {
    const cells: string[] = [];
    row.querySelectorAll("th, td").forEach((cell) => {
      // Escape quotes and wrap in quotes if contains comma/newline/quote
      let text = (cell.textContent || "").trim();
      if (text.includes('"') || text.includes(",") || text.includes("\n")) {
        text = `"${text.replace(/"/g, '""')}"`;
      }
      cells.push(text);
    });
    if (cells.length > 0) {
      rows.push(cells);
    }
  });
  
  return rows.map((row) => row.join(",")).join("\n");
}

/**
 * Download CSV string as file
 */
export function downloadCSV(csv: string, filename = "data.csv"): void {
  // Add BOM for Excel UTF-8 compatibility
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
