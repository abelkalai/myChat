const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  sender: {
    type: String,
    required: true
  },
  receiver: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  time: {
    type: Timestamp,
    required: true
  }
});

module.exports = mongoose.model("Message", schema);
