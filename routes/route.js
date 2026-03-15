const express = require("express");
const mongoose = require("mongoose");
const user = require("../models/newsLetters");
const admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const articles = require("../models/articles");
const articleModel = require("../models/articles");
const traker = require("../models/traker");
const bcrypt = require("bcrypt");
const protect = require("../middlewares/authorization");
const router = express.Router();

// connexion des utilisateur a la newsLetter
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

router.get("/allUser", protect, async (req, res) => {
  try {
    const users = await user.find().sort({ createdAt: -1 });

    const result = [];
    users.forEach((el) => {
      result.push({ email: el.email, createdAt: el.createdAt });
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log("an error ", error);
  }
});
// verification des informations de l'administrateur

router.post("/admin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admins = await admin.findOne({ email: email });
    if (admins) {
      const isMatch = await bcrypt.compare(password, admins.password);
      if (!isMatch) {
        return res.status(500).json({ msg: "mot de passe incorrect" });
      }
      const accessToken = jwt.sign({ email: email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res
        .status(200)
        .json({ msg: "admin authentifié", accessToken: accessToken });
    } else {
      res.status(500).json({ msg: "Une erreur, veuillez réessayer" });
    }
  } catch (error) {
    console.log("une erreur lors de la verification", error);
    res.status(501).json({ msg: "une erreur lors de la verification" });
  }
});
// ajout d'un nouvel article
router.post("/new", protect, async (req, res) => {
  const { json, values } = req.body; // données du formulaire d'ajout d'un article
  console.log(req.body);
  // sauvegarde du formulaire
  try {
    const newArticle = new articles({
      title: values.title,
      content: json.content,
      auteur: values.auteur,
      durer: values.durer,
    });
    await newArticle.save();
    console.log("article saved in database");
    res.status(200).json({ msg: "parfait" });
  } catch (error) {
    console.log("une erreur lors de la sauvegarde de l'article");
    res.status(500).json({ error: error.message });
  }
});
// recuperation de tous les articles
router.get("/articles", async (req, res) => {
  const { page } = parseInt(req.query.page) || 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  try {
    const article = await articles
      .find()
      .skip(0)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalArticles = await articles.countDocuments();
    const nextPage = skip + article.length < totalArticles ? page + 1 : null;

    res.status(200).json({
      data: article,
      nextPage: nextPage,
    });
  } catch (error) {
    console.log("une erreur lors de la recuperation des articles", error);
    res.status(500).json({ error: error.message });
  }
});
router.get("/Adminarticles", protect, async (req, res) => {
  try {
    const article = await articles.find().sort({ createdAt: -1 });
    res.status(200).json(article);
  } catch (error) {
    console.log("une erreur lors de la recuperation des articles");
    res.status(500).json({ error: error.message });
  }
});
router.get("/AdminAllarticles", protect, async (req, res) => {
  try {
    const article = await articles.find().sort({ createdAt: -1 });
    res.status(200).json(article);
  } catch (error) {
    console.log("une erreur lors de la recuperation des articles");
    res.status(500).json({ error: error.message });
  }
});

// recuperation du nombre d'articles
router.get("/getArticles", protect, async (req, res) => {
  try {
    const article = await articles.find();
    res.status(200).json({ total: article.length });
  } catch (error) {
    console.log("une erreur lors de la recuperation des articles");
    res.status(500).json({ error: error.message });
  }
});

router.get("/otherArticles", async (req, res) => {
  try {
    const otherArticles = await articles
      .find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({ otherArticle: otherArticles });
  } catch (error) {
    console.log(
      "une erreur lors de la recuperation des articles",
      error.message,
    );
    res.status(500).json({ error: error.message });
  }
});

// recuperation d'un article via son id
router.get("/article/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const article = await articles.findOne({ _id: id });
    if (!article) {
      console.log("nous somme ici");
      res.status(500).json({ msg: "cette article n'existe pas" });
    }

    res.status(200).json(article);
  } catch (error) {
    console.log(error);
    res.status(501).json({ error: error.message });
  }
});

// tracking des visites du site
router.post("/track", protect, async (req, res) => {
  const ip = req.ip === "::1" ? "8.8.8.8" : req.ip;

  try {
    const newLog = await new traker({
      url: req.body.url,
      ip: ip,
    });
    await newLog.save();
    console.log(newLog);
    res.status(200).json({ msg: "parfait" });
  } catch (error) {
    console.log("an error with save log", error.message);
    res.status(500).json({ msg: error.message });
  }
});

// recuperation de tous les logs de visite
router.get("/getAllTrack", protect, async (req, res) => {
  // recuperation de tous les logs de visite
  try {
    const data = await traker.find();
    if (!data) return null;
    res.status(200).json(data);
  } catch (error) {
    console.log("une erreur lors de la récuperation du pays");
    res.status(500).json({ error: error.message });
  }
});

router.get("/dayViews", protect, async (req, res) => {
  const now = new Date();

  // on definit le debut et la fin de la journée actuelle en UTC
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );

  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );

  // requete pour obtenir les visites du jour
  try {
    const tab = await traker.find({ createdAt: { $gte: start, $lte: end } });

    const tabs = [];
    // filtrage des ip unique
    for (el of tab) {
      const exist = tabs.some((els) => els.ip === el.ip);
      if (!exist) {
        tabs.push(el);
      }
    }
    res.status(200).json(tabs);
  } catch (error) {
    console.log("une erreur ", error);
    res.status(500).json({ error: error.message });
  }
});

// mise a jour d'un article via son id

router.put("/updateArticle/:id", protect, async (req, res) => {
  const { id } = req.params;
  const { json, values } = req.body;

  try {
    const updatedArticle = await articles.findByIdAndUpdate(
      id,
      {
        title: values.title,
        content: json.content,
        auteur: values.auteur,
        durer: values.durer,
      },
      { new: true },
    );
    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json(updatedArticle);
  } catch (error) {
    console.log("une erreur lors de la mise à jour de l'article");
    res.status(500).json({ error: error.message });
  }
});

// suppression d'un article via son id
router.delete("/deleteArticle/:id", protect, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedArticle = await articles.findByIdAndDelete(id);
    if (!deletedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.status(200).json({ msg: "Article deleted successfully" });
  } catch (error) {
    console.log("une erreur lors de la suppression de l'article");
    res.status(500).json({ error: error.message });
  }
});

// endpoint de recherche d'articles par mots clés
router.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const articlesFound = await articles
      .find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } });

    console.log(articlesFound);
    let result = [];
    // filtrage des articles qui ont un score de pertinence supérieur à 1
    for (el of articlesFound) {
      result.push({
        title: el.title,
        id: el._id,
      });
    }
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log("une erreur lors de la recherche d'articles");
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
