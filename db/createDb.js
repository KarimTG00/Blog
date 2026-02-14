const mongoose = require("mongoose");

async function createDB() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`, {
      autoIndex: process.env.NODE_ENV !== "production",
    });
    console.log("database connected");
  } catch (error) {
    console.log("une erreur lors de la connexion a la base de donnée", error);
  }
}

module.exports = createDB;
