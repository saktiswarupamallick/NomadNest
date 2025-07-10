const mongoose = require('mongoose');

const experienceBookingSchema = new mongoose.Schema({
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {type: Date, required: true},
  numberOfPeople: {type: Number, required: true},
  totalPrice: {type: Number, required: true},
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  specialRequests: {type: String},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date, default: Date.now}
});

const ExperienceBooking = mongoose.model('ExperienceBooking', experienceBookingSchema);
module.exports = ExperienceBooking; 