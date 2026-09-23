const express = require("express");
const axios = require("axios");
const app = express();
require("dotenv").config();

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS; // Call from .env file
const route = "https://api.hubspot.com/crm/v3/objects/2-282044427";
const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    "Content-Type": "application/json",
};

// ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.
app.get("/", async (req, res) => {
    const resp = await axios.get(route, {
        headers,
        params: {
            properties: "name,age,sickly", // Use 'params' to pull custom properties (usually not passed)
        },
    });
    const data = resp.data.results;
    res.render("homepage", { title: "Home", data });
});

// ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
app.get("/update-cobj", async (req, res) => {
    title = "Update Custom Object Form | Integrating With HubSpot I Practicum.";
    res.render("updates", { title });
});

// ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.
app.post("/update-cobj", async (req, res) => {
    const body_from_update_page = { properties: req.body };

    // POST Route
    await axios.post(route, body_from_update_page, { headers });

    // Pass back to script in /update something to say we've finished
    res.json({ status: "ok" });
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
