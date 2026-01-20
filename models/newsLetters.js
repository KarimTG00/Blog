const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Usermodel = mongoose.model("User", userSchema);

module.exports = Usermodel;
