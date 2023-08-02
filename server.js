const express = require("express");
const app = express();
const cors = require("cors");
const apiRoutes = require("./api");

app.use(express.static("public"));
app.use(cors());
app.use(express.json()); // Add this line to parse JSON data from requests

// Use the API routes and middleware
app.use("/api", apiRoutes);

const port = 3000;
app.listen(port, () => {
  console.log("Running on port: " + port);
});