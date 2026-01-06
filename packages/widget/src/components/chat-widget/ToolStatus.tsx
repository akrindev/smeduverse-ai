import { cn } from "../../lib/utils";

interface ToolStatusProps {
  toolName: string;
  input: any;
  state: "call" | "result" | "output-available" | "output-error" | string;
}

export function ToolStatus({ toolName, input, state }: ToolStatusProps) {
  const displayTitle = getToolDisplayInfo(toolName, input);

  return (
    <div className="py-1">
      <div className="flex items-center gap-2 bg-secondary/50 px-2.5 py-1.5 rounded-lg w-fit text-muted-foreground text-xs">
        <div
          className={cn(
            "rounded-full w-1.5 h-1.5",
            state === "output-available" || state === "result"
              ? "bg-green-500"
              : state === "output-error"
              ? "bg-red-500"
              : "bg-blue-500 animate-pulse"
          )}
        />
        <span className="font-medium">{displayTitle}</span>
      </div>
    </div>
  );
}

function getToolDisplayInfo(toolName: string, input: any): string {
  const toolNameLower = toolName.toLowerCase();
  const mode = input?.mode;
  const search = input?.search || input?.q;
  const inputValue = getInputValue(input);

  // 1. Reference Data Tool
  if (toolName === "referenceData") {
    if (mode === "jurusan") return "🏫 Mengambil daftar jurusan...";
    if (mode === "mapel") return search ? `📚 Mencari mata pelajaran "${search}"...` : "📚 Mengambil daftar mata pelajaran...";
    if (mode === "tahun_ajaran") return "📅 Mengambil data tahun ajaran...";
    if (mode === "jenis_ptk") return "👥 Mengambil referensi jenis PTK...";
    return "🏫 Mengambil data referensi...";
  }

  // 2. Class Tool
  if (toolName === "classTool") {
    if (mode === "roster") return "📋 Mengambil daftar siswa di kelas...";
    if (mode === "by_jurusan") return "🏫 Mengelompokkan kelas per jurusan...";
    if (search) return `🔍 Mencari kelas "${search}"...`;
    return "🏫 Mengambil daftar kelas...";
  }

  // 3. Student Tool
  if (toolName === "studentTool") {
    if (mode === "detail") return "👤 Mengambil profil lengkap siswa...";
    if (search) return `🔍 Mencari siswa "${search}"...`;
    return "👥 Mengambil daftar siswa...";
  }

  // 4. Teacher Tool
  if (toolName === "teacherTool") {
    if (mode === "me") return "👤 Mengambil profil Anda...";
    if (mode === "detail") return "👨‍🏫 Mengambil profil lengkap guru...";
    if (search) return `🔍 Mencari guru "${search}"...`;
    return "👨‍🏫 Mengambil daftar guru...";
  }

  // 5. School Stats
  if (toolName === "getSchoolStats") {
    return "📊 Mengambil statistik ringkas sekolah...";
  }

  // 6. Academic Calendar
  if (toolName === "academicCalendar") {
    return "📅 Cek kalender akademik...";
  }

  // 7. Staff Attendance
  if (toolName === "staffAttendance") {
    if (mode === "daily") return "📅 Cek kehadiran staff hari ini...";
    if (mode === "monthly") return "📅 Rekap kehadiran bulanan staff...";
    if (mode === "summary") return "📊 Statistik kehadiran staff...";
    if (mode === "settings") return "⚙️ Cek konfigurasi jam kerja...";
    return "📅 Mengakses data absensi staff...";
  }

  // 8. Orbit Module Tool
  if (toolName === "orbitModuleTool") {
    if (mode === "assignments") return "📝 Mengambil daftar tugas modul...";
    if (mode === "assignment_sheet") return "📝 Cek pengumpulan tugas siswa...";
    if (mode === "detail") return "📚 Mengambil detail modul...";
    if (search) return `🔍 Mencari modul "${search}"...`;
    return "📚 Mengakses modul Orbit...";
  }

  // 9. Orbit Presence Tool
  if (toolName === "orbitPresence") {
    if (mode === "today") return "📅 Cek presensi KBM hari ini...";
    if (mode === "active") return "🔴 Cek sesi KBM yang berlangsung...";
    if (mode === "by_student") return "👤 Rekap kehadiran siswa...";
    if (mode === "by_class") return "🏫 Rekap kehadiran kelas...";
    if (mode === "analytics") return "📊 Analisis kehadiran KBM...";
    return "📅 Mengakses data presensi KBM...";
  }

  // 10. Search Tool
  if (toolName === "search") {
    const entities = input?.entities;
    let entityText = "";
    if (entities && entities.length === 1) {
      if (entities[0] === "students") entityText = "siswa";
      else if (entities[0] === "teachers") entityText = "guru";
      else if (entities[0] === "classes") entityText = "kelas";
    }
    
    return search 
      ? `🔍 Mencari ${entityText} "${search}"...` 
      : "🔍 Sedang mencari informasi...";
  }

  // Fallback for legacy or unknown tools
  if (toolNameLower.includes("search") || toolNameLower.includes("google")) {
    return inputValue ? `🔍 Mencari "${inputValue}"` : "🔍 Sedang mencari informasi...";
  }
  if (toolNameLower.includes("calculator") || toolNameLower.includes("math")) {
    return inputValue ? `🧮 Menghitung ${inputValue}` : "🧮 Sedang melakukan perhitungan...";
  }
  if (toolNameLower.includes("weather")) {
    return inputValue ? `☁️ Cek cuaca ${inputValue}` : "☁️ Mengecek kondisi cuaca...";
  }
  if (toolNameLower.includes("map") || toolNameLower.includes("location")) {
    return inputValue ? `📍 Mencari lokasi ${inputValue}` : "📍 Mengakses peta...";
  }

  // Generic fallback
  // Generic fallback
  // For unknown tools, avoid showing technical names to non-tech users
  return "⚙️ Sedang memproses data...";
}

function getInputValue(input: any): string {
  if (!input || typeof input !== "object") return "";
  const values = Object.values(input);
  // Prioritize string inputs that look like queries
  return (
    values.find(
      (v) => typeof v === "string" && v.length < 50
    ) as string || ""
  );
}
