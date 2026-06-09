import express from 'express';
import Click from '../models/Click.js';
import Link from '../models/Link.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

function getOwnerKey(req) {
  return req.headers['x-owner-key']?.toString().slice(0, 128) || null;
}

function periodStart(range) {
  const now = new Date();
  if (range === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (range === 'week') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  if (range === '30d') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  if (range === '7d') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return null;
}

async function ownedLink(req, slug) {
  const ownerKey = getOwnerKey(req);
  const filter = req.user
    ? { slug, userId: req.user._id }
    : ownerKey
      ? { slug, ownerKey }
      : { slug };

  return Link.findOne(filter);
}

router.get('/:slug', optionalAuth, async (req, res) => {
  const { slug } = req.params;
  const range = req.query.range || '7d';
  const link = await ownedLink(req, slug);

  if (!link) return res.status(404).json({ error: 'Link not found' });

  const start = periodStart(range);
  const match = start ? { slug, timestamp: { $gte: start } } : { slug };
  const allTimeMatch = { slug };

  const [clicksOverTime, countries, devices, referrers, todayCount, weekCount] = await Promise.all([
    Click.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, date: '$_id', clicks: 1 } }
    ]),
    Click.aggregate([
      { $match: match },
      { $group: { _id: '$country', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, country: '$_id', clicks: 1 } }
    ]),
    Click.aggregate([
      { $match: match },
      { $group: { _id: '$device', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $project: { _id: 0, device: '$_id', clicks: 1 } }
    ]),
    Click.aggregate([
      { $match: match },
      { $group: { _id: '$referrer', clicks: { $sum: 1 } } },
      { $sort: { clicks: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, referrer: '$_id', clicks: 1 } }
    ]),
    Click.countDocuments({ ...allTimeMatch, timestamp: { $gte: periodStart('today') } }),
    Click.countDocuments({ ...allTimeMatch, timestamp: { $gte: periodStart('week') } })
  ]);

  res.json({
    link: {
      slug: link.slug,
      originalUrl: link.originalUrl,
      totalClicks: link.totalClicks,
      createdAt: link.createdAt,
      expiresAt: link.expiresAt
    },
    totals: {
      allTime: link.totalClicks,
      today: todayCount,
      week: weekCount
    },
    clicksOverTime,
    countries,
    devices,
    referrers
  });
});

export default router;
