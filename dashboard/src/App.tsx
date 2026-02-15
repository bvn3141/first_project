import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

const Overview = lazy(() => import('./pages/Overview'));
const TransferAnalytics = lazy(() => import('./pages/TransferAnalytics'));
const PlayerValuation = lazy(() => import('./pages/PlayerValuation'));
const RiskAnalysis = lazy(() => import('./pages/RiskAnalysis'));
const ClubIntelligence = lazy(() => import('./pages/ClubIntelligence'));
const Methodology = lazy(() => import('./pages/Methodology'));

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Overview />} />
          <Route path="/transfers" element={<TransferAnalytics />} />
          <Route path="/valuation" element={<PlayerValuation />} />
          <Route path="/risk" element={<RiskAnalysis />} />
          <Route path="/clubs" element={<ClubIntelligence />} />
          <Route path="/methodology" element={<Methodology />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
}

export default function App() {
  return (
    <HashRouter>
      <DashboardLayout>
        <AnimatedRoutes />
      </DashboardLayout>
    </HashRouter>
  );
}
