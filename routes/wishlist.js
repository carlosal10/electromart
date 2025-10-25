import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/wishlist - return the current user's wishlist products
router.get('/', requireAuth, async (req, res) => {
  try {
    let list = await Wishlist.findOne({ user: req.user.id }).populate('products');
    res.json((list && list.products) || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// POST /api/wishlist/add/:id - add product to wishlist
router.post('/add/:id', requireAuth, async (req, res) => {
  const productId = req.params.id;
  try {
    let list = await Wishlist.findOne({ user: req.user.id });
    if (!list) list = new Wishlist({ user: req.user.id, products: [] });
    const exists = list.products.some(id => id.toString() === productId);
    if (!exists) {
      list.products.push(productId);
      await list.save();
    }
    res.json({ message: 'Added to wishlist', wishlist: list.products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// DELETE /api/wishlist/remove/:id - remove product from wishlist
router.delete('/remove/:id', requireAuth, async (req, res) => {
  const productId = req.params.id;
  try {
    const list = await Wishlist.findOne({ user: req.user.id });
    if (!list) return res.status(404).json({ error: 'Wishlist not found' });
    list.products = list.products.filter(id => id.toString() !== productId);
    await list.save();
    res.json({ message: 'Removed from wishlist', wishlist: list.products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove from wishlist' });
  }
});

export default router;
