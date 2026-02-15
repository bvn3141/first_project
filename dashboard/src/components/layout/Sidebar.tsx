import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';

const icons: Record<string, string> = {
  'chart-line': 'M3 12l4-4 4 4 4-4 4 4',
  'arrow-right-left': 'M8 3L4 7l4 4M16 21l4-4-4-4M4 7h16M20 17H4',
  'trending-up': 'M22 7l-8.5 8.5-5-5L2 17',
  'shield-alert': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM12 8v4M12 16h.01',
  'building': 'M6 22V4a2 2 0 012-2h8a2 2 0 012 2v18zM6 12H4a2 2 0 00-2 2v6a2 2 0 002 2h2M18 9h2a2 2 0 012 2v9a2 2 0 01-2 2h-2',
  'book-open': 'M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z',
};

function NavIcon({ icon }: { icon: string }) {
  const d = icons[icon] || icons['chart-line'];
  return (
    <svg
      className="w-4 h-4 flex-shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-[#111118] border-r border-[#1e1e2e] flex flex-col z-30">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-[#1e1e2e]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-[#fb8b1e] flex items-center justify-center text-[#0a0a0f] font-bold text-sm font-mono">
            FT
          </div>
          <div>
            <div className="text-sm font-bold text-[#e8e8f0] font-mono tracking-tight">
              TRANSFER
            </div>
            <div className="text-[10px] text-[#8888a0] font-mono tracking-widest">
              ANALYTICS
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono transition-colors ${
                isActive
                  ? 'bg-[#fb8b1e]/10 text-[#fb8b1e] border-l-2 border-[#fb8b1e]'
                  : 'text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#1a1a24]'
              }`
            }
          >
            <NavIcon icon={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-[#1e1e2e]">
        <div className="text-[10px] text-[#555568] font-mono">
          DATA SOURCE
        </div>
        <div className="text-[10px] text-[#8888a0] font-mono">
          Transfermarkt via Kaggle
        </div>
      </div>
    </aside>
  );
}
