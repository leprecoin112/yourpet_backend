const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const { Notice } = require("../models/notice");
const { User } = require("../models/user");

const HttpError = require('../helpers/HttpError');

const ctrlWrapper = require('../utils/ctrlWrapper');

const photosDir = path.join(__dirname, "../", "public", "photos");

const getNoticeByTitle = async (req, res) => {
    const { page = 1, limit = 12, title } = req.query;
    const skip = (page - 1) * limit;
    const normalizedFind = title.toLowerCase().trim();
    
    const allNotices = await Notice.find({},
      "-createdAt -updatedAt",
      { skip, limit: Number(limit) });
    
    const result = allNotices.filter(notice => notice.title.toLowerCase().includes(normalizedFind));

    if(result.length === 0) {
      throw HttpError.NotFoundError("Notices not found");
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

const getNoticesByCategory = async (req, res) => {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    
    const result = await Notice.find({category},
        "-createdAt -updatedAt",
        { skip, limit: Number(limit) }
    ).sort({ createdAt: -1 });

    if (result.length === 0) {
        throw HttpError.NotFoundError(`There any notices in category ${category}`);
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

const getNoticeById = async (req, res) => {
  const {noticeId} = req.params;
  
const notice = await Notice.findById(noticeId);
  if(!notice) {
    throw HttpError.NotFoundError("Notice not found");
  }
  res.status(201).json({
     data: notice,
    })
};

const addNoticeToFavorite = async (req, res) => {
        const { _id: userId } = req.user;
        const { noticeId } = req.params;
      
        const findUser = await User.findById(userId);
        if (!findUser) {
            throw HttpError.NotFoundError("User not found");
        };

        const result = await User.findByIdAndUpdate
        (userId,  { $addToSet: { favorite: noticeId } }).populate('favorite');
        
        if (!result) {
            throw HttpError.NotFoundError(`Notice with ${noticeId} not found`);
        }

        res.status(200).json({
          result,
        }); 
};

const getFavoriteUserNotices = async (req, res) => {
  const { _id: userId } = req.user;

  const user = await User.findById(userId).populate('favorite');

  const result = user.favorite;

  res.status(200).json({
    result,
  });
};

const removeNoticeFromFavorite = async (req, res) => {
  const { _id: userId } = req.user;
  const { noticeId } = req.params;

  const user = await User.findById(userId);
    if (!user) {
      throw HttpError.NotFoundError('User not found');
    }

  const result = await User.findByIdAndUpdate(
            userId,
            { $pull: { favorite: noticeId } },
            { new: true }
        );

        if (!result) {
          throw HttpError.NotFoundError('Notice not found');
        }

        res.status(200).json({
            message: 'Notice removed',
        });
}

const addNoticeByCategory = async (req, res) => {
  const { category } = req.params;
  const { _id: owner } = req.user;
  const { path: tempUpload, filename } = req.file;
  const uniqueId = nanoid();

  const photoName = `${uniqueId}_${filename}`;
  const resultUpload = path.join(photosDir, photoName);
  await fs.rename(tempUpload, resultUpload);
  const photo = path.join("photos", photoName);

  const result = await Notice.create({...req.body, category, owner, photo});
  
  res.status(201).json({
    result,
  });  
};

const getAllUserNotices = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;
    const notices = await Notice.find({ owner },
      "-createdAt -updatedAt",
      { skip, limit })
      .populate("owner", "email");

    res.status(200).json({
        notices,
      },
    );
  };

const removeUserNotice = async (req, res) => {
    
    const { noticeId } = req.params;
    
    const result = await Notice.findByIdAndDelete(noticeId);
    if (!result) {
      throw HttpError.NotFoundError('Notice not found');
    }
    res.status(200).json({
      data: {
        message: "Notice deleted",
      },
    });
  };

  module.exports = {
    getNoticeByTitle: ctrlWrapper(getNoticeByTitle),
    getNoticesByCategory: ctrlWrapper(getNoticesByCategory),
    getNoticeById: ctrlWrapper(getNoticeById),
    addNoticeToFavorite: ctrlWrapper(addNoticeToFavorite),
    getFavoriteUserNotices: ctrlWrapper(getFavoriteUserNotices),
    removeNoticeFromFavorite: ctrlWrapper(removeNoticeFromFavorite),
    addNoticeByCategory: ctrlWrapper(addNoticeByCategory),
    getAllUserNotices: ctrlWrapper(getAllUserNotices),
    removeUserNotice: ctrlWrapper(removeUserNotice),
  };