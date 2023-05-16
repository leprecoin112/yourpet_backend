const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../utils");

const newsSchema = new Schema({
    
    title: String,
    text: String,
    imageURL: String,
    date: String,
    id: String,
    url: String,
    
},
{
    versionKey: false,
  });

newsSchema.post("save", handleMongooseError);

const News = model("news", newsSchema);

module.exports = {
    News,
};