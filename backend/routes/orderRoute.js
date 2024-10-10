import express from 'express';
import Purchase from '../models/orderModel';
import { isAuthorized, isSuperUser } from '../util';

const routes = express.Router();

routes.get("/", isAuthorized, async (req, res) => {
  const purchases = await Purchase.find({}).populate('buyer');
  res.send(purchases);
});

routes.get("/my-orders", isAuthorized, async (req, res) => {
  const myPurchases = await Purchase.find({ buyer: req.user._id });
  res.send(myPurchases);
});

routes.get("/:purchaseId", isAuthorized, async (req, res) => {
  const purchase = await Purchase.findOne({ _id: req.params.purchaseId });
  if (purchase) {
    res.send(purchase);
  } else {
    res.status(404).send("Purchase Not Found.");
  }
});

routes.delete("/:purchaseId", isAuthorized, isSuperUser, async (req, res) => {
  const purchase = await Purchase.findOne({ _id: req.params.purchaseId });
  if (purchase) {
    const deletedPurchase = await purchase.remove();
    res.send(deletedPurchase);
  } else {
    res.status(404).send("Purchase Not Found.");
  }
});

routes.post("/", isAuthorized, async (req, res) => {
  const newPurchase = new Purchase({
    purchaseItems: req.body.purchaseItems,
    buyer: req.user._id,
    shippingDetails: req.body.shippingDetails,
    paymentDetails: req.body.paymentDetails,
    itemsCost: req.body.itemsCost,
    taxCost: req.body.taxCost,
    shippingCost: req.body.shippingCost,
    totalCost: req.body.totalCost,
  });
  const newPurchaseCreated = await newPurchase.save();
  res.status(201).send({ message: "New Purchase Created", data: newPurchaseCreated });
});

routes.put("/:purchaseId/pay", isAuthorized, async (req, res) => {
  const purchase = await Purchase.findById(req.params.purchaseId);
  if (purchase) {
    purchase.isSettled = true;
    purchase.settledAt = Date.now();
    purchase.paymentDetails = {
      paymentMethod: 'paypal',
      paymentOutcome: {
        payerID: req.body.payerID,
        orderID: req.body.orderID,
        paymentID: req.body.paymentID
      }
    };
    const updatedPurchase = await purchase.save();
    res.send({ message: 'Purchase Settled.', purchase: updatedPurchase });
  } else {
    res.status(404).send({ message: 'Purchase not found.' });
  }
});

export default routes;
