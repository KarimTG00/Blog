function ErrorHandler() {
  return (err, req, res) => {
    const status = err.statusCode || 404;
    const message = err.message || "not found 404";
    res.status(status).json({ message: message });
  };
}

module.exports = ErrorHandler;
