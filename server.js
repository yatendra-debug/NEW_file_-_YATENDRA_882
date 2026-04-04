require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const sendRoute = require("./routes/sendRoute");

const app = express();

app.use(cors());
app.use(express.json());

// static frontend
app.use(express.static(path.join(__dirname, "public")));

// root fix
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "launcher.html"));
});

// api
app.use("/send", sendRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
