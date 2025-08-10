import React, { useState } from "react";
import axios from "axios";
import ClozeQuestion from "../components/ClozeQuestion";
import CategorizeQuestion from "../components/CategorizeQuestion";
import ComprehensionQuestion from "../components/ComprehensionQuestion";
import { useNavigate } from "react-router-dom";
import { server } from "../main";
const FormBuilder = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [questions, setQuestions] = useState([]);

  const addQuestion = (type) => {
    let newQ = { type, image: "", collapsed: false };
    if (type === "cloze") {
      newQ.passage = "";
      newQ.correctAnswer = [""]; // start with one option
      newQ.answerValue = [];
    }
    if (type === "categorize") {
      newQ.questionText = "";
      newQ.options = ["Option 1"];
      newQ.categories = ["Category 1", "Category 2"];
      newQ.answer = {};
    }
    if (type === "comprehension") {
      newQ.passage = "";
      newQ.subQuestions = [{ text: "", options: ["", ""], answer: "" }];
    }
    setQuestions([...questions, newQ]);
  };

  const toggleCollapse = (index) => {
    const updated = [...questions];
    updated[index].collapsed = !updated[index].collapsed;
    setQuestions(updated);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const updateCategory = (qIndex, catIndex, value) => {
    const updated = [...questions];
    updated[qIndex].categories[catIndex] = value;
    setQuestions(updated);
  };

  const updateAnswerMapping = (qIndex, newMapping) => {
    const updated = [...questions];
    updated[qIndex].answer = newMapping;
    setQuestions(updated);
  };

  const updateSubQuestion = (qIndex, subIndex, field, value) => {
    const updated = [...questions];
    updated[qIndex].subQuestions[subIndex][field] = value;
    setQuestions(updated);
  };

  const saveForm = async () => {
    try {
      const res = await axios.post(`${server}/api/forms`, {
        title,
        headerImage,
        questions,
      });
      alert(
        "Form saved! ID: " +
          res.data._id +
          " so you are redirecting to fill forms"
      );
      navigate(`/forms/${res.data._id}`);
    } catch (err) {
      console.error(err);
      alert("Error saving form");
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-[#1c1f2a] to-[#11131b] text-white p-4 font-sans overflow-x-hidden"
      style={{ fontSize: "14px" }}
    >
      <div className="max-w-5xl mx-auto px-3 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Form Builder
        </h1>

        {/* Form Inputs */}
        <div className="space-y-4 mb-6 sm:mb-8">
          <input
            type="text"
            placeholder="Form Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
          <input
            type="text"
            placeholder="Header Image URL"
            value={headerImage}
            onChange={(e) => setHeaderImage(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Question Buttons */}
        <div className="flex flex-wrap gap-3 mb-6 sm:mb-8 justify-center">
          <button
            onClick={() => addQuestion("cloze")}
            className="flex-grow sm:flex-grow-0 min-w-[120px] px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 transition shadow-lg text-sm sm:text-base"
          >
            Add Cloze
          </button>
          <button
            onClick={() => addQuestion("categorize")}
            className="flex-grow sm:flex-grow-0 min-w-[120px] px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 transition shadow-lg text-sm sm:text-base"
          >
            Add Categorize
          </button>
          <button
            onClick={() => addQuestion("comprehension")}
            className="flex-grow sm:flex-grow-0 min-w-[120px] px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 transition shadow-lg text-sm sm:text-base"
          >
            Add Comprehension
          </button>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, i) => (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:shadow-xl transition"
            >
              {/* Question Header with Toggle */}
              <div
                className="flex justify-between items-center cursor-pointer select-none"
                onClick={() => toggleCollapse(i)}
              >
                <h2 className="text-base sm:text-lg font-semibold">
                  Question {i + 1} ({q.type})
                </h2>
                <span
                  className={`text-xl transition-transform duration-300 ${
                    q.collapsed ? "rotate-180" : "rotate-0"
                  }`}
                  aria-label={q.collapsed ? "Expand" : "Collapse"}
                  role="img"
                >
                  ▼
                </span>
              </div>

              {/* Show details only if not collapsed */}
              {!q.collapsed && (
                <div className="mt-4">
                  {q.type === "categorize" && (
                    <input
                      type="text"
                      placeholder="Question text"
                      value={q.questionText || ""}
                      onChange={(e) =>
                        updateQuestion(i, "questionText", e.target.value)
                      }
                      className="w-full p-2 mb-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Question image URL"
                    value={q.image}
                    onChange={(e) => updateQuestion(i, "image", e.target.value)}
                    className="w-full p-2 mb-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                  />

                  {q.type === "categorize" && (
                    <>
                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Options</h4>
                        {q.options.map((opt, idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={opt}
                            onChange={(e) =>
                              updateOption(i, idx, e.target.value)
                            }
                            className="w-full p-1 mb-2 rounded bg-white/10 border border-white/20 text-white"
                          />
                        ))}
                        <button
                          onClick={() =>
                            updateQuestion(i, "options", [...q.options, ""])
                          }
                          className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
                        >
                          + Add Option
                        </button>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Categories</h4>
                        {q.categories.map((cat, idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={cat}
                            onChange={(e) =>
                              updateCategory(i, idx, e.target.value)
                            }
                            className="w-full p-1 mb-2 rounded bg-white/10 border border-white/20 text-white"
                          />
                        ))}
                        <button
                          onClick={() =>
                            updateQuestion(i, "categories", [...q.categories, ""])
                          }
                          className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
                        >
                          + Add Category
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <CategorizeQuestion
                          categories={q.categories}
                          options={q.options}
                          value={q.answer}
                          onChange={(newMapping) => updateAnswerMapping(i, newMapping)}
                          onDeleteOption={(opt) =>
                            updateQuestion(i, "options", q.options.filter((o) => o !== opt))
                          }
                          onDeleteCategory={(cat) =>
                            updateQuestion(i, "categories", q.categories.filter((c) => c !== cat))
                          }
                        />
                      </div>
                    </>
                  )}

                  {q.type === "cloze" && (
                    <>
                      <input
                        type="text"
                        placeholder="Passage (use ___ for blanks)"
                        value={q.passage}
                        onChange={(e) =>
                          updateQuestion(i, "passage", e.target.value)
                        }
                        className="w-full p-2 mb-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400"
                      />
                      <div className="mb-3">
                        <h4 className="font-medium mb-1">Correct Answers</h4>
                        {q.correctAnswer.map((opt, idx) => (
                          <input
                            key={idx}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...q.correctAnswer];
                              updated[idx] = e.target.value;
                              updateQuestion(i, "correctAnswer", updated);
                            }}
                            className="w-full p-1 mb-2 rounded bg-white/10 border border-white/20 text-white"
                          />
                        ))}
                        <button
                          onClick={() =>
                            updateQuestion(i, "correctAnswer", [
                              ...q.correctAnswer,
                              "",
                            ])
                          }
                          className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500"
                        >
                          + Add Answer
                        </button>
                      </div>
                      <ClozeQuestion
                        passage={q.passage}
                        correctAnswer={q.correctAnswer}
                        value={q.answerValue}
                        onChange={(newValue) =>
                          updateQuestion(i, "answerValue", newValue)
                        }
                      />
                    </>
                  )}

                  {q.type === "comprehension" && (
                    <ComprehensionQuestion
                      q={q}
                      i={i}
                      updateQuestion={updateQuestion}
                      updateSubQuestion={updateSubQuestion}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={saveForm}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 transition shadow-lg"
        >
          Save Form
        </button>
      </div>

      {/* Extra small screen tweaks */}
      <style>{`
        @media (max-width: 320px) {
          input, select, button {
            font-size: 13px !important;
          }
          button {
            padding: 0.4rem 0.7rem !important;
            min-width: auto !important;
          }
          .text-3xl {
            font-size: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FormBuilder;
