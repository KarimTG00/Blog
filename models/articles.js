const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: Object, required: true },
    auteur: { type: String, required: true, default: "Karim Tongue" },
    durer: { type: String, required: true },
    vues: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

const articleModel = mongoose.model("article", articleSchema);

module.exports = articleModel;
