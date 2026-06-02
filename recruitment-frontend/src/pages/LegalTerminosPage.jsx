import PublicPageHeader from '../components/legal/PublicPageHeader';
import TerminosContent from '../components/legal/TerminosContent';

export default function LegalTerminosPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#050A14]">
      <PublicPageHeader title="Términos y Condiciones" />
      <main className="flex-grow w-full pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <TerminosContent />
        </div>
      </main>
    </div>
  );
}
