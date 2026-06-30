const express = require("express");

const router = express.Router();

const {
  generate,
  optimize,
  mentor,
  notes,
} = require("../controllers/aiController");

router.post("/generate", generate);

router.post("/optimize", optimize);

router.post("/mentor", mentor);

router.post("/notes", notes);

module.exports = router;