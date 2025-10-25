import mongoose from 'mongoose';

// Review: stores a rating and optional comment per user per product.
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, trim: true },
}, { timestamps: true });

export default mongoose.model('Review', reviewSchema);
