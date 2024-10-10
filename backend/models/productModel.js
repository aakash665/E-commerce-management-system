import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    score: { type: Number, default: 0 },
    review: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  manufacturer: { type: String, required: true },
  priceTag: { type: Number, default: 0, required: true },
  itemCategory: { type: String, required: true },
  stockCount: { type: Number, default: 0, required: true },
  itemDescription: { type: String, required: true },
  averageRating: { type: Number, default: 0, required: true },
  totalReviews: { type: Number, default: 0, required: true },
  feedbacks: [feedbackSchema],
});

const itemModel = mongoose.model('Item', itemSchema);

export default itemModel;
