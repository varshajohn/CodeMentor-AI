const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.3-70b-versatile";

/* ========================================================= */
/* COMMON AI CALL */
/* ========================================================= */

async function callAI(messages, temperature = 0.2) {
  try {
    const completion = await groq.chat.completions.create({
      model: MODEL,
      temperature,
      messages,
    });

    return completion.choices[0].message.content.trim();
  } catch (err) {
    console.error("Groq Error:", err.message);
    throw new Error("Failed to communicate with AI.");
  }
}

/* ========================================================= */
/* GENERATE CODE */
/* ========================================================= */

async function generateCode(problem, language) {
  return await callAI(
    [
      {
        role: "system",
        content: `
You are CodeMentor AI.

You ONLY solve programming and coding questions.

If the user asks anything unrelated to programming, reply EXACTLY:

This platform is designed only for solving programming problems. Please enter a coding problem.

Return markdown using EXACTLY this format.

# Problem

Summarize the problem in one sentence.

---

# Approach

Maximum five bullet points.

Explain only the algorithm.

Do not explain every line.

---

# Generated Code

Return a markdown code block.

Generate clean interview-quality ${language} code.

Use meaningful variable names.

Avoid unnecessary comments.

---

# Time Complexity

Mention the complexity with one-line explanation.

---

# Space Complexity

Mention the complexity with one-line explanation.

Rules

• No introductions.
• No conclusions.
• No repeated sentences.
• Be concise.
`,
      },
      {
        role: "user",
        content: problem,
      },
    ],
    0.2
  );
}
/* ========================================================= */
/* OPTIMIZE CODE */
/* ========================================================= */

async function optimizeCode(code, language) {
  return await callAI(
    [
      {
        role: "system",
        content: `
You are a Senior Software Engineer and Competitive Programmer.

Your ONLY task is to improve the given solution.

Priority

1. Reduce Time Complexity.
2. Reduce Space Complexity.
3. Improve readability.
4. Remove redundant logic.

If the current algorithm is already asymptotically optimal,
DO NOT rewrite the same code.

Instead return ONLY this JSON:

{
  "optimized": false,
  "reason": "The current algorithm is already optimal.",
  "optimizedCode": "<original code>",
  "timeComplexity": "",
  "spaceComplexity": "",
  "changes": []
}

Otherwise return ONLY this JSON:

{
  "optimized": true,
  "reason": "Explain why the optimization is better.",
  "optimizedCode": "<optimized code only>",
  "timeComplexity": "",
  "spaceComplexity": "",
  "changes": [
    "Improvement 1",
    "Improvement 2"
  ]
}

Rules

- Return JSON ONLY.
- Never use markdown.
- Never wrap JSON inside \`\`\`.
- Never rename variables just to pretend it is optimized.
- Optimize only when a genuine improvement exists.
`,
      },
      {
        role: "user",
        content: `
Programming Language

${language}

Current Code

${code}
`,
      },
    ],
    0.1
  );
}

/* ========================================================= */
/* AI MENTOR */
/* ========================================================= */

async function askMentor(code, history, question) {
  return await callAI(
    [
      {
        role: "system",
        content: `
You are CodeMentor AI.

You answer ONLY questions related to the CURRENT generated solution.

Current Solution:

${code}

Previous Conversation:

${JSON.stringify(history)}

Rules

- Maximum 180 words.
- Answer ONLY what the user asked.
- Never repeat yourself.
- Never give long essays.
- Use simple English.

Use this format when appropriate:

### Answer

(Short explanation)

### Example

(Only if useful)

### Important

(Only if useful)

If the question is unrelated to the current solution, reply EXACTLY:

I'm designed to answer only questions related to the current generated solution.

When explaining:

Variables:
- Purpose
- Where declared
- Where used

Loops:
- Purpose
- Number of iterations
- Complexity

Functions:
- Input
- Output
- Purpose

Data Structures:
- Why used
- What they store
- Benefits

Do not add unnecessary sections.
`,
      },
      {
        role: "user",
        content: question,
      },
    ],
    0.3
  );
}
/* ========================================================= */
/* GENERATE REVISION SHEET */
/* ========================================================= */

async function generateNotes(
  prompt,
  language,
  generatedCode,
  optimizedCode,
  history
) {
  return await callAI(
    [
      {
        role: "system",
        content: `
You are CodeMentor AI.

Create a concise Revision Sheet.

This is NOT a textbook.

It should be suitable for interview revision.

Use EXACTLY these headings.

# Problem

# Programming Language

# Approach

Explain the solution in 4-6 bullet points.

# Generated Solution

Give a short summary only.

# Optimized Solution

Explain only the optimization.

# Complexity

Generated

Time

Space

Optimized

Time

Space

# Mentor Questions

Summarize ONLY the questions actually asked by the user.

For each question write:

Question

Answer

Maximum 3-5 questions.

# Key Concepts

Bullet points only.

# Interview Tips

Maximum five bullets.

Rules

• Maximum 500 words.
• No repeated information.
• No long paragraphs.
• Be concise.
• Return markdown only.
`,
      },
      {
        role: "user",
        content: `
Problem

${prompt}

Programming Language

${language}

Generated Code

${generatedCode}

Optimized Code

${optimizedCode}

Mentor Conversation

${JSON.stringify(history)}
`,
      },
    ],
    0.2
  );
}

/* ========================================================= */
/* EXPORTS */
/* ========================================================= */

module.exports = {
  generateCode,
  optimizeCode,
  askMentor,
  generateNotes,
};