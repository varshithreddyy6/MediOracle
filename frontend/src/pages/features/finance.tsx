/* Finance & performance modules — real backend data, hospital-scoped. */
import { useAuth } from '../../lib/auth';
import { useApi } from '../../lib/api';
import { PageHead, BackToDashboard, Card, Badge, Kpis } from '../../components/ui';

type Timesheet = { id: string; who: string; shift: string; hours: string; status: string };
type Invoice = { id: string; client: string; amount: string; due: string; status: string };
type Payment = { id: string; to: string; for: string; amount: string; status: string };
type Workforce = { coverage: number; open_shifts: number; fill_rate: number; time_to_fill_hours: number; rows: [string, number][] };

function useSub(suffix: string) {
  const { user } = useAuth();
  return user ? `${user.hospitalName} · ${suffix}` : '';
}

export function Timesheets() {
  const rows = useApi<Timesheet[]>('/timesheets');
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Timesheets" sub={useSub('Workforce finance')} />
      <Card title="Recent timesheets">
        {rows.data && (
          <table className="table">
            <thead><tr><th>ID</th><th>Professional</th><th>Shift</th><th>Hours</th><th className="tdRight">Status</th></tr></thead>
            <tbody>
              {rows.data.map((t) => (
                <tr key={t.id}>
                  <td><b>{t.id}</b></td>
                  <td className="dim">{t.who}</td>
                  <td className="dim">{t.shift}</td>
                  <td className="dim">{t.hours}</td>
                  <td className="tdRight"><Badge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </main>
  );
}

export function Billing() {
  const rows = useApi<Invoice[]>('/invoices');
  const inv = rows.data || [];
  const eur = (s: string) => Number(s.replace(/[€,]/g, '')) || 0;
  const open = inv.filter((i) => i.status === 'Open').reduce((a, i) => a + eur(i.amount), 0);
  const paid = inv.filter((i) => i.status === 'Paid').reduce((a, i) => a + eur(i.amount), 0);
  const overdue = inv.filter((i) => i.status === 'Overdue').reduce((a, i) => a + eur(i.amount), 0);
  const fmt = (n: number) => '€' + n.toLocaleString('en-IE', { minimumFractionDigits: 2 });
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Billing" sub={useSub('Workforce finance')} action="New invoice" />
      <Kpis items={[
        ['Open', fmt(open), `${inv.filter((i) => i.status === 'Open').length} invoice(s)`],
        ['Paid this month', fmt(paid), `${inv.filter((i) => i.status === 'Paid').length} invoice(s)`],
        ['Overdue', fmt(overdue), `${inv.filter((i) => i.status === 'Overdue').length} invoice(s)`],
        ['Avg days to pay', '14', '↑ improving'],
      ]} />
      <div style={{ height: 'var(--s3)' }} />
      <Card title="Invoices">
        {rows.data && (
          <table className="table">
            <thead><tr><th>Invoice</th><th>Client</th><th>Amount</th><th>Due</th><th className="tdRight">Status</th></tr></thead>
            <tbody>
              {inv.map((i) => (
                <tr key={i.id}>
                  <td><b>{i.id}</b></td>
                  <td className="dim">{i.client}</td>
                  <td className="dim">{i.amount}</td>
                  <td className="dim">{i.due}</td>
                  <td className="tdRight"><Badge status={i.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </main>
  );
}

export function Payments() {
  const rows = useApi<Payment[]>('/payments');
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Payments" sub={useSub('Workforce finance')} action="Run batch" />
      <Card title="Professional payments">
        {rows.data && (
          <table className="table">
            <thead><tr><th>Payment</th><th>To</th><th>For</th><th>Amount</th><th className="tdRight">Status</th></tr></thead>
            <tbody>
              {rows.data.map((p) => (
                <tr key={p.id}>
                  <td><b>{p.id}</b></td>
                  <td className="dim">{p.to}</td>
                  <td className="dim">{p.for}</td>
                  <td className="dim">{p.amount}</td>
                  <td className="tdRight"><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </main>
  );
}

export function Analytics() {
  const wf = useApi<Workforce>('/analytics/workforce');
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Analytics" sub={useSub('Performance')} />
      <Card title="Operating metrics">
        <div className="cardBody">
          {(wf.data?.rows || []).map(([label, value]) => (
            <div className="chartRow" key={label}>
              <small>{label}</small>
              <div className="bar"><i style={{ width: `${value}%` }} /></div>
              <b>{value}%</b>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
