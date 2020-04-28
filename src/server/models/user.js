const mongoose = require("mongoose");

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  fullName:{
    type: String,
    required: true,
    maxlength: 26
  }
  ,
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    maxlength: 32
  },
  password: {
    type: String,
    required: true
  },
  about: {
    type: String,
    defaultValue: ""
  },
  confirmed: {
    type: Boolean,
    required: true,
    defaultValue: false
  },
  validationCode: {
    type: String
  },
  profilePicture:{
    type: String
  }
});

module.exports = mongoose.model("User", User);
