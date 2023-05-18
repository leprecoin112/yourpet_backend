const { isValidObjectId } = require("mongoose");
const {HttpError} = require('../helpers')

const isValidId = (req, _, next) => {
  const { id } = req.params;
  const isCorrectId = isValidObjectId(id);
  if (!isCorrectId) {
    const error = HttpError.BadRequest(`${id} is not correct id format`);
    return next(error);
  }
  next();
};

module.exports = isValidId;