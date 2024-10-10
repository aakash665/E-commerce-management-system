import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import settings from './config';
import usersAPI from './routes/userRoute';
import productsAPI from './routes/productRoute';
import ordersAPI from './routes/orderRoute';
import uploadsAPI from './routes/uploadRoute';

const dbConnectionUrl = settings.MONGODB_URL;
mongoose
  .connect(dbConnectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .catch((error) => console.log(error.message));

const server = express();
server.use(bodyParser.json());
server.use('/api/uploads', uploadsAPI);
server.use('/api/users', usersAPI);
server.use('/api/products', productsAPI);
server.use('/api/orders', ordersAPI);
server.get('/api/config/paypal', (req, res) => {
  res.send(settings.PAYPAL_CLIENT_ID);
});
server.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
server.use(express.static(path.join(__dirname, '/../frontend/build')));
server.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
});

server.listen(settings.PORT, () => {
  console.log(`Server started at http://localhost:${settings.PORT}`);
});
