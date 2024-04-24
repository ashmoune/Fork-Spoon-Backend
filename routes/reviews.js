const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/reviews/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const reviewsResponse = await axios.get(
      `https://the-fork-the-spoon.p.rapidapi.com/reviews/v2/list`,
      {
        params: {
          restaurantId: id,
          //   withReview: "WITH_REVIEW",
        },
        headers: {
          "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
          "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com",
        },
      }
    );
    if (reviewsResponse.data) {
      res.json({ reviews: reviewsResponse.data });
      console.log(reviewsResponse.data);
    } else {
      res.status(404).json({ error: "Reviews not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
