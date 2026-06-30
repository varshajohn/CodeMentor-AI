const express = require("express");

const router = express.Router();

const {
  saveSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");

router.post("/save", saveSession);

router.get("/all", getSessions);

router.get("/:id", getSession);

router.put("/:id", updateSession);

router.delete("/:id", deleteSession);

module.exports = router;