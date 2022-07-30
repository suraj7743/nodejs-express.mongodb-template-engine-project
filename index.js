const mongoose = require("mongoose");
const morgan = require("morgan");

const express = require("express");
const app = express();

app.use(morgan("dev"));

const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });

const DATABASE = process.env.DATABASE;
//requiring from route
const userRoute = require("./routes/userRoute.js");
app.use("/", userRoute);

app.listen(process.env.PORT, () => {
  console.log("listening to server and connecting to database ..");
  mongoose.connect(
    DATABASE.replace("PASSWORD", process.env.DATABASE_PASSWORD),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
});
