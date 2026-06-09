import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, ExternalLink, QrCode, Trash2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function LinkCard({ link, onDelete }) {
  async function copy() {
    await navigator.clipboard.writeText(link.shortUrl);
  }

  return (
    <article className="link-card">
      <div className="link-card-main">
        <div>
          <span className="slug">/{link.slug}</span>
          <p>{link.originalUrl}</p>
        </div>
        <QRCodeSVG value={link.shortUrl} size={76} level="M" includeMargin />
      </div>

      <div className="card-stats">
        <span>{link.totalClicks} clicks</span>
        <span>{link.expiresAt ? `Expires ${new Date(link.expiresAt).toLocaleDateString()}` : 'No expiry'}</span>
      </div>

      <div className="card-actions">
        <Link className="text-button" to={`/analytics/${link.slug}`}>
          Analytics
        </Link>
        <a className="icon-button" href={link.shortUrl} target="_blank" rel="noreferrer" title="Open short URL">
          <ExternalLink size={17} />
        </a>
        <button className="icon-button" onClick={copy} title="Copy short URL">
          <Copy size={17} />
        </button>
        <button className="icon-button" title="QR code is visible">
          <QrCode size={17} />
        </button>
        <button className="icon-button danger" onClick={() => onDelete(link.slug)} title="Delete link">
          <Trash2 size={17} />
        </button>
      </div>
    </article>
  );
}
