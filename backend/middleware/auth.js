const jwt = require('jsonwebtoken')
const JWT_SECRET = require('../secrets/jwt')

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      console.log('authorization denied for ->', req.originalUrl);
      console.log('for token ->', token);
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bee-roll ")) {
      token = token.slice(9, token.length).trimLeft();
    }

    const verified = jwt.verify(token, JWT_SECRET);

    req.user = verified;
    next();
  } catch (err) {
    console.log("REQUEST TO:", req.originalUrl, req.header("Authorization"));
    console.error("Error in auth: ", err)
    res.status(500).json({ error: err.message });
  }
};

module.exports = verifyToken;