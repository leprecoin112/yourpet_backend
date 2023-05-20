const ctrlWrapper = require("../utils/ctrlWrapper");
const { Sponsor } = require("../models/sponsors");
const HttpError = require("../helpers/HttpError");

const getAllSponsors = async (req, res) => {
  const result = await Sponsor.find();

  if (result.length === 0) {
    throw HttpError.NotFoundError("Sponsors not found");
  }

  res.status(200).json({
    result,
  });
};

module.exports = {
  getAllSponsors: ctrlWrapper(getAllSponsors),
};
