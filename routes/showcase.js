import express from 'express';
import Hero from '../models/Banner.js';
import Product from '../models/Product.js';

const router = express.Router();

// Only fetch banners with type: 'seasonal'
const getSeasonalShowcaseData = async (section, usedProductIds = []) => {
  const banners = await Hero.find({ type: 'seasonal' })
    .sort({ createdAt: -1 })
    .limit(3);

  const query = {
    _id: { $nin: usedProductIds },
    $or: [
      { seasonalOffer: true },
      { bestChoice: true }
    ]
  };

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .limit(2);

  const responseProducts = products.map((p, idx) => ({
    ...p.toObject(),
    position: idx === 0 ? 'top' : 'bottom'
  }));

  return { banners, products: responseProducts };
};

let usedProductIdsLeft = [];

router.get('/left', async (req, res) => {
  try {
    const data = await getSeasonalShowcaseData('left');
    usedProductIdsLeft = data.products.map(p => p._id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seasonal showcase left' });
  }
});

router.get('/right', async (req, res) => {
  try {
    const data = await getSeasonalShowcaseData('right', usedProductIdsLeft);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch seasonal showcase right' });
  }
});

export default router;
