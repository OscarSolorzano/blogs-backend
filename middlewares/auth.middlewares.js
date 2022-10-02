const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

//Models
const { User } = require('../models/user.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const protectSession = catchAsync(async (req, res, next) => {
  //Get Token
  let token;

  if (
    //Extract token
    // req.headers.authorization = 'Bearer token'
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  //Check if token was sent
  if (!token) {
    return next(new AppError('The token was invalid', 403));
  }

  //Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //Verify token's owner
  const user = await User.findOne({
    where: { id: decoded.id, status: 'active' },
  });

  if (!user) {
    return next(
      new AppError('The owner of this session is no longer active', 400)
    );
  }

  //Grant Access
  req.sessionUser = user;
  next();
});

const protectUserAccount = (req, res, next) => {
  const { sessionUser, user } = req;
  if (sessionUser.id != user.id) {
    return next(new AppError('You are not the owner of this account', 403));
  }

  next();
};

const protectPostOwner = (req, res, next) => {
  const { sessionUser, post } = req;

  if (sessionUser.id != post.userId) {
    return next(new AppError('You are not the owner of this post', 403));
  }
  next();
};

const protecCommentOwner = (req, res, next) => {
  const { sessionUser, comment } = req;

  if (sessionUser.id != comment.userId) {
    return next(new AppError('You are not the owner of this comment', 403));
  }
  next();
};

const protectAdmin = (req, res, next) => {
  const { sessionUser } = req;
  if (sessionUser.role !== 'admin') {
    return next(new AppError('You do not have the rigth acces level', 403));
  }
  next();
};

module.exports = {
  protectSession,
  protectUserAccount,
  protectPostOwner,
  protecCommentOwner,
  protectAdmin,
};
