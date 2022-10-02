const express = require('express');

// Controllers
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/posts.controller');

// Middlewares
const { postExists } = require('../middlewares/posts.middlewares');
const {
  createPostValidators,
} = require('../middlewares/validators.middlewares');
const {
  protectSession,
  protectPostOwner,
} = require('../middlewares/auth.middlewares');

//Utils
const { upload } = require('../utils/multer.util.');

const postsRouter = express.Router();

postsRouter.use(protectSession);

postsRouter.get('/', getAllPosts);

// Get only one img
// postsRouter.post('/', upload.single('postImg'), createPost);

postsRouter.post('/', upload.array('postImg', 3), createPost);

postsRouter.patch('/:id', postExists, protectPostOwner, updatePost);

postsRouter.delete('/:id', postExists, protectPostOwner, deletePost);

module.exports = { postsRouter };
