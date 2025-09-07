const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Correctly get the authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // remove 'Bearer '

  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Token is not valid" });

    req.user = decoded; // attach decoded info to request
    next(); // allow access to the route
  });
};

module.exports = authMiddleware;
