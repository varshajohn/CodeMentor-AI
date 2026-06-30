const express = require("express");

const router = express.Router();

const {
  generate,
  optimize,
} = require("../controllers/codeController");

router.post("/generate", generate);

router.post("/optimize", optimize);

module.exports = router;