import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../main";

const Forms = () => {
  const [forms, setForms] = useState([]);
  const [status, setStatus] = useState({});
  const [marksByForm, setMarksByForm] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true); // Loading forms
  const [loadingStatus, setLoadingStatus] = useState(true); // Loading status
  const navigate = useNavigate();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axios.get(`${server}/api/forms/all`);
        setForms(res.data);
      } catch (err) {
        console.error("Error fetching forms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  useEffect(() => {
    const checkResponses = async () => {
      setLoadingStatus(true); // start loading status
      try {
        const statusObj = {};
        for (let form of forms) {
          const resp = await axios.get(
            `${server}/api/forms/${form._id}/has-response`
          );
          statusObj[form._id] = resp.data.hasSubmitted;
        }
        setStatus(statusObj);
      } catch (err) {
        console.error("Error checking responses:", err);
      } finally {
        setLoadingStatus(false); // done loading status
      }
    };

    if (forms.length > 0) {
      checkResponses();
    } else {
      setLoadingStatus(false); // no forms, so no status to load
    }
  }, [forms]);

  // Function to toggle marks visibility and fetch marks if needed
  const toggleMarks = async (formId) => {
    const current = marksByForm[formId];

    // If marks already fetched, just toggle visibility
    if (current?.data) {
      setMarksByForm((prev) => ({
        ...prev,
        [formId]: {
          ...prev[formId],
          visible: !prev[formId].visible,
        },
      }));
      return;
    }

    // Otherwise fetch marks data
    setMarksByForm((prev) => ({
      ...prev,
      [formId]: { loading: true, error: null, data: null, visible: true },
    }));

    try {
      const res = await axios.get(`${server}/api/forms/marks/${formId}`);
      setMarksByForm((prev) => ({
        ...prev,
        [formId]: { loading: false, error: null, data: res.data, visible: true },
      }));
    } catch (err) {
      console.error("Error fetching marks:", err);
      setMarksByForm((prev) => ({
        ...prev,
        [formId]: {
          loading: false,
          error: "Failed to load marks",
          data: null,
          visible: true,
        },
      }));
    }
  };

  // Show loading until both forms and status finish loading
  if (loading || loadingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#1c1f2a] to-[#11131b]">
        Loading forms...
      </div>
    );
  }

  const filteredForms = forms.filter((form) =>
    form.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1f2a] to-[#11131b] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">📋 Available Forms</h1>

        <input
          type="text"
          placeholder="Search forms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 p-2 w-full rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {filteredForms.length === 0 && (
          <p className="text-gray-400">No forms found matching your search.</p>
        )}

        {filteredForms.map((form) => {
          const marksInfo = marksByForm[form._id] || {};
          const questionScores = marksInfo.data?.questionScores || [];
          const totalMarks = questionScores.reduce(
            (acc, q) => acc + (q.marksObtained || 0),
            0
          );

          return (
            <div
              key={form._id}
              className="bg-gray-800 rounded-xl p-5 mb-5 shadow-lg border border-gray-700"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">{form.title}</h3>
                <div className="flex gap-3">
                  {status[form._id] ? (
                    <>
                      <button
                        onClick={() => navigate(`/forms/${form._id}`)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                      >
                        View Response
                      </button>
                      <button
                        onClick={() => toggleMarks(form._id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                      >
                        {marksInfo.visible ? "Hide Marks" : "Marks"}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => navigate(`/forms/${form._id}`)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                    >
                      Fill Form
                    </button>
                  )}
                </div>
              </div>

              <p className="text-gray-400">
                {form.description || "No description."}
              </p>

              {marksInfo.visible && (
                <>
                  {marksInfo.loading && (
                    <p className="text-yellow-400 mt-3">Loading marks...</p>
                  )}
                  {marksInfo.error && (
                    <p className="text-red-400 mt-3">{marksInfo.error}</p>
                  )}

                  {!marksInfo.loading && questionScores.length > 0 && (
                    <>
                      <p className="font-bold mt-4 text-green-400">
                        Total Marks Obtained: {totalMarks.toFixed(2)}
                      </p>
                      <div className="overflow-x-auto mt-3">
                        <table className="w-full border border-gray-700 text-sm">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="border border-gray-600 px-4 py-2">
                                Question ID
                              </th>
                              <th className="border border-gray-600 px-4 py-2">
                                Type
                              </th>
                              <th className="border border-gray-600 px-4 py-2">
                                Marks Obtained
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {questionScores.map(
                              ({ questionId, type, marksObtained }) => (
                                <tr
                                  key={questionId}
                                  className="hover:bg-gray-700"
                                >
                                  <td className="border border-gray-600 px-4 py-2 break-words">
                                    {questionId}
                                  </td>
                                  <td className="border border-gray-600 px-4 py-2 capitalize">
                                    {type}
                                  </td>
                                  <td className="border border-gray-600 px-4 py-2">
                                    {marksObtained.toFixed(2)}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                  {!marksInfo.loading && questionScores.length === 0 && (
                    <p className="text-gray-400 mt-3">
                      No marks data available for this form.
                    </p>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Forms;
