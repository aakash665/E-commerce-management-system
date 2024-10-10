import jwt from 'jsonwebtoken';
import settings from './config';

const generateToken = (account) => {
  return jwt.sign(
    {
      _id: account._id,
      name: account.name,
      email: account.email,
      isAdmin: account.isAdmin,
    },
    settings.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
};

const authenticate = (req, res, next) => {
  const tokenHeader = req.headers.authorization;

  if (tokenHeader) {
    const token = tokenHeader.slice(7, tokenHeader.length); // Bearer xxx
    jwt.verify(token, settings.JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.account = decoded;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: 'Token not provided.' });
  }
};

const authorizeAdmin = (req, res, next) => {
  console.log(req.account);
  if (req.account && req.account.isAdmin) {
    return next();
  }
  return res.status(401).send({ message: 'Admin privileges required.' });
};

export { generateToken, authenticate, authorizeAdmin };
