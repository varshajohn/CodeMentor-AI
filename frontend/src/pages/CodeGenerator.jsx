import { useState } from "react";
import { FaCode, FaWandMagicSparkles } from "react-icons/fa6";
import api from "../services/api";

export default function CodeGenerator({
    setPrompt,
    setLanguage,
    setGeneratedCode,
    setOptimizedCode,
    setComparison,
}) {
  const [problem, setProblem] = useState("");
  const [language, setLang] = useState("Python");
  const [loading, setLoading] = useState(false);

  function validateProblem(text) {
    const lower = text.toLowerCase();

    const invalid = [
      "hello",
      "hi",
      "who is",
      "weather",
      "movie",
      "song",
      "joke",
      "how are you",
      "tell me",
      "good morning",
    ];

    return !invalid.some((i) => lower.includes(i));
  }

async function generate() {
  if (!problem.trim()) {
    alert("Please enter a programming problem.");
    return;
  }

  if (!validateProblem(problem)) {
    alert("Only programming-related questions are allowed.");
    return;
  }

  try {
    setLoading(true);

    setPrompt(problem);
    setLanguage(language);

    /* ==========================
       Generate Initial Solution
    ========================== */

    const generatedRes = await api.post("/ai/generate", {
      prompt: problem,
      language,
    });

    const generated = generatedRes.data.code;

    setGeneratedCode(generated);

    /* ==========================
       Optimize Solution
    ========================== */

    const optimizeRes = await api.post("/ai/optimize", {
      code: generated,
      language,
    });

    let raw = optimizeRes.data.result.trim();

    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(?:json)?\n?/i, "");
      raw = raw.replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(raw);
    let comparisonMarkdown = `
# 📊 Comparison

| Metric | Generated | Optimized |
|--------|-----------|-----------|
| Time Complexity | Extract from generated output | ${parsed.timeComplexity || "N/A"} |
| Space Complexity | Extract from generated output | ${parsed.spaceComplexity || "N/A"} |

---

## Optimization Status

${parsed.optimized ? "✅ Improved" : "⚠ Already Optimal"}

---

## Reason

${parsed.reason}

---

## Changes

`;

if (parsed.changes.length > 0) {

  comparisonMarkdown += parsed.changes
    .map((c) => `- ${c}`)
    .join("\n");

} else {

  comparisonMarkdown +=
    "- No algorithmic improvement was possible.";

}

setComparison(comparisonMarkdown);

    /* ==========================
       Already Optimal
    ========================== */

    if (!parsed.optimized) {

      setOptimizedCode(`

# Already Optimal ✅

### Reason

${parsed.reason}

---

## Current Code

\`\`\`${language.toLowerCase()}
${parsed.optimizedCode}
\`\`\`

`);

      return;
    }

    /* ==========================
       Optimized
    ========================== */

    setOptimizedCode(`

# Optimized Solution ✅

### Why is it better?

${parsed.reason}

---

## Optimized Code

\`\`\`${language.toLowerCase()}
${parsed.optimizedCode}
\`\`\`

---

## Time Complexity

${parsed.timeComplexity}

---

## Space Complexity

${parsed.spaceComplexity}

---

## Improvements

${parsed.changes.length
  ? parsed.changes.map((c) => `- ${c}`).join("\n")
  : "- General code cleanup"}

`);

  } catch (err) {

    console.log(err);

    alert("Failed to generate solution.");

  } finally {

    setLoading(false);

  }
}

  return (
    <div className="space-y-8">

      <div>

        <div className="flex items-center gap-3 mb-3">

          <FaCode className="text-indigo-400 text-xl" />

          <h2 className="text-2xl font-bold">
            Describe your coding problem
          </h2>

        </div>

        <p className="text-slate-400 text-sm mb-5">
          Paste a coding problem or describe it in detail.
        </p>

        <textarea
          rows={8}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Example:

Given an array of integers nums and an integer target,
return the indices of the two numbers such that they add up to target..."
          className="input resize-none"
        />

        <div className="flex justify-end mt-2">

          <span className="text-xs text-slate-500">
            {problem.length} characters
          </span>

        </div>

      </div>

      <div className="flex gap-6 items-end flex-wrap">

        <div className="w-64">

          <label className="block mb-2 text-sm text-slate-400">
            Programming Language
          </label>

          <select
            className="input"
            value={language}
            onChange={(e) => setLang(e.target.value)}
          >
            <option>Python</option>
            <option>Java</option>
            <option>C</option>
            <option>C++</option>
            <option>JavaScript</option>
          </select>

        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="primary-btn flex items-center gap-3 h-[54px]"
        >

          <FaWandMagicSparkles />

          {loading
            ? "Generating..."
            : "Generate Solution"}

        </button>

      </div>

    </div>
  );
}