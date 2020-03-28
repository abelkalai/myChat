const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  senderID: {
    type: String,
    required: true
  },
  receiverID: {
    type: String,
    required: true
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

module.exports = mongoose.model("Message", schema);
