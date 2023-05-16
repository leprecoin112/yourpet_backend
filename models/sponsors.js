const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils");

const sponsorSchema = new Schema({
    title: String,
    url: String,
    addressURL: String,
    imageURL: String,
    address: String,
    workDays: [Schema.Types.Mixed],
    phone: String,
    email: String,
},
{
    versionKey: false,
  });

sponsorSchema.post("save", handleMongooseError);

const Sponsor = model("sponsor", sponsorSchema);

module.exports = {
    Sponsor,
};