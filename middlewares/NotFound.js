function NotFound(req, res, next) {
  next(new Error("Not Found 404"));
}

module.exports = NotFound;
