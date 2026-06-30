const Session = require("../models/Session");

const generatePDF = require("../services/pdfService");

const downloadPDF = async (req, res) => {
  try {
    const session =
      await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: "Session not found",
      });
    }

    generatePDF(session, res);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  downloadPDF,
};