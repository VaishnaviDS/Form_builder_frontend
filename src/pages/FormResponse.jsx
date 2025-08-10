import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../main";
import CategorizeQuestionResponse from "../components/Categorize/CategorizeQuestionResponse";
import ClozeQuestion from "../components/ClozeQuestion";

const ClozeDragDrop = ({ passage, correctAnswer, value = [], onChange, readOnly }) => {
  const parts = passage.split("___");
  const options = correctAnswer.filter((opt) => !value.includes(opt));

  const onDrop = (blankIndex, e) => {
    if (readOnly) return;
    e.preventDefault();
    const droppedAnswer = e.dataTransfer.getData("text/plain");
    if (!droppedAnswer) return;
    const newValue = [...value];
    newValue[blankIndex] = droppedAnswer;
    onChange(newValue);
  };

  const allowDrop = (e) => e.preventDefault();
  const onDragStart = (e, answer) => e.dataTransfer.setData("text/plain", answer);

  const clearBlank = (blankIndex) => {
    if (readOnly) return;
    const newValue = [...value];
    newValue[blankIndex] = "";
    onChange(newValue);
  };

  return (
    <div>
      <p className="leading-relaxed text-lg text-gray-200">
        {parts.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < parts.length - 1 && (
              <span
                onDrop={(e) => onDrop(i, e)}
                onDragOver={allowDrop}
                onClick={() => clearBlank(i)}
                className={`align-middle inline-flex items-center justify-center min-w-[100px] h-[2rem] px-4 mx-1 rounded-full text-center cursor-pointer transition-all border-2 font-medium shadow-sm ${
                  value[i]
                    ? "bg-blue-900 border-blue-400"
                    : "bg-gray-800 border-dashed border-gray-500"
                }`}
                title={value[i] ? "Click to clear" : "Drag an answer here"}
              >
                {value[i] || ""}
              </span>
            )}
          </React.Fragment>
        ))}
      </p>

      {!readOnly && (
        <div className="mt-4 flex flex-wrap gap-3">
          {options.length === 0 && (
            <small className="text-gray-400 italic">All options placed</small>
          )}
          {options.map((opt, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => onDragStart(e, opt)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow cursor-grab select-none font-medium hover:scale-105 transform transition-all"
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FormResponse = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [formRes, respRes] = await Promise.all([
          axios.get(`${server}/api/forms/${id}`),
          axios.get(`${server}/api/forms/${id}/response`).catch(() => ({ data: null })),
        ]);

        const formData = formRes.data;
        setForm(formData);

        const respData = respRes?.data;
        if (respData && Array.isArray(respData.responses) && respData.responses.length > 0) {
          setSubmitted(true);
          const loaded = {};
          for (const r of respData.responses) {
            const qid = r.questionId ? String(r.questionId) : null;
            if (qid) loaded[qid] = r.answer;
          }
          setAnswers(loaded);
        }
      } catch (err) {
        console.error("Error loading form/response:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const setAnswerForQ = (questionId, value) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [String(questionId)]: value }));
  };

  const handleComprehensionChoice = (questionId, subIndex, choice) => {
    if (submitted) return;
    setAnswers((prev) => {
      const cur = Array.isArray(prev[questionId]) ? [...prev[questionId]] : [];
      cur[subIndex] = choice;
      return { ...prev, [questionId]: cur };
    });
  };

  const handleSubmit = async () => {
    if (submitted) {
      alert("You have already submitted this form.");
      return;
    }

    if (!form) return;
    try {
      const payload = {
        responses: form.questions.map((q) => ({
          questionId: q._id,
          answer: answers[String(q._id)] ?? null,
        })),
      };
      await axios.post(`${server}/api/forms/${id}/response`, payload);
      alert("Responses submitted! \n You are being redirecting to see forms and marks");
      navigate("/forms/all");
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      if (err.response && err.response.data.message === "Form already submitted") {
        alert("You have already submitted this form.");
        setSubmitted(true);
      } else {
        alert("Error submitting responses");
      }
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center text-lg font-medium text-gray-300">
        Loading...
      </div>
    );
  if (!form)
    return (
      <div className="p-4 text-red-400 text-center font-medium">
        Form not found
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-[#1e1e1e] shadow-xl rounded-2xl overflow-hidden border border-gray-700">
        {form.headerImage && (
          <div className="flex items-center gap-6 bg-[#1a1a1a] p-6 border-b border-gray-700">
            <img
              src={form.headerImage}
              alt="header"
              className="h-34 w-34 object-contain rounded-md shadow-sm bg-amber-50"
            />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {form.title}
            </h1>
          </div>
        )}

        {!form.headerImage && (
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              {form.title}
            </h1>
          </div>
        )}

        <div className="p-8">
          {form.questions.map((q, idx) => {
            const qid = String(q._id);
            const currentAnswer = answers[qid];

            return (
              <div
                key={qid}
                className="border border-gray-700 p-6 rounded-2xl mb-6 bg-[#2b2b2b] shadow-sm hover:shadow-md transition-all"
              >
                <p className="font-semibold mb-3 text-gray-200">
                  Q{idx + 1}.{" "}
                  {q.type === "comprehension" ? "(Comprehension)" : q.questionText}
                </p>

                {q.image && (
                  <img
                    src={q.image}
                    alt=""
                    className="mb-4 max-h-48 object-contain rounded-lg shadow-sm"
                  />
                )}

                {q.type === "cloze" && (
                  <ClozeQuestion
                    passage={q.passage}
                    correctAnswer={q.correctAnswer || []}
                    value={Array.isArray(currentAnswer) ? currentAnswer : []}
                    onChange={(val) => setAnswerForQ(qid, val)}
                    readOnly={submitted}
                  />
                )}

                {q.type === "categorize" && (
                  <CategorizeQuestionResponse
                    categories={q.categories || []}
                    options={q.options || []}
                    value={currentAnswer || {}}
                    onChange={(newMapping) => setAnswerForQ(qid, newMapping)}
                    readOnly={submitted}
                  />
                )}

                {q.type === "comprehension" && (
                  <div>
                    {q.passage && (
                      <p className="mb-4 p-4 bg-[#1e1e1e] border border-gray-700 rounded-lg shadow-sm text-gray-300">
                        {q.passage}
                      </p>
                    )}

                    {(q.subQuestions || []).map((subQ, sIdx) => {
                      const chosen = Array.isArray(currentAnswer)
                        ? currentAnswer[sIdx]
                        : undefined;
                      return (
                        <div
                          key={sIdx}
                          className="mb-4 p-4 border border-white/10 rounded-lg bg-white/5 shadow-sm"
                        >
                          <p className="font-medium mb-2 text-gray-200">
                            {sIdx + 1}. {subQ.text}
                          </p>
                          {(subQ.options || []).map((opt, optIdx) => (
                            <label
                              key={optIdx}
                              className="block mb-1 cursor-pointer text-gray-300 hover:text-indigo-400"
                            >
                              <input
                                type="radio"
                                name={`comp-${qid}-${sIdx}`}
                                value={opt}
                                checked={chosen === opt}
                                disabled={submitted}
                                onChange={() =>
                                  handleComprehensionChoice(qid, sIdx, opt)
                                }
                                className="mr-2 accent-indigo-500"
                              />
                              {opt}
                            </label>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          <div className="text-center mt-8">
            <button
              onClick={handleSubmit}
              disabled={submitted}
              className={`bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-8 py-3 rounded-2xl font-semibold shadow transform transition-all ${
                submitted ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}
            >
              {submitted ? "Form Already Submitted" : "Submit Responses"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormResponse;
