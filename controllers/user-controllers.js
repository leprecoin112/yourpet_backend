const fs = require("fs/promises");
const path = require("path");

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const getCurrent = async (req, res) => {
  const{ email, name } = req.user;

  res.json({
     email,
     name,
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

  const updateName = async (req, res) => {
    const { _id } = req.user;
    const { name } = req.body;
    await User.findByIdAndUpdate(_id, { name });
  
    res.json({
     name
    });
  };
  const updatePhone = async (req, res) => {
    const { _id } = req.user;
    const { phone } = req.body;
    await User.findByIdAndUpdate(_id, { phone });
  
    res.json({
     phone
    });
  };
  
  const updateCity = async (req, res) => {
    const { _id } = req.user;
    const { city} = req.body;
    await User.findByIdAndUpdate(_id, { city });
  
    res.json({
     city
    });
  };
  
  const updateBirthday = async (req, res) => {
    const { _id } = req.user;
    const { birthday} = req.body;
    await User.findByIdAndUpdate(_id, { birthday });
  
    res.json({
      birthday
    });
  };
  
  module.exports = {
    getCurrent: ctrlWrapper(getCurrent),
    updateAvatar: ctrlWrapper(updateAvatar),
    updateName: ctrlWrapper(updateName),
    updatePhone: ctrlWrapper(updatePhone),
    updateCity: ctrlWrapper(updateCity),
    updateBirthday: ctrlWrapper(updateBirthday),
  };
 
