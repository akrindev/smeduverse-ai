import { BarChart3, Bell, BookOpen, Calendar, Menu, Search, Users } from "lucide-react";
import { SmeduverseAIWidget } from "./components/SmeduverseAIWidget";
import { useMcpKey } from "./hooks/useMcpKey";
import { cn } from "./lib/utils";

const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT || "http://localhost:3000/api/chat";
const MCP_KEY_ENDPOINT = import.meta.env.VITE_MCP_KEY_ENDPOINT || "http://localhost:2222/mcp/key";

export default function App() {
  const { token: mcpKey } = useMcpKey({
    endpoint: MCP_KEY_ENDPOINT,
    autoFetch: true,
  });

  return (
    <div className="flex flex-col bg-background min-h-screen text-foreground">
      {/* Navigation Bar */}
      <header className="top-0 z-40 sticky flex justify-between items-center bg-card/50 backdrop-blur-sm px-6 border-border border-b h-16">
        <div className="flex items-center gap-4">
          <button type="button" className="lg:hidden hover:bg-secondary p-2 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="flex justify-center items-center bg-primary rounded-lg w-8 h-8 text-primary-foreground">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>EduDash</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center bg-secondary/50 px-4 py-1.5 border border-border rounded-full">
            <Search className="mr-2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari data siswa..."
              className="bg-transparent border-none focus:outline-none w-48 text-sm"
            />
          </div>
          <button type="button" className="relative hover:bg-secondary p-2 rounded-full">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="top-1.5 right-1.5 absolute bg-red-500 border border-background rounded-full w-2 h-2" />
          </button>
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-background rounded-full w-8 h-8" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 space-y-8 mx-auto p-6 lg:p-8 w-full max-w-7xl">
        {/* Welcome Section */}
        <div className="flex md:flex-row flex-col justify-between md:items-center gap-4">
          <div>
            <h1 className="font-bold text-3xl tracking-tight">Selamat Pagi, Pak Budi</h1>
            <p className="mt-1 text-muted-foreground">
              Berikut adalah ringkasan aktivitas akademik kelas Anda hari ini.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Unduh Laporan
            </button>
            <button
              type="button"
              className="bg-primary hover:opacity-90 px-4 py-2 rounded-lg font-medium text-primary-foreground text-sm transition-colors"
            >
              Input Nilai Baru
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="gap-6 grid grid-cols-1 md:grid-cols-3">
          {[
            {
              label: "Total Siswa",
              value: "142",
              icon: Users,
              change: "+2 minggu ini",
            },
            {
              label: "Rata-rata Kelas",
              value: "84.5",
              icon: BarChart3,
              change: "+1.2 dari UTS",
            },
            {
              label: "Jadwal Hari Ini",
              value: "4 Kelas",
              icon: Calendar,
              change: "Selesai pukul 14:00",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-card shadow-sm hover:shadow-md p-6 border border-border rounded-xl transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="bg-green-500/10 px-2 py-1 rounded-full font-medium text-green-500 text-xs">
                  {stat.change}
                </span>
              </div>
              <div className="font-bold text-2xl">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Recent Activity / Data Table Placeholder */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-6 border-border border-b">
            <h3 className="font-semibold">Nilai Ujian Terakhir (Matematika X-A)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-secondary/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Nama Siswa</th>
                  <th className="px-6 py-3 font-medium">NISN</th>
                  <th className="px-6 py-3 font-medium">Nilai</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  {
                    name: "Ahmad Rizky",
                    id: "0054321",
                    score: 92,
                    status: "Lulus",
                  },
                  {
                    name: "Budi Santoso",
                    id: "0054322",
                    score: 78,
                    status: "Lulus",
                  },
                  {
                    name: "Citra Dewi",
                    id: "0054323",
                    score: 88,
                    status: "Lulus",
                  },
                  {
                    name: "Doni Pratama",
                    id: "0054324",
                    score: 65,
                    status: "Remedial",
                  },
                  {
                    name: "Eka Putri",
                    id: "0054325",
                    score: 95,
                    status: "Lulus",
                  },
                ].map((student, i) => (
                  <tr
                    // biome-ignore lint/suspicious/noArrayIndexKey: let it
                    key={i}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{student.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{student.id}</td>
                    <td className="px-6 py-4 font-bold">{student.score}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full font-medium text-xs",
                          student.score >= 75
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500",
                        )}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button type="button" className="text-primary hover:underline">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* The AI Widget - only show when MCP key is available */}
      {mcpKey && (
        <SmeduverseAIWidget
          apiEndpoint={API_ENDPOINT}
          mcpKey={mcpKey}
        />
      )}
    </div>
  );
}
