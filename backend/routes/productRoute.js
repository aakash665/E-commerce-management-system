import express from 'express';
import Item from '../models/productModel';
import { isAuthorized, isSuperUser } from '../util';

const routes = express.Router();

routes.get('/', async (req, res) => {
  const filterCategory = req.query.category ? { category: req.query.category } : {};
  const searchCriteria = req.query.searchKeyword
    ? {
        name: {
          $regex: req.query.searchKeyword,
          $options: 'i',
        },
      }
    : {};
  const sortCriteria = req.query.sortOrder
    ? req.query.sortOrder === 'lowest'
      ? { price: 1 }
      : { price: -1 }
    : { _id: -1 };
  const items = await Item.find({ ...filterCategory, ...searchCriteria }).sort(
    sortCriteria
  );
  res.send(items);
});

routes.get('/:itemId', async (req, res) => {
  const item = await Item.findOne({ _id: req.params.itemId });
  if (item) {
    res.send(item);
  } else {
    res.status(404).send({ message: 'Item Not Found.' });
  }
});

routes.post('/:itemId/reviews', isAuthorized, async (req, res) => {
  const item = await Item.findById(req.params.itemId);
  if (item) {
    const feedback = {
      username: req.body.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
    };
    item.reviews.push(feedback);
    item.numReviews = item.reviews.length;
    item.rating =
      item.reviews.reduce((acc, review) => review.rating + acc, 0) /
      item.reviews.length;
    const updatedItem = await item.save();
    res.status(201).send({
      data: updatedItem.reviews[updatedItem.reviews.length - 1],
      message: 'Feedback added successfully.',
    });
  } else {
    res.status(404).send({ message: 'Item Not Found' });
  }
});

routes.put('/:itemId', isAuthorized, isSuperUser, async (req, res) => {
  const itemId = req.params.itemId;
  const item = await Item.findById(itemId);
  if (item) {
    item.name = req.body.name;
    item.price = req.body.price;
    item.image = req.body.image;
    item.brand = req.body.brand;
    item.category = req.body.category;
    item.countInStock = req.body.countInStock;
    item.description = req.body.description;
    const updatedItem = await item.save();
    if (updatedItem) {
      return res
        .status(200)
        .send({ message: 'Item Updated', data: updatedItem });
    }
  }
  return res.status(500).send({ message: 'Error in Updating Item.' });
});

routes.delete('/:itemId', isAuthorized, isSuperUser, async (req, res) => {
  const itemToDelete = await Item.findById(req.params.itemId);
  if (itemToDelete) {
    await itemToDelete.remove();
    res.send({ message: 'Item Deleted' });
  } else {
    res.send('Error in Deleting Item.');
  }
});

routes.post('/', isAuthorized, isSuperUser, async (req, res) => {
  const item = new Item({
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
  });
  const newItem = await item.save();
  if (newItem) {
    return res
      .status(201)
      .send({ message: 'New Item Created', data: newItem });
  }
  return res.status(500).send({ message: 'Error in Creating Item.' });
});

export default routes;
