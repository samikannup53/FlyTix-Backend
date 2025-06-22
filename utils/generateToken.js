const jwt = require("jsonwebtoken");

const generateToken = (userId, role) => {
  const payload = { userId, role };
  const secretKey = process.env.JWT_SECRET_KEY;
  const options = { expiresIn: "1d", issuer: "FlyTix" };

  // JWT Secret Key Validation
  if (!secretKey) {
    throw new Error("JWT Secret Key not defined in Environment.");
  }

  // Generate Token Functio
  return jwt.sign(payload, secretKey, options);
};

module.exports = generateToken;
