/**
 * Dashboard = the navigation HUB.
 * KPIs and "needs attention" come from the REAL backend, scoped to the
 * signed-in user's hospital. Features are entered from here only.
 */
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useApi } from '../lib/api';
import { features } from '../lib/data';
import { Card, Kpis, Badge } from '../components/ui';
import { Building2, LogOut } from 'lucide-react';

type Workforce = {
  coverage: number; open_shifts: number; fill_rate: number;
  time_to_fill_hours: number; required: number; confirmed: number; critical_gaps: number;
};
type ShiftRow = { id: string; role: string; ward: string; date: string; status: string };

export function Topbar() {
  const { user, signOut } = useAuth();
  const nav = useNavigate();
  if (!user) return null;
  return (
    <header className="topbar">
      <div className="topbarInner">
        <Link to="/dashboard" className="neoLogo" title="Back to dashboard">
          <span className="neoLogoOver">MEDI</span>ORACLE
        </Link>
        <span className="hospitalTag"><Building2 /> {user.hospitalName}</span>
        <div className="topUser">
          <div className="avatar">{initials(user.name)}</div>
          <b>{user.name}</b>
          <button className="btn btnGhost" onClick={() => { signOut(); window.location.assign('/'); }}>
            <LogOut /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

export function initials(name: string) {
  return name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

export default function Dashboard() {
  const { user } = useAuth();
  const wf = useApi<Workforce>(user ? '/analytics/workforce' : null);
  const shifts = useApi<ShiftRow[]>(user ? '/shifts' : null);

  if (!user) return null;
  const k = wf.data;
  const hour = new Date().getHours();
  const part = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <main className="page">
      <div className="dashHero">
        <span className="eyebrow"><Building2 size={14} /> {user.hospitalName.toUpperCase()} · FACILITY WORKSPACE</span>
        <h1>{part}, <em>{user.name.split(' ')[0]}.</em></h1>
        <p className="sub">{user.hospitalName} · {user.role} — everything below runs inside your hospital.</p>
      </div>

      {wf.error && <div className="authError">Workforce data unavailable: {wf.error}</div>}

      {k && (
        <Kpis items={[
          ['Staffing coverage', `${k.coverage}%`, 'vs last week'],
          ['Open shifts', String(k.open_shifts), `${k.critical_gaps} critical`],
          ['Fill rate', `${k.fill_rate}%`, '↑ this month'],
          ['Time to fill', `${k.time_to_fill_hours}h`, 'median'],
        ]} />
      )}

      <div className="pageHead" style={{ marginTop: 'var(--s4)' }}>
        <div>
          <h1>Your workspace</h1>
          <p>Open a module below. To switch modules, come back here first.</p>
        </div>
      </div>

      <div className="featureGrid">
        {features.map((f) => (
          <Link to={f.path} className="featureTile" key={f.path}>
            <div className="cardIcon"><f.icon /></div>
            <b>{f.name}</b>
            <span>{f.desc}</span>
          </Link>
        ))}
      </div>

      <div style={{ height: 'var(--s3)' }} />

      <Card title="Needs attention" link="View shifts">
        {shifts.data && (
          <table className="table">
            <thead><tr><th>Shift</th><th>Ward</th><th>When</th><th className="tdRight">Status</th></tr></thead>
            <tbody>
              {shifts.data.slice(0, 3).map((s) => (
                <tr key={s.id}>
                  <td><b>{s.role}</b><div className="dim">{s.id}</div></td>
                  <td className="dim">{s.ward}</td>
                  <td className="dim">{s.date}</td>
                  <td className="tdRight"><Badge status={s.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </main>
  );
}
