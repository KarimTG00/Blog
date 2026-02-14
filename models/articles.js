const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    content: { type: Object, required: true },
    auteur: { type: String, required: true, default: "Karim Tongue" },
    durer: { type: String, required: true },
    vues: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

articleSchema.index({ title: "text" });
const articleModel = mongoose.model("article", articleSchema);

module.exports = articleModel;
