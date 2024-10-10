import express from 'express';
import User from '../models/userModel';
import { getToken, isAuth } from '../util';

const router = express.Router();

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  const existingUser = await User.findById(userId);
  if (existingUser) {
    existingUser.name = req.body.name || existingUser.name;
    existingUser.email = req.body.email || existingUser.email;
    existingUser.password = req.body.password || existingUser.password;
    const updatedUser = await existingUser.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

router.post('/signin', async (req, res) => {
  const credentials = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (credentials) {
    res.send({
      _id: credentials.id,
      name: credentials.name,
      email: credentials.email,
      isAdmin: credentials.isAdmin,
      token: getToken(credentials),
    });
  } else {
    res.status(401).send({ message: 'Invalid Email or Password.' });
  }
});

router.post('/register', async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  const savedUser = await newUser.save();
  if (savedUser) {
    res.send({
      _id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      isAdmin: savedUser.isAdmin,
      token: getToken(savedUser),
    });
  } else {
    res.status(401).send({ message: 'Invalid User Data.' });
  }
});

router.get('/createadmin', async (req, res) => {
  try {
    const adminUser = new User({
      name: 'AG',
      email: 'ag@example.com',
      password: '1234213',
      isAdmin: true,
    });
    const createdAdmin = await adminUser.save();
    res.send(createdAdmin);
  } catch (error) {
    res.send({ message: error.message });
  }
});

export default router;
