const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return token;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return next(new CustomError(401, "No token Found"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    next(new CustomError(401, "Can't verify token"));
  }
};

module.exports = { generateToken, verifyToken };
