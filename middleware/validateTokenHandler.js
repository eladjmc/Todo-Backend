import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

export const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error('User is not authorized!');
      }

      const { email, id: _id } = decoded.user;

      const user = await User.findOne({ email, _id }).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('User not found');
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401);
    throw new Error('User is not authorized or token was not provided');
  }
});
