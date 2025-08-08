import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser"; 
import authRoutes from "./routes/auth.routes.js"; // Pastikan ekstensi .js jika pakai module

dotenv.config(); // Load variabel dari .env

const app = express();

// Middleware untuk membaca JSON dari request
app.use(express.json());

// Middleware logger HTTP (pakai morgan)
app.use(morgan("dev")); // Tampilkan log ringkas di terminal

//middleware untuk mengelola cookie
app.use(cookieParser());

// Routing utama
app.use("/api/auth", authRoutes);

// Port dari .env default ke 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
