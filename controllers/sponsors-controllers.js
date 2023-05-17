const ctrlWrapper = require("../utils/ctrlWrapper");
const { News } = require("../models/news");
const HttpError = require('../helpers/HttpError');

const getAllSponsors = async (req, res) => {
   
    const result = await News.find();

      if(result.length === 0) {
        throw HttpError.NotFoundError("Sponsors not found");
      }


    res.status(200).json({
        result,
      },
    );
  };

  module.exports = {
    getAllSponsors: ctrlWrapper(getAllSponsors),
  }