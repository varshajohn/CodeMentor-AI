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
/* GENERATE BEGINNER FRIENDLY CODE */
/* ========================================================= */

async function generateCode(problem, language) {
  return await callAI(
    [
      {
        role: "system",
        content: `
You are CodeMentor AI.

You ONLY solve programming problems.

If the user's question is NOT related to programming, reply EXACTLY:

This platform is designed only for solving programming problems. Please enter a coding problem.

Your goal is NOT to generate the shortest or smartest code.

Instead, generate a BEGINNER FRIENDLY solution.

The user should be able to understand the code even if they started programming recently.

Return markdown using EXACTLY this format.

# Problem

Summarize the problem in one sentence.

---

# Approach

Explain the algorithm using 4-6 simple bullet points.

Do NOT explain every line.

Avoid technical jargon whenever possible.

---

# Generated Code

Return ONLY one markdown code block.

The code MUST follow these rules:

• Use beginner-friendly variable names.
• Prefer loops over clever shortcuts.
• Avoid one-line tricks.
• Avoid advanced language features.
• Avoid recursion unless absolutely necessary.
• Add short comments only where helpful.
• Write the code exactly like a teacher would explain it in class.
• Prioritize readability over performance.

The goal is educational learning, not competitive programming.

---

# Time Complexity

Mention only one line.

---

# Space Complexity

Mention only one line.

Rules

• No introduction.
• No conclusion.
• No repeated information.
• Return markdown only.
`,
      },
      {
        role: "user",
        content: `
Programming Language

${language}

Problem

${problem}
`,
      },
    ],
    0.35
  );
}

/* ========================================================= */
/* GENERATE PROFESSIONAL OPTIMIZED CODE */
/* ========================================================= */

async function optimizeCode(code, language) {
  return await callAI(
    [
      {
        role: "system",
        content: `
You are a Senior Software Engineer.

Convert the beginner-friendly solution into a professional solution.

Return MARKDOWN ONLY.

Use EXACTLY this format.

# 🚀 Professional Solution

## Why is it Better?

Explain why this version is better.

---

## Professional Code

Return ONLY ONE markdown code block.

Use language-specific best practices.

Use built-in functions whenever appropriate.

---

## Time Complexity

Mention one line.

---

## Space Complexity

Mention one line.

---

## Improvements

Write 3-6 bullet points explaining the improvements.

Rules

- Never return JSON.
- Never wrap the whole response in triple backticks.
- Return valid markdown only.
`,
      },
      {
        role: "user",
        content: `
Programming Language

${language}

Beginner Code

${code}
`,
      },
    ],
    0.2
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

You are an AI programming tutor.

Your ONLY responsibility is to answer questions related to the CURRENT solution shown below.

Current Solution

${code}

Previous Conversation

${JSON.stringify(history)}

Rules

- Answer ONLY programming questions related to this solution.
- If the question is unrelated, reply EXACTLY:

I'm designed to answer only questions related to the current generated solution.

- Use simple English.
- Maximum 200 words.
- Do not repeat previous answers.
- Do not explain unnecessary concepts.

When appropriate use the following sections.

### Answer

Explain the concept simply.

### Dry Run

Use only if the user asks for execution.

### Example

Use a small example only if necessary.

### Tip

Mention one interview or coding tip if useful.

If the user asks about:

Variables
- Explain purpose
- Explain value

Loops
- Explain number of iterations
- Explain stopping condition

Functions
- Purpose
- Input
- Output

Arrays
- Contents
- Why used

Data Structures
- Why chosen
- Advantages

Algorithms
- Step-by-step explanation

Never answer non-programming questions.
`,
      },
      {
        role: "user",
        content: question,
      },
    ],
    0.4
  );
}

/* ========================================================= */
/* GENERATE REVISION NOTES */
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

Create interview revision notes.

Return markdown ONLY.

Use EXACTLY these headings.

# Problem

Summarize the problem.

---

# Programming Language

Mention the language.

---

# Beginner Solution

Explain in 4-6 bullet points.

Mention why this solution is beginner friendly.

---

# Professional Solution

Explain what changed in the optimized version.

Mention why professionals prefer this approach.

---

# Complexity Comparison

Beginner Solution

Time

Space

Professional Solution

Time

Space

---

# Mentor Discussion

Summarize the user's important questions and your answers.

Maximum five questions.

---

# Key Interview Concepts

Bullet points only.

---

# Common Interview Questions

Give five interview questions related to this problem.

---

# Quick Revision Tips

Maximum five bullet points.

Rules

- Maximum 600 words.
- No unnecessary paragraphs.
- Avoid repetition.
- Be concise.
`,
      },
      {
        role: "user",
        content: `
Problem

${prompt}

Programming Language

${language}

Beginner Code

${generatedCode}

Professional Code

${optimizedCode}

Conversation

${JSON.stringify(history)}
`,
      },
    ],
    0.3
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
