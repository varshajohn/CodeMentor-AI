const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: String,

    prompt: String,

    language: String,

    generatedCode: String,

    optimizedCode: String,

    chatHistory: [
      {
        question: String,
        answer: String,
      },
    ],

    studyNotes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Session", sessionSchema);