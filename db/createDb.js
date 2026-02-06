const mongoose = require("mongoose");

async function createDB() {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log("database connected");
  } catch (error) {
    console.log("une erreur lors de la connexion a la base de donnée", error);
  }
}

module.exports = createDB;
