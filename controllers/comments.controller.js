//Models
const { Comment } = require('../models/comment.model');
const { Post } = require('../models/post.model');
const { User } = require('../models/user.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');

const getAllComments = catchAsync(async (req, res, next) => {
  //include the user that wrote the comment
  //imclude the post that the comment was made on
  //include the author of the post where the comment was made on
  const comments = await Comment.findAll({
    include: [{ model: User }, { model: Post, include: User }],
  });

  res.status(200).json({
    status: 'succes',
    data: {
      comments,
    },
  });
});

const createComment = catchAsync(async (req, res, next) => {
  const { comment, postId } = req.body;
  const { sessionUser } = req;
  const newComment = await Comment.create({
    comment,
    userId: sessionUser.id,
    postId,
  });

  res.status(201).json({
    status: 'succes',
    data: {
      newComment,
    },
  });
});

const updateComment = catchAsync(async (req, res, next) => {
  const { updatedComment } = req.body;
  const { comment } = req;

  console.log(comment);

  await comment.update({ comment: updatedComment });

  res.status(200).json({
    status: 'succes',
    data: { comment },
  });
});

const deleteComment = catchAsync(async (req, res, next) => {
  const { comment } = req;

  await comment.update({ status: 'deleted' });

  res.status(200).json({
    status: 'succes',
  });
});

module.exports = {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
};
