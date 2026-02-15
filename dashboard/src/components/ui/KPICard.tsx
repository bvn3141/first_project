import { useAnimatedValue } from '../../hooks/useAnimatedValue';

interface KPICardProps {
  label: string;
  value: number;
  format: (v: number) => string;
  change?: number;
  changeSuffix?: string;
}

export default function KPICard({ label, value, format, change, changeSuffix = '%' }: KPICardProps) {
  const animatedValue = useAnimatedValue(value);

  return (
    <div className="bg-[#111118] border border-[#1e1e2e] rounded-lg px-5 py-4 hover:border-[#2a2a3a] transition-colors">
      <div className="text-[10px] font-mono text-[#555568] uppercase tracking-wider mb-2">
        {label}
      </div>
      <div className="text-2xl font-bold font-mono text-[#e8e8f0] tracking-tight">
        {format(animatedValue)}
      </div>
      {change !== undefined && (
        <div
          className={`text-xs font-mono mt-1 ${
            change >= 0 ? 'text-[#4af6c3]' : 'text-[#ff433d]'
          }`}
        >
          {change >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(change).toFixed(1)}
          {changeSuffix}
        </div>
      )}
    </div>
  );
}
