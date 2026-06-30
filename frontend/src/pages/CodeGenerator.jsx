import { useState } from "react";
import api from "../services/api";

export default function CodeGenerator({
  setPrompt,
  setLanguage,
  setGeneratedCode,
  setOptimizedCode,
}) {
  const [problem, setProblem] = useState("");
  const [language, setLang] = useState("Python");
  const [loading, setLoading] = useState(false);

  const validateProblem = (text) => {
    const lower = text.toLowerCase();

    const invalid = [
      "can i",
      "what is python",
      "who is",
      "tell me",
      "joke",
      "hello",
      "hi",
      "good morning",
      "how are you",
      "weather",
      "movie",
      "song",
      "history",
    ];

    if (invalid.some((word) => lower.includes(word))) {
      return false;
    }

    return true;
  };

  const generate = async () => {
    if (!problem.trim()) {
      alert("Enter a coding problem.");
      return;
    }

    if (!validateProblem(problem)) {
      alert(
        "CodeMentor AI only accepts programming problems. Example: Reverse a Linked List, Find Prime Numbers, Two Sum, Merge Sort..."
      );
      return;
    }

    try {
      setLoading(true);

      setPrompt(problem);
      setLanguage(language);

      const codeRes = await api.post("/ai/generate", {
        prompt: problem,
        language,
      });

      const generated = codeRes.data.code;

      setGeneratedCode(generated);

      const optimizeRes = await api.post("/ai/optimize", {
        code: generated,
        language,
      });

      let optimized = optimizeRes.data.result;

      try {
        optimized = JSON.parse(optimized);

        setOptimizedCode(
          `
## Optimized Code

${optimized.optimizedCode}

---

## Why is this Better?

${optimized.explanation}
`
        );
      } catch {
        setOptimizedCode(optimizeRes.data.result);
      }
    } catch (err) {
      console.log(err);
      alert("Generation Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <h2 className="text-3xl font-bold mb-8">
        Solve a Coding Problem
      </h2>

      <div className="space-y-6">

        <div>

          <label className="block mb-3 text-lg font-semibold">
            Programming Problem
          </label>

          <textarea
            rows={7}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Example:

Find all prime numbers between 1 and N

Reverse a Linked List

Two Sum

Merge Sort

Binary Search

Maximum Subarray"
            className="w-full bg-slate-800 rounded-2xl p-5 text-lg"
          />

        </div>

        <div>

          <label className="block mb-3 text-lg font-semibold">
            Language
          </label>

          <select
            value={language}
            onChange={(e) => setLang(e.target.value)}
            className="w-full bg-slate-800 rounded-xl p-4"
          >
            <option>Python</option>
            <option>Java</option>
            <option>C</option>
            <option>C++</option>
            <option>JavaScript</option>
          </select>

        </div>

        <button
          disabled={loading}
          onClick={generate}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg"
        >
          {loading ? "Generating Solution..." : "Generate Solution"}
        </button>

      </div>

    </div>
  );
}