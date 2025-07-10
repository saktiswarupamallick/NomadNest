const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  type: {
    type: String,
    enum: ['tour', 'activity', 'food', 'transportation', 'cultural'],
    required: true
  },
  address: {type: String, required: true},
  
  price: {type: Number, required: true},
  duration: {type: Number, required: true}, // in minutes
  maxGroupSize: {type: Number, required: true},
  photos: [{type: String}],
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {type: Number, default: 0},
  reviews: [{
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    rating: {type: Number, required: true},
    comment: {type: String},
    date: {type: Date, default: Date.now}
  }],
  availability: [{
    date: {type: Date, required: true},
    slots: {type: Number, required: true}
  }],
  tags: [{type: String}],
  includedItems: [{type: String}],
  requirements: [{type: String}],
  cancellationPolicy: {type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

const Experience = mongoose.model('Experience', experienceSchema);
module.exports = Experience; 