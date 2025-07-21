import React, { useState, useEffect } from "react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { MEAL_API_END_POINT, SETTINGS_API_END_POINT } from "@/utils/constant";
import { useNavigate } from "react-router-dom";
import useGetConfirmation from "@/hooks/useGetConfirmation";

export default function MealConfirmation() {
  const { user } = useSelector((store) => store.auth);
  const selectedMess = useSelector(
    (store) => store.mess.selectedMess[user.userId]
  );

  const navigate = useNavigate();
  const [input, setInput] = useState({
    breakfast: false,
    lunch: false,
    noshes: false,
    dinner: false,
  });

  const [cutoffTime, setCutoffTime] = useState({
    breakfast: "07:30",
    lunch: "11:00",
    noshes: "15:30",
    dinner: "18:30",
  });
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const {
    preferences,
    hasPreferences,
    lastUpdated,
    loading: loadingConfirmation,
  } = useGetConfirmation(today);

  useEffect(() => {
    setInput(preferences);
  }, [preferences]);

  const toggleMeal = (meal) => {
    if (hasPreferences) return;
    setInput((prev) => ({ ...prev, [meal]: !prev[meal] }));
  };

  useEffect(() => {
    const fetchCutoff = async () => {
      if (!selectedMess?.messId) return;

      try {
        const res = await axios.get(
          `${SETTINGS_API_END_POINT}/cutoff/${selectedMess.messId}`,
          { withCredentials: true }
        );
        setCutoffTime(res.data?.cutoffTime || {});
      } catch (error) {
        console.error("Error fetching cutoff times", error);
      }
    };

    fetchCutoff();
  }, [selectedMess]);

  useEffect(() => {
    console.log("cutoffTime in useEffect:", cutoffTime);

    const interval = setInterval(() => {
      const newCountdowns = {};
      for (const meal in cutoffTime) {
        const [hours, minutes] = cutoffTime[meal].split(":");
        const cutoff = new Date();
        cutoff.setHours(+hours, +minutes, 0, 0);

        const now = new Date();
        const diff = cutoff - now;

        if (diff > 0) {
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);

          newCountdowns[meal] = `${String(hrs).padStart(2, "0")}:${String(
            mins
          ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        } else {
          newCountdowns[meal] = "Cutoff Passed";
        }
      }

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [cutoffTime]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!selectedMess) {
      toast.error("Please select a mess before confirming meals.");
      return;
    }

    if (hasPreferences) {
      toast.warning(
        "You have already submitted today's meal. Use Update option."
      );
      return;
    }

    setLoading(true);
    try {
      const dataToSend = {
        ...input,
        userId: user.userId,
        messId: selectedMess._id,
        date: today,
      };

      const res = await axios.post(MEAL_API_END_POINT, dataToSend, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to confirm meals.");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/MessI2.png')" }}
    >
      <div className="bg-black/50 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center px-4 py-10">
          {!user ? (
            <p className="text-center text-white mt-10 text-3xl font-semibold">
              Please login to confirm your meals.
            </p>
          ) : (
            <form
              onSubmit={submitHandler}
              className="w-full max-w-2xl bg-white/60 backdrop-blur-md shadow-lg border border-gray-300 px-8 py-6 rounded-md"
            >
              {selectedMess ? (
                <>
                  <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
                    {selectedMess.name} Meal Confirmation
                  </h2>
                  {hasPreferences && lastUpdated && (
                    <p className="text-sm text-gray-700 mb-4 text-center">
                      Last updated: {new Date(lastUpdated).toLocaleString()}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-center text-red-600 font-medium mb-4">
                  Please select a mess first.
                </p>
              )}

              <div className="mb-4">
                <Label className="block mb-1 font-semibold text-gray-800">
                  Name
                </Label>
                <input
                  type="text"
                  value={user?.fullname}
                  readOnly
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded"
                />
              </div>

              {/* Meal Instruction */}
              <div className="mb-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-gray-800 rounded-md">
                <p className="text-sm">
                  <strong>Note:</strong> Selecting{" "}
                  <span className="font-semibold text-green-700">Yes</span>{" "}
                  means you will <span className="underline">skip</span> that
                  particular meal. If you plan to eat, leave it as{" "}
                  <span className="font-semibold text-gray-700">No</span>.
                </p>
              </div>

              {["breakfast", "lunch", "noshes", "dinner"].map((meal) => {
                const isBeforeCutoff =
                  countdowns[meal] && countdowns[meal] !== "Cutoff Passed";
                return (
                  <div
                    key={meal}
                    className="flex items-center justify-between px-4 py-2 mb-3 bg-white/90 border border-gray-300 rounded"
                  >
                    <div className="capitalize font-medium w-1/3">{meal}</div>
                    <div className="text-sm text-gray-700 w-1/3 text-center">
                      Cutoff: {cutoffTime[meal] || "--"}
                      <br />
                      {countdowns[meal] || ""}
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleMeal(meal)}
                      disabled={hasPreferences || !isBeforeCutoff}
                      className={`w-20 py-1 rounded text-white font-semibold transition ${
                        input[meal]
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-gray-400 hover:bg-gray-500"
                      } ${
                        hasPreferences || !isBeforeCutoff
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {input[meal] ? "Yes" : "No"}
                    </button>
                  </div>
                );
              })}

              {loading || loadingConfirmation ? (
                <Button className="w-full mt-4 rounded-none" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : !hasPreferences ? (
                <Button
                  type="submit"
                  className="w-full mt-4 bg-purple-700 hover:bg-purple-800 rounded-none"
                  disabled={!selectedMess}
                >
                  Confirm Meals
                </Button>
              ) : (
                <div className="flex justify-center mt-4">
                  <Button
                    variant="outline"
                    className="text-purple-800 border-purple-800 hover:bg-purple-100"
                    onClick={() => navigate("/update-meal")}
                  >
                    Update Meals
                  </Button>
                </div>
              )}

              <div
                className="text-sm text-right text-purple-700 hover:text-purple-900 mt-4 cursor-pointer"
                onClick={() => navigate("/")}
              >
                ← Back to Home
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
