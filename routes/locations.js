const axios = require("axios");
const express = require("express");
const router = express.Router();

router.get("/locations", async (req, res) => {
  const { text, pageNumber } = req.query;

  if (!text) {
    return res.status(400).json({ error: "text parameter is required" });
  }

  try {
    //  1: on utilise  /locations/v2/auto-complete pour obtenir des suggestions
    const response = await axios.get(
      "https://the-fork-the-spoon.p.rapidapi.com/locations/v2/auto-complete",
      {
        params: { text },
        headers: {
          "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
          "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com",
        },
      }
    );

    // vérifie si des suggestions sont retournées
    if (
      response.data &&
      response.data.data &&
      response.data.data.geolocation &&
      response.data.data.geolocation.length > 0
    ) {
      //  le premier objet de géolocalisation
      const geolocation = response.data.data.geolocation[0];
      const googlePlaceId = geolocation.id.id;
      console.log("Google Place ID:", googlePlaceId);

      //  2: on utilise  /locations/v2/list pour obtenir des lieux associés à l'ID de lieu Google
      const listResponse = await axios.get(
        "https://the-fork-the-spoon.p.rapidapi.com/locations/v2/list",
        {
          params: {
            google_place_id: googlePlaceId,
            geo_ref: "false",
            geo_text: text,
            geo_type: geolocation.type,
          },
          headers: {
            "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
            "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com",
          },
        }
      );
      console.log("List Response:", listResponse.data);

      //
      if (listResponse.data && listResponse.data.id_city) {
        // ID de la ville à partir de la réponse de la liste
        const cityId = listResponse.data.id_city;
        console.log("City ID:", cityId);

        //  3: on utilise /restaurants/v2/list pour obtenir la liste des restaurants
        const restaurantsResponse = await axios.get(
          "https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/list",
          {
            params: {
              queryPlaceValueCityId: cityId,
              pageSize: "10",
              pageNumber: pageNumber || "1",
            },
            headers: {
              "X-RapidAPI-Key": process.env.XRAPIDAPIKEY,
              "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com",
            },
          }
        );

        // renvoie la liste des restaurants dans la réponse
        res.json({ restaurants: restaurantsResponse.data });
      } else {
        res
          .status(404)
          .json({ error: "No locations found for the given text" });
      }
    } else {
      res.status(404).json({ error: "No locations found for the given text" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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
