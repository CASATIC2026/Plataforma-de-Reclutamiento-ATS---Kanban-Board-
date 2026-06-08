import PublicPageHeader from '../components/legal/PublicPageHeader';
import TerminosContent from '../components/legal/TerminosContent';

export default function LegalTerminosPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#071326] relative overflow-x-hidden">
      <div className="absolute -right-20 top-32 w-64 h-64 rounded-full bg-[rgba(255,180,163,0.05)] pointer-events-none" />
      <div className="absolute -left-20 bottom-40 w-80 h-80 rounded-full bg-[rgba(106,217,192,0.05)] pointer-events-none" />
      <PublicPageHeader title="Términos y Condiciones" />
      <main className="flex-grow w-full pb-16 md:pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-16">
          <TerminosContent />
        </div>
      </main>
    </div>
  );
}
