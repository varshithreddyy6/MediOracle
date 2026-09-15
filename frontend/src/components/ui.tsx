/* Shared UI components — built once, reused on every page. */
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';

export function PageHead({ title, sub, action, onAction }: {
  title: string; sub: string; action?: string; onAction?: () => void;
}) {
  return (
    <div className="pageHead">
      <div>
        <h1>{title}</h1>
        <p>{sub}</p>
      </div>
      {action && (
        <button className="btn btnPrimary" onClick={onAction}>
          <Plus /> {action}
        </button>
      )}
    </div>
  );
}

export function BackToDashboard() {
  const nav = useNavigate();
  return (
    <button className="backLink" onClick={() => nav('/dashboard')}>
      <ArrowLeft /> Dashboard
    </button>
  );
}

export function Card({ title, link, onLink, children }: {
  title: string; link?: string; onLink?: () => void; children: ReactNode;
}) {
  return (
    <section className="card">
      <div className="cardHead">
        <b>{title}</b>
        {link && <button className="btnText" onClick={onLink}>{link} →</button>}
      </div>
      {children}
    </section>
  );
}

export function Badge({ status }: { status: string }) {
  const s = status.toLowerCase();
  const tone =
    ['critical', 'expired', 'overdue', 'disputed'].some((k) => s.includes(k)) ? 'red'
    : ['at risk', 'expiring', 'pending', 'open', 'queued'].some((k) => s.includes(k)) ? 'amber'
    : ['staffed', 'approved', 'paid', 'processed', 'valid', 'connected', 'available'].some((k) => s.includes(k)) ? 'green'
    : '';
  return <span className={`badge ${tone}`}>{status}</span>;
}

export function Kpis({ items }: { items: [string, string, string][] }) {
  return (
    <section className="card kpis">
      {items.map(([label, value, delta]) => (
        <div className="kpi" key={label}>
          <small>{label}</small>
          <b>{value}</b>
          <span>{delta}</span>
        </div>
      ))}
    </section>
  );
}

export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <div className="emptyState">
      <b>{title}</b>
      {body}
    </div>
  );
}
