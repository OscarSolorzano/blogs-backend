const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Post } = require('../models/post.model');
const { Comment } = require('../models/comment.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.findAll({
    where: { status: 'active' },
    attributes: { exclude: ['password'] },
    include: [
      { model: Post, include: { model: Comment, include: User } },
      { model: Comment },
    ],
  });

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (role !== 'admin' && role !== 'normal') {
    return next(new AppError('Invalid role', 400));
  }

  //Encrypt the user's password
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  //Remove password from response
  newUser.password = undefined;

  // 201 -> Success and a resource has been created
  res.status(201).json({
    status: 'success',
    data: { newUser },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { name } = req.body;
  const { user } = req;

  // Method 1: Update by using the model
  // await User.update({ name }, { where: { id } });

  // Method 2: Update using a model's instance
  await user.update({ name });

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  // Method 1: Delete by using the model
  // User.destroy({ where: { id } })

  // Method 2: Delete by using the model's instance
  // await user.destroy();

  // Method 3: Soft delete
  await user.update({ status: 'deleted' });

  res.status(204).json({ status: 'success' });
});

const login = catchAsync(async (req, res, next) => {
  //Get user email and password
  const { email, password } = req.body;
  //Validate if the users exists with given mail
  const user = await User.findOne({
    where: { email, status: 'active' },
  });

  // Compare passwords (entered password vs db password)
  //If user or  password does not match, send error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong credential', 400));
  }

  //Remove Password from response
  user.password = undefined;

  //Generate JWT
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.status(200).json({
    status: 'succes',
    data: { user, token },
  });
});

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
};
