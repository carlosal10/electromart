import express from 'express';
import Review from '../models/Review.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/reviews/:productId - fetch all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate('user', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// POST /api/reviews/:productId - add a review to a product (requires auth)
router.post('/:productId', requireAuth, async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;
    if (!rating) return res.status(400).json({ error: 'Rating is required' });
    const review = new Review({ user: req.user.id, product: productId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review added', review });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

export default router;
