const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  place: {type:mongoose.Schema.Types.ObjectId, ref:'Place'},
  user: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
  ambience: {type: Number, required: true, min: 1, max: 5},
  service: {type: Number, required: true, min: 1, max: 5},
  food: {type: Number, required: true, min: 1, max: 5},
  overall: {type: Number, required: true, min: 1, max: 5},
  createdAt: {type: Date, default: Date.now}
});

const Rating = mongoose.model('Rating', ratingSchema);
module.exports = Rating; 