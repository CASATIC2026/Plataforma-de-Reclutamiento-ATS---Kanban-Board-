import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import TerminosContent from "@/components/TerminosContent";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Términos y Condiciones - Talentify SV",
  description: "Lee nuestros términos y condiciones de uso.",
};

export default function TerminosPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050A14]">
      {/* Header */}
      <header className="border-b border-outline-variant/10 bg-[#0F1B28] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver al inicio</span>
          </Link>
          <Link href="/" className="text-xl font-bold text-slate-100">
            Talentify <span className="text-brand-turquoise">SV</span>
          </Link>
          <div className="w-24" />
        </div>
      </header>

      {/* Main Content - Flex grow to push footer down */}
      <main className="flex-grow w-full pb-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <TerminosContent />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
