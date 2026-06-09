import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  slug: { type: String, index: true, required: true },
  timestamp: { type: Date, default: Date.now, index: true },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  device: { type: String, default: 'desktop' },
  browser: { type: String, default: 'Unknown' },
  referrer: { type: String, default: 'direct' },
  ip: { type: String, default: 'Unknown' }
});

clickSchema.index({ slug: 1, timestamp: -1 });

export default mongoose.model('Click', clickSchema);
