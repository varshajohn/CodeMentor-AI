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
      "weather",
      "movie",
      "song",
      "joke",
      "good morning",
      "who is",
      "tell me about",
      "capital of",
    ];

    return !invalid.some((item) => lower.includes(item));
  }

  async function generate() {
    if (!problem.trim()) {
      alert("Please enter a programming problem.");
      return;
    }

    if (!validateProblem(problem)) {
      alert("Only programming related questions are allowed.");
      return;
    }

    try {
      setLoading(true);

      setPrompt(problem);
      setLanguage(language);

      /* =====================================
         STEP 1 - Beginner Friendly Solution
      ===================================== */

      const generatedRes = await api.post("/ai/generate", {
        prompt: problem,
        language,
      });

      const beginnerSolution = generatedRes.data.code;

      setGeneratedCode(beginnerSolution);
/* =====================================
   Extract only the generated code block
===================================== */

const match = beginnerSolution.match(/```[\w]*\n([\s\S]*?)```/);

const extractedCode = match
  ? match[1].trim()
  : beginnerSolution;
      /* =====================================
         STEP 2 - Professional Optimization
      ===================================== */

const optimizeRes = await api.post("/ai/optimize", {
    code: extractedCode,
    language,
});
const professionalSolution = optimizeRes.data.result;

setOptimizedCode(professionalSolution);

setComparison(`
# 📊 Beginner vs Professional

## Beginner Solution

- Easy to understand
- Uses simple logic
- Suitable for learning programming

---

## Professional Solution

- Uses language-specific best practices
- Uses built-in methods where possible
- Cleaner and shorter implementation
- Better readability
- More interview ready

---

Compare both tabs to understand how professional developers improve beginner code.
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

      {/* Heading */}

      <div>

        <div className="flex items-center gap-3 mb-3">

          <FaCode className="text-indigo-400 text-xl" />

          <h2 className="text-2xl font-bold">
            Describe Your Coding Problem
          </h2>

        </div>

        <textarea
          rows={8}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          className="input resize-none"
        />

        <div className="flex justify-between items-center mt-3">

          <span className="text-xs text-slate-500">
          </span>

          <span className="text-xs text-slate-500">
            {problem.length} Characters
          </span>

        </div>

      </div>

      {/* Bottom Controls */}

      <div className="flex flex-wrap items-end gap-6">

        <div className="w-64">

          <label className="block mb-2 text-sm text-slate-400">
            Language
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
            : "Generate"}

        </button>

      </div>

      {/* Info Cards */}

    </div>
  );
}