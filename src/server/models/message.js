const mongoose = require("mongoose");

const Message = new mongoose.Schema({
  senderID: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
    required: true
  },
  receiverID: {
    type: mongoose.Schema.Types.ObjectId, ref: "User",
    required: true
  },
  conversationID:{
    type: String,
  },
  content: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("Message", Message);
