import { validate, categoryCreateRules, subcategoryAddRules, brandAddRules } from '../middleware/validators.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import express from 'express';
import Category from '../models/categories.js';

const router = express.Router();

// ✅ POST /api/categories - Create a main category (independent)
router.post('/', requireAuth, requireRole('admin'), validate(categoryCreateRules), async (req, res) => {
  try {
    const { name } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ error: "Main category name is required" });
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(400).json({ error: "Category already exists" });

    const category = new Category({
      name: name.trim(),
      subcategories: [],
    });

    await category.save();
    res.status(201).json({ message: 'Main category created', category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ✅ PUT /api/categories/:categoryName/add-sub - Add a subcategory to a main category
router.put('/:categoryName/add-sub', requireAuth, requireRole('admin'), validate(subcategoryAddRules), async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryName } = req.params;

    if (!name?.trim()) return res.status(400).json({ error: 'Subcategory name is required' });

    const category = await Category.findOne({ name: categoryName });
    if (!category) return res.status(404).json({ error: 'Main category not found' });

    const exists = category.subcategories.find(sub => sub.name === name.trim());
    if (exists) return res.status(400).json({ error: 'Subcategory already exists' });

    category.subcategories.push({ name: name.trim(), brands: [] });
    await category.save();

    res.status(200).json({ message: 'Subcategory added', category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST /api/categories/:categoryName/:subName/brand - Add brand to a subcategory
router.post('/:categoryName/:subName/brand', requireAuth, requireRole('admin'), validate(brandAddRules), async (req, res) => {
  try {
    const { brand } = req.body;
    const { categoryName, subName } = req.params;

    if (!brand?.trim()) return res.status(400).json({ error: 'Brand name is required' });

    const category = await Category.findOne({ name: categoryName });
    if (!category) return res.status(404).json({ error: 'Main category not found' });

    const sub = category.subcategories.find(s => s.name === subName);
    if (!sub) return res.status(404).json({ error: 'Subcategory not found' });

    const brandExists = sub.brands.includes(brand.trim());
    if (brandExists) return res.status(400).json({ error: 'Brand already exists in this subcategory' });

    sub.brands.push(brand.trim());
    await category.save();

    res.status(200).json({ message: 'Brand added to subcategory', category });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /api/categories - Fetch all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;

