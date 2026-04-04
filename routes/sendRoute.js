const express = require("express");
const router = express.Router();
const sender = require("../queue/sender");

router.post("/", async (req, res) => {
  try {
    await sender(req.body);
    res.json({ message: "✅ Emails sent safely" });
  } catch (err) {
    res.json({ message: "❌ Error: " + err.message });
  }
});

module.exports = router;
