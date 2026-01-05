import { Bot } from "lucide-react";

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 bg-gray-50/50 dark:bg-gray-950/50 overflow-y-auto">
      <div className="flex flex-col justify-center items-center space-y-6 px-6 py-8 h-full text-muted-foreground text-center">
        <div className="flex justify-center items-center bg-secondary/50 mb-2 rounded-2xl w-16 h-16">
          <Bot className="opacity-50 w-8 h-8" />
        </div>
      <div className="space-y-2">
        <h4 className="font-medium text-foreground text-lg">Halo, Bapak/Ibu Guru!</h4>
        <p className="mx-auto max-w-md text-sm leading-relaxed">
            Saya adalah asisten AI yang siap membantu Anda dalam berbagai informasi pendidikan dan administrasi sekolah.
        </p>
      </div>
      <div className="gap-2.5 grid grid-cols-1 w-full max-w-sm text-sm">
        <button
          type="button"
          onClick={() =>
            onSuggestionClick("Buatkan rencana pembelajaran untuk topik Matematika kelas 11")
          }
          className="bg-white hover:bg-secondary/50 dark:bg-gray-900 px-4 py-3 border border-border rounded-lg text-left transition-colors"
        >
          "Buatkan RPP Matematika kelas 11"
        </button>
        <button
          type="button"
          onClick={() => onSuggestionClick("Bagaimana cara meningkatkan motivasi siswa yang rendah?")}
          className="bg-card hover:bg-secondary/50 px-4 py-3 border border-border rounded-lg text-left transition-colors"
        >
          "Tips motivasi siswa"
        </button>
        <button
          type="button"
          onClick={() => onSuggestionClick("Siapa siswa yang tidak hadir kemarin?")}
          className="bg-card hover:bg-secondary/50 px-4 py-3 border border-border rounded-lg text-left transition-colors"
        >
          "Siapa siswa yang tidak hadir kemarin?"
        </button>
        <button
          type="button"
          onClick={() => onSuggestionClick("Cari siswa bernama dinda dan tampilkan detailnya")}
          className="bg-card hover:bg-secondary/50 px-4 py-3 border border-border rounded-lg text-left transition-colors"
        >
          "Cari siswa bernama dinda"
        </button>
      </div>
      </div>
    </div>
  );
}
