const express = require("express");
const router = express.Router();

router.get("/test", (req, resp) => {
  resp.json({ msg: "User works" });
});

module.exports = router;
