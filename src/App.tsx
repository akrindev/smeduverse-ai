import {
	BarChart3,
	Bell,
	BookOpen,
	Calendar,
	Menu,
	Search,
	Users,
} from "lucide-react";
import { SmeduverseAIWidget } from "./components/SmeduverseAIWidget";
import { cn } from "./lib/utils";

export default function App() {
	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col">
			{/* Navigation Bar */}
			<header className="h-16 border-b border-border flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
				<div className="flex items-center gap-4">
					<button
						type="button"
						className="p-2 hover:bg-secondary rounded-lg lg:hidden"
					>
						<Menu className="h-5 w-5" />
					</button>
					<div className="flex items-center gap-2 font-bold text-xl">
						<div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
							<BookOpen className="h-5 w-5" />
						</div>
						<span>EduDash</span>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<div className="hidden md:flex items-center bg-secondary/50 rounded-full px-4 py-1.5 border border-border">
						<Search className="h-4 w-4 text-muted-foreground mr-2" />
						<input
							type="text"
							placeholder="Cari data siswa..."
							className="bg-transparent border-none focus:outline-none text-sm w-48"
						/>
					</div>
					<button
						type="button"
						className="p-2 hover:bg-secondary rounded-full relative"
					>
						<Bell className="h-5 w-5 text-muted-foreground" />
						<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-background" />
					</button>
					<div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 border-2 border-background" />
				</div>
			</header>

			{/* Main Content */}
			<main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
				{/* Welcome Section */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold tracking-tight">
							Selamat Pagi, Pak Budi
						</h1>
						<p className="text-muted-foreground mt-1">
							Berikut adalah ringkasan aktivitas akademik kelas Anda hari ini.
						</p>
					</div>
					<div className="flex gap-3">
						<button
							type="button"
							className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-lg text-sm font-medium transition-colors"
						>
							Unduh Laporan
						</button>
						<button
							type="button"
							className="px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded-lg text-sm font-medium transition-colors"
						>
							Input Nilai Baru
						</button>
					</div>
				</div>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
							className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
						>
							<div className="flex items-center justify-between mb-4">
								<div className="p-2 bg-primary/10 rounded-lg text-primary">
									<stat.icon className="h-5 w-5" />
								</div>
								<span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
									{stat.change}
								</span>
							</div>
							<div className="text-2xl font-bold">{stat.value}</div>
							<div className="text-sm text-muted-foreground">{stat.label}</div>
						</div>
					))}
				</div>

				{/* Recent Activity / Data Table Placeholder */}
				<div className="bg-card border border-border rounded-xl overflow-hidden">
					<div className="p-6 border-b border-border">
						<h3 className="font-semibold">
							Nilai Ujian Terakhir (Matematika X-A)
						</h3>
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
										<td className="px-6 py-4 text-muted-foreground">
											{student.id}
										</td>
										<td className="px-6 py-4 font-bold">{student.score}</td>
										<td className="px-6 py-4">
											<span
												className={cn(
													"px-2 py-1 rounded-full text-xs font-medium",
													student.score >= 75
														? "bg-green-500/10 text-green-500"
														: "bg-yellow-500/10 text-yellow-500",
												)}
											>
												{student.status}
											</span>
										</td>
										<td className="px-6 py-4 text-right">
											<button
												type="button"
												className="text-primary hover:underline"
											>
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

			{/* The AI Widget */}
			<SmeduverseAIWidget apiEndpoint="http://localhost:3000/api/chat" />
		</div>
	);
}
