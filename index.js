// import des packages
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
// const axios = require("axios");
// const cloudinary = require("cloudinary").v2;

const app = express();
mongoose.connect(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());

// import des routes
const locationsRoutes = require("./routes/locations");
app.use(locationsRoutes);
const restaurantsIdRoutes = require("./routes/restaurantsId");
app.use(restaurantsIdRoutes);
const reviewsRoutes = require("./routes/reviews");
app.use(reviewsRoutes);

app.get("/", (req, res) => {
  try {
    return res.status(200).json({ message: "Bienvenue sur notre serveur" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.all("*", (req, res) => {
  return res.status(404).json("Not found");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is 🧨🧨🧨🧨 on ${process.env.PORT}`);
});
