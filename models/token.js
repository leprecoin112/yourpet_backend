const { Schema, model } = require("mongoose");

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  refreshToken: { type: String, require: true },
  __v: { type: Number, select: false },
});

const Token = model("Token", tokenSchema);

module.exports = Token;
