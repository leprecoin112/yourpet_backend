

const { ctrlWrapper } = require("../utils");

const { User } = require("../models/user");

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
    updateName: ctrlWrapper(updateName),
    updatePhone: ctrlWrapper(updatePhone),
    updateCity: ctrlWrapper(updateCity),
    updateBirthday: ctrlWrapper(updateBirthday),
  };
  

// const { ctrlWrapper } = require('../utils');
// const { Pet } = require("../models/pet");

// const getUserInfo = async (req, res) => {
//     const { email, name, birthday, city, phone } = req.user;

//     res.json({ email, name, birthday, city, phone });
// };

// const getUserPets = async (req, res) => {
//     const { _id: owner } = req.user;
//     const { page = 1, limit = 12 } = req.query;
//     const skip = (page - 1) * limit;
//     const result = await Pet.find({owner}, '-createdAt -updatedAt', {skip, limit});
//     res.json(result);
// }

// module.exports = {
//     getUserInfo: ctrlWrapper(getUserInfo),
//     getUserPets: ctrlWrapper(getUserPets),
// }

