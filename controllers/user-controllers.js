const { ctrlWrapper } = require('../utils');
const { Pet } = require("../models/pet");

const getUserInfo = async (req, res) => {
    const { email, name, birthday, city, phone } = req.user;

    res.json({ email, name, birthday, city, phone });
};

const getUserPets = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Pet.find({owner}, '-createdAt -updatedAt', {skip, limit});
    res.json(result);
}

module.exports = {
    getUserInfo: ctrlWrapper(getUserInfo),
    getUserPets: ctrlWrapper(getUserPets),
}