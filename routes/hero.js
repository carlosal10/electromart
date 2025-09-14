import express from 'express';
import Hero from '../models/Banner.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Create a new banner (supports different types)
router.post('/', async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      imageUrl,
      buttonText,
      buttonLink,
      type // <- NEW
    } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ error: 'Title and imageUrl are required' });
    }

    const banner = new Hero({
      title,
      subtitle,
      description,
      imageUrl,
      buttonText,
      buttonLink,
      type: type || 'hero' // default to 'hero' if not provided
    });

    await banner.save();

    res.status(201).json({ message: 'Banner created', banner });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create banner' });
  }
});

// ✅ Get all banners (optional filter by type)
router.get('/', async (req, res) => {
  try {
    const { type } = req.query;
    const filter = type ? { type } : {};
    const banners = await Hero.find(filter).sort({ createdAt: -1 });

    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch banners' });
  }
});

// ✅ Get single banner by ID
router.get('/:id', async (req, res) => {
  try {
    const banner = await Hero.findById(req.params.id);
    if (!banner) return res.status(404).json({ error: 'Banner not found' });

    res.json(banner);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving banner' });
  }
});

// ✅ Update a banner
router.put('/:id', async (req, res) => {
  try {
    const updated = await Hero.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Banner not found' });

    res.json({ message: 'Banner updated', banner: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update banner' });
  }
});

// ✅ Delete a banner
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Hero.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Banner not found' });

    res.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete banner' });
  }
});

export default router;
