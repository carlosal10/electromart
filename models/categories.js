// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcategories: [
    {
      name: { type: String, required: true },
      brands: [String], // Add brands inside subcategories
    },
  ],
});

export default mongoose.model('Category', categorySchema);
