const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const imagePath = path.join(__dirname, "image");

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

const { HttpError, sendEmail } = require("../helpers");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError.ConflictError("Email already in use");
  }
 
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = path.join(imagePath, "Photodefault.png");
  const verificationToken = nanoid();

  const result = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });
 
  res.status(201).json({
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

const getCurrent = async (req, res) => {
  const{ email, name } = req.user;

  res.json({
     email,
     name,
    });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;
  const avatarName = `${_id}_${filename}`;
  const resultUpload = path.join(avatarsDir, avatarName);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", avatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};


module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),

};
