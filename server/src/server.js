const dotenv = require("dotenv");
dotenv.config();
const app = require("./app");
const connectDb = require("./config/db");
const cloudinary = require("./config/cloudnary");

connectDb();
cloudinary.config();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
