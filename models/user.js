const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../utils");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    email: {
        type: String,
        match: emailRegexp,
        unique: true,
        required: [true, "Email is required"],
    },
    password: {
        type: String,
        minlength: 6,
        required: [true, "Set password for user"],
    },
    avatarURL: { 
        type: String, 
        require: true 
    },
    name: String,
    birthday: String,
    phone: String,
    city: String,
    token: {
        type: String,
        default: ""
    },
    verify: {
        type: Boolean,
        default: false,
      },
      verificationToken: {
        type: String,
        required: [true, "Verify token is required"],
      },
}, { versionKey: false, timestamps: true });

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
   
});

const schemas = {
    registerSchema,
    loginSchema,
    emailSchema,
};

const User = model("user", userSchema);

module.exports = {
    User,
    schemas,
}