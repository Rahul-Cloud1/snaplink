import React, { useState } from 'react';
import { CalendarClock, Copy, Link2, LockKeyhole, Wand2, X } from 'lucide-react';
import { api } from '../lib/api.js';

const GUEST_LIMIT = 5;

export default function Home({ user, onRequireAuth }) {
  const [form, setForm] = useState({ originalUrl: '', customSlug: '', expiresAt: '' });
  const [created, setCreated] = useState(null);
  const [guestCount, setGuestCount] = useState(() => Number(localStorage.getItem('guestLinkCount') || 0));
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!user && guestCount >= GUEST_LIMIT) {
      setShowAuthPrompt(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        originalUrl: form.originalUrl,
        customSlug: form.customSlug || undefined,
        expiresAt: form.expiresAt || undefined
      };
      const { data } = await api.post('/api/shorten', payload);
      setCreated(data.link);
      setForm({ originalUrl: '', customSlug: '', expiresAt: '' });
      if (!user) {
        const nextCount = guestCount + 1;
        localStorage.setItem('guestLinkCount', String(nextCount));
        setGuestCount(nextCount);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Could not create link');
    } finally {
      setLoading(false);
    }
  }

  async function copyLink() {
    if (!created) return;
    await navigator.clipboard.writeText(created.shortUrl);
  }

  return (
    <section className="workbench">
      <div className="page-heading">
        <p>URL shortener</p>
        <h1>Create a tracked short link</h1>
        {!user && <span className="guest-counter">{Math.max(GUEST_LIMIT - guestCount, 0)} guest links left</span>}
      </div>

      <form className="panel shorten-form" onSubmit={submit}>
        <label>
          Long URL
          <div className="input-row">
            <Link2 size={18} />
            <input
              type="url"
              placeholder="https://example.com/very/long/path"
              value={form.originalUrl}
              onChange={(event) => update('originalUrl', event.target.value)}
              required
            />
          </div>
        </label>

        <div className="form-grid">
          <label>
            Custom slug
            <div className="input-row">
              <Wand2 size={18} />
              <input
                placeholder="my-portfolio"
                value={form.customSlug}
                onChange={(event) => update('customSlug', event.target.value)}
              />
            </div>
          </label>

          <label>
            Expiry
            <div className="input-row">
              <CalendarClock size={18} />
              <input
                type="datetime-local"
                value={form.expiresAt}
                onChange={(event) => update('expiresAt', event.target.value)}
              />
            </div>
          </label>
        </div>

        {error && <p className="error">{error}</p>}
        <button className="primary-button" disabled={loading}>
          {loading ? 'Creating...' : 'Create short link'}
        </button>
      </form>

      {created && (
        <div className="panel result-panel">
          <div>
            <span>Ready</span>
            <strong>{created.shortUrl}</strong>
          </div>
          <button className="icon-button" onClick={copyLink} title="Copy short URL">
            <Copy size={18} />
          </button>
        </div>
      )}

      {showAuthPrompt && (
        <div className="modal-backdrop" role="presentation">
          <div className="upgrade-modal" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
            <button className="modal-close" onClick={() => setShowAuthPrompt(false)} title="Close">
              <X size={18} />
            </button>
            <div className="modal-icon">
              <LockKeyhole size={24} />
            </div>
            <p>Guest limit reached</p>
            <h2 id="upgrade-title">Login or sign up to keep shortening links</h2>
            <span>Your first 5 guest links are free. An account unlocks saved links, dashboard access, QR codes, and analytics history.</span>
            <button className="primary-button" onClick={onRequireAuth}>
              Login / Sign up
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
