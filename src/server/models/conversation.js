const mongoose = require("mongoose");

const Conversation = new mongoose.Schema({
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  lastSender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lastMessage: {
    type: String
  },
  lastMessageTime: {
    type: Date
  },
  unread:{
    type: Boolean
  }
});

module.exports = mongoose.model("Conversation", Conversation);
