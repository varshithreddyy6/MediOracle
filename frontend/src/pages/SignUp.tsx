import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Building2 } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function SignUp() {
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError('');
    const f = new FormData(e.currentTarget);
    try {
      signUp({
        name: String(f.get('name') || ''),
        email: String(f.get('email') || ''),
        password: String(f.get('password') || ''),
        hospitalName: String(f.get('hospital') || ''),
        role: String(f.get('role') || 'Facility Manager'),
      });
      nav('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create the account.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="authWrap">
      <div className="authCard">
        <Link to="/" className="neoLogo authLogo"><span className="neoLogoOver">MEDI</span>ORACLE</Link>
        <h1>Create your workspace</h1>
        <p className="authSub">Register your hospital — every module opens inside your hospital’s context.</p>

        {error && <div className="authError" role="alert">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="hospital">Hospital / facility name</label>
            <input id="hospital" name="hospital" type="text" placeholder="e.g. City Care Hospital" required minLength={2} />
            <p className="hint">Shown across your workspace — supports any number of hospitals.</p>
          </div>
          <div className="fieldRow">
            <div className="field">
              <label htmlFor="name">Your full name</label>
              <input id="name" name="name" type="text" placeholder="Jane Doe" required />
            </div>
            <div className="field">
              <label htmlFor="role">Your role</label>
              <select id="role" name="role" defaultValue="Facility Manager">
                <option>Facility Manager</option>
                <option>Staffing Coordinator</option>
                <option>Compliance Officer</option>
                <option>Finance / Billing</option>
                <option>Administrator</option>
              </select>
            </div>
          </div>
          <div className="fieldRow">
            <div className="field">
              <label htmlFor="email">Work email</label>
              <input id="email" name="email" type="email" placeholder="you@hospital.org" required autoComplete="email" />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" placeholder="Min 6 characters" required minLength={6} autoComplete="new-password" />
            </div>
          </div>
          <button className="btn btnPrimary full" disabled={busy}>
            {busy ? 'Creating workspace…' : 'Create workspace'} {!busy && <ArrowUpRight />}
          </button>
        </form>

        <div className="hospitalFlag">
          <Building2 />
          <span>Your hospital name will appear in the top bar and on every page after signup.</span>
        </div>
        <p className="authSwap">Already have an account? <Link to="/signin">Sign in</Link></p>
      </div>
    </main>
  );
}
