import { useState } from "react";
import api from "../services/api";

const SAMPLE_PROBLEMS = [
  { title: "Two Sum", text: "Find indices of the two numbers such that they add up to target." },
  { title: "Reverse Linked List", text: "Given the head of a singly linked list, reverse the list." },
  { title: "Binary Search", text: "Search for a target value in a sorted array of integers." },
  { title: "Merge Sort", text: "Sort an array of integers in ascending order." }
];

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
    const lower = text.toLowerCase().trim();
    if (!lower) return false;

    const invalidKeywords = [
      "can i", "what is python", "who is", "tell me", "joke", "hello",
      "hi", "good morning", "how are you", "weather", "movie", "song", "history"
    ];

    return !invalidKeywords.some((word) => lower.includes(word));
  };

  const generate = async () => {
    if (!problem.trim()) {
      alert("Please specify a problem statement.");
      return;
    }

    if (!validateProblem(problem)) {
      alert("Please input a valid programming problem description.");
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
        let cleanResult = optimized.trim();
        if (cleanResult.startsWith("```")) {
          cleanResult = cleanResult.replace(/^```(?:json)?\n?/i, "");
          cleanResult = cleanResult.replace(/\n?```$/, "");
          cleanResult = cleanResult.trim();
        }
        
        const parsed = JSON.parse(cleanResult);

        setOptimizedCode(
          `
## Optimized Code

\`\`\`${language.toLowerCase()}
${parsed.optimizedCode}
\`\`\`

---

## Performance Changes

${parsed.explanation}

### Complexities
- **Time Complexity:** ${parsed.timeComplexity || "N/A"}
- **Space Complexity:** ${parsed.spaceComplexity || "N/A"}

### Code Changes
${parsed.changes && Array.isArray(parsed.changes) 
  ? parsed.changes.map(change => `- ${change}`).join("\n") 
  : "Optimization applied."}
`
        );
      } catch {
        setOptimizedCode(optimizeRes.data.result);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to compute solution.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
          Programming Problem Description
        </label>
        <textarea
          rows={4}
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder="Describe your coding challenge or copy a problem statement..."
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 p-4 rounded-xl text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition"
        />
      </div>

      {/* Suggestion tags */}
      <div>
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
          Or select a common pattern
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SAMPLE_PROBLEMS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setProblem(sample.text)}
              className="text-left bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-3.5 rounded-xl transition active:scale-[0.98]"
            >
              <div className="font-bold text-xs text-blue-600 mb-0.5">{sample.title}</div>
              <p className="text-[10px] text-slate-500 line-clamp-1 leading-normal">{sample.text}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-end border-t border-slate-200/60 pt-5 mt-2">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Target Language
          </label>
          <select
            value={language}
            onChange={(e) => setLang(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-200 rounded-xl p-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition"
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
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-xl text-sm transition shrink-0 active:scale-[0.98]"
        >
          {loading ? "Generating..." : "Generate Solution"}
        </button>
      </div>
    </div>
  );
}