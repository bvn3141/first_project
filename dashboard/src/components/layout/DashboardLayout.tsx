import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div
      style={{ display: 'grid', gridTemplateColumns: '224px 1fr', minHeight: '100vh' }}
      className="bg-[#0a0a0f] text-[#e8e8f0]"
    >
      <Sidebar />
      <main className="overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
