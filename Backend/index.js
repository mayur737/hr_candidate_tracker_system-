require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const api = require("./api.js");
const initialize = require("./initialise.js");
const app = express();

app.use(cors());

app.use("/api", api);
app.get("/ping", (_, res) => res.status(200).json({ message: "All Good" }));

mongoose
  .connect(process.env.MONGOURI)
  .then(console.log("MongoDB Connected"))
  .then(() => initialize())
  .then(() =>
    app.listen(process.env.PORT, process.env.HOST, () =>
      console.log(`Server listening on port ${process.env.PORT}`)
    )
  )
  .catch(console.error);
