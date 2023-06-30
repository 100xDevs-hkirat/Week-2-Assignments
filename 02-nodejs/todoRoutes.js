const express = require("express");
const router = express.Router();

todo = [];

router.get("/", (req, res) => {
  res.send([]);
});
module.exports = router;
