const jwt = require("jsonwebtoken");

const config = process.env;

const checkUserAuthorizedOrNot = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.headers["authorization"];
  let actualToken = token;

  if (token && token.startsWith('Bearer ')) {
    actualToken = token.slice(7, token.length);
  }

  if (!actualToken) {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: "A token is required for authentication"
    });
  }

  try {
    const decoded = jwt.verify(actualToken, config.TOKEN_KEY || process.env.TOKEN_KEY);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: "Invalid or expired token"
    });
  }
};

module.exports = checkUserAuthorizedOrNot;