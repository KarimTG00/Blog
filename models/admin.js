const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;
