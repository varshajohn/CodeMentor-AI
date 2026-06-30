const {
  generateCode,
  optimizeCode,
} = require("../services/groqService");

const generate = async (req, res) => {
  try {
    const { prompt, language } = req.body;

    const code = await generateCode(prompt, language);

    res.json({
      success: true,
      code,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const optimize = async (req, res) => {
  try {
    const { code, language } = req.body;

    const result = await optimizeCode(code, language);

    res.json({
      success: true,
      result,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  generate,
  optimize,
};