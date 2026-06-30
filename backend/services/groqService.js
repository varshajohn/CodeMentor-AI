const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const MODEL = "llama-3.3-70b-versatile";

async function callAI(messages, temperature = 0.2) {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature,
    messages,
  });

  return completion.choices[0].message.content.trim();
}

/* ========================================================= */
/* GENERATE CODE */
/* ========================================================= */

async function generateCode(problem, language) {
  return await callAI([
    {
      role: "system",
      content: `
You are CodeMentor AI.

Purpose:
Generate solutions ONLY for programming/coding problems.

Reject anything that is not a coding problem.

Accepted:
- Coding interview questions
- DSA problems
- Competitive programming
- Algorithms
- Data Structures

Reject:
- "Can I learn Python?"
- "Who is Elon Musk?"
- "Tell me a joke."
- "What is Java?"
- Any general conversation.

If rejected, reply EXACTLY:

This platform is designed only for solving programming problems. Please enter a coding problem.

When accepted:

Return markdown using this exact structure.

# Solution

Brief explanation in 3-5 lines.

# ${language} Code

Use proper markdown code fences.

# Time Complexity

Explain.

# Space Complexity

Explain.

Rules

- Professional
- Interview quality
- Clean code
- Proper variable names
- Comments only where useful
- No unnecessary text
`,
    },
    {
      role: "user",
      content: problem,
    },
  ]);
}
/* ========================================================= */
/* OPTIMIZATION */
/* ========================================================= */

async function optimizeCode(code, language) {
  return await callAI([
    {
      role: "system",
      content: `
You are a senior software engineer.

Improve the following ${language} solution.

Return ONLY valid JSON.

{
"optimizedCode":"",
"explanation":"",
"timeComplexity":"",
"spaceComplexity":"",
"changes":[]
}

Rules

Do not use markdown.

Do not write explanations outside JSON.

Keep explanation professional.
`,
    },
    {
      role: "user",
      content: code,
    },
  ]);
}

/* ========================================================= */
/* MENTOR */
/* ========================================================= */

async function askMentor(code, history, question) {
  return await callAI(
    [
      {
        role: "system",
        content: `
You are CodeMentor AI.

You are mentoring a student.

Current generated solution:

${code}

Previous discussion:

${JSON.stringify(history)}

You ONLY answer questions related to THIS solution.

If the question is unrelated reply EXACTLY:

I'm designed to answer only questions related to the current generated solution.

When answering:

- Explain step-by-step.
- Assume the student is a beginner.
- Explain variables.
- Explain loops.
- Explain conditions.
- Give a dry run whenever appropriate.
- Explain time complexity if relevant.
- Explain space complexity if relevant.
- Never answer unrelated programming questions.
- Never answer general knowledge.

Use beautiful markdown.

Use headings.

Use bullet points.

Never reply in one paragraph.
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
/* STUDY NOTES */
/* ========================================================= */

async function generateNotes(
  prompt,
  language,
  generatedCode,
  optimizedCode,
  history
) {
  return await callAI([
    {
      role: "system",
      content: `
Create PROFESSIONAL revision notes.

These are NOT summaries.

These should look like handwritten interview revision notes.

Use EXACTLY these headings.

# Problem Statement

# Programming Language

# Solution Idea

# Generated Solution Explanation

# Optimized Solution Explanation

# Variables Explained

# Loops Explained

# Conditions Explained

# Questions Asked During Learning

For EVERY question write

Question

Answer

# Important Concepts Learned

# Time Complexity

# Space Complexity

# Interview Tips

# Common Mistakes

# Final Revision Notes

Write detailed explanations.

Minimum 1000 words.

Use markdown.

Do NOT make it short.

Do NOT skip sections.

The student should be able to revise only from these notes.
`,
    },
    {
      role: "user",
      content: JSON.stringify({
        prompt,
        language,
        generatedCode,
        optimizedCode,
        history,
      }),
    },
  ]);
}

module.exports = {
  generateCode,
  optimizeCode,
  askMentor,
  generateNotes,
};