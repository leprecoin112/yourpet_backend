const { tokenActions } = require("../helpers");

const { User } = require("../models/user");
const { HttpError } = require("../helpers");
const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError.UnauthorizedError());
  }

  try {
    const { id } = tokenActions.validateAccessToken(token);

    const user = await User.findById(id);

    if (!user) {
      return next(HttpError.UnauthorizedError());
    }

    req.user = user;
    next();
  } catch {
    next(HttpError.UnauthorizedError());
  }
};

module.exports = authenticate;
