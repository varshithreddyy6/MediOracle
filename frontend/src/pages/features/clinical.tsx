/* Clinical & talent modules — all data from the REAL backend,
   scoped to the signed-in hospital. No sidebar; back-to-dashboard only. */
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../lib/auth';
import { api, useApi } from '../../lib/api';
import { specialties } from '../../lib/data';
import { PageHead, BackToDashboard, Card, Badge } from '../../components/ui';

type Shift = { id: string; role: string; ward: string; date: string; gap: number; filled: number; status: string; rate: string };
type Ward = { name: string; filled: number; required: number };
type Candidate = { name: string; role: string; score: number; confidence: number; distance: string; rating: string; factors: string[] };
type ComplianceRow = { who: string; item: string; expires: string; status: string };
type Pro = { name: string; role: string; specialty: string; rating: string; status: string };
type ScheduleData = { days: string[]; events: string[][] };

function useHospitalSub(suffix = 'Clinical operations') {
  const { user } = useAuth();
  return user ? `${user.hospitalName} · ${suffix}` : '';
}

/* ---------------- SHIFTS (+ create) ---------------- */

export function Shifts() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const list = useApi<Shift[]>(user ? '/shifts' : null);

  const rows = (list.data || []).filter((s) => filter === 'All' || s.status === filter);

  async function createShift(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setFormError('');
    const f = new FormData(e.currentTarget);
    try {
      await api('/shifts', {
        method: 'POST',
        body: JSON.stringify({
          role: f.get('role'), ward: f.get('ward'),
          when_text: f.get('when'), rate: String(f.get('rate') || ''),
        }),
      });
      setCreating(false);
      list.refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create the shift.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Shifts" sub={useHospitalSub()} action="Create shift" onAction={() => setCreating(!creating)} />

      {creating && (
        <Card title="New shift">
          <form className="cardBody" onSubmit={createShift}>
            {formError && <div className="authError">{formError}</div>}
            <div className="fieldRow">
              <div className="field"><label>Role</label><input name="role" placeholder="Registered Nurse" required minLength={2} /></div>
              <div className="field"><label>Ward</label><input name="ward" placeholder="ICU · Ward 3" required minLength={2} /></div>
            </div>
            <div className="fieldRow">
              <div className="field"><label>When</label><input name="when" placeholder="Fri, 19:00–07:00" required minLength={2} /></div>
              <div className="field"><label>Rate (optional)</label><input name="rate" placeholder="€32.50/hr" /></div>
            </div>
            <button className="btn btnPrimary" disabled={busy}>{busy ? 'Posting…' : 'Post shift'}</button>
          </form>
        </Card>
      )}

      <div style={{ height: creating ? 'var(--s3)' : 0 }} />

      <div className="filters">
        {['All', 'Critical', 'At risk', 'Open', 'Staffed'].map((f) => (
          <button key={f} className={`chip ${filter === f ? 'on' : ''}`} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>

      {list.error && <div className="authError">{list.error}</div>}

      <Card title={`${rows.length} shift${rows.length === 1 ? '' : 's'}`}>
        {list.data && (
          <table className="table">
            <thead><tr><th>Shift</th><th>Ward</th><th>When</th><th>Filled</th><th>Rate</th><th className="tdRight">Status</th></tr></thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.id}>
                  <td><b>{s.role}</b><div className="dim">{s.id}</div></td>
                  <td className="dim">{s.ward}</td>
                  <td className="dim">{s.date}</td>
                  <td className="dim">{s.filled} on shift{s.gap ? ` · ${s.gap} gap` : ''}</td>
                  <td className="dim">{s.rate}</td>
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

/* ---------------- FLOOR STAFFING ---------------- */

export function FloorStaffing() {
  const { user } = useAuth();
  const wards = useApi<Ward[]>(user ? '/wards' : null);
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Floor staffing" sub={useHospitalSub()} />
      <Card title="Coverage by ward" link="Full report">
        <div className="cardBody">
          {(wards.data || []).map((w) => {
            const pct = Math.round((w.filled / w.required) * 100);
            const tone = pct >= 95 ? '' : pct >= 80 ? 'warn' : 'bad';
            return (
              <div className="ward" key={w.name}>
                <b><i className={`dot ${pct >= 95 ? 'green' : pct >= 80 ? 'amber' : 'red'}`} /> {w.name}</b>
                <div className="bar"><i className={tone} style={{ width: `${pct}%` }} /></div>
                <span>{w.filled} / {w.required}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </main>
  );
}

/* ---------------- SCHEDULE ---------------- */

export function Schedule() {
  const { user } = useAuth();
  const sched = useApi<ScheduleData>(user ? '/schedule' : null);
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Schedule" sub={useHospitalSub()} />
      <Card title="This week" link="Open shifts">
        <div className="cardBody">
          <div className="week">
            {(sched.data?.days || []).map((d, i) => (
              <div className="day" key={d}>
                <small>{d.toUpperCase()}</small>
                {(sched.data?.events[i] || []).map((e) => <div className="event" key={e}>{e}</div>)}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </main>
  );
}

/* ---------------- CANDIDATES ---------------- */

export function Candidates() {
  const { user } = useAuth();
  const cands = useApi<Candidate[]>(user ? '/candidates' : null);
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Candidates" sub={`${useHospitalSub()} · AI matching`} />
      <div className="grid3">
        {(cands.data || []).map((c) => (
          <Card key={c.name} title={c.name} link="Offer">
            <div className="cardBody">
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>{c.role}</p>
              <div style={{ display: 'flex', gap: 16, margin: '12px 0' }}>
                <div><b style={{ fontSize: 22, color: 'var(--accent)' }}>{c.score}%</b><div style={{ fontSize: 11, color: 'var(--faint)' }}>match</div></div>
                <div><b style={{ fontSize: 22 }}>{c.rating}</b><div style={{ fontSize: 11, color: 'var(--faint)' }}>rating</div></div>
                <div><b style={{ fontSize: 22 }}>{c.distance}</b><div style={{ fontSize: 11, color: 'var(--faint)' }}>away</div></div>
              </div>
              {c.factors.map((f) => <div key={f} style={{ fontSize: 13, color: 'var(--muted)' }}>✓ {f}</div>)}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}

/* ---------------- COMPLIANCE ---------------- */

export function Compliance() {
  const { user } = useAuth();
  const items = useApi<ComplianceRow[]>(user ? '/compliance' : null);
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Compliance" sub={useHospitalSub()} />
      <Card title="Credentials watchlist" link="Export">
        {items.data && (
          <table className="table">
            <thead><tr><th>Professional</th><th>Item</th><th>Expires</th><th className="tdRight">Status</th></tr></thead>
            <tbody>
              {items.data.map((c) => (
                <tr key={c.who + c.item}>
                  <td><b>{c.who}</b></td>
                  <td className="dim">{c.item}</td>
                  <td className="dim">{c.expires}</td>
                  <td className="tdRight"><Badge status={c.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </main>
  );
}

/* ---------------- PROFESSIONALS ---------------- */

export function Professional() {
  const { user } = useAuth();
  const pros = useApi<Pro[]>(user ? '/professionals' : null);
  return (
    <main className="page">
      <BackToDashboard />
      <PageHead title="Professionals" sub={`${useHospitalSub()} · Directory`} />
      <Card title={`${pros.data?.length ?? 0} professionals`} link="Invite">
        {pros.data && (
          <table className="table">
            <thead><tr><th>Name</th><th>Role</th><th>Specialty</th><th>Rating</th><th className="tdRight">Status</th></tr></thead>
            <tbody>
              {pros.data.map((p) => (
                <tr key={p.name}>
                  <td><b>{p.name}</b></td>
                  <td className="dim">{p.role}</td>
                  <td className="dim">{p.specialty}</td>
                  <td className="dim">{p.rating}</td>
                  <td className="tdRight"><Badge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      <div style={{ height: 'var(--s3)' }} />
      <Card title="Specialties covered">
        <div className="cardBody"><div className="chips" style={{ justifyContent: 'flex-start' }}>
          {specialties.slice(0, 10).map((s) => <span className="chip2" key={s}>{s}</span>)}
        </div></div>
      </Card>
    </main>
  );
}
