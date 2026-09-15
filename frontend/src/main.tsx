/**
 * MediOracle — app entry.
 *
 * Flow:
 *   /           → NEUCONOMI-style landing page (public; app never shown here)
 *   /signin     → existing users (via click from the landing)
 *   /signup     → new users register WITH their hospital name
 *   /dashboard  → the hub: hospital name prominent, all features as tiles
 *   /feature    → pages have NO sidebar; switching modules = return to hub
 */
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import './styles.css';

import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard, { Topbar } from './pages/Dashboard';
import { Shifts, FloorStaffing, Schedule, Candidates, Compliance, Professional } from './pages/features/clinical';
import { Timesheets, Billing, Payments, Analytics } from './pages/features/finance';
import { Integrations, Support } from './pages/features/ops';

function Guard({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const loc = useLocation();
  if (status === 'loading') {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '60vh', color: 'var(--muted)' }}>Loading your workspace…</div>;
  }
  if (!user) return <Navigate to="/signin" replace state={{ from: loc.pathname }} />;
  return (
    <div className="app">
      <Topbar />
      <div className="main">{children}</div>
    </div>
  );
}

function PublicOnly({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  if (status === 'loading') return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function RootRoute() {
  const { user, status } = useAuth();
  if (status === 'loading') {
    return <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', color: 'var(--muted)', fontFamily: 'var(--font)' }}>Loading your workspace…</div>;
  }
  return user ? <Navigate to="/dashboard" replace /> : <Landing />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/signin" element={<PublicOnly><SignIn /></PublicOnly>} />
          <Route path="/signup" element={<PublicOnly><SignUp /></PublicOnly>} />

          <Route path="/dashboard" element={<Guard><Dashboard /></Guard>} />

          {/* feature modules — no sidebar anywhere; back-link returns to the hub */}
          <Route path="/floor-staffing" element={<Guard><FloorStaffing /></Guard>} />
          <Route path="/shifts" element={<Guard><Shifts /></Guard>} />
          <Route path="/schedule" element={<Guard><Schedule /></Guard>} />
          <Route path="/candidates" element={<Guard><Candidates /></Guard>} />
          <Route path="/compliance" element={<Guard><Compliance /></Guard>} />
          <Route path="/professional" element={<Guard><Professional /></Guard>} />
          <Route path="/timesheets" element={<Guard><Timesheets /></Guard>} />
          <Route path="/billing" element={<Guard><Billing /></Guard>} />
          <Route path="/payments" element={<Guard><Payments /></Guard>} />
          <Route path="/analytics" element={<Guard><Analytics /></Guard>} />
          <Route path="/integrations" element={<Guard><Integrations /></Guard>} />
          <Route path="/support" element={<Guard><Support /></Guard>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
