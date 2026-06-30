const express = require("express");

const router = express.Router();

const {
  downloadPDF,
} = require("../controllers/pdfController");

router.get("/:id", downloadPDF);

module.exports = router;