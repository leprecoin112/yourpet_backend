// const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const {Pet} = require('../models/pets')
const { ctrlWrapper } = require("../utils");
const {HttpError} = require('../helpers')
const avatarDir = path.join(__dirname, "../", "public", "avatarsPets")
const addPets = async (req, res) => {
   
console.log("test", req.file.size)
const { path: tempUpload, filename } = req.file;
const avatarName = `_${filename}`;
const resultUpload = path.join(avatarDir, avatarName);
await fs.rename(tempUpload, resultUpload);
const avatarURL = path.join("avatars", avatarName);

const{_id: owner} = req.user;
    const mg = 3 * 1024
if (!req.body) {
throw new HttpError(400, `The text fields are not filled in`);
}
if (!req.file) {
throw new HttpError(400, `The file is not loaded`);
}
if(req.file.size > mg){
    throw new HttpError(413, `Payload Too Large`);
}
const result = await Pet.create({
    ...req.body, 
    avatarURL,
    owner
});
res.status(201).json({
    message: "Information about the pet was published",
    result
});

};
const deletePet = async (req, res) => {
    const {id} = req.params;

    const result = await Pet.findByIdAndDelete(id);
    if(!result) {
        throw new HttpError(404, `Pet with id ${id} not found`);
    }
    res.status(200).json(
    {
        message: "The pet was deleted",
        result,
    }
    )
}

module.exports = {
    deletePet: ctrlWrapper(deletePet),
  addPets: ctrlWrapper(addPets),

};
