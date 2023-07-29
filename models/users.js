const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "please input your user name"],
  },
  email: {
    type: String,
    unique: [true, "email must ne unique"],
    required: [true, "please input your email"],
    trim: true,
  },
  password: {
    type: String,
    minLength: [8, "too short password"],
  },
});

module.exports = mongoose.model("Users", userSchema);
