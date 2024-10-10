import mongoose from 'mongoose';

const deliverySchema = {
  street: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
};

const transactionSchema = {
  method: { type: String, required: true }
};

const purchasedItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  unitPrice: { type: String, required: true },
  productRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
});

const purchaseSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  purchasedItems: [purchasedItemSchema],
  deliveryDetails: deliverySchema,
  transactionDetails: transactionSchema,
  itemsCost: { type: Number },
  taxAmount: { type: Number },
  deliveryCost: { type: Number },
  totalCost: { type: Number },
  paymentStatus: { type: Boolean, default: false },
  paymentDate: { type: Date },
  deliveryStatus: { type: Boolean, default: false },
  deliveryDate: { type: Date },
}, {
  timestamps: true
});

const purchaseModel = mongoose.model("Purchase", purchaseSchema);
export default purchaseModel;
