//  REQUIRED MODULES 
require("dotenv").config(); //  Load environment variables first!
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

//  CONFIGURATION 
const app = express();
const PORT = process.env.PORT || 5000;
let products = [];

//  DATABASE CONNECTION
mongoose
  
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error(" MongoDB connection error:", err));

//  MIDDLEWARE 
app.use(express.json());
app.use(cors());

// Serve static images safely
app.use("/images", express.static(path.join(__dirname, "images")));

//  LOAD LOCAL PRODUCTS 
try {
  const dataPath = path.join(__dirname, "products.json");
  const productsJson = fs.readFileSync(dataPath, "utf8");
  products = JSON.parse(productsJson);
  console.log(` Loaded ${products.length} products successfully.`);
} catch (error) {
  console.error("Failed to load products.json. Check path or syntax.");
  console.error(error.message);
}

//  ROUTES 
app.get("/", (req, res) => {
  res.send(" Pillows & Candles Backend is Running...");
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

// Import and Register user routes here
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes); 

//  SERVER START 
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
