interface SectionTitleProps {
  label: string;
  title: string;
  subtitle?: string;
}

export default function SectionTitle({ label, title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-16">
      <p className="text-xs font-bold tracking-[0.3em] uppercase text-[#e50000] mb-3">
        {label}
      </p>
      <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-[#e50000] mt-6" />
    </div>
  );
}
