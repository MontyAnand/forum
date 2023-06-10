const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  url: {
    type: String,
  },
  author: {
    type: String,
  },
  message: {
    type: String,
  },
  time: {
    type: String,
  },
  room: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;


