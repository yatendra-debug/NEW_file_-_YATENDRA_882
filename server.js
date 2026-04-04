require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const sendRoute = require("./routes/sendRoute");

const app = express();

app.use(cors());
app.use(express.json());

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API
app.use("/send", sendRoute);

app.listen(process.env.PORT, () => {
  console.log("🚀 Server running on port", process.env.PORT);
});
