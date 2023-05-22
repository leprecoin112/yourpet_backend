const { nanoid } = require("nanoid");
const { Pet } = require("../../models/pets");
const { ctrlWrapper } = require("../../utils");
const { HttpError, cloudinaryUpload } = require("../../helpers");
const addPets = async (req, res) => {
  const { path: tempUpload, filename } = req.file;

  const { _id: owner } = req.user;

  if (!req.body) {
    throw HttpError.BadRequest(`The text fields are not filled in`);
  }
  if (!req.file) {
    throw HttpError.BadRequest(`The file is not loaded`);
  }

  const uniqueId = nanoid();
  const avatarName = `${uniqueId}_${filename}`;
  const avatarURL = await cloudinaryUpload(tempUpload, avatarName);

  const result = await Pet.create({
    ...req.body,
    avatarURL,
    owner,
  });
  res.status(201).json({
    message: "Information about the pet was published",
    result,
  });
};
const deletePet = async (req, res) => {
  const { id } = req.params;

  const result = await Pet.findByIdAndDelete(id);
  if (!result) {
    throw HttpError.NotFoundError(`Pet with id ${id} not found`);
  }
  res.status(200).json({
    message: "The pet was deleted",
    result,
  });
};

module.exports = {
  deletePet: ctrlWrapper(deletePet),
  addPets: ctrlWrapper(addPets),
};
