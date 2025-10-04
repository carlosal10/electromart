import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String },
  method: { type: String },
  path: { type: String },
  statusCode: { type: Number },
  ip: { type: String },
  userAgent: { type: String },
  payload: { type: Object },
}, { timestamps: true });

export default mongoose.model('AuditLog', auditLogSchema);
