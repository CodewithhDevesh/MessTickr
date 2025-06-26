import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { FEEDBACK_API_END_POINT } from "@/utils/constant";
import { format } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { setFeedbacks } from "@/redux/feedbackSlice";
import Footer from "./shared/Footer";
import { Link } from "react-router-dom";

export default function Feedback() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { feedbacks } = useSelector((store) => store.feedback);
 // console.log("user obj: ",user);
  
  const [formData, setFormData] = useState({
    date: format(new Date(), "yyyy-MM-dd"),
    mealType: "",
    rating: "",
    comment: "",
  });

  const [loading, setLoading] = useState(false);
  const mealOptions = ["breakfast", "lunch", "noshes", "dinner"];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.mealType || !formData.rating || !formData.comment) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${FEEDBACK_API_END_POINT}/submit`,
        {
          ...formData,
          messId: user?.mess?.messId,
          studentName: user?.fullname,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Feedback submitted successfully!");

        dispatch(setFeedbacks([...feedbacks, res.data.feedback]));

        setFormData({
          date: format(new Date(), "yyyy-MM-dd"),
          mealType: "",
          rating: "",
          comment: "",
        });
      } else {
        toast.error(res.data.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Error submitting feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/MessI2.png')" }}
    >
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl p-8 bg-white/60 shadow-xl border border-gray-400">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
            Submit Meal Feedback
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5 text-gray-900">
            <Input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
            />

            <select
              className="w-full border border-gray-500 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-purple-500"
              value={formData.mealType}
              onChange={(e) =>
                setFormData({ ...formData, mealType: e.target.value })
              }
              required
            >
              <option value="">Select Meal Type</option>
              {mealOptions.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>

            <Input
              type="number"
              min={1}
              max={5}
              placeholder="Rating (1-5)"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: e.target.value })
              }
              required
            />

            <Textarea
              placeholder="Your feedback..."
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-700 to-purple-500 hover:from-purple-800 hover:to-purple-600 transition duration-300 rounded-none text-white font-semibold py-2 shadow-md"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>

            <Link
              to="/"
              className="inline-block text-purple-700 hover:text-purple-900 text-sm font-medium mt-2 transition"
            >
              ← Back to Home
            </Link>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
