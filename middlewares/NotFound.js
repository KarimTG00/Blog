function NotFound(req, res, next) {
  console.log("❌ NOT FOUND:", req.originalUrl);
  next(new Error("Not Found 404"));
}

module.exports = NotFound;
