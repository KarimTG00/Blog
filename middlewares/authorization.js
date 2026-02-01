const protect = async (req, res, next) => {
  try {
    let token; // intialisation du token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        token = req.headers.authorization.split(" ")[1]; // on recupere le token stock├® dans le localStorage
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.authUser = await User.findOne({
          telephone: decoded.telephone,
        }).select("-password"); // on recup├®re les information de l'utilisateur sauf sont password

        if (!req.authUser) {
          console.log("utilisateur non trouv├®");
          res.status(401).json({ msg: "utilisateur non trouv├®" });
          return;
        }
        console.log("utilisateur identifi├®");
        next();
      } catch (error) {
        const token = req.headers.authorization.split(" ")[1]; // on recup├®re les elements du token
        res.status(401).json({ msg: error.message });
      }
    }

    if (!token) {
      res.status(401).json({ msg: "not authorized , no token" });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: error.message });
  }
};

module.exports = protect;
