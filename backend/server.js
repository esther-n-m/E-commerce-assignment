
// --- REQUIRED MODULES ---
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path"); // Required for reliable, absolute paths

// --- CONFIGURATION ---
const app = express();
const PORT = 5000;
let products = []; // Array to hold our product data

// SAFE DATA LOADING (V2 + V1 Safety)
// We load the data ONCE when the server starts, but use a try/catch for safety.
try {
    const dataPath = path.join(__dirname, "products.json"); // Safer path
    const productsJson = fs.readFileSync(dataPath, "utf8");
    products = JSON.parse(productsJson);
    console.log(` Loaded ${products.length} products successfully.`);
} catch (error) {
    // If the file is missing or corrupt, we log the error and exit gracefully.
    console.error(" ERROR: Failed to load products.json. Check file path and JSON syntax.");
    console.error(error.message);
    // You might want to exit the process here if products are critical: process.exit(1);
}

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// Serve static images from the 'images' folder using a reliable absolute path
// Images will be accessible at http://localhost:5000/images/image_name.jpg
app.use('/images', express.static(path.join(__dirname, 'images')));


// --- ROUTES ---

// Product API Endpoint - just returns the data loaded at startup
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Root route
app.get("/", (req, res) => {
  res.send(" Pillows & Candles Backend is Running...");
});

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

