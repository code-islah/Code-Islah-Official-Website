const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth"); 

dotenv.config();

const app = express();
app.use(express.json({limit: "10mb"}));
app.use(express.urlencoded({ extended: true,  limit: "10mb"}));

// Allow both your live site and local development
const allowedOrigins = [
  "https://codeislah.netlify.app",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5501",
  "http://localhost:5000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err.message));

app.use("/api/auth", authRoutes);

// Simple test route
app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token is not valid.' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});

app.use("/api/admin", require("./routes/admin"));
