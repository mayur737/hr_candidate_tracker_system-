const jwt = require("jsonwebtoken");
const Hr = require("../models/Hr.model");

const authenticate = async (req, _, next) => {
  try {
    const { authorization } = req.headers;
    if (!(authorization && authorization.startsWith("Bearer ")))
      return next({ st: 403, ms: "Missing Authorization Credential" });

    const token = authorization.slice(7);

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const hr = await Hr.findById(id);

    req.auth = hr;
    next();
  } catch (error) {
    console.log(error);
    if (error.name === "TokenExpiredError")
      next({ st: 403, ms: error.message });
    else next({ st: 500, ms: error.message });
  }
};

module.exports = authenticate;
