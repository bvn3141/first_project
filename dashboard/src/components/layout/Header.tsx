import Ticker from '../ui/Ticker';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="border-b border-[#1e1e2e] bg-[#0a0a0f]">
      <Ticker />
      <div className="px-6 py-4 flex items-end justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#e8e8f0] font-mono tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-[#8888a0] font-mono mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div className="text-[10px] text-[#555568] font-mono">
          {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </div>
      </div>
    </header>
  );
}
