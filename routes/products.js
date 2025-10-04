import { validate, productCreateRules, productUpdateRules } from '../middleware/validators.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import express from 'express';
import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ CREATE PRODUCT
router.post('/', requireAuth, requireRole('admin'), validate(productCreateRules), async (req, res) => {
  try {
    const {
      name, price, stock, inStock, features, description,
      mainCategory, subcategory, brand, colors, sizes,
      photoUrls, isPopular, seasonalOffer, bestChoice
    } = req.body;

    // Validation
    if (
      !name || !price || !stock || !features || !description ||
      !mainCategory || !subcategory || !brand ||
      !Array.isArray(photoUrls) || photoUrls.length === 0
    ) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const product = new Product({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
      inStock: Boolean(inStock),
      features: features.trim(),
      description: description.trim(),
      mainCategory: mainCategory.trim(),
      subcategory: subcategory.trim(),
      brand: brand.trim(),
      colors: colors || [],
      sizes: sizes || [],
      photoUrls: photoUrls.map(url => url.trim()),
      isPopular: Boolean(isPopular),
      seasonalOffer: Boolean(seasonalOffer),
      bestChoice: Boolean(bestChoice)
    });

    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// ✅ READ PRODUCTS (all / filtered)
router.get('/', async (req, res) => {
  try {
    const { category, subcategory, popular, seasonal, best, limit } = req.query;
    const filter = {};

    if (category) filter.mainCategory = category;
    if (subcategory) filter.subcategory = subcategory;
    if (popular === 'true') filter.isPopular = true;
    if (seasonal === 'true') filter.seasonalOffer = true;
    if (best === 'true') filter.bestChoice = true;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit) || 20);

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ DELETE
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ✅ UPDATE
router.put('/:id', requireAuth, requireRole('admin'), validate(productUpdateRules), async (req, res) => {
  try {
    const {
      name, price, stock, inStock, features, description,
      mainCategory, subcategory, brand, colors, sizes,
      photoUrls, isPopular, seasonalOffer, bestChoice
    } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
        inStock: Boolean(inStock),
        features: features.trim(),
        description: description.trim(),
        mainCategory: mainCategory.trim(),
        subcategory: subcategory.trim(),
        brand: brand.trim(),
        colors: colors || [],
        sizes: sizes || [],
        photoUrls: photoUrls.map(url => url.trim()),
        isPopular: Boolean(isPopular),
        seasonalOffer: Boolean(seasonalOffer),
        bestChoice: Boolean(bestChoice)
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// ✅ GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: 'Invalid product ID' });
  }
});

export default router;

