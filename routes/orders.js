import express from 'express';
import Order from '../models/Order.js'; // ✅ Your Mongoose Order model
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; // To fetch user by decoded ID

const router = express.Router();

// 🔐 Authentication Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ error: "Invalid token." });

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};

// 🧾 POST /api/orders - Place new order
router.post("/", authenticate, async (req, res) => {
  const {
    orderId,
    items,
    totalItems,
    totalCost,
    customerEmail,
    customerPhone,
    deliveryAddress,
    paymentMethod,
  } = req.body;

  // ✅ Basic validation
  if (
    !orderId ||
    !items?.length ||
    !totalItems ||
    !totalCost ||
    !customerEmail?.trim() ||
    !customerPhone?.trim() ||
    !deliveryAddress?.trim() ||
    !paymentMethod?.trim()
  ) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newOrder = new Order({
      orderId,
      user: req.user._id,
      items,
      totalItems,
      totalCost,
      customerEmail,
      customerPhone,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "cod" : "paid",
      date: new Date(),
    });

    await newOrder.save();
    res.status(201).json({ message: "Order saved successfully", order: newOrder });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Failed to save order" });
  }
});

// (Optional) GET orders for logged-in user
router.get("/", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

router.get("/my-orders", authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ date: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
});

export default router;
