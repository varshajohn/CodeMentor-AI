const {
  generateCode,
  optimizeCode,
  askMentor,
  generateNotes,
} = require("../services/groqService");

function cleanJSONResponse(str) {
  if (!str) return "";
  let cleaned = str.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "");
    cleaned = cleaned.replace(/\n?```$/, "");
    cleaned = cleaned.trim();
  }
  return cleaned;
}

const generate = async (req, res) => {
  try {
    const { prompt, language } = req.body;

    const code = await generateCode(prompt, language);

    res.json({
      code,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const optimize = async (req, res) => {
  try {
    const { code, language } = req.body;

    const result = await optimizeCode(code, language);
    const cleanedResult = cleanJSONResponse(result);

    res.json({
      result: cleanedResult,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const mentor = async (req, res) => {
  try {
    const {
      code,
      history,
      question,
    } = req.body;

    const answer = await askMentor(
      code,
      history,
      question
    );

    res.json({
      answer,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

const notes = async (req, res) => {
  try {
    const {
      prompt,
      language,
      code,
      optimizedCode,
      history,
    } = req.body;

    const studyNotes = await generateNotes(
      prompt,
      language,
      code,
      optimizedCode,
      history
    );

    res.json({
      studyNotes,
    });
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
};

module.exports = {
  generate,
  optimize,
  mentor,
  notes,
};