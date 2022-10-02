// Models
const { User } = require('../models/user.model');

//Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({ where: { id } });

  // If user doesn't exist, send error message
  if (!user) {
    return next(new AppError('User not found', 404));
    // return res.status(404).json({
    //   status: 'error',
    //   message: 'User not found',
    // });
  }

  // req.anyPropName = 'anyValue'
  req.user = user;
  next();
});

module.exports = {
  userExists,
};
