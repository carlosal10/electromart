import mongoose from 'mongoose';

// Wishlist: each user has a list of product references they have marked as favourites.
const wishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

export default mongoose.model('Wishlist', wishlistSchema);
