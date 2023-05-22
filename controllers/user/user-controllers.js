const { ctrlWrapper } = require("../../utils");
const { User } = require("../../models/user");
const { Pet } = require("../../models/pets");
const { cloudinaryUpload } = require("../../helpers");

const getUserInfo = async (req, res) => {
  const { _id, email, name, birthday, city, phone, avatarURL } = req.user;

  res.json({ _id, email, name, birthday, city, phone, avatarURL });
};

const getUserPets = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Pet.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  res.json(result);
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;

  res.json({
    email,
    name,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;

  const avatarName = `${_id}_${filename}`;
  const avatarURL = await cloudinaryUpload(tempUpload, avatarName);
  await User.findByIdAndUpdate(_id, { avatarURL });

  res.json({ avatarURL });
};

const updateName = async (req, res) => {
  const { _id } = req.user;
  const { name } = req.body;
  await User.findByIdAndUpdate(_id, { name });

  res.json({
    name,
  });
};
const updatePhone = async (req, res) => {
  const { _id } = req.user;
  const { phone } = req.body;
  await User.findByIdAndUpdate(_id, { phone });

  res.json({
    phone,
  });
};

const updateCity = async (req, res) => {
  const { _id } = req.user;
  const { city } = req.body;
  await User.findByIdAndUpdate(_id, { city });

  res.json({
    city,
  });
};

const updateBirthday = async (req, res) => {
  const { _id } = req.user;
  const { birthday } = req.body;
  await User.findByIdAndUpdate(_id, { birthday });

  res.json({
    birthday,
  });
};

module.exports = {
  getUserInfo: ctrlWrapper(getUserInfo),
  getUserPets: ctrlWrapper(getUserPets),
  getCurrent: ctrlWrapper(getCurrent),
  updateAvatar: ctrlWrapper(updateAvatar),
  updateName: ctrlWrapper(updateName),
  updatePhone: ctrlWrapper(updatePhone),
  updateCity: ctrlWrapper(updateCity),
  updateBirthday: ctrlWrapper(updateBirthday),
};
