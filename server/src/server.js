const app = require("./app");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
dotenv.config();
connectDb();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
