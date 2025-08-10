import React from "react";

const ComprehensionQuestion = ({ q, i, updateQuestion, updateSubQuestion }) => {
  const updateOption = (subIndex, optIndex, value) => {
    const updatedSubQs = [...q.subQuestions];
    updatedSubQs[subIndex].options[optIndex] = value;
    updateQuestion(i, "subQuestions", updatedSubQs);
  };

  const addOption = (subIndex) => {
    const updatedSubQs = [...q.subQuestions];
    updatedSubQs[subIndex].options.push("");
    updateQuestion(i, "subQuestions", updatedSubQs);
  };

  const deleteOption = (subIndex, optIndex) => {
    const updatedSubQs = [...q.subQuestions];
    updatedSubQs[subIndex].options.splice(optIndex, 1);
    updateQuestion(i, "subQuestions", updatedSubQs);
  };

  const deleteSubQuestion = (subIndex) => {
    const updatedSubQs = q.subQuestions.filter((_, idx) => idx !== subIndex);
    updateQuestion(i, "subQuestions", updatedSubQs);
  };

  return (
    <div className="bg-gray-800 text-gray-100 p-4 rounded-lg shadow-md">
      {/* Passage */}
      <textarea
        placeholder="Passage text"
        value={q.passage}
        onChange={(e) => updateQuestion(i, "passage", e.target.value)}
        className="border border-gray-600 bg-gray-700 text-white p-2 w-full mb-4 rounded"
      />

      <h3 className="font-semibold mb-3 text-lg">MCQ Questions</h3>

      {q.subQuestions.map((sq, idx) => (
        <div
          key={idx}
          className="border border-gray-600 p-3 rounded mb-3 bg-gray-700"
        >
          {/* Sub-question header with permanent purple close */}
          <div className="flex justify-between items-center mb-3 gap-2">
            <input
              type="text"
              placeholder="Question"
              value={sq.text}
              onChange={(e) => updateSubQuestion(i, idx, "text", e.target.value)}
              className="border border-gray-600 bg-gray-800 text-white p-2 w-full rounded"
            />
            <button
              onClick={() => deleteSubQuestion(idx)}
              className="text-indigo-400 text-xl flex-shrink-0 hover:text-indigo-300"
              title="Delete question"
            >
              ✖
            </button>
          </div>

          <h4 className="font-medium mb-2">Options</h4>
          {sq.options.map((opt, optIdx) => (
            <div key={optIdx} className="flex items-center mb-2 gap-2">
              <input
                type="text"
                placeholder={`Option ${optIdx + 1}`}
                value={opt}
                onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                className="border border-gray-600 bg-gray-800 text-white p-2 w-full rounded"
              />
              <button
                onClick={() => deleteOption(idx, optIdx)}
                className="text-indigo-400 text-lg flex-shrink-0 hover:text-indigo-300"
                title="Remove option"
              >
                ✖
              </button>
            </div>
          ))}

          <button
            onClick={() => addOption(idx)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded mb-3"
          >
            + Add Option
          </button>

          <select
            value={sq.answer}
            onChange={(e) => updateSubQuestion(i, idx, "answer", e.target.value)}
            className="border border-gray-600 bg-gray-800 text-white p-2 w-full rounded"
          >
            <option value="">Select correct answer</option>
            {sq.options.map((opt, optIdx) => (
              <option key={optIdx} value={opt}>
                {opt || `Option ${optIdx + 1}`}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        onClick={() => {
          const updated = [
            ...q.subQuestions,
            { text: "", options: ["", ""], answer: "" },
          ];
          updateQuestion(i, "subQuestions", updated);
        }}
        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
      >
        + Add MCQ
      </button>
    </div>
  );
};

export default ComprehensionQuestion;
