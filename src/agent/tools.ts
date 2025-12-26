/**
 * Educational AI Tools for Smeduverse
 *
 * These tools provide educational data analysis capabilities
 * for the LangGraph agent.
 */

import { tool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * Get current school statistics including student count, attendance, and grades.
 */
export const getSchoolStats = tool(
	async () => {
		// This would connect to your actual school database
		return JSON.stringify({
			total_students: 1420,
			attendance_rate: 94.5,
			average_grade: 78.3,
			active_teachers: 86,
			classes_today: 42,
			message: "Data statistik sekolah berhasil diambil",
		});
	},
	{
		name: "get_school_stats",
		description:
			"Mendapatkan statistik sekolah saat ini termasuk jumlah siswa, tingkat kehadiran, dan rata-rata nilai.",
		schema: z.object({}),
	}
);

/**
 * Get teacher performance data including class ratings and student outcomes.
 */
export const getTeacherPerformance = tool(
	async (input: { teacher_id?: string }) => {
		// This would connect to your actual performance tracking system
		return JSON.stringify({
			teacher_id: input.teacher_id || "all",
			average_rating: 4.2,
			student_satisfaction: 88,
			attendance_compliance: 96,
			curriculum_completion: 92,
			message: "Data performa guru berhasil diambil",
		});
	},
	{
		name: "get_teacher_performance",
		description:
			"Mendapatkan data performa guru termasuk rating kelas dan hasil belajar siswa.",
		schema: z.object({
			teacher_id: z
				.string()
				.optional()
				.describe("ID guru spesifik (opsional, kosongkan untuk semua guru)"),
		}),
	}
);

/**
 * Get student grade statistics for a specific class and subject.
 */
export const getStudentGrades = tool(
	async (input: { class_id?: string; subject?: string }) => {
		return JSON.stringify({
			class_id: input.class_id || "X-A",
			subject: input.subject || "Matematika",
			average_score: 82.5,
			highest_score: 98,
			lowest_score: 45,
			pass_rate: 87.5,
			students_needing_remedial: 4,
			message: "Data nilai siswa berhasil diambil",
		});
	},
	{
		name: "get_student_grades",
		description:
			"Mendapatkan statistik nilai siswa untuk kelas dan mata pelajaran tertentu.",
		schema: z.object({
			class_id: z.string().optional().describe("ID kelas (contoh: X-A, XI-B)"),
			subject: z.string().optional().describe("Nama mata pelajaran"),
		}),
	}
);

/**
 * Help create a lesson plan (RPP) outline for a given topic.
 */
export const createLessonPlan = tool(
	async (input: {
		topic: string;
		grade_level: string;
		duration_minutes?: number;
	}) => {
		const duration = input.duration_minutes || 90;
		return JSON.stringify({
			topic: input.topic,
			grade_level: input.grade_level,
			duration: `${duration} menit`,
			structure: {
				pendahuluan: "10 menit - Apersepsi dan motivasi",
				kegiatan_inti: `${duration - 25} menit - Eksplorasi, elaborasi, konfirmasi`,
				penutup: "15 menit - Refleksi dan penugasan",
			},
			suggested_methods: ["Diskusi kelompok", "Demonstrasi", "Tanya jawab"],
			message: "Outline RPP berhasil dibuat",
		});
	},
	{
		name: "create_lesson_plan",
		description:
			"Membantu membuat outline Rencana Pelaksanaan Pembelajaran (RPP) untuk topik tertentu.",
		schema: z.object({
			topic: z.string().describe("Topik pembelajaran"),
			grade_level: z
				.string()
				.describe("Tingkat/kelas (contoh: Kelas 7, Kelas 10)"),
			duration_minutes: z
				.number()
				.optional()
				.describe("Durasi pembelajaran dalam menit (default: 90)"),
		}),
	}
);

/**
 * Get attendance report for a specific class or date range.
 */
export const getAttendanceReport = tool(
	async (input: { class_id?: string; date?: string }) => {
		return JSON.stringify({
			class_id: input.class_id || "all",
			date: input.date || new Date().toISOString().split("T")[0],
			total_students: 35,
			present: 32,
			absent: 2,
			late: 1,
			attendance_rate: 91.4,
			absent_students: ["Andi (sakit)", "Budi (izin)"],
			message: "Laporan kehadiran berhasil diambil",
		});
	},
	{
		name: "get_attendance_report",
		description:
			"Mendapatkan laporan kehadiran untuk kelas atau rentang tanggal tertentu.",
		schema: z.object({
			class_id: z.string().optional().describe("ID kelas"),
			date: z.string().optional().describe("Tanggal dalam format YYYY-MM-DD"),
		}),
	}
);

// Export all tools as an array
export const educationalTools = [
	getSchoolStats,
	getTeacherPerformance,
	getStudentGrades,
	createLessonPlan,
	getAttendanceReport,
];
