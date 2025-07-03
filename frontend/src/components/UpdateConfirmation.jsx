import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { MEAL_API_END_POINT, SETTINGS_API_END_POINT } from "@/utils/constant";
import Navbar from "@/components/shared/Navbar";
import { useNavigate } from "react-router-dom";

export default function UpdateConfirmation() {
  const { user } = useSelector((store) => store.auth);
  const selectedMess = useSelector(
    (store) => store.mess.selectedMess[user?.userId]
  );
  const navigate = useNavigate();

  const [input, setInput] = useState({
    breakfast: false,
    lunch: false,
    noshes: false,
    dinner: false,
  });

  const [cutoffTime, setCutoffTime] = useState({});
  const [countdowns, setCountdowns] = useState({});
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);

  const todayDate = new Date().toISOString().split("T")[0];

  const toggleMeal = (meal) => {
    const isBeforeCutoff =
      countdowns[meal] && countdowns[meal] !== "Cutoff Passed";
    if (!exists || !isBeforeCutoff) return;
    setInput((prev) => ({ ...prev, [meal]: !prev[meal] }));
  };

  useEffect(() => {
    const fetchMeal = async () => {
      if (!user?.userId) return;
      try {
        const res = await axios.get(
          `${MEAL_API_END_POINT}/${user.userId}/${todayDate}`,
          { withCredentials: true }
        );
        if (res.data.success && res.data.data) {
          setExists(true);
          const data = res.data.data;
          setInput({
            breakfast: !!data.breakfast,
            lunch: !!data.lunch,
            noshes: !!data.noshes,
            dinner: !!data.dinner,
          });
        } else {
          setExists(false);
          toast.error("No saved meal preferences found to update.");
        }
      } catch (error) {
        setExists(false);
        toast.error("Failed to fetch meal preferences.");
      }
    };

    fetchMeal();
  }, [user, todayDate]);

  useEffect(() => {
    const fetchCutoff = async () => {
      if (!selectedMess?.messId) return;
      try {
        const res = await axios.get(
          `${SETTINGS_API_END_POINT}/cutoff/${selectedMess.messId}`,
          { withCredentials: true }
        );

        if (res.data?.cutoffTime) {
          console.log("⏱️ Cutoff Time:", res.data.cutoffTime); // debug
          setCutoffTime(res.data.cutoffTime);
        } else {
          toast.error("Cutoff times not configured.");
        }
      } catch (error) {
        console.error("Error fetching cutoff times:", error);
        toast.error("Failed to fetch cutoff times.");
      }
    };

    fetchCutoff();
  }, [selectedMess]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns = {};
      for (const meal in cutoffTime) {
        if (!cutoffTime[meal]) continue;

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

    if (!exists) {
      toast.error("No existing meal preferences to update.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        userId: user.userId,
        date: todayDate,
        ...input,
      };

      const res = await axios.put(`${MEAL_API_END_POINT}/update`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(
          res.data.message || "Meal preferences updated successfully."
        );
      } else {
        toast.error(res.data.message || "Failed to update meal preferences.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <p className="text-center text-xl font-semibold">
          Please login to update your meals.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundImage: "url(/MessI2.png)" }}
      className="min-h-screen bg-cover bg-center"
    >
      <div className="bg-black/30 min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center px-4 py-10">
          <form
            onSubmit={submitHandler}
            className="w-full max-w-xl bg-white/50 backdrop-blur-md rounded-xl p-6 sm:p-10 shadow-md"
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">
              Update Meal Confirmation
            </h1>

            <div className="mb-4">
              <Label className="font-semibold">Name</Label>
              <input
                type="text"
                value={user?.fullname}
                readOnly
                className="w-full px-3 py-2 mt-1 rounded bg-gray-100 border border-gray-300 text-gray-700"
              />
            </div>

            {["breakfast", "lunch", "noshes", "dinner"].map((meal) => {
              const isBeforeCutoff =
                countdowns[meal] && countdowns[meal] !== "Cutoff Passed";
              return (
                <div
                  key={meal}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 my-3 bg-white/80 rounded p-4 shadow"
                >
                  <div className="font-semibold capitalize">{meal}</div>
                  <div className="text-sm text-gray-600 text-center">
                    Cutoff: {cutoffTime[meal] ?? "--"}
                    <br />
                    {countdowns[meal] || ""}
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMeal(meal)}
                    className={`px-4 py-2 rounded font-semibold transition-all ${
                      input[meal]
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-800"
                    } ${
                      !isBeforeCutoff || !exists
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={!isBeforeCutoff || !exists}
                  >
                    {input[meal] ? "Yes" : "No"}
                  </button>
                </div>
              );
            })}

            <Button
              type="submit"
              disabled={
                !exists ||
                loading ||
                Object.values(countdowns).every(
                  (val) => val === "Cutoff Passed"
                )
              }
              className="w-full mt-6 bg-purple-800 hover:bg-[#5b30a6] rounded-none"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Update Meals"
              )}
            </Button>

            {!exists && (
              <p className="text-center text-sm text-red-600 mt-3">
                No saved meal preferences found to update.
              </p>
            )}

            <p
              onClick={() => navigate("/")}
              className="text-sm text-right mt-4 cursor-pointer hover:underline"
            >
              ← Back
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
