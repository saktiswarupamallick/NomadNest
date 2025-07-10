const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  message: String,
  response: String,
  createdAt: {type: Date, default: Date.now},
});

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel; 