const ctrlWrapper = require("../../utils/ctrlWrapper");
const { News } = require("../../models/news");
const HttpError = require("../../helpers/HttpError");

const getAllNews = async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  const skip = (page - 1) * limit;
  const news = await News.find({}, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  }).sort({ createdAt: -1 });

  if (news.length === 0) {
    throw HttpError.NotFoundError("News not found");
  }

  const totalResults = await News.count();
  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    totalResults,
    totalPages,
    page: +page,
    limit: +limit,
    news,
  });
};

const findNewsByTitle = async (req, res) => {
  const { page = 1, limit = 6, title } = req.query;
  const skip = (page - 1) * limit;
  const normalizedFind = title.toLowerCase().trim();

  const allNews = await News.find({}, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  }).sort({ createdAt: -1 });

  const result = allNews.filter((oneNew) =>
    oneNew.title.toLowerCase().includes(normalizedFind)
  );

  if (result.length === 0) {
    throw HttpError.NotFoundError("News not found");
  }

  const totalResults = result.length;
  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    totalResults,
    totalPages,
    page: +page,
    limit: +limit,
    result,
  });
};

module.exports = {
  getAllNews: ctrlWrapper(getAllNews),
  findNewsByTitle: ctrlWrapper(findNewsByTitle),
};
