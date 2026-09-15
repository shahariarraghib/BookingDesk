const mongoose = require("mongoose");
const AppError = require("../utils/global.error");

const debugAuth = (req, resp, next) => {
  const userId = req.header("x-user-id");

  if (!userId) {
    return next(
      new AppError("Protected API: send a valid x-user-id header", 401),
    );
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(
      new AppError("x-user-id must be a valid MongoDB ObjectId", 400),
    );
  }

  req.user = { _id: userId };
  next();
};

module.exports = debugAuth;
