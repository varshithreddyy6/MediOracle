/* Operations modules: integrations + support. */
import { useAuth } from '../../lib/auth';
import { useApi } from '../../lib/api';
import { PageHead, BackToDashboard, Card, Badge } from '../../components/ui';
import { Building2, Headphones, Mail, ShieldCheck } from 'lucide-react';

type Integration = { name: string; desc: string; status: string };

export function Integrations() {
  const { user } = useAuth();
  const rows = useApi<Integration[]>('/integrations');
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Integrations" sub={user ? `${user.hospitalName} · Connected systems` : ''} />
      <div className="grid2">
        {(rows.data || []).map((i) => (
          <Card key={i.name} title={i.name} link={i.status === 'Connected' ? 'Configure' : 'Connect'}>
            <div className="cardBody" style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>{i.desc}</p>
              <Badge status={i.status} />
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}

export function Support() {
  const { user } = useAuth();
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Support" sub={user ? `${user.hospitalName} · We reply within one business day` : ''} />
      <div className="supportGrid">
        <Card title="Contact">
          <div className="cardBody">
            <div className="supportRow"><div className="cardIcon"><Mail /></div><div><b>Email</b><span>support@medioracle.app</span></div></div>
            <div className="supportRow"><div className="cardIcon"><Headphones /></div><div><b>Phone</b><span>+91 (0) 40 5555 0100 · Mon–Sat, 9:00–19:00 IST</span></div></div>
            <div className="supportRow"><div className="cardIcon"><Building2 /></div><div><b>Your workspace</b><span>{user ? `${user.hospitalName} — ${user.role}` : ''}</span></div></div>
          </div>
        </Card>
        <Card title="Common questions">
          <div className="cardBody">
            {[
              ['How do shifts get filled?', 'Post a shift; the matcher ranks verified professionals by score — offer with one click.'],
              ['Who sees our data?', 'Only your hospital’s workspace. Each hospital’s context is isolated.'],
              ['How are payments calculated?', 'Approved timesheets × shift rate; batches run to payroll automatically.'],
            ].map(([q, a]) => (
              <div key={q} style={{ padding: '10px 0', borderBottom: '1px solid var(--surface)' }}>
                <b style={{ fontSize: 14, display: 'flex', gap: 8, alignItems: 'center' }}><ShieldCheck size={15} color="var(--accent)" /> {q}</b>
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{a}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}
