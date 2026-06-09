import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  slug: { type: String, unique: true, index: true, required: true },
  originalUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
  ownerKey: { type: String, default: null, index: true },
  customSlug: { type: Boolean, default: false },
  expiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now, index: true },
  totalClicks: { type: Number, default: 0 }
});

linkSchema.index({ userId: 1, createdAt: -1 });
linkSchema.index({ ownerKey: 1, createdAt: -1 });

export default mongoose.model('Link', linkSchema);
