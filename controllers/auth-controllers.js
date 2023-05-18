const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");

const imagePath = path.join(__dirname, "image");

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

const { HttpError} = require("../helpers");

const { SECRET_KEY} = process.env;

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError.ConflictError("Email already in use");
  }
 
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = path.join(imagePath, "Photodefault.png");

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  const payload = {
    id: result._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(result._id, { token });
 
  res.status(201).json({
    token,
    email: result.email,
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
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    name: user.name,
    email: user.email,
    
  });
};


const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};


module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
};
