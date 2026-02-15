interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold font-mono text-[#e8e8f0] uppercase tracking-wider">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[11px] font-mono text-[#555568] mt-0.5">{subtitle}</p>
      )}
    </div>
  );
}
