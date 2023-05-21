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
  console.log(page);
  const normalizedFind = title.trim().split(" ");
  let searchQuery = {};
  const regexExpressions = normalizedFind.map((word) => new RegExp(word, "i"));

  if (title !== "null") {
    searchQuery = {
      $and: [
        {
          $or: regexExpressions.map((expression) => ({
            title: { $regex: expression },
          })),
        },
      ],
    };
  }

  const result = await News.find(searchQuery, "-createdAt -updatedAt", {
    skip,
    limit: Number(limit),
  }).sort({ date: -1 });

  if (result.length === 0) {
    throw HttpError.NotFoundError("News not found");
  }

  const totalResults = await News.count(searchQuery, "-createdAt -updatedAt");

  const totalPages = Math.ceil(totalResults / limit);

  res.status(200).json({
    totalResults,
    totalPages,
    page: +page,
    limit: +limit,
    news: result,
  });
};

module.exports = {
  getAllNews: ctrlWrapper(getAllNews),
  findNewsByTitle: ctrlWrapper(findNewsByTitle),
};
