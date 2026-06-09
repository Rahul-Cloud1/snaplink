import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { api } from '../lib/api.js';
import LinkCard from '../components/LinkCard.jsx';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadLinks() {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/shorten/links');
      setLinks(data.links);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not load links');
    } finally {
      setLoading(false);
    }
  }

  async function deleteLink(slug) {
    await api.delete(`/api/shorten/links/${slug}`);
    setLinks((current) => current.filter((link) => link.slug !== slug));
  }

  useEffect(() => {
    loadLinks();
  }, []);

  return (
    <section className="workbench">
      <div className="toolbar">
        <div className="page-heading">
          <p>Dashboard</p>
          <h1>Your short links</h1>
        </div>
        <button className="icon-button" onClick={loadLinks} title="Refresh links">
          <RefreshCw size={18} />
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      {loading && <div className="panel muted">Loading links...</div>}
      {!loading && links.length === 0 && <div className="panel muted">No links yet.</div>}

      <div className="link-grid">
        {links.map((link) => (
          <LinkCard key={link.id} link={link} onDelete={deleteLink} />
        ))}
      </div>
    </section>
  );
}
