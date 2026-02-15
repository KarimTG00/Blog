const express = require("express");
const createDB = require("./db/createDb");
const router = require("./routes/route");
const Notfound = require("./middlewares/NotFound");
const ErrorHandler = require("./middlewares/errorHandler");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 4000;
createDB();

// middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "https://blog-frontent-ten.vercel.app"], // origine de mon frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.get("/favicon.ico", (req, res) => res.status(204));

// routes
console.log(port);

app.use("/", router);
app.use(Notfound);
app.use(ErrorHandler());
app.listen(port, () => {
  console.log("serveur lancé sur le port : ", port);
});
