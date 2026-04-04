const express = require("express");
const router = express.Router();
const sender = require("../queue/sender");

router.post("/", async (req, res) => {
  try {
    const count = await sender(req.body);
    res.json({ success: true, count });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

module.exports = router;
