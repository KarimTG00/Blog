const express = require("express");
const mongoose = require("mongoose");
const user = require("../models/newsLetters");

const router = express.Router();

router.post("/user", async (req, res) => {
  const { email } = req.body;
  try {
    const newUser = new user({ email });
    await newUser.save();
    res.status(200).json({ msg: "user saved" });
  } catch (error) {
    console.log("Une erreur lors de l'ajout de l'utilisateur");
    res.status(500).json({ erreur: error.message });
  }
});

module.exports = router;
