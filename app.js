const express = require("express");
const createDB = require("./db/createDb");
const router = require("./routes/route");
const Notfound = require("./middlewares/NotFound");
const ErrorHandler = require("./middlewares/errorHandler");

const app = express();
const port = 4000;
createDB();

// middlewares
app.use(express.json());

app.use("/", router);
app.use(Notfound);
app.use(ErrorHandler());
app.listen(port, () => {
  console.log("serveur lancé");
});
