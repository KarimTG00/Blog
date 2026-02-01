const mongoose = require("mongoose");

const trakerSchema = mongoose.Schema({
  url: { type: String, required: true },
  ip: { type: String, required: true },
  pays: { type: String, required: false },
  createdAt: { type: Date, default: Date.now, index: true },
});

const trakerModel = mongoose.model("traker", trakerSchema);

module.exports = trakerModel;
