const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const auth_router = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", auth_router);

app.use(errorHandler);
module.exports = app;
