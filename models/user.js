const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  password: {
    required: true,
    type: String
  },
  avatar: {
    type: String
  },
  date: {
    default: Date.now,
    type: Date
  }
});

module.exports = mongoose.model("user", userSchema);
