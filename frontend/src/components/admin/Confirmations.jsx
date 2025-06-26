import React, { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { MESS_API_END_POINT } from "@/utils/constant";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Confirmations() {
  const [messData, setMessData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedMessId, setSelectedMessId] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.userId) return;

    const getMessPreferences = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${MESS_API_END_POINT}/admin/${user.userId}/mess-preferences`,
          { withCredentials: true }
        );

        if (res.data.success) {
          setMessData(res.data.data || []);
        } else {
          setError(res.data.message || "Failed to fetch mess preferences");
          toast.error(res.data.message || "Failed to fetch mess preferences");
        }
      } catch (err) {
        setError("Failed to fetch mess preferences");
        toast.error("Failed to fetch mess preferences");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getMessPreferences();
  }, [user]);

  useEffect(() => {
    setExpandedSections({});
  }, [selectedDate]);

  const toggleDetails = (messId, date) => {
    const key = `${messId}_${date}`;
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredMessData = selectedMessId
    ? messData.filter((m) => m.mess._id === selectedMessId)
    : messData;

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/MessI1.png')" }}
    >
      <div className="bg-black/40 min-h-screen">
        <Navbar />
        <main className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10 bg-white/60 backdrop-blur-md mt-10 rounded-2xl shadow-2xl">
          <h1 className="text-3xl font-bold text-center text-purple-800 mb-4 drop-shadow-md">
            Student Meal Preferences
          </h1>
          <p className="text-center text-sm italic text-gray-700 mb-8">
            * "Yes" means the student skipped that meal; "No" means they did not skip.
          </p>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-stretch gap-4 mb-8">
            <select
              value={selectedMessId}
              onChange={(e) => setSelectedMessId(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            >
              <option value="">-- Show All Messes --</option>
              {messData.map(({ mess }) => (
                <option key={mess._id} value={mess._id}>
                  {mess.name} — {mess.location}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={today}
              className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
            />
          </div>

          {/* Status Handling */}
          {loading && (
            <div className="flex justify-center items-center gap-2 text-purple-700">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading meal preferences...
            </div>
          )}
          {error && (
            <p className="text-center text-red-600 font-medium">{error}</p>
          )}
          {!loading && !error && filteredMessData.length === 0 && (
            <p className="text-center text-gray-600 font-medium">
              No messes found for this admin.
            </p>
          )}

          {/* Meal Data Display */}
          <div className="space-y-10">
            {filteredMessData.map(({ mess, students, mealConfirmations }) => {
              const mealsByDate = {};
              mealConfirmations.forEach((meal) => {
                const date = new Date(meal.date).toLocaleDateString();
                if (!mealsByDate[date]) mealsByDate[date] = [];
                mealsByDate[date].push(meal);
              });

              const formattedDate = new Date(selectedDate).toLocaleDateString();
              const meals = mealsByDate[formattedDate];
              const key = `${mess._id}_${formattedDate}`;

              // Count skipped meals
              let skipBreakfast = 0,
                skipLunch = 0,
                skipNoshes = 0,
                skipDinner = 0;

              students.forEach((student) => {
                const meal = meals?.find(
                  (m) =>
                    m.userId?._id === student._id.toString() ||
                    m.userId === student._id.toString()
                );
                if (meal?.breakfast) skipBreakfast++;
                if (meal?.lunch) skipLunch++;
                if (meal?.noshes) skipNoshes++;
                if (meal?.dinner) skipDinner++;
              });

              return (
                <section
                  key={mess._id}
                  className="bg-white/80 p-6 rounded-xl shadow-md border border-gray-200"
                >
                  <h2 className="text-xl sm:text-2xl font-semibold text-purple-900 mb-4">
                    {mess.name} — {mess.location}
                  </h2>

                  {(!meals || meals.length === 0) ? (
                    <p className="text-purple-600 italic">
                      No meal preferences submitted for {formattedDate}.
                    </p>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm sm:text-base font-medium text-purple-700 mb-4">
                        <p>👥 Total Students: {students.length}</p>
                        <p>🥞 Skipped Breakfast: {skipBreakfast}</p>
                        <p>🍛 Skipped Lunch: {skipLunch}</p>
                        <p>🍪 Skipped Noshes: {skipNoshes}</p>
                        <p>🍲 Skipped Dinner: {skipDinner}</p>
                      </div>

                      <Button
                        onClick={() => toggleDetails(mess._id, formattedDate)}
                        className="mb-3 bg-purple-700 hover:bg-purple-800 transition text-white"
                      >
                        {expandedSections[key] ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            View Details
                          </>
                        )}
                      </Button>

                      <AnimatePresence>
                        {expandedSections[key] && (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-x-auto rounded-lg border border-gray-300"
                          >
                            <table className="w-full table-auto text-sm">
                              <thead className="bg-purple-100 text-purple-900">
                                <tr>
                                  <th className="px-3 py-2 border">Student Name</th>
                                  <th className="px-3 py-2 border text-center">Breakfast</th>
                                  <th className="px-3 py-2 border text-center">Lunch</th>
                                  <th className="px-3 py-2 border text-center">Noshes</th>
                                  <th className="px-3 py-2 border text-center">Dinner</th>
                                </tr>
                              </thead>
                              <tbody>
                                {students.map((student) => {
                                  const meal = meals.find(
                                    (m) =>
                                      m.userId?._id === student._id.toString() ||
                                      m.userId === student._id.toString()
                                  );
                                  return (
                                    <tr
                                      key={student._id}
                                      className="hover:bg-purple-50 transition"
                                    >
                                      <td className="px-3 py-2 border">{student.fullname}</td>
                                      <td className="px-3 py-2 border text-center">{meal?.breakfast ? "Yes" : "No"}</td>
                                      <td className="px-3 py-2 border text-center">{meal?.lunch ? "Yes" : "No"}</td>
                                      <td className="px-3 py-2 border text-center">{meal?.noshes ? "Yes" : "No"}</td>
                                      <td className="px-3 py-2 border text-center">{meal?.dinner ? "Yes" : "No"}</td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </section>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Button onClick={() => navigate("/")} className="bg-purple-600 hover:bg-purple-700 text-white">
              ← Back to Home
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
