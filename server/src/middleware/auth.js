import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHNlcGF0dXN1cGVyLmNvbSIsIm5hbWUiOiJBZG1pbiBTZXBhdHVTdXBlciIsImlhdCI6MTc5MzYwMzY3MCwiZXhwIjoxNzkzNjkwMDcwfQ.OAw8OFQoaGuctskUFTQa9FrM3FQ1KXb4v5BSHWs0vKs"; // Use a default

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token is missing",
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ suscess: false, message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

export { JWT_SECRET };
