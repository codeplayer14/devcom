const express = require("express");
const router = express.Router();

router.get("/test", (req, resp) => {
  resp.json({ msg: "Profile works" });
});

module.exports = router;
