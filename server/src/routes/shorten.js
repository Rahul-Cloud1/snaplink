import express from 'express';
import { customAlphabet } from 'nanoid';
import QRCode from 'qrcode';
import validator from 'validator';
import Link from '../models/Link.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { anonymousCreateLinkLimiter, authenticatedCreateLinkLimiter } from '../middleware/rateLimit.js';
import { redis, URL_CACHE_TTL_SECONDS } from '../lib/redis.js';
import { clickQueue } from '../lib/queue.js';

const router = express.Router();
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 6);
const slugPattern = /^[a-zA-Z0-9_-]{3,64}$/;

function getOwnerKey(req) {
  return req.headers['x-owner-key']?.toString().slice(0, 128) || null;
}

function publicLink(link) {
  const baseUrl = process.env.PUBLIC_BASE_URL || 'http://localhost:5000';
  return {
    id: link._id,
    slug: link.slug,
    originalUrl: link.originalUrl,
    shortUrl: `${baseUrl}/${link.slug}`,
    customSlug: link.customSlug,
    expiresAt: link.expiresAt,
    createdAt: link.createdAt,
    totalClicks: link.totalClicks
  };
}

function clientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip || req.socket.remoteAddress || 'Unknown';
}

function getClickData(req) {
  return {
    ip: clientIp(req),
    userAgent: req.headers['user-agent'] || '',
    referrer: req.get('referer') || req.get('referrer') || ''
  };
}

async function createRandomSlug() {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const slug = nanoid();
    const exists = await Link.exists({ slug });
    if (!exists) return slug;
  }
  throw new Error('Could not generate a unique slug');
}

router.post(
  '/',
  optionalAuth,
  anonymousCreateLinkLimiter,
  authenticatedCreateLinkLimiter,
  async (req, res) => {
    const { originalUrl, customSlug, expiresAt } = req.body;

    if (!originalUrl || !validator.isURL(originalUrl, { require_protocol: true })) {
      return res.status(400).json({ error: 'Enter a valid URL including http:// or https://' });
    }

    let slug = customSlug?.trim();
    const hasCustomSlug = Boolean(slug);

    if (hasCustomSlug && !slugPattern.test(slug)) {
      return res.status(400).json({ error: 'Custom slug must be 3-64 letters, numbers, dashes, or underscores' });
    }

    if (!slug) slug = await createRandomSlug();
    if (await Link.exists({ slug })) return res.status(409).json({ error: 'That slug is already taken' });

    const expiryDate = expiresAt ? new Date(expiresAt) : null;
    if (expiryDate && Number.isNaN(expiryDate.getTime())) {
      return res.status(400).json({ error: 'Expiry date is invalid' });
    }

    const link = await Link.create({
      slug,
      originalUrl,
      customSlug: hasCustomSlug,
      expiresAt: expiryDate,
      userId: req.user?._id || null,
      ownerKey: req.user ? null : getOwnerKey(req)
    });

    await redis.setex(`url:${slug}`, URL_CACHE_TTL_SECONDS, originalUrl);
    res.status(201).json({ link: publicLink(link) });
  }
);

router.get('/links', optionalAuth, async (req, res) => {
  const ownerKey = getOwnerKey(req);
  const filter = req.user ? { userId: req.user._id } : ownerKey ? { ownerKey } : { _id: null };
  const links = await Link.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json({ links: links.map(publicLink) });
});

router.delete('/links/:slug', optionalAuth, async (req, res) => {
  const ownerKey = getOwnerKey(req);
  const filter = req.user
    ? { slug: req.params.slug, userId: req.user._id }
    : { slug: req.params.slug, ownerKey };

  const deleted = await Link.findOneAndDelete(filter);
  if (!deleted) return res.status(404).json({ error: 'Link not found' });

  await redis.del(`url:${req.params.slug}`);
  res.status(204).send();
});

router.get('/links/:slug/qr', async (req, res) => {
  const link = await Link.findOne({ slug: req.params.slug });
  if (!link) return res.status(404).json({ error: 'Link not found' });

  const qr = await QRCode.toDataURL(`${process.env.PUBLIC_BASE_URL || 'http://localhost:5000'}/${link.slug}`);
  res.json({ qr });
});

router.get('/:slug', async (req, res) => {
  const { slug } = req.params;

  const cached = await redis.get(`url:${slug}`);
  if (cached) {
    clickQueue.add('track', { slug, ...getClickData(req) });
    return res.redirect(cached);
  }

  const link = await Link.findOne({ slug });
  if (!link) return res.status(404).json({ error: 'Link not found' });
  if (link.expiresAt && link.expiresAt < new Date()) {
    return res.status(410).json({ error: 'Link expired' });
  }

  await redis.setex(`url:${slug}`, URL_CACHE_TTL_SECONDS, link.originalUrl);
  clickQueue.add('track', { slug, ...getClickData(req) });

  res.redirect(link.originalUrl);
});

export default router;
