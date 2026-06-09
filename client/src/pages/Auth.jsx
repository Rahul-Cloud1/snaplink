import React, { useState } from 'react';
import { ArrowRight, BarChart3, Link2, LogIn, ShieldCheck, UserPlus } from 'lucide-react';
import { api } from '../lib/api.js';

const initialForm = {
  name: '',
  email: '',
  password: ''
};

export default function Auth({ onAuth, onGuest }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isSignup = mode === 'signup';

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = isSignup
        ? form
        : { email: form.email, password: form.password };
      const endpoint = isSignup ? '/api/auth/register' : '/api/auth/login';
      const { data } = await api.post(endpoint, payload);
      onAuth(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  function switchMode(nextMode) {
    setMode(nextMode);
    setError('');
  }

  return (
    <section className="auth-stage">
      <div className="auth-visual">
        <div className="auth-visual-content">
          <span className="brand-pill">Shortlytics</span>
          <h1>Short links with analytics built in.</h1>
          <p>Start as a guest for 5 links, or sign in to keep every link, click, QR code, and dashboard view together.</p>
          <div className="feature-strip">
            <span><Link2 size={16} /> Custom slugs</span>
            <span><BarChart3 size={16} /> Live analytics</span>
            <span><ShieldCheck size={16} /> Saved account</span>
          </div>
        </div>
      </div>

      <div className="panel auth-panel">
        <div className="auth-heading">
          <p>Account</p>
          <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
        </div>

        <div className="segmented auth-tabs">
          <button type="button" className={!isSignup ? 'active' : ''} onClick={() => switchMode('login')}>
            <LogIn size={16} />
            Login
          </button>
          <button type="button" className={isSignup ? 'active' : ''} onClick={() => switchMode('signup')}>
            <UserPlus size={16} />
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {isSignup && (
            <label>
              Name
              <input
                className="plain-input"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                placeholder="Your name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              className="plain-input"
              type="email"
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              className="plain-input"
              type="password"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              placeholder={isSignup ? 'Minimum 8 characters' : 'Your password'}
              minLength={isSignup ? 8 : undefined}
              required
            />
          </label>

          {error && <p className="error">{error}</p>}

          <button className="primary-button auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Create account' : 'Login'}
            <ArrowRight size={17} />
          </button>
        </form>

        <button className="guest-button" onClick={onGuest}>
          Continue as guest
          <span>5 free short links</span>
        </button>
      </div>
    </section>
  );
}
