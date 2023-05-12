const { Schema, model } = require('mongoose');
// const Joi = require("joi");

const { handleMongooseError } = require('../utils/handleMongooseError');

const petSchema = new Schema({
    category: {
      type: String,
      required: true,
      enum: ['sell', 'in good hands', 'lost-found'],
    },
    name: {
      type: String,
      required: [true, 'Set your pet name'], // change the standart error text
    },
    birthday: {
      type: Date,
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
      enum: ['male', 'female'],
      required: true,
    },
    comments: {
      type: String,
    },
    title: {
      type: String,
    },
    location: {
      type: String,
    },
    price: {
      type: String,
    },
    // owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'user',
    // }
}, { versionKey: false, timestamps: true, });


// petSchema.post('save', handleMongooseError);

const Pet = model('notice', petSchema);

module.exports = {
  Pet,
};