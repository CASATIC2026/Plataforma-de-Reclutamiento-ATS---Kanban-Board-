export default function LegalSectionHeading({ number, title }) {
  return (
    <div className="flex items-center gap-4">
      <span className="inline-flex py-1 px-3 rounded-full bg-[rgba(42,164,141,0.10)] text-[#2AA48D] text-sm font-bold">
        {String(number).padStart(2, '0')}
      </span>
      <h2 className="font-editorial text-2xl md:text-3xl text-[#D7E3FD] leading-tight">{title}</h2>
    </div>
  );
}
