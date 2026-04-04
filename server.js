require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const sendRoute = require("./routes/sendRoute");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ IMPORTANT: public folder serve
app.use(express.static(path.join(__dirname, "public")));

// ✅ ROOT FIX (MOST IMPORTANT)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "launcher.html"));
});

// API
app.use("/send", sendRoute);

// ✅ PORT FIX
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
