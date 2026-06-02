import PublicPageHeader from '../components/legal/PublicPageHeader';
import PrivacidadContent from '../components/legal/PrivacidadContent';

export default function LegalPrivacidadPage() {
  return (
    <div className="flex flex-col min-h-full bg-[#050A14]">
      <PublicPageHeader title="Política de Privacidad" />
      <main className="flex-grow w-full pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <PrivacidadContent />
        </div>
      </main>
    </div>
  );
}
