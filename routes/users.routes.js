const express = require('express');

// Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const {
  createUserValidators,
} = require('../middlewares/validators.middlewares');
const {
  protectSession,
  protectUserAccount,
  protectAdmin,
} = require('../middlewares/auth.middlewares');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

//Protecting below end Points
usersRouter.use(protectSession);

usersRouter.get('/', protectAdmin, getAllUsers);

usersRouter.patch('/:id', userExists, protectUserAccount, updateUser);

usersRouter.delete('/:id', userExists, protectUserAccount, deleteUser);

module.exports = { usersRouter };
