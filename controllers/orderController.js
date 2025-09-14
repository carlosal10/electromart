// controllers/orderController.js
import Order from '../models/Order.js';

export const getMyOrders = async (req, res) => {
  try {
    const userEmail = req.user.email;
    const orders = await Order.find({ customerEmail: userEmail }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
