const mongoose = require("mongoose");
const validatar = require("validator");
const email_validator = require("email-validator");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!email_validator.validate(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  mobile_no: {
    type: Number,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  is_admin: {
    type: Number,
    required: true,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
});
module.exports = userModel = mongoose.model("user", userSchema);
