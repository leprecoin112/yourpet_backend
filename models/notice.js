const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../utils");

const noticeSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["sell", "in-good-hands", "lost-found"],
    },
    title: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Set your pet name"], // change the standart error text
    },
    birthday: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    location: {
      type: String,
    },
    price: {
      type: String,
    },
    comments: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

noticeSchema.post("save", handleMongooseError);

const addNoticeSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": `"title" is required`,
  }),
  name: Joi.string().required().messages({
    "any.required": `"name" is required`,
  }),
  birthday: Joi.date().required().messages({
    "any.required": "Enter pet's date of birth",
  }),
  breed: Joi.string().required().messages({
    "any.required": "Enter pet's breed",
  }),
  sex: Joi.string().required().messages({
    "any.required": "Enter pet's sex",
  }),
  location: Joi.string().required().messages({
    "any.required": "Enter pet's location",
  }),
  price: Joi.string().messages({
    "any.required": "Enter pet's price and currency",
  }),
  comments: Joi.string(),
});

const schemas = {
  addNoticeSchema,
};

const Notice = model("notice", noticeSchema);

module.exports = {
  Notice,
  schemas,
};
