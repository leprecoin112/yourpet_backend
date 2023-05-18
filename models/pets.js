const { Schema, model } = require("mongoose");
const Joi = require("joi");
const moment = require('moment')
const stringRegexp = /^[a-zA-Zа-яА-Я\s]+$/;
const dateRegexp = /^\d{2}\.\d{2}\.\d{4}$/;

const { handleMongooseError } = require("../utils");

const petSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for pet"],
      minlength: 2,
      maxlength: 16,
      match: stringRegexp,
    },
    birthday: {
      type: Date,
      required: [true, "Set date of birth"],
      get: (v) => moment(v).format("DD.MM.YYYY"),
      set: (v) => moment(v, "DD.MM.YYYY").toDate(),
      validate: {
        validator: function (value) {
          return moment(value, "DD.MM.YYYY", true).isValid();
        },
        message: "Invalid birthdate format (must be dd.mm.yyyy)",
      },
    },

    breed: {
      type: String,
      required: [true, "Set the breed"],
      minlength: 2,
      maxlength: 16,
      match: stringRegexp,
    },
    comments: {
      type: String,
      minlength: 8,
      maxlength: 320,
      default: null,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    avatarURL: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

petSchema.post("save", handleMongooseError);

const Pet = model("pet", petSchema);

const petAddJoiSchema = Joi.object({
  name: Joi.string().min(2).max(16).pattern(stringRegexp).required().messages({
    "any.required": "Set name for pet",
    "string.min": "The name must contain at least 2 letters",
    "string.max": "The name should not exceed 16 letters",
    "string.pattern.base": "The name must only contain letters",
  }),
  birthday: Joi.string()
    .required()
    .regex(dateRegexp)
    .custom((value, helpers) => {
      const date = moment(value, "DD.MM.YYYY");
      if (!date.isValid()) {
        return helpers.error("string.dateInvalid");
      }
      return date.toDate();
    })
  .messages({
    "any.required": "Set birthday for pet",
    "string.pattern.base": "Invalid date format",
    "string.dateInvalid": "Invalid date",
  }),
  breed: Joi.string()
    .min(2)
    .max(16)
    .pattern(stringRegexp)
    .required()
    .messages({
      "any.required": "Set type of breed",
      "string.min": "The breed must have at least 2 characters",
      "string.max": "The breed cannot exceed 16 characters",
      "string.pattern.base": "The breed must only contain letters",
    }),
  comments: Joi.string().min(8).max(320).allow("").messages({
    "string.min": "Comments must have at least 8 characters",
    "string.max": "Comments cannot exceed 320 characters",
  }),
  avatar: Joi.string().optional(),
}).options({ abortEarly: false });



module.exports = {
  Pet,
  petAddJoiSchema,
};
