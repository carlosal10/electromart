import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      _id: false,
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: String,
      price: Number,
      quantity: Number,
      photoUrl: String,
    },
  ],
  totalItems: Number,
  totalCost: Number,
  customerEmail: String,
  customerPhone: String,
  deliveryAddress: String,
  paymentMethod: String, // mpesa | cod
  paymentStatus: { type: String, default: 'pending' },
  date: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
