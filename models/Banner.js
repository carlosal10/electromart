import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  imageUrl: { type: String, required: true },
  buttonText: { type: String },
  buttonLink: { type: String },

  // New field to distinguish seasonal/promotional/etc.
  season: { type: String, default: '' }, // e.g., "Back to School", "Holiday Deals"
  type: {
    type: String,
    enum: ['hero', 'seasonal', 'promotional', 'best-selling'], // Add types as needed
    default: 'hero'
  }
}, {
  timestamps: true
});

export default mongoose.model('Banner', bannerSchema);
