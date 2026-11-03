import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/categories.js";
import productRoutes from "./routes/products.js";
import storeRoutes from "./routes/store.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Banyak yang mengirim body JSON lewat Postman dengan raw = Text,
// sehingga Content-Type-nya text/plain dan express.json() mengabaikannya.
// Parser ini menerima teks, lalu kita coba ubah ke JSON.
app.use(express.text({ type: ["text/plain", "text/*"] }));

app.use((req, res, next) => {
  if (typeof req.body === "string") {
    const text = req.body.trim();
    if (text.startsWith("{") || text.startsWith("[")) {
      try {
        req.body = JSON.parse(text);
      } catch {
        // biarkan sebagai string kalau bukan JSON valid
      }
    }

    if (typeof req.body === "string" && text === "") {
      req.body = {};
    }
  }

  // Pastikan req.body selalu objek agar route tidak crash
  if (req.body === undefined || req.body === null) {
    req.body = {};
  }

  next();
});

const uploadPath = path.join(__dirname, `uploads`);
app.use("/uploads", express.static(uploadPath));

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/store", storeRoutes); // alias supaya /api/store (tanpa s) juga jalan

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Sukabumi Drive API",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Sukabumi Drive API",
    endpoints: {
      auth: "/api/auth",
      categories: "/api/categories",
      products: "/api/products",
      stores: "/api/stores",
      health: "/api/health",
    },
  });
});

app.listen(port, () => {
  console.log(
    `Server Sukabumi Drive is running on http://localhost:${port}`,
  );
});
