const express = require("express");
const router = require("./src/routes/routes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(`Hallo`);
});

app.use("/api/v1/", router);

app.use("/uploads", express.static("uploads"));

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
