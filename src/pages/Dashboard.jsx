import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaWpforms, FaRegListAlt } from "react-icons/fa";
import { MdOutlineAssignment } from "react-icons/md";
import { server } from "../main";
const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          axios.get(`${server}/api/forms/stats`),
          axios.get(`${server}/api/forms/recent-activity`),
        ]);
        setStats(statsRes.data);
        setRecent(recentRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-gradient-to-br from-[#1c1f2a] to-[#11131b]">
        Loading dashboard...
      </div>
    );
  if (!stats || !recent)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 bg-gradient-to-br from-[#1c1f2a] to-[#11131b]">
        Failed to load dashboard
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1f2a] to-[#11131b] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          📊 Dashboard
        </h1>

        {/* Stats Overview */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-6">Stats Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl flex items-center gap-4 shadow-lg hover:scale-[1.03] transition">
              <FaWpforms className="text-indigo-400 text-3xl" />
              <div>
                <p className="text-sm text-gray-300">Total Forms</p>
                <p className="text-3xl font-bold">{stats.totalForms}</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl flex items-center gap-4 shadow-lg hover:scale-[1.03] transition">
              <MdOutlineAssignment className="text-green-400 text-3xl" />
              <div>
                <p className="text-sm text-gray-300">Total Responses</p>
                <p className="text-3xl font-bold">{stats.totalResponses}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Latest Forms Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-indigo-300">
                <FaRegListAlt /> Latest Forms
              </h3>
              <table className="w-full text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.latestForms.length > 0 ? (
                    recent.latestForms.map((form) => (
                      <tr
                        key={form._id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="p-2">{form.title}</td>
                        <td className="p-2">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="p-2 text-center text-gray-400"
                      >
                        No recent forms
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Latest Responses Table */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-lg p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-green-300">
                <MdOutlineAssignment /> Latest Responses
              </h3>
              <table className="w-full text-sm">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-2 text-left">Form Title</th>
                    <th className="p-2 text-left">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.latestResponses.length > 0 ? (
                    recent.latestResponses.map((resp) => (
                      <tr
                        key={resp._id}
                        className="border-t border-white/10 hover:bg-white/5"
                      >
                        <td className="p-2">
                          {resp.formId?.title || "Unknown Form"}
                        </td>
                        <td className="p-2">
                          {new Date(resp.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="2"
                        className="p-2 text-center text-gray-400"
                      >
                        No recent responses
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
