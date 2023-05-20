const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

const validateAccessToken = (token) => {
  try {
    const userData = jwt.verify(token, JWT_ACCESS_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
};
const validateRefreshToken = (refreshToken) => {
  try {
    const userData = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    return userData;
  } catch (e) {
    return null;
  }
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });
  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    return tokenData.save();
  }

  const token = Token.create({ user: userId, refreshToken });
  return token;
};

const removeToken = async (refreshToken) => {
  const tokenData = await Token.deleteOne({ refreshToken });
  return tokenData;
};

const removeTokenByUserId = async (userId) => {
  await Token.deleteOne({ user: userId });
};

const findToken = async (refreshToken) => {
  const tokenData = await Token.findOne({ refreshToken });
  return tokenData;
};

module.exports = {
  generateTokens,
  validateAccessToken,
  validateRefreshToken,
  saveToken,
  removeToken,
  removeTokenByUserId,
  findToken,
};
