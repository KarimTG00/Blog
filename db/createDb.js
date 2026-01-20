const mongoose = require("mongoose");

async function createDB() {
  await mongoose.connect("mongodb://localhost/Blog");
  console.log("database connected");
}

module.exports = createDB;
