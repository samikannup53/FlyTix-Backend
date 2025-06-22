const jwt = require("jsonwebtoken");

const verifyToken = (token) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return { valid: true, payload, error: null };
  } catch (error) {
    return { valid: false, payload: null, error };
  }
};

module.exports = verifyToken;
