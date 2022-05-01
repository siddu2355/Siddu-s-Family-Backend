const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const family = require("./routes/family");
const register = require("./routes/users");
const login = require("./routes/authe");
const catogeries = require("./routes/catogeries");
const app = express();
if (!config.get("jwtPrivateKey")) {
  console.log("Fatal ERROR: jwtPrivateKey is not set...");
  process.exit(1);
}

mongoose
  .connect(
    "mongodb+srv://siddu2355:siddu2355@cluster0.yhpqq.mongodb.net/family?retryWrites=true&w=majority"
  )
  .then(() => console.log("Connected to mongoDB..."))
  .catch((e) => console.log("could not connect to mongoDB", ex));

app.use(express.json());
app.use(cors());
app.use("/api/family", family);
app.use("/api/register", register);
app.use("/api/login", login);
app.use("/api/catogeries", catogeries);

app.get("/", (req, res) => {
  res.send("Hello world");
});

const port = process.env.PORT || 3900;
app.listen(port, () => console.log(`Listening to port${port}...`));
