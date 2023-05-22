const bcrypt = require("bcrypt");
const path = require("path");

const { ctrlWrapper } = require("../../utils");

const { User } = require("../../models/user");

const { HttpError, tokenActions } = require("../../helpers");

const cookieOption = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: "lax",
};

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError.ConflictError("Email already in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = path.join("avatars", "Photodefault.png");

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  const payload = {
    id: result._id,
  };
  const tokens = tokenActions.generateTokens(payload);
  await tokenActions.saveToken(result._id, tokens.refreshToken);

  await User.findByIdAndUpdate(result._id, { token: tokens.accessToken });

  res.cookie("refreshToken", tokens.refreshToken, cookieOption);

  res.status(201).json({
    user: {
      name: result.name,
      email: result.email,
    },
    ...tokens,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError.UnauthorizedError("Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError.UnauthorizedError("Email or password invalid");
  }
  const payload = {
    id: user._id,
  };
  const tokens = tokenActions.generateTokens(payload);
  await tokenActions.saveToken(user._id, tokens.refreshToken);

  await User.findByIdAndUpdate(user._id, { token: tokens.accessToken });

  res.cookie("refreshToken", tokens.refreshToken, cookieOption);

  res.json({
    user: {
      name: user.name,
      email: user.email,
    },
    ...tokens,
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  const token = await tokenActions.removeToken(refreshToken);
  if (token.deletedCount === 0) {
    throw HttpError.UnauthorizedError();
  }

  res.clearCookie("refreshToken");
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw HttpError.UnauthorizedError();
  }

  const { id } = tokenActions.validateRefreshToken(refreshToken);
  const tokenFromDb = await tokenActions.findToken(refreshToken);

  if (!id || !tokenFromDb) {
    throw HttpError.UnauthorizedError();
  }
  const user = await User.findById(id);

  const payload = {
    id: user._id,
  };

  const tokens = tokenActions.generateTokens(payload);
  await tokenActions.saveToken(user._id, tokens.refreshToken);

  await User.findByIdAndUpdate(user._id, { token: tokens.accessToken });

  res.cookie("refreshToken", tokens.refreshToken, cookieOption);

  res.status(200).json({
    user: {
      name: user.name,
      email: user.email,
    },
    ...tokens,
  });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  refresh: ctrlWrapper(refresh),
};
