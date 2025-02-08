const config = require("../config");
const jwt = require("jsonwebtoken");
let messages = require("../config/messages.json");

const isAuthorized = (allowed = []) => {
  return async (req, res, next) => {
    try {
      const authorization = req.headers.authorization;
      if (!authorization)
        return res.status(401).json({ error: "token not found" });
      const token = req.headers.authorization.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Unauthorized" });
      const token_decode = jwt.verify(token, config.SECRET);
      req.user = token_decode;
      if (allowed.length === 0 || allowed.includes(req.user.role)) {
        next();
      } else {
        return res
          .status(403)
          .json({
            message: "Access denied. You do not have the required role.",
          });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
};

const generateToken = (usermodel) => {
  try {
    return jwt.sign(usermodel, config.SECRET);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
module.exports = {
  generateToken,
  isAuthorized,
};
