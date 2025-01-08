const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth_router = require("./routes/authRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

app.use("/api/auth", auth_router);

module.exports = app;
