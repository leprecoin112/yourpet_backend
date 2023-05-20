const ctrlWrapper = require("../../utils/ctrlWrapper");
const { Sponsor } = require("../../models/sponsors");
const HttpError = require("../../helpers/HttpError");

const getAllSponsors = async (req, res) => {
  const { page = 1, limit = 9 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Sponsor.find({}, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  });

  if (result.length === 0) {
    throw HttpError.NotFoundError("Sponsors not found");
  }

  const totalResult = await Sponsor.count();
  const totalPages = Math.ceil(totalResult / limit);

  res.status(200).json({
    totalResult,
    totalPages,
    page: +page,
    limit: +limit,
    result,
  });
};

module.exports = {
  getAllSponsors: ctrlWrapper(getAllSponsors),
};
