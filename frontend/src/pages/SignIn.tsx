import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useAuth } from '../lib/auth';

export default function SignIn() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError('');
    const f = new FormData(e.currentTarget);
    try {
      signIn(String(f.get('email') || ''), String(f.get('password') || ''));
      nav('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="authWrap">
      <div className="authCard">
        <Link to="/" className="neoLogo authLogo"><span className="neoLogoOver">MEDI</span>ORACLE</Link>
        <h1>Welcome back</h1>
        <p className="authSub">Sign in to your hospital workspace.</p>

        {error && <div className="authError" role="alert">{error}</div>}

        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Work email</label>
            <input id="email" name="email" type="email" placeholder="you@hospital.org" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="••••••••" required autoComplete="current-password" />
          </div>
          <button className="btn btnPrimary full" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'} {!busy && <ArrowUpRight />}
          </button>
        </form>

        <p className="authSwap">
          New here? <Link to="/signup">Create your hospital workspace</Link>
        </p>
        <p className="demoBox">Demo account · anna@avthospitals.demo / Demo@2026</p>
      </div>
    </main>
  );
}
