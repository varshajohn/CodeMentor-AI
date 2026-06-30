const Session = require("../models/Session");

const saveSession = async (req, res) => {
  try {
    const {
      userId,
      title,
      prompt,
      language,
      generatedCode,
      optimizedCode,
      chatHistory,
      studyNotes,
    } = req.body;

    const session = await Session.create({
      userId,
      title:
        title ||
        prompt.substring(0, 50) +
          (prompt.length > 50 ? "..." : ""),
      prompt,
      language,
      generatedCode,
      optimizedCode,
      chatHistory,
      studyNotes,
    });

    res.status(201).json({
      success: true,
      session,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSessions = async (req, res) => {
  try {
    const { userId } = req.query;
    // Filter sessions by userId if provided to keep history lists private
    const filter = userId ? { userId } : {};
    const sessions = await Session.find(filter)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getSession = async (req, res) => {
  try {
    const session = await Session.findById(
      req.params.id
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateSession = async (req, res) => {
  try {
    const session = await Session.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    res.json({
      success: true,
      session,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const deleteSession = async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Session deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  saveSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
};