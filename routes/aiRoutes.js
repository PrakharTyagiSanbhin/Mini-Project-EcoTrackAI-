const express = require("express");

const router = express.Router();

const aiController =
    require("../controllers/aiController");

router.post(
    "/coach",
    aiController.climateCoach
);

router.post(
    "/future",
    aiController.futureMe
);

module.exports = router;