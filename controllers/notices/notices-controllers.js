const { nanoid } = require("nanoid");

const { Notice } = require("../../models/notice");
const { User } = require("../../models/user");

const { HttpError, cloudinaryUpload } = require("../../helpers");

const ctrlWrapper = require("../../utils/ctrlWrapper");

const getAllNotices = async (req, res) => {
  const { page = 1, limit = 3 } = req.query;
  const skip = (page - 1) * limit;

  const result = await Notice.find({}, "", {
    skip,
    limit: Number(limit),
  }).sort({ createdAt: -1 });

  if (result.length === 0) {
    throw HttpError.NotFoundError("Notices not found");
  }

  const totalResult = await Notice.count();
  const totalPages = Math.ceil(totalResult / limit);

  res.status(200).json({
    totalResult,
    totalPages,
    page: +page,
    limit: +limit,
    result,
  });
};

const getNoticesBySearchParams = async (req, res) => {
  const { page = 1, limit = 12, title, category } = req.query;
  const skip = (page - 1) * limit;

  let result = [];

  if (!title && !category) {
    result = await Notice.find({}, "", {
      skip,
      limit: Number(limit),
    }).sort({ createdAt: -1 });

    if (result.length === 0) {
      throw HttpError.NotFoundError("Notices not found");
    }
  }

  if (!title && category) {
    result = await Notice.find({ category }, "", {
      skip,
      limit: Number(limit),
    }).sort({ createdAt: -1 });

    if (result.length === 0) {
      throw HttpError.NotFoundError("Notices not found");
    }
  }

  if (title && !category) {
    const normalizedFind = title.toLowerCase().trim();
    const notices = await Notice.find({}, "", {
      skip,
      limit: Number(limit),
    }).sort({ createdAt: -1 });

    result = notices.filter((notice) =>
      notice.title.toLowerCase().includes(normalizedFind)
    );

    if (result.length === 0) {
      throw HttpError.NotFoundError("Notices not found");
    }
  }

  if (category && title) {
    const normalizedFind = title.toLowerCase().trim();
    const notices = await Notice.find({ category }, "", {
      skip,
      limit: Number(limit),
    }).sort({ createdAt: -1 });
    result = notices.filter((notice) =>
      notice.title.toLowerCase().includes(normalizedFind)
    );
  }

  const totalResult = result.length;
  const totalPages = Math.ceil(totalResult / limit);

  res.status(200).json({
    totalResult,
    totalPages,
    page: +page,
    limit: +limit,
    result,
  });
};

const addNoticeToFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { noticeId } = req.params;

  const findUser = await User.findById(userId);
  if (!findUser) {
    throw HttpError.NotFoundError("User not found");
  }

  const result = await User.findByIdAndUpdate(userId, {
    $addToSet: { favorite: noticeId },
  }).populate("favorite");

  if (!result) {
    throw HttpError.NotFoundError(`Notice with ${noticeId} not found`);
  }

  res.status(200).json({
    result,
  });
};

const getFavoriteUserNotices = async (req, res) => {
  const { _id: userId } = req.user;

  const user = await User.findById(userId).populate("favorite").sort({ createdAt: -1 });

  const result = user.favorite;

  if (result.length === 0) {
    throw HttpError.NotFoundError(`There any notices for this user`);
  }

  res.status(200).json({
    result,
  });
};

const removeNoticeFromFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { noticeId } = req.params;

  const user = await User.findById(userId);
  if (!user) {
    throw HttpError.NotFoundError("User not found");
  }

  const result = await User.findByIdAndUpdate(
    userId,
    { $pull: { favorite: noticeId } },
    { new: true }
  );

  if (!result) {
    throw HttpError.NotFoundError("Notice not found");
  }

  res.status(200).json({
    message: "Notice removed",
  });
};

const addNoticeByCategory = async (req, res) => {
  const { category } = req.params;
  const { _id: owner } = req.user;
  const { path: tempUpload, filename } = req.file;
  const uniqueId = nanoid();

  const photoName = `${uniqueId}_${filename}`;
  const photo = await cloudinaryUpload(tempUpload, photoName);

  const result = await Notice.create({ ...req.body, category, owner, photo });

  res.status(201).json({
    result,
  });
};

const getAllUserNotices = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  const notices = await Notice.find({ owner }, "", {
    skip,
    limit,
  }).populate("owner", "email").sort({ createdAt: -1 });

  if (notices.length === 0) {
    throw HttpError.NotFoundError(`There any notices for this user`);
  }

  res.status(200).json({
    notices,
  });
};

const removeUserNotice = async (req, res) => {
  const { noticeId } = req.params;

  const result = await Notice.findByIdAndDelete(noticeId);
  if (!result) {
    throw HttpError.NotFoundError("Notice not found");
  }
  res.status(200).json({
    data: {
      message: "Notice deleted",
    },
  });
};

const getNoticeId = async (req, res) => {
  const { noticeId } = req.params;

  const notice = await Notice.findById(noticeId).populate(
    "owner",
    "phone email name"
  );
  if (!notice) {
    throw HttpError.NotFoundError("Notice not found");
  }
  res.status(201).json({
    data: notice,
  });
};

module.exports = {
  getAllNotices: ctrlWrapper(getAllNotices),
  getNoticesBySearchParams: ctrlWrapper(getNoticesBySearchParams),
  getNoticeId: ctrlWrapper(getNoticeId),
  addNoticeToFavorite: ctrlWrapper(addNoticeToFavorite),
  getFavoriteUserNotices: ctrlWrapper(getFavoriteUserNotices),
  removeNoticeFromFavorite: ctrlWrapper(removeNoticeFromFavorite),
  addNoticeByCategory: ctrlWrapper(addNoticeByCategory),
  getAllUserNotices: ctrlWrapper(getAllUserNotices),
  removeUserNotice: ctrlWrapper(removeUserNotice),
};
