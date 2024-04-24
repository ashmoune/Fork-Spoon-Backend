const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get(`/restaurants/:id`, async (req, res) => {
  const { id } = req.params;

  try {
    const restaurantResponse = await axios.get(
      `https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/get-info/`,
      {
        params: {
          restaurantId: id,
        },
        headers: {
          "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
          "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com",
        },
      }
    );

    if (restaurantResponse.data) {
      res.json({ restaurant: restaurantResponse.data });
      console.log(restaurantResponse.data);
    } else {
      res.status(404).json({ error: "Restaurant not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
