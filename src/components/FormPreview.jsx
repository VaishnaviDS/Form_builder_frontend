import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FormPreview = () => {
  const { id } = useParams(); // formId from route
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchForm = async () => {
      const res = await axios.get(`http://localhost:5000/api/forms/${id}`);
      setForm(res.data);
      setAnswers(new Array(res.data.questions.length).fill(""));
    };
    fetchForm();
  }, [id]);

  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const submitResponse = async () => {
    try {
      await axios.post(`http://localhost:5000/api/forms/${id}/response`, {
        responses: form.questions.map((q, i) => ({
          questionId: q._id,
          answer: answers[i]
        }))
      });
      alert("Response submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting response");
    }
  };

  if (!form) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {form.headerImage && (
        <img src={form.headerImage} alt="Header" className="w-full mb-4" />
      )}
      <h1 className="text-2xl font-bold mb-4">{form.title}</h1>

      {form.questions.map((q, i) => (
        <div key={q._id} className="mb-6 border p-3 rounded">
          <p className="font-semibold mb-2">{q.questionText}</p>
          {q.image && <img src={q.image} alt="" className="mb-2 max-h-40" />}

          {/* Cloze type */}
          {q.type === "cloze" && (
            <input
              type="text"
              value={answers[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              className="border p-2 w-full"
            />
          )}
          {/* Categorize and Comprehension will be added later */}
        </div>
      ))}

      <button
        onClick={submitResponse}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default FormPreview;
