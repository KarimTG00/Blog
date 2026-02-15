const express = require("express");
const createDB = require("./db/createDb");
const router = require("./routes/route");
const Notfound = require("./middlewares/NotFound");
const ErrorHandler = require("./middlewares/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;
createDB();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://blog-frontent-ten.vercel.app"], // origine de mon frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/favicon.ico", (req, res) => res.status(204));

// routes

app.use("/", router);
app.use(Notfound);
app.use(ErrorHandler());
app.listen(port, () => {
  console.log("serveur lancé sur le port : ", port);
});
