const { Pet }= require("../models/pets");

// const HttpError = require('../helpers/HttpError');

const ctrlWrapper = require('../utils/ctrlWrapper');

const addNotice = async (req, res) => {
  const result = await Pet.create(req.body);
  res.status(201).json({
    status: 'success',
    code: 201,
    data: {
      data: result,
    },
  });  
};

const getAllNotices = async (req, res) => {
    // const { _id: owner } = req.user;
    // const { page = 1, limit = 12 } = req.query;
    // const skip = (page - 1) * limit;
    const notices = await Pet.find();
      // { owner },
      // "-createdAt -updatedAt",
      // { skip, limit })
      // .populate("owner", "email"); // returns all data from the collection
  
    res.json({
      status: 'success',
      code: 200,
      data: {
        notices,
      },
    });
  };
  
  module.exports = {
    getAllNotices: ctrlWrapper(getAllNotices),
    addNotice: ctrlWrapper(addNotice),
  }